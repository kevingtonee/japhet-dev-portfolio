import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {it,expect} from 'vitest';
import {ProjectArt,ProjectDemo} from '../src/ProjectArt';

for(const id of ['ilana','remarket','vibemeet','studenthub']){
 it(id+' cover contains no nested interactive controls',()=>{
  const html=renderToStaticMarkup(createElement(ProjectArt,{id}));
  expect(html).not.toMatch(/<(button|input|textarea|a)\b/);
  expect(html).toContain('aria-hidden="true"');
 });
 it(id+' demo exposes real controls separately from the cover',()=>{
  const html=renderToStaticMarkup(createElement(ProjectDemo,{id}));
  expect(html).toMatch(/<(button|input|textarea)\b/);
  expect(html).toContain('project-demo');
 });
 it(id+' demo renders its sample-data toolbar',()=>{
  const html=renderToStaticMarkup(createElement(ProjectDemo,{id}));
  expect(html).toContain('mock-toolbar');
 });
}
