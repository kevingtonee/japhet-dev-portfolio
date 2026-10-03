import type {Locale} from './content';

/* Shared money formatting — Kenyan shillings, grouping like M-Pesa receipts. */
export function formatKES(n:number){return 'KES '+Math.round(n).toLocaleString('en-KE')}

/* ---------------- ILANA · storefront + M-Pesa STK Push ---------------- */
export interface IlanaProduct {id:string;name:Record<Locale,string>;line:Record<Locale,string>;price:number;swatch:string}
export const ilanaProducts:IlanaProduct[]=[
 {id:'atlas-chain',name:{cn:'Atlas 项链',en:'Atlas Chain'},line:{cn:'项链 · 金色调',en:'Necklace · Gold-tone'},price:4500,swatch:'#c9a35f'},
 {id:'mara-hoops',name:{cn:'Mara 耳环',en:'Mara Hoops'},line:{cn:'耳环 · 黄铜',en:'Earrings · Brass'},price:2800,swatch:'#b0894a'},
 {id:'savanna-cuff',name:{cn:'Savanna 手镯',en:'Savanna Cuff'},line:{cn:'手镯 · 再生黄铜',en:'Bracelet · Recycled brass'},price:3600,swatch:'#d4b07a'},
 {id:'rift-ring',name:{cn:'Rift 戒指',en:'Rift Ring'},line:{cn:'戒指 · 纯银',en:'Ring · Sterling silver'},price:3200,swatch:'#c8c8ce'},
];
export type Cart=Record<string,number>;
export function addToCart(cart:Cart,id:string):Cart{return{...cart,[id]:(cart[id]||0)+1}}
export function cartCount(cart:Cart){return Object.values(cart).reduce((sum,qty)=>sum+qty,0)}
export function cartTotal(cart:Cart){return ilanaProducts.reduce((sum,p)=>sum+(cart[p.id]||0)*p.price,0)}
/* STK Push state machine: idle → sending → prompted (phone) → confirmed. Terminal at confirmed. */
export type StkState='idle'|'sending'|'prompted'|'confirmed';
export function nextStk(state:StkState):StkState{
 if(state==='idle')return 'sending';
 if(state==='sending')return 'prompted';
 return 'confirmed';
}
export function orderCode(total:number){return 'IL-'+(1042+(total%488))}

