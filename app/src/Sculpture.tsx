import {useEffect,useRef,useState} from 'react';
import {copy} from './content';
import {globePoint,rotateX,rotateY,fibonacciLatLon} from './model';

/* Stack globe: a canvas wireframe sphere with the 8-item tech stack riding on
   its surface as clickable chips. The skill typewriter is kept — typing a name
   highlights its chip, and clicking / focusing a chip pins that skill.
   Zero network, zero 3D deps — all effects are canvas 2D + CSS.
   Sound is a soft WebAudio tick; browsers block audio pre-gesture so it
   unlocks on first tap/keypress. prefers-reduced-motion shows one static
   frame instead of looping. */
const SKILL_TYPE_MS = 85;
const SKILL_HOLD_MS = 2100;
const SKILL_ERASE_MS = 30;
const SKILL_GAP_MS = 500;
interface Skill { name: string; tag: string; color: string; glyph: string; icon: string }
const SKILLS: Skill[] = [
 {name: 'TypeScript', tag: 'TYPED JS · FRONTEND', color: '#3178c6', glyph: 'TS', icon: 'M2 3h20v18H2zM7 8v2.4h2.6v7.2h2.4v-7.2H15V8zM15.5 8l1 1.5 1-1.5h1.6l-1.8 2.6 1.9 2.7h-1.6l-1.1-1.6-1.1 1.6h-1.6l1.9-2.7L13.9 8z'},
 {name: 'React', tag: 'UI · COMPONENTS', color: '#61dafb', glyph: '⚛', icon: 'M12 10.5c1.2 0 2.1.7 2.1 1.5s-.9 1.5-2.1 1.5-2.1-.7-2.1-1.5.9-1.5 2.1-1.5zM12 2l2 4.2 4.5-.5 1 4.5 4 2.3-4 2.3-1 4.5-4.5-.5-2 4.2-2-4.2-4.5.5-1-4.5-4-2.3 4-2.3 1-4.5 4.5.5zM12 5.8l-1 2.4-2.6-.3-.5 2.6-2.3 1.5 2.3 1.5.5 2.6 2.6-.3 1 2.4 1-2.4 2.6.3.5-2.6 2.3-1.5-2.3-1.5-.5-2.6-2.6.3z'},
 {name: 'Next.js', tag: 'FULL-STACK · SSR', color: '#edeef2', glyph: '▲', icon: 'M12 2l9 16H3zm0 4.2L7.4 16h9.2zm5.6 7.3l2.8 4.5h-2.5l-1.8-3zM12 11l2 3.2h-4z'},
 {name: 'Node.js', tag: 'APIS · BACKEND', color: '#68a063', glyph: '⬢', icon: 'M12 2l8.5 5v10L12 22l-8.5-5V7zm0 2.3L5.7 8 12 11.7 18.3 8zM5 9.7v6.6l5.5 3.2v-6.6zm14 0v6.6L13.5 19.5v-6.6z'},
 {name: 'PostgreSQL', tag: 'DATA · RELATIONAL', color: '#5f7fae', glyph: '🐘', icon: 'M5 4h14a1 1 0 011 1v5H4V5a1 1 0 011-1zm0 7h14v3H5zm0 5h14v3a1 1 0 01-1 1H6a1 1 0 01-1-1zm2-9.5h4v1.6H7zm0 9.9h4v1.6H7z'},
 {name: 'M-Pesa Daraja', tag: 'PAYMENTS · STK PUSH', color: '#4fb8a3', glyph: 'M', icon: 'M4 4h3.5L12 13l4.5-9H20v16h-2.6V8.5L12.7 18h-1.4L6.6 8.5V20H4z'},
 {name: 'Python', tag: 'ML · AUTOMATION', color: '#c9a35f', glyph: '🐍', icon: 'M12 3c-4 0-5 1.8-5 4v2h5v1.5H5.5C4 10.5 3 12 3 14s1 3.5 2.5 3.5H8v-2.6c0-1.4 1-2.4 2.4-2.4h4.2c1.2 0 2.4-1 2.4-2.4V7c0-2.2-1-4-5-4zM9 6.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm3 8.5v1.5H7V15c-1.5 0-2.5 1-2.5 0 .5 0 0-1 0-1h5.9c1.4 0 2.4 1 2.4 2.4V19H16c1.5 0 2.5-1 2.5-2.5V14c0-2-1-3.5-2.5-3.5h-2.5v2.6c0 1.4-1 2.4-2.5 2.4zm4-2.9a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'},
 {name: 'Supabase', tag: 'REALTIME · AUTH', color: '#3ecf8e', glyph: '⚡', icon: 'M13 2L4 14h6l-1 8 9-12h-6z'},
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
 function jumpTo(next: number) {
  state.current = {index: next, chars: 0, phase: 'typing'};
  setIndex(next); setChars(0); setPhase('typing');
 }
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
 return {skill: SKILLS[index], index, chars, phase, muted, setMuted, soundOn, jumpTo};
}
export function Sculpture() {
 const c=copy, canvas=useRef<HTMLCanvasElement>(null), frame=useRef<HTMLDivElement>(null),
  angle=useRef(0.4), tilt=useRef(0.42), formRef=useRef(0), paint=useRef<()=>void>(()=>{}),
  pinned=useRef<number|null>(null), chipRefs=useRef<(HTMLButtonElement|null)[]>([]);
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [form,setForm]=useState(0);
 const dragging=useRef(false),lastX=useRef(0);
 const sig=useSkillLoop(reduced);
 const sigIndex=useRef(sig.index);
 sigIndex.current=sig.index;
 const typedSkill=sig.skill.name.slice(0,sig.chars);
 const showCaret=sig.phase==='typing'||sig.phase==='erasing';
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const change=()=>{setReduced(media.matches);if(media.matches)setPlaying(false)};
  media.addEventListener('change',change);return()=>media.removeEventListener('change',change);
 },[]);
 useEffect(()=>{
  const node=canvas.current;if(!node)return;const ctx=node.getContext('2d');if(!ctx)return;
  let width=0,height=0,raf=0,last=performance.now(),visible=true;
  const project=(x:number,y:number,z:number):[number,number,number]=>{
   const R=Math.min(width,height)*0.36;
   const persp=3.4/(3.4-z*0.5);
   return [width/2+x*R*persp,height/2+y*R*persp,z];
  };
  const placeChips=()=>{
   const host=frame.current;if(!host)return;
   const rect=host.getBoundingClientRect();
   const cx=rect.width/2, cy=rect.height/2, R=Math.min(rect.width,rect.height)*0.36;
   const rotY=angle.current, lean=tilt.current-0.42;
   SKILLS.forEach((_,i)=>{
    const el=chipRefs.current[i];if(!el)return;
    const [lat,lon]=fibonacciLatLon(i,SKILLS.length);
    const p=rotateX(rotateY(globePoint(lat,lon),rotY),lean);
    const rz=p[2], persp=3.4/(3.4-rz*0.5);
    const x=cx+p[0]*R*persp, y=cy+p[1]*R*persp;
    const front=(rz+1)/2, s=0.62+front*0.55;
    el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%) scale(${s.toFixed(3)})`;
    el.style.opacity=front<0.32?'0.22':String((0.45+front*0.55).toFixed(2));
    el.style.zIndex=front<0.32?'1':'3';
    el.classList.toggle('is-back',front<0.32);
   });
  };
  function draw() {
   if(!ctx||!width||!height)return;ctx.clearRect(0,0,width,height);
   const rotY=angle.current, lean=tilt.current-0.42;
   const portrait=formRef.current===1;
   const seg=portrait?72:90;
   const cx=width/2, cy=height/2, R=Math.min(width,height)*0.36;
   const halo=ctx.createRadialGradient(cx,cy,R*0.7,cx,cy,R*1.55);
   halo.addColorStop(0,'rgba(201,154,63,0)');halo.addColorStop(0.72,'rgba(201,154,63,0.10)');halo.addColorStop(1,'rgba(201,154,63,0)');
   ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
   ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
   ctx.strokeStyle='rgba(237,238,242,0.5)';ctx.lineWidth=1.1;ctx.stroke();
   const paths:{z:number;points:[number,number][];alpha:number}[]=[];
   for(let m=0;m<12;m++){
    const pts:[number,number][]=[];let depth=0;
    for(let j=0;j<=seg;j++){
     const lat=-Math.PI/2+j/seg*Math.PI, lon=m/12*Math.PI*2+rotY;
     const p=rotateX(globePoint(lat,lon),lean);
     const t=project(...p);pts.push([t[0],t[1]]);depth+=t[2];
    }
    const slot=Math.round(((rotY*6/Math.PI)%12+12)%12);
    paths.push({z:depth/(seg+1),points:pts,alpha:m===slot?0.5:0.26});
   }
   const parallels=portrait?[-60,-40,-20,0,20,40,60]:[-60,-30,0,30,60];
   for(const deg of parallels){
    const pts:[number,number][]=[];let depth=0;
    const lat=deg*Math.PI/180;
    for(let j=0;j<=seg;j++){
     const lon=j/seg*Math.PI*2+rotY;
     const p=rotateX(globePoint(lat,lon),lean);
     const t=project(...p);pts.push([t[0],t[1]]);depth+=t[2];
    }
    paths.push({z:depth/(seg+1),points:pts,alpha:deg===0?0.46:0.22});
   }
   const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#c99a3f';
   paths.sort((p,q)=>p.z-q.z).forEach(p=>{
    ctx.beginPath();p.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    const intensity=Math.max(.1,Math.min(.85,p.alpha+(p.z+1)*.28));
    ctx.strokeStyle=p.alpha>0.4?accent+'aa':'rgba(239,235,237,'+intensity+')';
    ctx.lineWidth=p.alpha>0.4?1:.65;ctx.stroke();
   });
   /* equator glow */
   ctx.beginPath();
   for(let j=0;j<=seg;j++){
    const p=rotateX(globePoint(0,j/seg*Math.PI*2+rotY),lean);
    const t=project(...p);j?ctx.lineTo(t[0],t[1]):ctx.moveTo(t[0],t[1]);
   }
   ctx.strokeStyle=accent+'55';ctx.lineWidth=3;ctx.stroke();
   /* dotted shimmer — deterministic pseudo-noise dots riding the sphere */
   ctx.fillStyle='rgba(237,238,242,0.5)';
   for(let k=0;k<130;k++){
    const lat=Math.asin(((k*0.61803398875)%1)*2-1), lon=k*2.399963+rotY*0.9;
    const p=rotateX(globePoint(lat,lon),lean);
    if(p[2]<-0.12)continue;
    const t=project(...p);
    const r=(0.5+((k*37)%10)/22)*((p[2]+1)/2+0.3);
    ctx.beginPath();ctx.arc(t[0],t[1],r,0,Math.PI*2);ctx.fill();
   }
   /* arc from globe centre to active skill */
   const active=pinned.current??sigIndex.current;
   const [blat,blon]=fibonacciLatLon(active,SKILLS.length);
   const ap=rotateX(rotateY(globePoint(blat,blon),rotY),lean);
   const a2=project(...ap);
   if(ap[2]>-0.2){
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.quadraticCurveTo((cx+a2[0])/2,(cy+a2[1])/2-26,a2[0],a2[1]);
    ctx.strokeStyle=SKILLS[active].color+'cc';ctx.lineWidth=1.2;ctx.stroke();
    ctx.beginPath();ctx.arc(a2[0],a2[1],3.2,0,Math.PI*2);
    ctx.fillStyle=SKILLS[active].color;ctx.fill();
   }
   placeChips();
  }
  paint.current=draw;
  const resize=()=>{const rect=node.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,2);node.width=Math.round(width*dpr);node.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()};
  const ro=new ResizeObserver(resize);ro.observe(node);resize();
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});io.observe(node);
  const tick=(time:number)=>{if(playing&&visible&&!document.hidden&&!reduced){angle.current+=Math.min(time-last,40)*.00022;draw()}last=time;raf=requestAnimationFrame(tick)};
  if(playing&&!reduced)raf=requestAnimationFrame(tick);else draw();
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect()};
 },[playing,reduced]);
 const pinSkill=(i:number)=>{pinned.current=i;sig.jumpTo(i);paint.current()};
 const switchForm=()=>{formRef.current=1-formRef.current;setForm(formRef.current);paint.current()};
 return <div className="sculpture-wrap globe-wrap">
  <div className="specimen-meta"><span>{c.specimen}</span><span>GLOBE · LIVE</span></div>
  <div ref={frame} className="globe-frame" onPointerDown={e=>{dragging.current=true;lastX.current=e.clientX;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(!dragging.current)return;angle.current+=(e.clientX-lastX.current)*0.006;lastX.current=e.clientX;paint.current()}} onPointerUp={()=>{dragging.current=false}} onPointerCancel={()=>{dragging.current=false}}>
   <button className="sculpture-button globe-button" aria-label={c.sculpture} onClick={switchForm} onKeyDown={event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();setPlaying(false);angle.current+=(event.key==='ArrowLeft'?-.15:.15);paint.current();}
   }}><canvas ref={canvas} aria-hidden="true"/><span className="sculpture-index">STACK · {String(sig.index+1).padStart(2,'0')}/{String(SKILLS.length).padStart(2,'0')}</span><span className="sculpture-cross">+</span></button>
   <div className="stack-orbit">
    {SKILLS.map((s,i)=><button key={s.name} ref={el=>{chipRefs.current[i]=el}} type="button" className={'stack-chip'+(i===sig.index?' is-active':'')} style={{['--chip-color' as string]:s.color}} title={`${s.name} — ${s.tag}`} aria-label={`Pin skill ${s.name}`} aria-pressed={i===sig.index} onClick={e=>{e.stopPropagation();pinSkill(i)}} onFocus={()=>pinSkill(i)}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d={s.icon}/></svg></button>)}
   </div>
  </div>
  <div className="signature-overlay" aria-hidden="true">
   <p className="signature-kicker">NOW TYPING · {String(sig.index+1).padStart(2,'0')}/{String(SKILLS.length).padStart(2,'0')}</p>
   <p className="skill-badge" style={{['--chip-color' as string]:sig.skill.color}}><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor" style={{color:sig.skill.color}}><path d={sig.skill.icon}/></svg></p>
   <p className={'signature-type skill-type'+(sig.phase==='holding'?' is-glow':'')} key={sig.skill.name}>{typedSkill}{showCaret&&<span className="signature-caret"/>}</p>
   <p className="signature-sub">{sig.skill.tag}</p>
   <div className="skill-progress" aria-hidden="true">{SKILLS.map((s,i)=><i key={s.name} className={i===sig.index?'is-current':''}/>)}</div>
  </div>
  <p className="sculpture-hint">{c.sculptureHint}</p>
  <p className="signature-live" role="status">{sig.skill.name} — {sig.skill.tag}</p>
  <div className="signature-controls">
   <button className="text-action" onClick={()=>sig.setMuted(m=>!m)} aria-pressed={sig.muted}>{sig.muted?'♪ Unmute typing sound':'♪ Mute typing sound'}</button>
   {!sig.soundOn&&<span className="signature-sound-note">Sound starts on first tap / keypress</span>}
  </div>
  <div className="motion-controls"><span><i className={playing?'motion-dot is-live':'motion-dot'}/>{reduced?c.reduced:playing?c.running:c.paused}</span><button onClick={()=>setPlaying(v=>!v)}>{playing?'Ⅱ':'▷'} {playing?c.pause:c.play}</button><button onClick={()=>{angle.current=.4;tilt.current=.42;formRef.current=0;pinned.current=null;setForm(0);setPlaying(false);sig.jumpTo(0);paint.current()}}>{c.reset} ↺</button></div>
 </div>
}
