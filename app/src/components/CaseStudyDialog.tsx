import {useEffect,useRef} from 'react';
import {copy,type Project} from '../content';
import {ProjectDemo} from '../ProjectArt';

/* Case study as a real reading experience: context → demo slice → decisions →
   architecture flow → fingerprint → outcome. All content from the data model. */
export function CaseStudyDialog({project,onClose}:{project:Project|null;onClose:()=>void}){
 const c=copy,dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const d=dialog.current;
  if(!d)return;
  if(project&&!d.open){d.showModal();d.scrollTop=0}
  if(!project&&d.open)d.close();
  if(project){
   const previous=document.body.style.overflow;
   document.body.style.overflow='hidden';
   return()=>{document.body.style.overflow=previous};
  }
 },[project]);
 return <dialog
  ref={dialog}
  className="case-dialog"
  aria-labelledby="case-title"
  onCancel={onClose}
  onClose={onClose}
  onClick={event=>{
   if(event.target===event.currentTarget){
    const r=event.currentTarget.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)onClose();
   }
  }}
 >
 {project&&<>
  <div className="dialog-top">
   <span>{c.concept} / {project.year}</span>
   <button autoFocus aria-label={c.close} onClick={onClose}>×</button>
  </div>
  <div className="dialog-content">
   <p className="section-kicker">{project.name} / {project.number}</p>
   <h2 id="case-title">{project.headline}</h2>
   <p className="case-context">{project.context}</p>
   <div className="case-status-row">
    <span className={'case-status '+(project.status==='building'?'is-building':'')}><i/>{project.status==='building'?c.buildingLabel:c.liveLabel}</span>
   </div>
   <div className="case-links">
    {project.links.live&&<a href={project.links.live} target="_blank" rel="noreferrer">{c.liveLabel} ↗</a>}
    {project.links.source&&<a href={project.links.source} target="_blank" rel="noreferrer">{c.sourceLabel} ↗</a>}
   </div>
   <p className="case-role">{c.responsibility} — {project.role}</p>
   {project.shot&&<figure className="case-shot"><img src={project.shot} alt={project.name+' — '+c.shotCaption} loading="lazy"/><figcaption>{c.shotCaption}</figcaption></figure>}
   <div className="case-demo-heading"><span>{c.demoLabel}</span><p>{project.demoHint}</p></div>
   <ProjectDemo key={project.id} id={project.id}/>
   <div className="case-columns">
    <section><h3>{c.challenge}</h3><p>{project.problem}</p></section>
    <section><h3>{c.approach}</h3><p>{project.decision}</p></section>
   </div>
   <section className="architecture" aria-label={c.architecture}>
    <h3>{c.architecture}</h3>
    <ol className="arch-flow">
     {project.architecture.map((step,i)=><li key={step}>
      <span className="arch-node"><span className="arch-index">0{i+1}</span>{step}</span>
      {i<project.architecture.length-1&&<span className="arch-connector" aria-hidden="true"/>}
     </li>)}
    </ol>
   </section>
   <section className="case-fingerprint" aria-label={c.fingerprintLabel}>
    <h3>{c.fingerprintLabel}</h3>
    <dl>
     {project.fingerprint.map(([group,items])=><div key={group}><dt>{group}</dt><dd>{items}</dd></div>)}
    </dl>
   </section>
   <section className="case-result">
    <h3>{c.outcome}</h3><p>{project.result}</p>
    <h3>{c.next}</h3><p>{project.next}</p>
   </section>
   <button className="text-action" onClick={onClose}>{c.close} ↙</button>
  </div>
 </>}
 </dialog>;
}