/* ---------------- ReMarket · listings + offers ---------------- */
export interface Listing{id:string;title:Record<Locale,string>;price:number;condition:Record<Locale,string>;location:Record<Locale,string>;keywords:string;swatch:string}
export const remarketListings:Listing[]=[
 {id:'bike',title:{cn:'山地自行车',en:'Mountain bike'},price:18000,condition:{cn:'八成新',en:'Good'},location:{cn:'内罗毕 · CBD',en:'Nairobi · CBD'},keywords:'bike bicycle cycle mtb 自行车',swatch:'#4fb8a3'},
 {id:'laptop',title:{cn:'联想 ThinkPad T14',en:'Lenovo ThinkPad T14'},price:45000,condition:{cn:'几乎全新',en:'Like new'},location:{cn:'内罗毕 · Westlands',en:'Nairobi · Westlands'},keywords:'laptop thinkpad lenovo computer 笔记本 电脑',swatch:'#c99a3f'},
 {id:'sofa',title:{cn:'双人沙发',en:'Two-seater sofa'},price:12000,condition:{cn:'七成新',en:'Fair'},location:{cn:'内罗毕 · Kilimani',en:'Nairobi · Kilimani'},keywords:'sofa couch furniture 沙发 家具',swatch:'#8b8f9b'},
 {id:'camera',title:{cn:'佳能 EOS M50',en:'Canon EOS M50'},price:38000,condition:{cn:'九成新',en:'Very good'},location:{cn:'内罗毕 · Karen',en:'Nairobi · Karen'},keywords:'camera canon photography 相机 摄影',swatch:'#a06a8f'},
 {id:'textbooks',title:{cn:'工程教材（6 本）',en:'Engineering textbooks (6)'},price:3500,condition:{cn:'有笔记',en:'Annotated'},location:{cn:'校园内自取',en:'Campus pickup'},keywords:'books textbook engineering study 教材 书',swatch:'#5f7fae'},
 {id:'guitar',title:{cn:'木吉他',en:'Acoustic guitar'},price:9500,condition:{cn:'八成新',en:'Good'},location:{cn:'内罗毕 · Ngong Rd',en:'Nairobi · Ngong Rd'},keywords:'guitar music instrument 吉他 乐器',swatch:'#b8725c'},
];
export function searchListings(query:string){
 const tokens=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 if(!tokens.length)return remarketListings;
 return remarketListings.filter(item=>tokens.every(token=>(Object.values(item.title).join(' ')+' '+item.keywords).toLocaleLowerCase().includes(token)));
}
export function isValidOffer(n:number){return Number.isFinite(n)&&n>0}
export type OfferTone='accept'|'counter'|'decline';
export function counterPrice(price:number){return Math.round(price*0.92/50)*50}
/* The patient seller: >=85% of asking accepts, >=55% counters just under asking, below that declines. */
export function sellerReply(offer:number,price:number,locale:Locale):{tone:OfferTone;text:string}{
 const ratio=offer/price;
 if(ratio>=0.85)return{tone:'accept',text:locale==='cn'?`成交！${formatKES(offer)} 可以。什么时候方便自取？`:`Deal — ${formatKES(offer)} works for me. When can you pick it up?`};
 if(ratio>=0.55)return{tone:'counter',text:locale==='cn'?`接近了 —— ${formatKES(counterPrice(price))} 就卖，今天就可以交易。`:`Close — meet me at ${formatKES(counterPrice(price))} and it’s yours today.`};
 return{tone:'decline',text:locale==='cn'?`这个价格太低了，最低 ${formatKES(counterPrice(price))}。`:`That’s below my lowest — I can’t go under ${formatKES(counterPrice(price))}.`};
}

/* ---------------- VibeMeet · realtime chat ---------------- */
export interface VibeChannel{id:string;label:string;topic:Record<Locale,string>}
export const vibeChannels:VibeChannel[]=[
 {id:'general',label:'# general',topic:{cn:'大家都在这里',en:'Everyone hangs out here'}},
 {id:'dev-kenya',label:'# dev-kenya',topic:{cn:'内罗毕技术圈',en:'Nairobi tech scene'}},
 {id:'marketplace',label:'# marketplace',topic:{cn:'买卖与交换',en:'Buy, sell, trade'}},
];
export interface VibeMessage{from:string;initials:string;text:Record<Locale,string>;time:string;self?:boolean}
export const vibeThreads:Record<string,VibeMessage[]>={
 general:[
  {from:'Achieng O.',initials:'AO',text:{cn:'有人去过新开的屋顶影院吗？',en:'Has anyone tried the new rooftop cinema?'},time:'18:02'},
  {from:'Brian K.',initials:'BK',text:{cn:'去了，音响一般但氛围很好。',en:'Went last week — sound is okay, vibe is great.'},time:'18:05'},
  {from:'Wanjiru M.',initials:'WM',text:{cn:'周五组团？',en:'Group trip on Friday?'},time:'18:11'},
 ],
 'dev-kenya':[
  {from:'Otieno J.',initials:'OJ',text:{cn:'有人在生产环境接过 Daraja 吗？回调验签怎么做比较稳？',en:'Anyone running Daraja in production? How are you validating callbacks?'},time:'09:14'},
  {from:'You',initials:'JN',text:{cn:'我们在 ILANA 里用幂等回调 + 服务端状态机，效果不错。',en:'We did idempotent callbacks + a server-side state machine on ILANA — solid so far.'},time:'09:20',self:true},
  {from:'Achieng O.',initials:'AO',text:{cn:' sandbox 到生产的差异大吗？',en:'How rough is the sandbox-to-production jump?'},time:'09:23'},
 ],
 marketplace:[
  {from:'Brian K.',initials:'BK',text:{cn:'出一台几乎全新的显示器，24 寸。',en:'Selling a 24" monitor, like new.'},time:'12:40'},
  {from:'Wanjiru M.',initials:'WM',text:{cn:'价格多少？',en:'Price?'},time:'12:44'},
  {from:'Brian K.',initials:'BK',text:{cn:'14k，可小刀。',en:'14k, slightly negotiable.'},time:'12:47'},
 ],
};
export const vibeMembers=[
 {name:'Achieng O.',initials:'AO',online:true},
 {name:'Brian K.',initials:'BK',online:true},
 {name:'Wanjiru M.',initials:'WM',online:true},
 {name:'Otieno J.',initials:'OJ',online:false},
];
export const vibeReplies:Record<Locale,string[]>={
 cn:['哈哈哈真实','+1，同感','这个主意不错，私聊细节？','刚看到 —— 算我一个','有链接吗？发一个'],
 en:['Haha, so true','+1, same here','Good idea — DM me the details?','Just saw this — count me in','Got a link? Drop it here'],
};
export function pickReply(locale:Locale,seed:number){const pool=vibeReplies[locale];return pool[((seed%pool.length)+pool.length)%pool.length]}

