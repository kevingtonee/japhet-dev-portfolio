import {useEffect,useRef,useState} from 'react';
import {copy,projects,social,type Category} from './content';
import {filterProjects,buildResume} from './model';
import {Sculpture} from './Sculpture';
import {ProjectArt,ProjectDemo} from './ProjectArt';
import {ContactForm} from './ContactForm';

function Arrow({diagonal=false}:{diagonal?:boolean}) {return <span aria-hidden="true">{diagonal?'↗':'↘'}</span>}
export function App() {
 const [category,setCategory]=useState<Category>('all');
 const [selected,setSelected]=useState<string|null>(null);
 const [notice,setNotice]=useState('');
 const dialog=useRef<HTMLDialogElement>(null);
 const c=copy,all=projects,items=filterProjects(all,category),project=all.find(p=>p.id===selected);
 useEffect(()=>{
  const target=document.getElementById(window.location.hash.slice(1));
  if(!target)return;
  const frame=requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant'}));
  return()=>cancelAnimationFrame(frame);
 },[]);
 useEffect(()=>{
  document.documentElement.lang='en';
  document.title=c.name+' · '+c.role;
  document.querySelector('meta[name="description"]')?.setAttribute('content',c.intro+' '+c.statusNote);
 },[c]);
 useEffect(()=>{
  const d=dialog.current;if(!d)return;
  if(selected&&!d.open){d.showModal();d.scrollTop=0}
  if(!selected&&d.open)d.close();
  if(selected){const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}}
 },[selected]);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),6000);return()=>clearTimeout(timer)},[notice]);
 function download() {
  try {
   const blob=new Blob(['﻿'+buildResume()],{type:'text/plain;charset=utf-8'});
   const url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='japhet-nyangaresi-resume.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice(c.downloaded);
  } catch{setNotice(c.downloadFailed)}
 }
 async function copyEmail() {
  try {await navigator.clipboard.writeText(c.email);setNotice(c.copied)}
  catch{setNotice(c.copyFailed)}
 }
 return <>
 <a className="skip-link" href="#work">{c.skip}</a>
 <div className="screen-content">
 <header className="site-header">
  <a href="#top" className="wordmark" aria-label={c.name+' '+c.resumeLabel}><span className="logo-mark" aria-hidden="true">✳</span><span>JAPHET NYANGARESI<small>{c.resumeLabel}</small></span></a>
  <nav aria-label="Main navigation">{['work','experience','contact'].map((id,i)=><a key={id} href={'#'+id}>{c.nav[i]}<span>0{i+1}</span></a>)}</nav>
 </header>
 <main>
 <section className="hero section-shell" id="top" aria-labelledby="hero-title">
  <div className="hero-intro">
   <div className="availability"><span/> {c.available}</div>
   <p className="hero-role">{c.role}<span> / 2023 — 2026</span></p>
   <h1 id="hero-title" className="english-name">{c.name}<span className="name-stop">.</span></h1>
   <p className="hero-statement">{c.statement[0]}<br/>{c.statement[1]}</p>
   <p className="hero-description">{c.intro}</p>
   <div className="hero-actions"><a className="primary-action" href="#work">{c.viewWork}<Arrow/></a><button className="text-action" onClick={download}>{c.download}<span aria-hidden="true">↓</span></button></div>
   <div className="hero-links">
    <a href={social.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal/></a>
    <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal/></a>
    <a href={'mailto:'+c.email}>{c.email}</a>
   </div>
   <p className="fiction-notice"><span aria-hidden="true">◌</span> {c.statusNote}</p>
  </div>
  <Sculpture/>
  <div className="hero-baseline"><span>{c.location}</span><span>{c.eyebrow}</span><a href="#work" aria-label={c.viewWork}>↓</a></div>
 </section>
 <section className="work-section section-shell" id="work" aria-labelledby="work-title">
  <div className="section-heading"><div><p className="section-kicker">01 / SELECTED WORK</p><h2 id="work-title">{c.selected}<span className="tiny-sup">{String(all.length).padStart(2,'0')}</span></h2></div><p>{c.selectedSub}<br/><span>{c.projectHint}</span></p></div>
  <div className="filter-row"><div role="group" aria-label="Project categories">{(['all','product','system','experiment'] as Category[]).map(k=><button key={k} onClick={()=>setCategory(k)} aria-pressed={category===k}>{c[k]}{k==='all'&&<span>{String(all.length).padStart(2,'0')}</span>}</button>)}</div><span role="status" aria-live="polite">{items.length} {c.resultCount}</span></div>
  <div className={'project-grid '+(items.length===1?'single-result':'')}>
   {items.map(p=><article key={p.id} className={'project-card project-'+p.id}>
    <button className="project-open" onClick={()=>setSelected(p.id)} aria-label={p.name+' — '+c.caseStudy}>
     <ProjectArt id={p.id}/><div className="project-caption"><div><span className="project-number">/{p.number}</span><h3>{p.name}</h3><span className="project-year">{p.year}</span></div><span className="project-arrow"><Arrow diagonal/></span></div>
     <p className="project-headline">{p.headline}</p><p className="project-summary">{p.summary}</p><div className="project-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
    </button>
   </article>)}
  </div>
 </section>
 <section className="about-section section-shell" aria-labelledby="about-title">
  <div className="about-left"><img className="about-photo" src="/img/profile.jpg" alt="Portrait of Japhet Nyangaresi" width="118" height="118" loading="lazy"/><p className="section-kicker">02 / {c.aboutLabel}</p><h2 id="about-title">{c.aboutTitle[0]}<br/><span>{c.aboutTitle[1]}</span></h2><p className="about-body">{c.aboutBody}</p><div className="about-stamp" aria-hidden="true"><span>THINK</span><b>✳</b><span>MAKE</span></div></div>
  <div className="principles">{c.principles.map(p=><div key={p[0]}><span>{p[0]}</span><div><h3>{p[1]}</h3><p>{p[2]}</p></div></div>)}</div>
 </section>
 <section className="experience-section section-shell" id="experience" aria-labelledby="experience-title">
  <div className="section-heading"><div><p className="section-kicker">03 / THE JOURNEY</p><h2 id="experience-title">{c.experience}</h2></div><p>{c.experienceNote}</p></div>
  <div className="experience-list">{c.history.map((h,i)=><article key={h.date}><div className="experience-date"><span>{h.date}</span>{i===0&&<i/>}</div><div><h3>{h.company}</h3><p className="experience-role">{h.role}</p></div><p>{h.body}</p></article>)}</div>
  <div className="toolkit"><div><h3>{c.toolkit}</h3><p>{c.toolNote}</p></div><div className="skill-list">{c.skillGroups.map(([title,skills])=><div key={title}><h4>{title}</h4><p>{skills}</p></div>)}</div></div>
  <div className="education"><h3>{c.education}</h3><div><p>{c.educationText}</p><p>{c.educationExtra}</p></div></div>
 </section>
 <section className="contact-section section-shell" id="contact" aria-labelledby="contact-title">
  <p className="section-kicker">04 / WHAT'S NEXT?</p><div className="contact-layout"><div><h2 id="contact-title">{c.contactTitle[0]}<br/><span>{c.contactTitle[1]}</span><span className="contact-star" aria-hidden="true">✳</span></h2><p>{c.contactBody}</p><ContactForm/></div><div className="contact-details"><a className="contact-email" href={'mailto:'+c.email}>{c.email}</a><button className="primary-action" onClick={copyEmail}>{c.copyEmail}<span aria-hidden="true">↗</span></button><p>{c.contactNote}</p><div className="contact-socials"><a href={social.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a><a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a></div><div className="resume-actions"><button onClick={download}>{c.download} ↓</button><button onClick={()=>window.print()}>{c.print} ↗</button></div></div></div>
 </section>
 </main>
 <footer className="site-footer"><a href="#top">✳ JAPHET NYANGARESI</a><span>{c.footer}</span><span>© 2026 · {c.location}</span></footer>
 </div>
 <section className="print-resume" aria-label={c.printable}><h1>{c.name} / {c.roman}</h1><h2>{c.role}</h2><p>{c.statusNote}</p><p>{c.location} · {c.email} · {social.github}</p><p>{c.intro}</p><h2>{c.selected}</h2>{all.map(p=><article key={p.id}><h3>{p.name} — {p.headline}</h3><p>{p.role}</p><p>{p.summary}</p><p>{p.result}</p></article>)}<h2>{c.experience}</h2>{c.history.map(h=><article key={h.date}><h3>{h.company} · {h.role}</h3><p>{h.date}</p><p>{h.body}</p></article>)}<h2>{c.toolkit}</h2>{c.skillGroups.map(g=><p key={g[0]}>{g.join(': ')}</p>)}<h2>{c.education}</h2><p>{c.educationText}</p></section>
 <dialog ref={dialog} className="case-dialog" aria-labelledby="case-title" onCancel={()=>setSelected(null)} onClose={()=>setSelected(null)} onClick={event=>{if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)setSelected(null)}}}>
 {project&&<><div className="dialog-top"><span>{c.concept} / {project.year}</span><button autoFocus aria-label={c.close} onClick={()=>setSelected(null)}>×</button></div><div className="dialog-content"><p className="section-kicker">{project.name} / {project.number}</p><h2 id="case-title">{project.headline}</h2><p className="case-context">{project.context}</p><div className="case-status-row"><span className={'case-status '+(project.status==='building'?'is-building':'')}><i/>{project.status==='building'?c.buildingLabel:c.liveLabel}</span></div><div className="case-links">{project.links.live&&<a href={project.links.live} target="_blank" rel="noreferrer">{c.liveLabel} ↗</a>}{project.links.source&&<a href={project.links.source} target="_blank" rel="noreferrer">{c.sourceLabel} ↗</a>}</div><p className="case-role">{c.responsibility} — {project.role}</p>{project.shot&&<figure className="case-shot"><img src={project.shot} alt={project.name+' — '+c.shotCaption} loading="lazy"/><figcaption>{c.shotCaption}</figcaption></figure>}<div className="case-demo-heading"><span>{c.demoLabel}</span><p>{project.demoHint}</p></div><ProjectDemo key={project.id} id={project.id}/><div className="case-columns"><section><h3>{c.challenge}</h3><p>{project.problem}</p></section><section><h3>{c.approach}</h3><p>{project.decision}</p></section></div><section className="architecture"><h3>{c.architecture}</h3><ol>{project.architecture.map((step,i)=><li key={step}><span>0{i+1}</span>{step}</li>)}</ol></section><section className="case-result"><h3>{c.outcome}</h3><p>{project.result}</p><h3>{c.next}</h3><p>{project.next}</p></section><button className="text-action" onClick={()=>setSelected(null)}>{c.close} ↙</button></div></>}
 </dialog>
 <div className={'toast '+(notice?'is-visible':'')} role="status" aria-live="polite">{notice}</div>
 </>
}
