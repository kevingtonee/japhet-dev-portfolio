import {useEffect,useRef} from 'react';
/** Wraps index math for the carousel so it stays testable without a DOM. */
export function nextIndex(current:number,total:number){
 if(total<=0)return 0;
 return (current+1)%total;
}
export function prevIndex(current:number,total:number){
 if(total<=0)return 0;
 return (current-1+total)%total;
}
/** Offset of an item relative to the active index, wrapped to [-total/2, total/2]. */
export function relativeOffset(item:number,active:number,total:number){
 if(total<=0)return 0;
 let d=(item-active)%total;
 if(d>total/2)d-=total;
 if(d<-total/2)d+=total;
 return d;
}
export function useAutoplay(active:boolean,count:number,delayMs:number,onAdvance:()=>void){
 const saved=useRef(onAdvance);
 saved.current=onAdvance;
 useEffect(()=>{
  if(!active||count<=1)return;
  const t=window.setInterval(()=>saved.current(),delayMs);
  return()=>window.clearInterval(t);
 },[active,count,delayMs]);
}
