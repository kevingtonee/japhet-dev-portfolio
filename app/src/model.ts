import {copy, projects, type Category, type Project} from './content';
export function filterProjects(items:Project[], category:Category) {
 return category === 'all' ? items : items.filter(item => item.category === category);
}
export function buildResume() {
 const c=copy;
 return [
  c.name+' / '+c.roman, c.role, c.statusNote, c.location, c.email, '',
  c.intro,'',c.selected,
  ...projects.map(p => p.name+' — '+p.headline+'\n'+p.role+'\n'+p.summary+'\n'+p.result),
  '',c.experience,c.experienceNote,
  ...c.history.map(h=>h.date+' | '+h.company+' | '+h.role+'\n'+h.body),
  '',c.toolkit,...c.skillGroups.map(g=>g.join(': ')), '',c.education,c.educationText,c.educationExtra
 ].join('\n\n');
}
export function surfacePoint(u:number,v:number,form:number):[number,number,number] {
 const tube=0.39 + (form===1 ? 0.11*Math.cos(3*u) : 0.075*Math.sin(3*u));
 const radius=0.95 + tube*Math.cos(v);
 return [radius*Math.cos(u),radius*Math.sin(u),tube*Math.sin(v)+(form===1 ? 0.18*Math.sin(2*u):0.07*Math.cos(3*u))];
}
