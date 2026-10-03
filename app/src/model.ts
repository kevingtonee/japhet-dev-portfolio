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
/* ---------------- Stack globe · unit-sphere math (pure, tested) ----------------
   The hero globe is a radius-1 sphere. Chips for each stack item sit on the
   surface via fibonacciLatLon so 8 items spread without clumping, then rotate
   with the globe angle each frame. */
export function globePoint(lat:number,lon:number):[number,number,number] {
 return [Math.cos(lat)*Math.cos(lon),Math.cos(lat)*Math.sin(lon),Math.sin(lat)];
}
export function rotateY(p:[number,number,number],a:number):[number,number,number] {
 const c=Math.cos(a),s=Math.sin(a);
 return [p[0]*c-p[1]*s,p[0]*s+p[1]*c,p[2]];
}
export function rotateX(p:[number,number,number],a:number):[number,number,number] {
 const c=Math.cos(a),s=Math.sin(a);
 return [p[0],p[1]*c-p[2]*s,p[1]*s+p[2]*c];
}
export function fibonacciLatLon(i:number,n:number):[number,number] {
 if(n<=1)return [0,0];
 const y=1-(i/(n-1))*2, r=Math.sqrt(Math.max(0,1-y*y)), th=i*2.399963229728653;
 return [Math.asin(Math.max(-1,Math.min(1,y))),Math.atan2(r*Math.sin(th),r*Math.cos(th))];
}
