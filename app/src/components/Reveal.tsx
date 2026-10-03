import {useEffect,useRef,useState,type ReactNode} from 'react';
import {useReducedMotion} from '../hooks/useReducedMotion';

/* Lightweight scroll reveal: fades + lifts children into view once.
   Reduced-motion users get the content immediately, no observer work. */
export function Reveal({children,className='',delay=0}:{children:ReactNode;className?:string;delay?:number}){
 const ref=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  if(reduced){setVisible(true);return}
  const node=ref.current;
  if(!node)return;
  const io=new IntersectionObserver(entries=>{
   if(entries[0].isIntersecting){setVisible(true);io.disconnect()}
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  io.observe(node);
  return()=>io.disconnect();
 },[reduced]);
 return <div ref={ref} className={'reveal '+(visible?'is-visible ':'')+className} style={delay?{transitionDelay:delay+'ms'}:undefined}>{children}</div>;
}