/* ---------------- Student Hub · timetable + grades ---------------- */
export const hubDays=['mon','tue','wed','thu','fri'] as const;
export type HubDay=typeof hubDays[number];
export const hubDayLabels:Record<HubDay,Record<Locale,string>>={
 mon:{cn:'周一',en:'Mon'},tue:{cn:'周二',en:'Tue'},wed:{cn:'周三',en:'Wed'},thu:{cn:'周四',en:'Thu'},fri:{cn:'周五',en:'Fri'},
};
export interface HubClass{time:string;course:Record<Locale,string>;room:string}
export const hubSchedule:Record<HubDay,HubClass[]>={
 mon:[{time:'08:00',course:{cn:'数据结构',en:'Data Structures'},room:'LH 2'},{time:'11:00',course:{cn:'离散数学',en:'Discrete Maths'},room:'LH 5'},{time:'14:00',course:{cn:'Web 开发实验',en:'Web Dev Lab'},room:'CL 3'}],
 tue:[{time:'09:00',course:{cn:'数据库系统',en:'Database Systems'},room:'LH 1'},{time:'13:00',course:{cn:'操作系统',en:'Operating Systems'},room:'LH 4'}],
 wed:[{time:'08:00',course:{cn:'数据结构',en:'Data Structures'},room:'LH 2'},{time:'10:00',course:{cn:'计算机网络',en:'Networks'},room:'LH 6'},{time:'15:00',course:{cn:'机器学习导论',en:'Intro to ML'},room:'CL 1'}],
 thu:[{time:'09:00',course:{cn:'数据库系统',en:'Database Systems'},room:'LH 1'},{time:'14:00',course:{cn:'软件工程',en:'Software Engineering'},room:'LH 3'}],
 fri:[{time:'10:00',course:{cn:'机器学习实验',en:'ML Lab'},room:'CL 2'},{time:'13:00',course:{cn:'学习小组',en:'Study group'},room:'Library'}],
};
export interface HubCourse{code:string;name:Record<Locale,string>;grade:number;credits:number}
export const hubCourses:HubCourse[]=[
 {code:'CSC 201',name:{cn:'数据结构',en:'Data Structures'},grade:78,credits:4},
 {code:'CSC 210',name:{cn:'数据库系统',en:'Database Systems'},grade:84,credits:3},
 {code:'CSC 220',name:{cn:'操作系统',en:'Operating Systems'},grade:71,credits:4},
 {code:'MAT 204',name:{cn:'离散数学',en:'Discrete Maths'},grade:66,credits:3},
 {code:'CSC 230',name:{cn:'机器学习导论',en:'Intro to ML'},grade:81,credits:3},
];
export function averageGrade(courses:HubCourse[]){
 const credits=courses.reduce((sum,c)=>sum+c.credits,0);
 if(!credits)return 0;
 return Math.round(courses.reduce((sum,c)=>sum+c.grade*c.credits,0)/credits*10)/10;
}
export function gradeLetter(n:number){
 if(n>=70)return 'A';
 if(n>=60)return 'B';
 if(n>=50)return 'C';
 if(n>=40)return 'D';
 return 'E';
}
