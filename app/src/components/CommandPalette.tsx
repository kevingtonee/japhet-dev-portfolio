import {useEffect,useMemo,useRef,useState} from 'react';
import {copy} from '../content';
import './command-palette.css';

export interface PaletteCommand{id:string;label:string;hint?:string;keywords:string;run:()=>void}

/* Ctrl/Cmd+K command palette — a developer interface for the whole site:
   sections, case studies, resume, socials. Keyboard-first, Escape closes. */
export function CommandPalette({open,onClose,commands}:{open:boolean;onClose:()=>void;commands:PaletteCommand[]}){
 const c=copy;
 const [query,setQuery]=useState('');
 const [cursor,setCursor]=useState(0);
 const input=useRef<HTMLInputElement>(null);
 const list=useRef<HTMLUListElement>(null);
 const restoreFocus=useRef<HTMLElement|null>(null);
 const results=useMemo(()=>{
  const q=query.trim().toLowerCase();
  if(!q)return commands;
  return commands.filter(cmd=>(cmd.label+' '+cmd.keywords).toLowerCase().includes(q));
 },[query,commands]);
 useEffect(()=>{
  if(!open)return;
  restoreFocus.current=document.activeElement as HTMLElement|null;
  setQuery('');setCursor(0);
  const frame=requestAnimationFrame(()=>input.current?.focus());
  const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();onClose()}};
  window.addEventListener('keydown',onKey);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('keydown',onKey);restoreFocus.current?.focus?.()};
 },[open,onClose]);
 useEffect(()=>{setCursor(0)},[query]);
 useEffect(()=>{
  const el=list.current?.querySelector('[aria-selected="true"]');
  el?.scrollIntoView({block:'nearest'});
 },[cursor]);
 if(!open)return null;
 function run(cmd:PaletteCommand){onClose();cmd.run()}
 return <div className="palette-overlay" onClick={onClose}>
  <div className="palette" role="dialog" aria-modal="true" aria-label={c.paletteTitle} onClick={e=>e.stopPropagation()}>
   <div className="palette-input-row">
    <span aria-hidden="true">⌘</span>
    <input
     ref={input}
     value={query}
     placeholder={c.palettePlaceholder}
     aria-label={c.palettePlaceholder}
     aria-controls="palette-list"
     aria-activedescendant={results[cursor]?'palette-option-'+results[cursor].id:undefined}
     role="combobox"
     aria-expanded="true"
     onChange={e=>setQuery(e.target.value)}
     onKeyDown={e=>{
      if(e.key==='ArrowDown'){e.preventDefault();setCursor(i=>Math.min(i+1,results.length-1))}
      else if(e.key==='ArrowUp'){e.preventDefault();setCursor(i=>Math.max(i-1,0))}
      else if(e.key==='Enter'&&results[cursor]){e.preventDefault();run(results[cursor])}
     }}
    />
    <kbd>esc</kbd>
   </div>
   <ul id="palette-list" role="listbox" ref={list} aria-label={c.paletteTitle}>
    {results.map((cmd,i)=><li key={cmd.id} id={'palette-option-'+cmd.id} role="option" aria-selected={i===cursor}>
     <button onClick={()=>run(cmd)} onPointerEnter={()=>setCursor(i)} tabIndex={-1}>
      <span>{cmd.label}</span>
      {cmd.hint&&<small>{cmd.hint}</small>}
     </button>
    </li>)}
    {!results.length&&<li className="palette-empty">{c.paletteEmpty}</li>}
   </ul>
   <p className="palette-hint">{c.paletteHint}</p>
  </div>
 </div>;
}
