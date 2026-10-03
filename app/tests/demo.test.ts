import {describe,it,expect} from 'vitest';
import {addToCart,averageGrade,cartCount,cartTotal,counterPrice,formatKES,gradeLetter,hubCourses,hubDays,hubSchedule,ilanaProducts,isValidOffer,nextStk,orderCode,pickReply,remarketListings,searchListings,sellerReply,vibeChannels,vibeReplies,vibeThreads} from '../src/demo-model';
import {projects} from '../src/content';

describe('ILANA storefront model',()=>{
 it('adds items and computes count and total',()=>{
  let cart={};cart=addToCart(cart,'atlas-chain');cart=addToCart(cart,'atlas-chain');cart=addToCart(cart,'mara-hoops');
  expect(cartCount(cart)).toBe(3);
  expect(cartTotal(cart)).toBe(2*4500+2800);
 });
 it('formats Kenyan shillings with grouping',()=>{expect(formatKES(45000)).toBe('KES 45,000');expect(formatKES(0)).toBe('KES 0')});
 it('walks the STK Push state machine to a terminal confirmed state',()=>{
  expect(nextStk('idle')).toBe('sending');expect(nextStk('sending')).toBe('prompted');expect(nextStk('prompted')).toBe('confirmed');expect(nextStk('confirmed')).toBe('confirmed');
 });
 it('derives deterministic order codes',()=>{expect(orderCode(11800)).toBe(orderCode(11800));expect(orderCode(11800)).toMatch(/^IL-\d+$/)});
 it('every product has bilingual copy and a positive price',()=>{for(const p of ilanaProducts){expect(p.name.en&&p.name.cn).toBeTruthy();expect(p.price).toBeGreaterThan(0)}});
});
describe('ReMarket offers model',()=>{
 it('searches listings by keyword, alias and case',()=>{
  expect(searchListings(' BIKE ').map(l=>l.id)).toEqual(['bike']);
  expect(searchListings('thinkpad')[0].id).toBe('laptop');
  expect(searchListings('')).toEqual(remarketListings);
  expect(searchListings('nonexistent-xyz')).toEqual([]);
 });
 it('validates offers',()=>{expect(isValidOffer(500)).toBe(true);expect(isValidOffer(0)).toBe(false);expect(isValidOffer(NaN)).toBe(false)});
 it('accepts strong offers, counters mid offers, declines lowballs',()=>{
  expect(sellerReply(17000,18000,'en').tone).toBe('accept');
  expect(sellerReply(12000,18000,'en').tone).toBe('counter');
  expect(sellerReply(3000,18000,'en').tone).toBe('decline');
  expect(sellerReply(12000,18000,'cn').text).toContain(formatKES(counterPrice(18000)));
 });
 it('counters just under asking in clean steps',()=>{expect(counterPrice(18000)).toBeLessThan(18000);expect(counterPrice(18000)%50).toBe(0)});
});
describe('VibeMeet chat model',()=>{
 it('threads exist for every channel in both languages',()=>{
  for(const c of vibeChannels){expect(vibeThreads[c.id].length).toBeGreaterThan(0);for(const m of vibeThreads[c.id])expect(m.text.en&&m.text.cn).toBeTruthy()}
 });
 it('picks replies deterministically within bounds',()=>{
  expect(pickReply('en',0)).toBe(vibeReplies.en[0]);
  expect(pickReply('en',vibeReplies.en.length)).toBe(vibeReplies.en[0]);
  expect(pickReply('cn',-1)).toBe(vibeReplies.cn[vibeReplies.cn.length-1]);
 });
});
describe('Student Hub planner model',()=>{
 it('every weekday has classes',()=>{for(const d of hubDays)expect(hubSchedule[d].length).toBeGreaterThan(0)});
 it('computes a credit-weighted average',()=>{
  expect(averageGrade(hubCourses)).toBeCloseTo(75.8,1);
  expect(averageGrade([])).toBe(0);
 });
 it('maps grades to letters',()=>{expect(gradeLetter(78)).toBe('A');expect(gradeLetter(66)).toBe('B');expect(gradeLetter(52)).toBe('C');expect(gradeLetter(45)).toBe('D');expect(gradeLetter(20)).toBe('E')});
});
describe('project link integrity',()=>{
 it('every case carries https links and honest status in both languages',()=>{
  for(const cases of Object.values(projects))for(const item of cases){
   if(item.links.live)expect(item.links.live).toMatch(/^https:\/\//);
   if(item.links.source)expect(item.links.source).toMatch(/^https:\/\//);
   expect(['live','building']).toContain(item.status);
   expect(item.demoHint).toBeTruthy();expect(item.context).toBeTruthy();
   if(item.status==='building')expect(item.links.live).toBeUndefined();
  }
  expect(projects.cn.map(p=>p.links.live)).toEqual(projects.en.map(p=>p.links.live));
 });
 it('shipped client and marketplace cases include a real screenshot',()=>{
  for(const locale of ['cn','en'] as const){const shots=projects[locale].filter(p=>p.shot).map(p=>p.id);expect(shots).toEqual(['ilana','remarket'])}
 });
});
