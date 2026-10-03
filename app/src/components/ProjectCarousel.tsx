import {useCallback,useEffect,useRef,useState} from 'react';
import {copy,type Project} from '../content';
import {ProjectArt} from '../ProjectArt';
import {useReducedMotion} from '../hooks/useReducedMotion';
import './carousel.css';

const AUTOPLAY_MS=6000;
const SWIPE_PX=48;
const TILT_MAX=6;

/* Pure CSS-3D project carousel: active project large and central, neighbours
   visible as a physical stack. Pointer tilt, keyboard, swipe and polite
   autoplay that pauses on any interaction. Reduced motion: fades only. */
export function ProjectCarousel({items,onOpen}:{items:Project[];onOpen:(id:string)=>void}){
 const c=copy,reduced=useReducedMotion(),n=items.length;
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 const [tilt,setTilt]=useState<{x:number;y:number}|null>(null);
 const stage=useRef<HTMLDivElement>(null);
 const swipe=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{if(active>=n)setActive(0)},[active,n]);
 const go=useCallback((dir:number)=>{setActive(a=>n?(a+dir+n)%n:0);setPaused(true)},[n]);
 useEffect(()=>{
  if(reduced||paused||n<2)return;
  const timer=setInterval(()=>setActive(a=>(a+1)%n),AUTOPLAY_MS);
  return()=>clearInterval(timer);
 },[reduced,paused,n]);
 function tiltMove(event:React.PointerEvent<HTMLElement>){
  if(reduced||event.pointerType!=='mouse')return;
  const rect=event.currentTarget.getBoundingClientRect();
  const px=(event.clientX-rect.left)/rect.width-.5,py=(event.clientY-rect.top)/rect.height-.5;
  setTilt({x:-(py*2*TILT_MAX),y:px*2*TILT_MAX});
 }
 function slideOffset(i:number){
  let offset=(i-active)%n;
  if(offset>n/2)offset-=n;
  if(offset<-n/2)offset+=n;
  return offset;
 }
 function slideClass(offset:number){
  if(offset===0)return'pos-0';
  if(offset===1)return'pos-next';
  if(offset===-1)return'pos-prev';
  if(offset===2)return'pos-next-far';
  if(offset===-2)return'pos-prev-far';
  return'pos-hidden';
 }
 const current=items[active];
 return <div className={'carousel'+(reduced?' is-reduced':'')}>
  <div
   ref={stage}
   className="carousel-stage"
   role="group"
   aria-roledescription="carousel"
   aria-label={c.carouselLabel}
   tabIndex={0}
   onKeyDown={event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();go(-1)}
    if(event.key==='ArrowRight'){event.preventDefault();go(1)}
   }}
   onPointerEnter={()=>setPaused(true)}
   onPointerLeave={()=>{setPaused(false);setTilt(null)}}
   onFocus={()=>setPaused(true)}
   onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setPaused(false)}}
   onPointerDown={event=>{setPaused(true);swipe.current={x:event.clientX,y:event.clientY}}}
   onPointerUp={event=>{
    const start=swipe.current;swipe.current=null;
    if(!start)return;
    const dx=event.clientX-start.x,dy=event.clientY-start.y;
    if(Math.abs(dx)>SWIPE_PX&&Math.abs(dx)>Math.abs(dy)*1.2)go(dx<0?1:-1);
   }}
  >
   {items.map((p,i)=>{
    const offset=slideOffset(i),isActive=offset===0;
    return <div key={p.id} className={'carousel-slide '+slideClass(offset)} aria-hidden={!isActive}>
     <div
      className="carousel-card"
      style={isActive&&tilt?{transform:`rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`}:undefined}
      onPointerMove={isActive?tiltMove:undefined}
      onPointerLeave={isActive?()=>setTilt(null):undefined}
     >
      <button
       className="carousel-open"
       tabIndex={isActive?0:-1}
       onClick={()=>{if(isActive)onOpen(p.id);else setActive(i)}}
       aria-label={isActive?p.name+' — '+c.caseStudy:c.goToProject+': '+p.name}
      >
       <ProjectArt id={p.id}/>
       <div className="carousel-info">
        <div className="carousel-title-row">
         <span className="project-number">/{p.number}</span>
         <h3>{p.name}</h3>
         <span className="project-year">{p.year}</span>
         <span className={'carousel-status '+(p.status==='building'?'is-building':'is-live')}>{p.status==='building'?c.statusBuilding:c.statusLive}</span>
        </div>
        <p className="project-headline">{p.headline}</p>
        <p className="carousel-fingerprint"><span>{c.stackLabel}</span>{p.tags.join(' · ')}</p>
        <p className="carousel-explore">{c.explore} <span aria-hidden="true">↗</span></p>
       </div>
      </button>
     </div>
    </div>;
   })}
   <p className="carousel-live" role="status" aria-live="polite">{current?current.name+', '+(active+1)+' / '+n:''}</p>
  </div>
  <div className="carousel-controls">
   <button className="carousel-arrow" onClick={()=>go(-1)} aria-label={c.prevProject}>←</button>
   <div className="carousel-dots" role="tablist" aria-label={c.carouselLabel}>
    {items.map((p,i)=><button key={p.id} role="tab" aria-selected={i===active} aria-label={p.name} className={i===active?'is-current':''} onClick={()=>{setActive(i);setPaused(true)}}/>)}
   </div>
   <button className="carousel-arrow" onClick={()=>go(1)} aria-label={c.nextProject}>→</button>
  </div>
 </div>;
}
