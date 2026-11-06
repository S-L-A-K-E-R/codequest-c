import { curriculum } from './curriculum.js';

const $ = id => document.getElementById(id);
const lessons = [...curriculum.lessons.course, ...curriculum.lessons.revision];
const lessonById = new Map(lessons.map(lesson => [lesson.id, lesson]));
const dayPattern = /^\d{4}-\d{2}-\d{2}$/;
const pad = value => String(value).padStart(2, '0');

function dayKey(date) {
  return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-');
}
function parseDay(key) {
  if (typeof key !== 'string' || !dayPattern.test(key)) return null;
  const date = new Date(key + 'T12:00:00');
  return !Number.isNaN(date.valueOf()) && dayKey(date) === key ? date : null;
}
function offsetDay(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}
const integer = value => Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;

export function getProfileStats(progress, now = new Date()) {
  const completed = progress?.completed && typeof progress.completed === 'object' ? progress.completed : {};
  const daily = progress?.daily && typeof progress.daily === 'object' ? progress.daily : {};
  const byDay = new Map();
  function day(key) {
    if (!parseDay(key)) return null;
    if (!byDay.has(key)) byDay.set(key, { completed: 0, runs: 0, checks: 0, passed: 0, xp: 0 });
    return byDay.get(key);
  }
  const finished = [];
  for (const [id, date] of Object.entries(completed)) {
    if (!lessonById.has(id)) continue;
    const entry = day(date);
    if (!entry) continue;
    entry.completed++;
    entry.xp += lessonById.get(id)?.kind==='gold'?60:lessonById.get(id)?.kind==='side'?30:20;
    finished.push({ id, date, lesson: lessonById.get(id) });
  }
  for (const [date, events] of Object.entries(daily)) {
    if (!events || typeof events !== 'object') continue;
    const entry = day(date);
    if (!entry) continue;
    entry.runs += integer(events.runs);
    entry.checks += integer(events.checks);
    entry.passed += Math.min(integer(events.passed), integer(events.checks));
  }
  const activeDays = [...byDay.keys()].filter(key => {
    const e = byDay.get(key);
    return e.completed + e.runs + e.checks > 0 && key <= dayKey(now);
  }).sort();
  const today = dayKey(now);
  const yesterday = dayKey(offsetDay(now, -1));
  let streak = 0;
  let cursor = activeDays.includes(today) ? today : yesterday;
  const dates = new Set(activeDays);
  while (dates.has(cursor)) {
    streak++;
    cursor = dayKey(offsetDay(parseDay(cursor), -1));
  }
  let bestStreak = 0, consecutive = 0, previous = null;
  for (const key of activeDays) {
    const contiguous = previous && dayKey(offsetDay(parseDay(previous), 1)) === key;
    consecutive = contiguous ? consecutive + 1 : 1;
    bestStreak = Math.max(bestStreak, consecutive);
    previous = key;
  }
  const courseCount = finished.filter(item => item.id.startsWith('c') || item.id.startsWith('g')).length;
  const revisionCount = finished.filter(item => item.id.startsWith('r')).length;
  const checks = [...byDay.values()].reduce((sum, e) => sum + e.checks, 0);
  const passed = [...byDay.values()].reduce((sum, e) => sum + e.passed, 0);
  const runs = [...byDay.values()].reduce((sum, e) => sum + e.runs, 0);
  const xp = [...byDay.values()].reduce((sum,entry)=>sum+entry.xp,0);
  const level = Math.floor(xp / 100) + 1;
  return {
    byDay, activeDays, finished, courseCount, revisionCount,
    xp, level, streak, bestStreak, checks, passed, runs,
    accuracy: checks ? Math.round(passed / checks * 100) : null,
    total: lessons.length,
    modulesVisited: new Set(finished.filter(i => i.id.startsWith('c')).map(i => i.lesson.module)).size
  };
}

