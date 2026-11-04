import {curriculum} from './curriculum.js';
const $=id=>document.getElementById(id),KEY='codequest-c-progress-v1';
const params=new URLSearchParams(location.search);
let track=params.get('track')==='revision'?'revision':'course',active=null,busy=false,runner=null;
const all=[...curriculum.lessons.course,...curriculum.lessons.revision],ids=new Set(all.map(l=>l.id));
const fresh=()=>({version:1,completed:{},drafts:{},lastActivity:''});
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));return s&&typeof s==='object'?{...fresh(),...s}:fresh()}catch{return fresh()}}
let state=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{notify('Stockage local indisponible')}}
function today(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
function completed(id){return !!state.completed[id]}
function unlocked(l){if(track==='revision'||params.get('teacher')==='1')return true;const list=curriculum.lessons.course,i=list.findIndex(x=>x.id===l.id);return i<=0||completed(list[i-1].id)}
function find(id){return all.find(l=>l.id===id)}
function notify(message){$('toast').textContent=message;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),3500)}
function streak(){const days=new Set(Object.values(state.completed)),d=new Date();if(!days.has(today(d)))d.setDate(d.getDate()-1);let n=0;while(days.has(today(d))){n++;d.setDate(d.getDate()-1)}return n}
function updateStats(){const done=curriculum.lessons[track].filter(l=>completed(l.id)).length,allDone=Object.keys(state.completed).filter(id=>ids.has(id)).length,total=curriculum.lessons[track].length,pct=Math.round(done/total*100);
$('completedCount').textContent=done;$('totalXp').textContent=allDone*20;$('trackPercent').textContent=pct+'%';
$('xpSidebar').textContent=$('xpTop').textContent=allDone*20;$('streakSidebar').textContent=streak();
$('progressLabel').textContent=done+' / '+total+' terminés';$('progressPercent').textContent=pct+'%';$('progressFill').style.width=pct+'%';
}
function render(){const revision=track==='revision';
$('breadcrumb').textContent=revision?'SOUTIEN / RÉVISION 1':'APPRENDRE / PARCOURS C';
$('heroEyebrow').textContent=revision?'SOUTIEN · RÉVISION 1':'TON AVENTURE COMMENCE ICI';
$('heroTitle').innerHTML=revision?'Révise le C.<br><em>À ton rythme.</em>':'Apprends le C.<br><em>Un défi à la fois.</em>';
$('heroDesc').textContent=revision?'20 exercices indépendants pour revoir les bases à ton rythme.':'Écris du vrai code, teste tes idées et progresse dans chaque notion.';
$('sectionTitle').textContent=revision?'Tes exercices de soutien':"Ton parcours d’apprentissage";
$('sectionDesc').textContent=revision?'Choisis n’importe quel exercice.':'Valide un défi pour débloquer le suivant.';
document.querySelectorAll('[data-track]').forEach(b=>b.classList.toggle('is-selected',b.dataset.track===track));
const parent=$('pathList');parent.replaceChildren();
const groups=revision?[{id:'revision',title:'Révision 1',subtitle:'Fondamentaux de la programmation C'}]:curriculum.modules;
let index=0;
for(const group of groups){const items=curriculum.lessons[track].filter(l=>l.module===group.id);if(!items.length)continue;
const section=document.createElement('section');section.className='module-block';
const heading=document.createElement('div');heading.className='module-heading';
const number=document.createElement('div');number.className='module-icon';number.textContent=String(groups.indexOf(group)+1).padStart(2,'0');
const details=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=group.title;p.textContent=group.subtitle;details.append(h,p);
const count=document.createElement('span');count.className='module-count';count.textContent=items.filter(l=>completed(l.id)).length+'/'+items.length+' ✓';
heading.append(number,details,count);section.append(heading);
const path=document.createElement('div');path.className='lesson-path';
items.forEach(l=>{const ok=completed(l.id),allowed=unlocked(l),b=document.createElement('button');
b.type='button';b.className='lesson-node '+(ok?'is-complete':allowed?'is-unlocked':'is-locked');
b.disabled=!allowed;b.title=l.title;
b.innerHTML='<span class="lesson-symbol">'+(ok?'✓':allowed?'★':'🔒')+'</span><span class="lesson-info"><strong></strong><small></small></span>';
b.querySelector('strong').textContent=l.title;b.querySelector('small').textContent='Défi '+String(++index).padStart(2,'0')+(ok?' · Terminé':'');
b.addEventListener('click',()=>open(l.id));path.append(b)});
section.append(path);parent.append(section)}
updateStats();
}
function navigate(id=null){const q=new URLSearchParams();if(track==='revision')q.set('track','revision');if(id)q.set('lesson',id);if(params.get('teacher')==='1')q.set('teacher','1');history.replaceState(null,'',location.pathname+(q.size?'?'+q:''))}
function open(id){const l=find(id);if(!l)return;
track=l.id.startsWith('r')?'revision':'course';if(!unlocked(l)){notify('Termine les défis précédents.');return}active=l;render();navigate(id);
$('challengeCategory').textContent=(track==='revision'?'SOUTIEN · RÉVISION':'PARCOURS C')+' · +20 XP';
$('challengeTitle').textContent=l.title;$('challengePrompt').textContent=l.prompt;$('conceptText').textContent=l.concept||'';
$('codeEditor').value=state.drafts[id]??l.starter;$('stdinInput').value=l.tests[0].input;
$('hintText').textContent=l.hint;$('hintText').hidden=true;$('hintButton').setAttribute('aria-expanded','false');
$('consoleOutput').textContent='Clique sur « Exécuter » pour essayer ton programme.';
$('consoleStatus').textContent='Prêt';$('feedback').textContent='';$('feedback').className='feedback';$('nextBtn').hidden=!completed(l.id);
tests();$('modalBackdrop').hidden=false;document.body.style.overflow='hidden';}
function close(){active=null;$('modalBackdrop').hidden=true;document.body.style.overflow='';navigate()}
function tests(results=[]){$('testList').replaceChildren();active.tests.forEach((t,i)=>{const div=document.createElement('div');div.className='test-item '+(results[i]?(results[i].ok?'is-pass':'is-fail'):'');const span=document.createElement('span');span.className='test-bullet';span.textContent=results[i]?(results[i].ok?'✓':'✗'):'◯';const txt=document.createElement('div');txt.textContent='Test '+(i+1)+' · Entrée : '+(t.input||'(aucune)');div.append(span,txt);$('testList').append(div)})}
function setBusy(value){busy=value;$('runBtn').disabled=value;$('checkBtn').disabled=value;$('consoleStatus').textContent=value?'Exécution…':'Prêt'}
async function engine(){if(!runner){const {createRunner}=await import('https://cdn.jsdelivr.net/npm/@browserrun/sandrun@0.4.0/+esm');runner=await createRunner({c:'xcc',timeoutMs:4000,loadTimeoutMs:90000,maxOutputBytes:16384})}return runner}
async function execute(code,input){return (await engine()).run({language:'c',code,stdin:input})}
const normalize=s=>String(s||'').replace(/\r\n/g,'\n').trimEnd();
function describe(r){return r.error?String(r.error):(r.stdout||'')+(r.stderr?'\n[stderr]\n'+r.stderr:'')||'(Aucune sortie)'}
async function run(){if(!active||busy)return;setBusy(true);$('consoleOutput').textContent='Chargement du compilateur C et exécution locale…';try{const r=await execute($('codeEditor').value,$('stdinInput').value);$('consoleOutput').textContent=describe(r);$('consoleStatus').textContent=r.exitCode===0?'Exécuté':'Erreur / arrêt'}catch(e){$('consoleOutput').textContent=String(e);$('feedback').className='feedback error';$('feedback').textContent='Échec du compilateur. Connexion nécessaire au premier chargement.'}finally{setBusy(false)}}
async function check(){if(!active||busy)return;setBusy(true);$('consoleOutput').textContent='Exécution des tests automatiques…';const results=[];try{
for(const t of active.tests){const r=await execute($('codeEditor').value,t.input);const ok=!r.error&&!r.timedOut&&!r.truncated&&r.exitCode===0&&normalize(r.stdout)===normalize(t.expected);results.push({ok,r});if(!ok)break}
tests(results);const passed=results.length===active.tests.length&&results.every(x=>x.ok);
if(passed){if(!completed(active.id)){state.completed[active.id]=today();state.lastActivity=today();save()}$('feedback').className='feedback success';$('feedback').textContent='Bravo ! Tous les tests sont réussis. +20 XP !';$('nextBtn').hidden=false;$('consoleOutput').textContent='✓ Tous les tests sont réussis.';render()}
else{$('feedback').className='feedback error';$('feedback').textContent=results.filter(x=>x.ok).length+'/'+active.tests.length+' tests réussis. Continue !';$('consoleOutput').textContent=describe(results.at(-1)?.r||{})+'\nAttendu : '+JSON.stringify(active.tests[results.length-1]?.expected)}
}catch(e){$('consoleOutput').textContent=String(e);$('feedback').className='feedback error';$('feedback').textContent='Impossible de charger le compilateur.'}finally{setBusy(false)}}
function change(next){if(active)close();track=next;render();navigate();$('sidebar').classList.remove('is-open')}
document.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>change(b.dataset.track)));
$('continueBtn').addEventListener('click',()=>open((curriculum.lessons[track].find(l=>!completed(l.id))||curriculum.lessons[track][0]).id));
$('closeModal').addEventListener('click',close);$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))close()});
$('menuBtn').addEventListener('click',()=>$('sidebar').classList.toggle('is-open'));
$('runBtn').addEventListener('click',run);$('checkBtn').addEventListener('click',check);
$('nextBtn').addEventListener('click',()=>{const list=curriculum.lessons[track],i=list.findIndex(l=>l.id===active.id);if(list[i+1])open(list[i+1].id);else{close();notify('Parcours terminé !')}});
$('codeEditor').addEventListener('input',()=>{if(active){state.drafts[active.id]=$('codeEditor').value;save()}});
$('codeEditor').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();e.target.setRangeText('    ',e.target.selectionStart,e.target.selectionEnd,'end')}});
$('hintButton').addEventListener('click',()=>{$('hintText').hidden=!$('hintText').hidden;$('hintButton').setAttribute('aria-expanded',String(!$('hintText').hidden))});
$('restoreBtn').addEventListener('click',()=>{if(active&&confirm('Restaurer le code de départ ?')){$('codeEditor').value=active.starter;state.drafts[active.id]=active.starter;save()}});
$('exportBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({app:'CodeQuest C',...state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='codequest-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$('importBtn').addEventListener('click',()=>$('importFile').click());
$('importFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f||f.size>500000)return;try{const obj=JSON.parse(await f.text());if(obj.app!=='CodeQuest C')throw Error();if(!confirm('Remplacer la progression actuelle ?'))return;state=fresh();state.completed=Object.fromEntries(Object.entries(obj.completed||{}).filter(([k,v])=>ids.has(k)&&typeof v==='string'));state.drafts=Object.fromEntries(Object.entries(obj.drafts||{}).filter(([k,v])=>ids.has(k)&&typeof v==='string'&&v.length<60000));save();render();notify('Progression importée')}catch{notify('Sauvegarde invalide')}});
$('resetBtn').addEventListener('click',()=>{if(confirm('Effacer toute la progression ?')){state=fresh();save();render();notify('Progression réinitialisée')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)close();if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&active){e.preventDefault();run()}});
render();if(params.get('lesson')&&find(params.get('lesson')))open(params.get('lesson'));
