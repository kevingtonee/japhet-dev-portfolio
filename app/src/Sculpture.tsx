import {useEffect,useRef,useState} from 'react';
import {copy} from './content';
import {surfacePoint} from './model';

/* Continuous signature loop, drawn ON the sculpture:
   types name → types role → holds → erases → repeats forever, starting on
   every page load. Sound is a soft per-keystroke WebAudio tick. Browsers
   block audio before the first tap/click, so the visual loop starts
   immediately while sound unlocks on first interaction (with a mute toggle).
   prefers-reduced-motion shows the full static signature instead of looping. */
const TYPE_MS = 115;
const ROLE_MS = 48;
const HOLD_MS = 2300;
const ERASE_MS = 26;
const GAP_MS = 650;
type Phase = 'typing-name' | 'typing-role' | 'holding' | 'erasing' | 'gap';
function useSignatureLoop(reduced: boolean, name: string, role: string) {
 const [nameChars, setNameChars] = useState(reduced ? name.length : 0);
 const [roleChars, setRoleChars] = useState(reduced ? role.length : 0);
 const [phase, setPhase] = useState<Phase>(reduced ? 'holding' : 'typing-name');
 const [muted, setMuted] = useState(false);
 const [soundOn, setSoundOn] = useState(false);
 const audio = useRef<AudioContext | null>(null);
 const state = useRef({nameChars: reduced ? name.length : 0, roleChars: reduced ? role.length : 0, phase: (reduced ? 'holding' : 'typing-name') as Phase});
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
   osc.type = 'sine';
   osc.frequency.value = (erasing ? 420 : 640) + Math.random() * 200;
   gain.gain.setValueAtTime(0.0001, ctx.currentTime);
   gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.012);
   gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
   osc.connect(gain).connect(ctx.destination);
   osc.start();
   osc.stop(ctx.currentTime + 0.08);
  } catch { /* decorative — never break the loop */ }
 }
 /* Unlock sound on first visitor gesture (autoplay policy). */
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
 /* The loop itself. */
 useEffect(() => {
  if (reduced) {
   state.current = {nameChars: name.length, roleChars: role.length, phase: 'holding'};
   setNameChars(name.length);
   setRoleChars(role.length);
   setPhase('holding');
   return;
  }
  let delay = TYPE_MS;
  const s = state.current;
  if (s.phase === 'typing-name') delay = TYPE_MS;
  else if (s.phase === 'typing-role') delay = ROLE_MS;
  else if (s.phase === 'holding') delay = HOLD_MS;
  else if (s.phase === 'erasing') delay = ERASE_MS;
  else delay = GAP_MS;
  const t = window.setTimeout(() => {
   const cur = state.current;
   if (cur.phase === 'typing-name') {
    cur.nameChars += 1;
    blip();
    setNameChars(cur.nameChars);
    if (cur.nameChars >= name.length) { cur.phase = 'typing-role'; setPhase('typing-role'); }
   } else if (cur.phase === 'typing-role') {
    cur.roleChars += 1;
    blip();
    setRoleChars(cur.roleChars);
    if (cur.roleChars >= role.length) { cur.phase = 'holding'; setPhase('holding'); }
   } else if (cur.phase === 'holding') {
    cur.phase = 'erasing'; setPhase('erasing');
   } else if (cur.phase === 'erasing') {
    if (cur.roleChars > 0) { cur.roleChars -= 1; setRoleChars(cur.roleChars); blip(true); }
    else if (cur.nameChars > 0) { cur.nameChars -= 1; setNameChars(cur.nameChars); blip(true); }
    else { cur.phase = 'gap'; setPhase('gap'); }
   } else {
    cur.phase = 'typing-name'; setPhase('typing-name');
   }
  }, delay);
  return () => window.clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [reduced, name, role, nameChars, roleChars, phase, muted, soundOn]);
 useEffect(() => () => { void audio.current?.close().catch(() => undefined); }, []);
 return {nameChars, roleChars, phase, muted, setMuted, soundOn};
}
export function Sculpture() {
 const c=copy, canvas=useRef<HTMLCanvasElement>(null),angle=useRef(0.4),formRef=useRef(0),paint=useRef<()=>void>(()=>{});
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [form,setForm]=useState(0);
 const sig=useSignatureLoop(reduced, c.roman, c.role.toUpperCase());
 const typedName=c.roman.slice(0,sig.nameChars);
 const typedRole=c.role.toUpperCase().slice(0,sig.roleChars);
 const showCaret=sig.phase==='typing-name'||sig.phase==='typing-role';
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
  <div className="signature-orbit" aria-hidden="true"><span className="signature-orbit-text">{c.roman} ✳ {c.role.toUpperCase()} ✳ </span></div>
  <div className="signature-overlay" aria-hidden="true">
   <p className="signature-type">{typedName}{showCaret&&<span className="signature-caret"/>}</p>
   <p className="signature-sub">{typedRole}{sig.phase==='typing-role'&&<span className="signature-caret is-small"/>}</p>
  </div>
  <p className="sculpture-hint">{c.sculptureHint}</p>
  <p className="signature-live" role="status">{c.roman} — {c.role}</p>
  <div className="signature-controls">
   <button className="text-action" onClick={()=>sig.setMuted(m=>!m)} aria-pressed={sig.muted}>{sig.muted?'♪ Unmute typing sound':'♪ Mute typing sound'}</button>
   {!sig.soundOn&&<span className="signature-sound-note">Sound starts on first tap / keypress</span>}
  </div>
  <div className="motion-controls"><span><i className={playing?'motion-dot is-live':'motion-dot'}/>{reduced?c.reduced:playing?c.running:c.paused}</span><button onClick={()=>setPlaying(v=>!v)}>{playing?'Ⅱ':'▷'} {playing?c.pause:c.play}</button><button onClick={()=>{angle.current=.4;formRef.current=0;setForm(0);setPlaying(false);paint.current()}}>{c.reset} ↺</button></div>
 </div>
}