const badges = [
  { icon: '✦', title: 'Premier pas', desc: 'Terminer ton premier défi', test: s => s.finished.length >= 1 },
  { icon: '⚡', title: 'Échauffement', desc: 'Terminer 5 défis', test: s => s.finished.length >= 5 },
  { icon: '◆', title: 'En route !', desc: 'Terminer 10 défis', test: s => s.finished.length >= 10 },
  { icon: '🏆', title: 'Défi après défi', desc: 'Terminer 25 défis', test: s => s.finished.length >= 25 },
  { icon: '🌱', title: 'Curiosité', desc: 'Explorer les 7 chapitres du C', test: s => s.modulesVisited === 7 },
  { icon: '☀', title: 'Régularité', desc: 'Atteindre 3 jours consécutifs', test: s => s.bestStreak >= 3 },
  { icon: '🔥', title: 'Série de feu', desc: 'Atteindre 7 jours consécutifs', test: s => s.bestStreak >= 7 },
  { icon: '💎', title: '100 XP', desc: 'Gagner au moins 100 XP', test: s => s.xp >= 100 },
  { icon: '🎓', title: 'Maître du parcours', desc: 'Terminer les 30 défis classiques du parcours C', test: s => s.courseCount >= 30 },
  { icon: '✍', title: 'Révisions au top', desc: 'Terminer les 20 exercices de soutien', test: s => s.revisionCount === 20 },
  { icon: '⌨', title: 'Explorateur du code', desc: 'Exécuter ton code 50 fois', test: s => s.runs >= 50 },
  { icon: '🛠', title: 'Persévérance', desc: 'Faire 10 validations non réussies', test: s => s.checks - s.passed >= 10 }
];

function drawXpChart(stats, now) {
  const host = $('profileXpChart');
  const dates = Array.from({ length: 30 }, (_, i) => dayKey(offsetDay(now, i - 29)));
  const earned = dates.map(key => stats.byDay.get(key)?.xp ?? 0);
  const cumulative = earned.map((_, i) => earned.slice(0, i + 1).reduce((sum, value) => sum + value, 0));
  const maximum = Math.max(100, ...cumulative);
  const width = 700, height = 198, left = 42, right = 18, top = 16, bottom = 29;
  const x = i => left + i / 29 * (width - left - right);
  const y = value => top + (1 - value / maximum) * (height - top - bottom);
  const points = cumulative.map((value, i) => [x(i), y(value)]);
  const line = points.map(([px, py], i) => (i ? 'L' : 'M') + px.toFixed(2) + ' ' + py.toFixed(2)).join(' ');
  const area = line + ' L ' + x(29) + ' ' + (height - bottom) + ' L ' + left + ' ' + (height - bottom) + ' Z';
  const guides = [0, .5, 1].map(fraction => {
    const value = Math.round(maximum * fraction);
    return '<line x1="' + left + '" y1="' + y(value) + '" x2="' + (width - right) + '" y2="' + y(value) + '" stroke="#30435e" stroke-dasharray="4 7"/>' +
      '<text x="4" y="' + (y(value) + 4) + '" fill="#91a7c9" font-size="12">' + value + '</text>';
  }).join('');
  host.innerHTML = '<svg class="profile-line-svg" viewBox="0 0 700 198" role="img" aria-label="XP cumulés sur les 30 derniers jours : ' +
    cumulative[29] + ' XP gagnés"><defs><linearGradient id="profileXpGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#6e91ff" stop-opacity=".34"/><stop offset="100%" stop-color="#6e91ff" stop-opacity="0"/></linearGradient></defs>' +
    guides + '<path d="' + area + '" fill="url(#profileXpGradient)"/><path d="' + line + '" fill="none" stroke="#79a5ff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="' + x(29) + '" cy="' + y(cumulative[29]) + '" r="5" fill="#a3c2ff" stroke="#142440" stroke-width="3"/>' +
    '<text x="' + left + '" y="195" fill="#91a7c9" font-size="12">' + dates[0].slice(5) + '</text>' +
    '<text x="' + (width - 60) + '" y="195" fill="#91a7c9" font-size="12">' + dates[29].slice(5) + '</text></svg>';
  $('profileXpPeriod').textContent = '+' + earned.reduce((a, b) => a + b, 0) + ' XP ces 30 derniers jours';
}

