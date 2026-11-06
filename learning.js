import {courses} from './courses.js';

// Minimal Markdown subset rendered with DOM nodes, not unsanitized HTML.
export function renderMarkdown(host, source) {
  host.replaceChildren();
  let code = false, pre = null, list = null;
  const inline = (parent, line) => {
    const tokens = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    for (const token of tokens) {
      if (token.startsWith('`') && token.endsWith('`')) {
        const el = document.createElement('code'); el.textContent = token.slice(1,-1); parent.append(el);
      } else if (token.startsWith('**') && token.endsWith('**')) {
        const el = document.createElement('strong'); el.textContent = token.slice(2,-2); parent.append(el);
      } else parent.append(document.createTextNode(token));
    }
  };
  for (const line of source.split('\n')) {
    if (line.startsWith('```')) {
      code = !code; list = null;
      if (code) { pre = document.createElement('pre'); pre.className = 'course-code'; const el = document.createElement('code'); pre.append(el); host.append(pre); }
      continue;
    }
    if (code) { pre.firstChild.textContent += line + '\n'; continue; }
    if (!line.trim()) { list = null; continue; }
    if (line.startsWith('- ')) {
      if (!list) { list = document.createElement('ul'); host.append(list); }
      const li = document.createElement('li'); inline(li,line.slice(2)); list.append(li); continue;
    }
    list = null;
    const h = line.match(/^(#{2,3}) (.*)$/);
    const el = document.createElement(h ? (h[1].length === 2 ? 'h3' : 'h4') : 'p');
    inline(el,h ? h[2] : line); host.append(el);
  }
}

const steps = [
  {line:0, i:'—', total:0, output:'', message:'Initialisation : total vaut 0, puis i vaut 1.'},
  {line:1, i:1, total:0, output:'', message:'Condition : 1 <= 4 → vrai. On entre dans la boucle.'},
  {line:2, i:1, total:1, output:'', message:'Corps : total = 0 + 1 → 1.'},
  {line:3, i:2, total:1, output:'', message:'Mise à jour : i++ → 2.'},
  {line:1, i:2, total:1, output:'', message:'Condition : 2 <= 4 → vrai.'},
  {line:2, i:2, total:3, output:'', message:'Corps : total = 1 + 2 → 3.'},
  {line:3, i:3, total:3, output:'', message:'Mise à jour : i++ → 3.'},
  {line:1, i:3, total:3, output:'', message:'Condition : 3 <= 4 → vrai.'},
  {line:2, i:3, total:6, output:'', message:'Corps : total = 3 + 3 → 6.'},
  {line:3, i:4, total:6, output:'', message:'Mise à jour : i++ → 4.'},
  {line:1, i:4, total:6, output:'', message:'Condition : 4 <= 4 → vrai.'},
  {line:2, i:4, total:10, output:'', message:'Corps : total = 6 + 4 → 10.'},
  {line:3, i:5, total:10, output:'', message:'Mise à jour : i++ → 5.'},
  {line:1, i:5, total:10, output:'', message:'Condition : 5 <= 4 → faux. La boucle se termine.'},
  {line:4, i:5, total:10, output:'10', message:'printf affiche 10. Fin du programme.'}
];
let timer = null;
let current = 0;
const stop = () => {if(timer !== null) clearInterval(timer); timer = null;};
function visualizer(host) {
  host.replaceChildren();
  const heading = document.createElement('h3'); heading.textContent = 'Visualiser une boucle for';
  const caption = document.createElement('p'); caption.textContent = 'Simulation pas à pas du code ci-dessous (indépendante du compilateur).';
  const layout = document.createElement('div'); layout.className = 'loop-layout';
  const source = document.createElement('div'); source.className = 'loop-source';
  const lines = ['int total = 0;', 'for (int i = 1; i <= 4; i++) {', '    total += i;', '}', 'printf("%d\\n", total);'];
  const rows = lines.map((s,idx) => {const row=document.createElement('div');row.textContent=String(idx+1).padStart(2,' ')+'  '+s;source.append(row);return row;});
  const status = document.createElement('div'); status.className='loop-state';
  const vars = document.createElement('div'); vars.className='loop-vars';
  const message = document.createElement('p'); message.className='loop-message'; message.setAttribute('aria-live','polite');
  const output = document.createElement('pre'); output.className='loop-output';
  const label = document.createElement('small'); label.textContent='SORTIE STANDARD';
  status.append(vars,message,label,output); layout.append(source,status);
  const controls = document.createElement('div'); controls.className='loop-controls';
  const back=document.createElement('button'), next=document.createElement('button'), play=document.createElement('button'), reset=document.createElement('button');
  back.textContent='← Précédent'; next.textContent='Suivant →'; play.textContent='▶ Lecture'; reset.textContent='↺ Recommencer';
  const progress=document.createElement('span'); controls.append(back,play,next,reset,progress);
  function paint() {
    const s=steps[current]; rows.forEach((row,i)=>row.classList.toggle('is-active',i===s.line));
    vars.replaceChildren();
    for (const [key,value] of [['i',s.i],['total',s.total]]) {
      const chip=document.createElement('span');chip.textContent=key+' = '+value;vars.append(chip);
    }
    message.textContent=s.message; output.textContent=s.output||'(aucune sortie)';
    progress.textContent=(current+1)+' / '+steps.length;
    back.disabled=current===0;next.disabled=current===steps.length-1;
    play.textContent=timer===null?'▶ Lecture':'Ⅱ Pause';
  }
  back.onclick=()=>{stop();current=Math.max(0,current-1);paint();};
  next.onclick=()=>{stop();current=Math.min(steps.length-1,current+1);paint();};
  reset.onclick=()=>{stop();current=0;paint();};
  play.onclick=()=>{
    if(timer!==null){stop();paint();return;}
    if(current===steps.length-1)current=0;
    timer=setInterval(()=>{if(current===steps.length-1){stop();paint();return;}current++;paint();},850);
    paint();
  };
  host.append(heading,caption,layout,controls);paint();
}
export function initLearning({onPractice}) {
  const overlay=document.getElementById('courseOverlay');
  const body=document.getElementById('courseContent');
  const more=document.getElementById('courseMore');
  const diagram=document.getElementById('courseDiagram');
  const visual=document.getElementById('courseVisual');
  const title=document.getElementById('courseTitle');
  let currentModule='start',expanded=false,returnFocus=null;
  function paint() {
    const course=courses[currentModule]; title.textContent=course.title;
    renderMarkdown(body,course.short);more.hidden=!expanded;
    if(expanded)renderMarkdown(more,course.full);
    document.getElementById('courseExpand').textContent=expanded?'− Masquer le cours complet':'+ Voir le cours complet';
    diagram.replaceChildren();
    for (const [i,label] of course.flow.entries()) {
      const node=document.createElement('span');node.textContent=label;diagram.append(node);
      if(i<course.flow.length-1){const arrow=document.createElement('b');arrow.textContent='→';diagram.append(arrow);}
    }
    visual.hidden=currentModule!=='for';
    if(currentModule==='for')visualizer(visual);else stop();
  }
  function close(){stop();overlay.hidden=true;document.body.style.overflow='';returnFocus?.focus();}
  function open(module,practice=null) {
    if(!courses[module])return;
    returnFocus=document.activeElement;currentModule=module;expanded=false;paint();
    document.getElementById('coursePractice').onclick=()=>{close();if(practice)onPractice(practice);};
    document.getElementById('coursePractice').hidden=!practice;
    overlay.hidden=false;document.body.style.overflow='hidden';
    document.getElementById('courseClose').focus();
  }
  document.getElementById('courseExpand').onclick=()=>{expanded=!expanded;paint();};
  document.getElementById('courseClose').onclick=close;
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){e.stopImmediatePropagation();close();}});
  return {open,close,isOpen:()=>!overlay.hidden};
}
