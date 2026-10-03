import {describe,it,expect} from 'vitest';
import {copy,projects,social,type Category} from '../src/content';
import {buildResume,filterProjects,surfacePoint} from '../src/model';
describe('portfolio data',()=>{
 it('has four distinct, complete cases',()=>{
  expect(new Set(projects.map(p=>p.id)).size).toBe(4);
  for(const project of projects){expect(project.architecture).toHaveLength(4);for(const [key,value] of Object.entries(project)){if(key==='shot')continue;expect(value).toBeTruthy()}}
 });
 const counts:Record<Category,number>={all:4,product:2,system:1,experiment:1};
 for(const category of ['all','product','system','experiment'] as Category[])it('filters '+category,()=>{
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
describe('sculpture geometry',()=>{
 it('surface wraps continuously',()=>{for(const form of [0,1]){const first=surfacePoint(0,0,form),last=surfacePoint(Math.PI*2,Math.PI*2,form);first.forEach((v,i)=>expect(v).toBeCloseTo(last[i],8))}});
 it('both forms produce finite bounded geometry',()=>{for(const form of [0,1])for(let u=0;u<6.3;u+=.1)for(let v=0;v<6.3;v+=.3)for(const value of surfacePoint(u,v,form)){expect(Number.isFinite(value)).toBe(true);expect(Math.abs(value)).toBeLessThan(1.7)}});
 it('switching form changes the geometry',()=>{expect(surfacePoint(.7,.4,0)).not.toEqual(surfacePoint(.7,.4,1))});
});
