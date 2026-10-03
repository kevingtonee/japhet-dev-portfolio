import {useEffect,useRef,useState} from 'react';
import {copy} from './content';
import {surfacePoint} from './model';

/* Skill-typewriter on the sculpture: cycles skill → types its name with a
   code-drawn logo badge → holds in a glow sweep → erases → next skill,
   forever, starting on every page load. Logos are inline SVG (zero network,
   zero video files — all effects are CSS/canvas). Sound is a soft WebAudio
   tick; browsers block audio pre-gesture so it unlocks on first tap/keypress.
   prefers-reduced-motion shows one static skill instead of looping. */
const SKILL_TYPE_MS = 85;
const SKILL_HOLD_MS = 2100;
const SKILL_ERASE_MS = 30;
const SKILL_GAP_MS = 500;
interface Skill { name: string; tag: string; color: string; glyph: string }
const SKILLS: Skill[] = [
 {name: 'TypeScript', tag: 'TYPED JS · FRONTEND', color: '#3178c6', glyph: 'TS'},
 {name: 'React', tag: 'UI · COMPONENTS', color: '#61dafb', glyph: '⚛'},
 {name: 'Next.js', tag: 'FULL-STACK · SSR', color: '#edeef2', glyph: '▲'},
 {name: 'Node.js', tag: 'APIS · BACKEND', color: '#68a063', glyph: '⬢'},
 {name: 'PostgreSQL', tag: 'DATA · RELATIONAL', color: '#5f7fae', glyph: '🐘'},
 {name: 'M-Pesa Daraja', tag: 'PAYMENTS · STK PUSH', color: '#4fb8a3', glyph: '₮'},
 {name: 'Python', tag: 'ML · AUTOMATION', color: '#c9a35f', glyph: '🐍'},
 {name: 'Supabase', tag: 'REALTIME · AUTH', color: '#3ecf8e', glyph: '⚡'},
];
type SkillPhase = 'typing' | 'holding' | 'erasing' | 'gap';
function useSkillLoop(reduced: boolean) {
 const [index, setIndex] = useState(0);
 const [chars, setChars] = useState(reduced ? SKILLS[0].name.length : 0);
 const [phase, setPhase] = useState<SkillPhase>(reduced ? 'holding' : 'typing');
 const [muted, setMuted] = useState(false);
 const [soundOn, setSoundOn] = useState(false);
 const audio = useRef<AudioContext | null>(null);
 const state = useRef({index: 0, chars: reduced ? SKILLS[0].name.length : 0, phase: (reduced ? 'holding' : 'typing') as SkillPhase});
 function blip(erasing = false) {
  if (muted || !soundOn) return;
  try {
   if (!audio.current) {
    const Ctor = window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctor) return;
    audio.current = new Ctor();
   }
   const ctx = audio.current;
   if (ctx.state === 'suspended') { void ctx.resume(); return; }
   const osc = ctx.createOscillator();
   const gain = ctx.createGain();
   osc.type = 'triangle';
   osc.frequency.value = (erasing ? 380 : 600) + Math.random() * 240;
   gain.gain.setValueAtTime(0.0001, ctx.currentTime);
   gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.012);
   gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
   osc.connect(gain).connect(ctx.destination);
   osc.start();
   osc.stop(ctx.currentTime + 0.08);
  } catch { /* decorative — never break the loop */ }
 }
 useEffect(() => {
  const unlock = () => {
   try {
    if (!audio.current) {
     const Ctor = window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
     if (Ctor) audio.current = new Ctor();
    }
    if (audio.current?.state === 'suspended') void audio.current.resume();
    setSoundOn(true);
   } catch { /* ignore */ }
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
  return () => {
   window.removeEventListener('pointerdown', unlock);
   window.removeEventListener('keydown', unlock);
  };
 }, []);
 useEffect(() => {
  if (reduced) {
   state.current = {index: 0, chars: SKILLS[0].name.length, phase: 'holding'};
   setIndex(0);
   setChars(SKILLS[0].name.length);
   setPhase('holding');
   return;
  }
  const s = state.current;
  const delay = s.phase === 'typing' ? SKILL_TYPE_MS : s.phase === 'holding' ? SKILL_HOLD_MS : s.phase === 'erasing' ? SKILL_ERASE_MS : SKILL_GAP_MS;
  const t = window.setTimeout(() => {
   const cur = state.current;
   const skill = SKILLS[cur.index];
   if (cur.phase === 'typing') {
    cur.chars += 1;
    blip();
    setChars(cur.chars);
    if (cur.chars >= skill.name.length) { cur.phase = 'holding'; setPhase('holding'); }
   } else if (cur.phase === 'holding') {
    cur.phase = 'erasing'; setPhase('erasing');
   } else if (cur.phase === 'erasing') {
    cur.chars -= 1;
    blip(true);
    setChars(Math.max(cur.chars, 0));
    if (cur.chars <= 0) { cur.phase = 'gap'; setPhase('gap'); }
   } else {
    cur.index = (cur.index + 1) % SKILLS.length;
    setIndex(cur.index);
    cur.phase = 'typing'; setPhase('typing');
   }
  }, delay);
  return () => window.clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [reduced, index, chars, phase, muted, soundOn]);
 useEffect(() => () => { void audio.current?.close().catch(() => undefined); }, []);
 return {skill: SKILLS[index], index, chars, phase, muted, setMuted, soundOn};
}
export function Sculpture() {
 const c=copy, canvas=useRef<HTMLCanvasElement>(null),angle=useRef(0.4),formRef=useRef(0),paint=useRef<()=>void>(()=>{});
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [form,setForm]=useState(0);
 const sig=useSkillLoop(reduced);
 const typedSkill=sig.skill.name.slice(0,sig.chars);
 const showCaret=sig.phase==='typing';
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const change=()=>{setReduced(media.matches);if(media.matches)setPlaying(false)};
  media.addEventListener('change',change);return()=>media.removeEventListener('change',change);
 },[]);
 useEffect(()=>{
  const node=canvas.current;if(!node)return;const ctx=node.getContext('2d');if(!ctx)return;
  let width=0,height=0,raf=0,last=0,visible=true;
  function draw() {
   if(!ctx)return;ctx.clearRect(0,0,width,height);
   const scale=Math.min(width,height)*.29,a=angle.current,tilt=.91;
   const paths:{z:number;points:[number,number][];alpha:number}[]=[];
   function project(x:number,y:number,z:number):[number,number,number] {
    const xx=x*Math.cos(a)-y*Math.sin(a), yy=x*Math.sin(a)+y*Math.cos(a);
    const yz=yy*Math.cos(tilt)-z*Math.sin(tilt),zz=yy*Math.sin(tilt)+z*Math.cos(tilt);
    const perspective=3.8/(3.8-zz*.36);
    return [width/2+xx*scale*perspective,height/2+yz*scale*perspective,zz];
   }
   for(let i=0;i<76;i++){
    const pts:[number,number][]= [];let depth=0;
    for(let j=0;j<=70;j++){
     const p=surfacePoint(i/76*Math.PI*2,j/70*Math.PI*2,formRef.current),t=project(...p);
     pts.push([t[0],t[1]]);depth+=t[2];
    }
    paths.push({z:depth/71,points:pts,alpha:.3});
   }
   for(let i=0;i<22;i++){
    const pts:[number,number][]=[];let depth=0;
    for(let j=0;j<=140;j++){
     const p=surfacePoint(j/140*Math.PI*2,i/22*Math.PI*2,formRef.current),t=project(...p);
     pts.push([t[0],t[1]]);depth+=t[2];
    }
    paths.push({z:depth/141,points:pts,alpha:.17});
   }
   paths.sort((p,q)=>p.z-q.z).forEach(p=>{
    ctx.beginPath();p.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    const intensity=Math.max(.08,Math.min(.83,p.alpha+(p.z+1)*.25));
    ctx.strokeStyle='rgba(239,235,237,'+intensity+')';ctx.lineWidth=.65;ctx.stroke();
   });
  }
  paint.current=draw;
  const resize=()=>{const rect=node.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,2);node.width=Math.round(width*dpr);node.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()};
  const ro=new ResizeObserver(resize);ro.observe(node);resize();
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});io.observe(node);
  const tick=(time:number)=>{if(playing&&visible&&!document.hidden){angle.current+=Math.min(time-last,40)*.00015;draw()}last=time;raf=requestAnimationFrame(tick)};
  if(playing)raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect()};
 },[playing]);
 const switchForm=()=>{formRef.current=1-formRef.current;setForm(formRef.current);paint.current()};
 return <div className="sculpture-wrap">
  <div className="specimen-meta"><span>{c.specimen}</span><span>CANVAS · LIVE</span></div>
  <button className="sculpture-button" aria-label={c.sculpture} onClick={switchForm} onKeyDown={event=>{
   if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();setPlaying(false);angle.current+=(event.key==='ArrowLeft'?-.15:.15);paint.current();}
  }}><canvas ref={canvas} aria-hidden="true"/><span className="sculpture-index">0{form+1} / ∞</span><span className="sculpture-cross">+</span></button>
  <div className="signature-orbit" aria-hidden="true">
   {SKILLS.map((s,i)=><span key={s.name} className={'orbit-chip'+(i===sig.index?' is-active':'')} style={{['--orbit-angle' as string]:`${(i/SKILLS.length)*360}deg`,['--chip-color' as string]:s.color}}><i>{s.glyph}</i></span>)}
  </div>
  <div className="signature-overlay" aria-hidden="true">
   <p className="signature-kicker">NOW TYPING · {String(sig.index+1).padStart(2,'0')}/{String(SKILLS.length).padStart(2,'0')}</p>
   <p className="skill-badge" style={{['--chip-color' as string]:sig.skill.color}}><span className="skill-glyph">{sig.skill.glyph}</span></p>
   <p className={'signature-type skill-type'+(sig.phase==='holding'?' is-glow':'')} key={sig.skill.name}>{typedSkill}{showCaret&&<span className="signature-caret"/>}</p>
   <p className="signature-sub">{sig.skill.tag}</p>
   <div className="skill-progress" aria-hidden="true">{SKILLS.map((s,i)=><i key={s.name} className={i===sig.index?'is-current':i<sig.index||(sig.index===0&&false)?'is-seen':''}/>)}</div>
  </div>
  <p className="sculpture-hint">{c.sculptureHint}</p>
  <p className="signature-live" role="status">{sig.skill.name} — {sig.skill.tag}</p>
  <div className="signature-controls">
   <button className="text-action" onClick={()=>sig.setMuted(m=>!m)} aria-pressed={sig.muted}>{sig.muted?'♪ Unmute typing sound':'♪ Mute typing sound'}</button>
   {!sig.soundOn&&<span className="signature-sound-note">Sound starts on first tap / keypress</span>}
  </div>
  <div className="motion-controls"><span><i className={playing?'motion-dot is-live':'motion-dot'}/>{reduced?c.reduced:playing?c.running:c.paused}</span><button onClick={()=>setPlaying(v=>!v)}>{playing?'Ⅱ':'▷'} {playing?c.pause:c.play}</button><button onClick={()=>{angle.current=.4;formRef.current=0;setForm(0);setPlaying(false);paint.current()}}>{c.reset} ↺</button></div>
 </div>
}