function drawActivityChart(stats, now) {
  const host = $('profileActivityChart');
  const days = Array.from({ length: 14 }, (_, i) => dayKey(offsetDay(now, i - 13)));
  const maximum = Math.max(1, ...days.map(key => {
    const d = stats.byDay.get(key);
    return (d?.runs || 0) + (d?.checks || 0);
  }));
  host.replaceChildren();
  for (const [i, key] of days.entries()) {
    const data = stats.byDay.get(key) || { runs: 0, checks: 0, passed: 0 };
    const column = document.createElement('div');
    column.className = 'profile-bar-column';
    const stack = document.createElement('div');
    stack.className = 'profile-bar-stack';
    const series = [
      ['run', data.runs],
      ['pass', data.passed],
      ['fail', Math.max(0, data.checks - data.passed)]
    ];
    for (const [kind, amount] of series) {
      if (!amount) continue;
      const bar = document.createElement('div');
      bar.className = 'profile-bar profile-bar-' + kind;
      bar.style.height = Math.max(2, amount / maximum * 100) + '%';
      stack.append(bar);
    }
    stack.title = key + ' · ' + data.runs + ' exécutions · ' + data.checks + ' validations';
    const label = document.createElement('span');
    label.textContent = i % 3 === 1 || i === 13 ? key.slice(8) : '';
    column.append(stack, label);
    host.append(column);
  }
}

function drawHeatmap(stats, now) {
  const host = $('profileHeatmap');
  host.replaceChildren();
  const grid = document.createElement('div');
  grid.className = 'heatmap-grid';
  const months = document.createElement('div');
  months.className = 'heatmap-months';
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const endWeek = offsetDay(base, -((base.getDay() + 6) % 7));
  const firstMonday = offsetDay(endWeek, -51 * 7);
  const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  let lastMonth = -1;
  for (let week = 0; week < 52; week++) {
    const start = offsetDay(firstMonday, week * 7);
    const month = document.createElement('span');
    const display = start.getMonth() !== lastMonth;
    month.textContent = display ? monthNames[start.getMonth()] : '';
    lastMonth = start.getMonth();
    months.append(month);
    for (let weekday = 0; weekday < 7; weekday++) {
      const current = offsetDay(start, weekday), key = dayKey(current);
      const data = stats.byDay.get(key);
      const count = data ? data.completed + data.runs + data.checks : 0;
      const cell = document.createElement('span');
      const future = current > base;
      const level = count === 0 ? 0 : count === 1 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4;
      cell.className = 'heatmap-cell heatmap-level-' + level + (future ? ' is-future' : '');
      const label = current.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) +
        ' · ' + count + ' activité' + (count > 1 ? 's' : '') +
        (data ? ' (' + data.completed + ' défis, ' + data.runs + ' exécutions, ' + data.checks + ' validations)' : '');
      cell.title = label;
      cell.setAttribute('aria-label', label);
      grid.append(cell);
    }
  }
  host.append(months, grid);
  $('profileActiveDays').textContent = stats.activeDays.length + ' jours actifs au total';
}

function drawModules(stats) {
  const host = $('profileModules');
  host.replaceChildren();
  for (const mod of curriculum.modules) {
    const count = curriculum.lessons.course.filter(lesson => lesson.module === mod.id && stats.finished.some(item => item.id === lesson.id)).length;
    const total = curriculum.lessons.course.filter(lesson => lesson.module === mod.id).length;
    const item = document.createElement('div');
    item.className = 'profile-module-item';
    const heading = document.createElement('div');
    heading.className = 'profile-module-heading';
    const title = document.createElement('span');
    title.textContent = mod.title;
    const result = document.createElement('strong');
    result.textContent = count + '/' + total;
    heading.append(title, result);
    const line = document.createElement('div');
    line.className = 'profile-module-track';
    const fill = document.createElement('div');
    fill.className = 'profile-module-fill';
    fill.style.width = Math.round(count / total * 100) + '%';
    line.append(fill);
    item.append(heading, line);
    host.append(item);
  }
}

function drawBadges(stats) {
  const host = $('profileBadges');
  host.replaceChildren();
  const earned = badges.filter(b => b.test(stats)).length;
  $('profileBadgesCount').textContent = earned + ' / ' + badges.length + ' obtenus';
  for (const badge of badges) {
    const got = badge.test(stats);
    const item = document.createElement('div');
    item.className = 'profile-badge ' + (got ? 'is-earned' : 'is-pending');
    item.title = badge.desc;
    const icon = document.createElement('span');
    icon.className = 'profile-badge-icon';
    icon.textContent = got ? badge.icon : '◇';
    const body = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = badge.title;
    const desc = document.createElement('small');
    desc.textContent = badge.desc;
    body.append(title, desc);
    item.append(icon, body);
    host.append(item);
  }
}

