import {useEffect,useRef,useState} from 'react';
import {copy} from './content';
import {surfacePoint} from './model';

/* Typewriter signature: types `text` once (paused when prefers-reduced-motion),
   with a soft per-keystroke tick via WebAudio. Sound only starts after the
   visitor presses "play signature" (browsers block audio before a gesture),
   and each run stops cleanly at the end — no loops, no autoplay. */
const SIGNATURE_TEXT = 'Japhet Nyangaresi';
const SIGNATURE_SUB = 'FULL-STACK · AI ENGINEER';
function useTypewriter(reduced: boolean) {
 const [chars, setChars] = useState(0);
 const [started, setStarted] = useState(false);
 const [done, setDone] = useState(false);
 const [muted, setMuted] = useState(false);
 const audio = useRef<AudioContext | null>(null);
 const timer = useRef(0);
 function tick() {
  try {
   if (!audio.current) {
    const Ctor = window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctor) return;
    audio.current = new Ctor();
   }
   const ctx = audio.current;
   if (ctx.state === 'suspended') void ctx.resume();
   const osc = ctx.createOscillator();
   const gain = ctx.createGain();
   osc.type = 'sine';
   osc.frequency.value = 660 + Math.random() * 220;
   gain.gain.setValueAtTime(0.0001, ctx.currentTime);
   gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.012);
   gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
   osc.connect(gain).connect(ctx.destination);
   osc.start();
   osc.stop(ctx.currentTime + 0.09);
  } catch { /* audio is decorative — never break typing */ }
 }
 function start() {
  window.clearInterval(timer.current);
  setChars(0);
  setDone(false);
  setStarted(true);
 }
 function replay() {
  start();
 }
 useEffect(() => {
  if (!started) return;
  if (reduced) {
   setChars(SIGNATURE_TEXT.length);
   setDone(true);
   return;
  }
  timer.current = window.setInterval(() => {
   setChars(prev => {
    const next = prev + 1;
    if (!muted) tick();
    if (next >= SIGNATURE_TEXT.length) {
     window.clearInterval(timer.current);
     setDone(true);
    }
    return Math.min(next, SIGNATURE_TEXT.length);
   });
  }, 130);
  return () => window.clearInterval(timer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [started, reduced, muted]);
 useEffect(() => () => {
  window.clearInterval(timer.current);
  void audio.current?.close().catch(() => undefined);
 }, []);
 return {chars, started, done, muted, setMuted, start, replay};
}
export function Sculpture() {
 const c=copy, canvas=useRef<HTMLCanvasElement>(null),angle=useRef(0.4),formRef=useRef(0),paint=useRef<()=>void>(()=>{});
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [form,setForm]=useState(0);
 const sig=useTypewriter(reduced);
 const typed=SIGNATURE_TEXT.slice(0,sig.chars);
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
  <div className="signature-overlay" aria-hidden="true">
   <p className="signature-type">{typed}<span className={'signature-caret'+(sig.done?' is-done':'')}/></p>
   {sig.done&&<p className="signature-sub">{SIGNATURE_SUB}</p>}
  </div>
  <p className="sculpture-hint">{c.sculptureHint}</p>
  <p className="signature-live" role="status" aria-live="polite">{sig.started?(sig.done?'Signature complete.':`Signing… ${typed}`):''}</p>
  <div className="signature-controls">
   {!sig.started
    ?<button className="text-action" onClick={sig.start}>▷ Play signature with sound</button>
    :<><button className="text-action" onClick={sig.replay}>↺ Replay signature</button>
   <button className="text-action" onClick={()=>sig.setMuted(m=>!m)} aria-pressed={sig.muted}>{sig.muted?'♪ Unmute keystrokes':'♪ Mute keystrokes'}</button></>}
  </div>
  <div className="motion-controls"><span><i className={playing?'motion-dot is-live':'motion-dot'}/>{reduced?c.reduced:playing?c.running:c.paused}</span><button onClick={()=>setPlaying(v=>!v)}>{playing?'Ⅱ':'▷'} {playing?c.pause:c.play}</button><button onClick={()=>{angle.current=.4;formRef.current=0;setForm(0);setPlaying(false);paint.current()}}>{c.reset} ↺</button></div>
 </div>
}
