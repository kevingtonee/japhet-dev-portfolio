import {describe,it,expect} from 'vitest';
import {copy,projects,social,type Category} from '../src/content';
import {buildResume,filterProjects,surfacePoint,globePoint,rotateY,rotateX,fibonacciLatLon} from '../src/model';
describe('portfolio data',()=>{
 it('has six distinct, complete cases',()=>{
  expect(new Set(projects.map(p=>p.id)).size).toBe(6);
  for(const project of projects){expect(project.architecture).toHaveLength(4);for(const [key,value] of Object.entries(project)){if(key==='shot')continue;expect(value).toBeTruthy()}}
 });
 const counts:Record<Category,number>={all:6,product:2,system:1,ai:2,experiment:1};
 for(const category of ['all','product','system','ai','experiment'] as Category[])it('filters '+category,()=>{
  const selected=filterProjects(projects,category);
  expect(selected).toHaveLength(counts[category]);
  if(category!=='all')expect(selected.every(p=>p.category===category)).toBe(true);
 });
 it('downloads a full resume with real contact details',()=>{
  const text=buildResume();expect(text).toContain(copy.statusNote);expect(text).toContain(copy.email);
  projects.forEach(p=>expect(text).toContain(p.name));
  copy.history.forEach(h=>expect(text).toContain(h.company));
  expect(text).toContain(copy.educationText);
 });
 it('contact email is the real address',()=>{expect(copy.email).toBe('japhetkevingtone@gmail.com')});
 it('social links are real https URLs',()=>{expect(social.github).toMatch(/^https:\/\/github\.com\//);expect(social.linkedin).toMatch(/^https:\/\//)});
});
describe('globe geometry',()=>{
 it('sphere points sit on the unit radius',()=>{for(let a=0;a<12;a++)for(let o=0;o<12;o++){const p=globePoint(a/12*Math.PI-Math.PI/2,o/12*Math.PI*2);const r=Math.hypot(p[0],p[1],p[2]);expect(r).toBeCloseTo(1,10)}});
 it('longitude wraps continuously',()=>{const first=globePoint(0.3,0),last=globePoint(0.3,Math.PI*2);first.forEach((v,i)=>expect(v).toBeCloseTo(last[i],10))});
 it('rotations preserve radius',()=>{const p:readonly number[]=globePoint(0.5,1.1);for(const a of [0,0.4,1.2,Math.PI]){for(const q of [rotateY(p as [number,number,number],a),rotateX(p as [number,number,number],a)]){expect(Math.hypot(q[0],q[1],q[2])).toBeCloseTo(1,10)}}});
 it('fibonacci chips spread without clumping',()=>{const n=8;const pts:Array<[number,number,number]>=[];
  for(let i=0;i<n;i++){const [lat,lon]=fibonacciLatLon(i,n);pts.push(globePoint(lat,lon))}
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const d=Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1],pts[i][2]-pts[j][2]);expect(d).toBeGreaterThan(0.7)}});
 it('legacy torus surface still wraps (deprecated)',()=>{for(const form of [0,1]){const first=surfacePoint(0,0,form),last=surfacePoint(Math.PI*2,Math.PI*2,form);first.forEach((v,i)=>expect(v).toBeCloseTo(last[i],8))}});
 it('both forms produce finite bounded geometry',()=>{for(const form of [0,1])for(let u=0;u<6.3;u+=.1)for(let v=0;v<6.3;v+=.3)for(const value of surfacePoint(u,v,form)){expect(Number.isFinite(value)).toBe(true);expect(Math.abs(value)).toBeLessThan(1.7)}});
 it('switching form changes the geometry',()=>{expect(surfacePoint(.7,.4,0)).not.toEqual(surfacePoint(.7,.4,1))});
});