function drawRecent(stats, onOpenChallenge) {
  const host = $('profileRecent');
  host.replaceChildren();
  const recent = [...stats.finished].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  if (!recent.length) {
    const empty = document.createElement('p');
    empty.className = 'profile-empty';
    empty.textContent = 'Aucun défi terminé pour le moment. Ta première victoire apparaîtra ici !';
    host.append(empty);
  }
  for (const item of recent) {
    const row = document.createElement('div');
    row.className = 'profile-recent-item';
    const icon = document.createElement('span');
    icon.className = 'profile-recent-icon';
    icon.textContent = '✓';
    const summary = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = item.lesson.title;
    const detail = document.createElement('small');
    detail.textContent = (item.id.startsWith('r') ? 'Soutien' : 'Parcours C') + ' · ' + item.date.split('-').reverse().join('/');
    summary.append(title, detail);
    const points = document.createElement('span');
    points.className = 'profile-recent-xp';
    points.textContent = '+' + (item.lesson.kind==='gold'?60:item.lesson.kind==='side'?30:20) + ' XP';
    const revisit = document.createElement('button');
    revisit.type = 'button';
    revisit.textContent = 'Revoir';
    revisit.className = 'profile-revisit';
    revisit.setAttribute('aria-label', 'Revoir ' + item.lesson.title);
    revisit.addEventListener('click', () => onOpenChallenge(item.id));
    row.append(icon, summary, points, revisit);
    host.append(row);
  }
}

export function initProfile({ getState, saveName, onOpenChallenge }) {
  function render() {
    const state = getState();
    const stats = getProfileStats(state);
    const name = typeof state.profile?.name === 'string' && state.profile.name.trim() ? state.profile.name.trim() : 'Explorateur C';
    $('profileDisplayName').textContent = name;
    $('profileNameInput').value = name;
    $('profileAvatar').textContent = name.substring(0, 1).toLocaleUpperCase('fr-FR');
    $('profileLevel').textContent = stats.level;
    $('profileLevelFill').style.width = stats.xp % 100 + '%';
    $('profileLevelCaption').textContent = stats.xp % 100 + ' / 100 XP vers le niveau ' + (stats.level + 1);
    $('profileRank').textContent = stats.level >= 8 ? 'Architecte du C' : stats.level >= 5 ? 'Développeur en herbe' : stats.level >= 3 ? 'Codeur curieux' : 'Apprenti du C';
    $('profileMetricXp').textContent = stats.xp.toLocaleString('fr-FR');
    $('profileMetricChallenges').textContent = stats.finished.length + ' / ' + stats.total;
    $('profileMetricStreak').textContent = stats.streak;
    $('profileMetricBest').textContent = stats.bestStreak;
    $('profileMetricRuns').textContent = stats.runs;
    $('profileMetricAccuracy').textContent = stats.accuracy === null ? '—' : stats.accuracy + '%';
    $('profileCourseCount').textContent = stats.courseCount + ' / ' + curriculum.lessons.course.length;
    $('profileRevisionCount').textContent = stats.revisionCount + ' / 20';
    $('profileCourseFill').style.width = stats.courseCount / curriculum.lessons.course.length * 100 + '%';
    $('profileRevisionFill').style.width = stats.revisionCount / 20 * 100 + '%';
    $('profileAttemptHint').textContent = stats.checks ? stats.passed + ' validations réussies sur ' + stats.checks + ' tentatives' : 'Les tentatives seront comptabilisées à partir de maintenant';
    drawXpChart(stats, new Date());
    drawActivityChart(stats, new Date());
    drawHeatmap(stats, new Date());
    drawModules(stats);
    drawBadges(stats);
    drawRecent(stats, onOpenChallenge);
    refreshShortcut();
  }
  function refreshShortcut() {
    const state = getState();
    const name = typeof state.profile?.name === 'string' && state.profile.name.trim() ? state.profile.name.trim() : 'Explorateur C';
    $('profileSidebarName').textContent = name;
    $('profileSidebarAvatar').textContent = name.substring(0, 1).toLocaleUpperCase('fr-FR');
    $('profileTopAvatar').textContent = name.substring(0, 1).toLocaleUpperCase('fr-FR');
  }
  $('profileSaveName').addEventListener('click', () => {
    const name = $('profileNameInput').value.trim().slice(0, 30) || 'Explorateur C';
    saveName(name);
    render();
  });
  $('profileNameInput').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      $('profileSaveName').click();
    }
  });
  refreshShortcut();
  return { render, refreshShortcut };
}
