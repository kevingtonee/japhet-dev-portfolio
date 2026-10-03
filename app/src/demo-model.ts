/* Shared money formatting — Kenyan shillings, grouping like M-Pesa receipts. */
export function formatKES(n:number){return 'KES '+Math.round(n).toLocaleString('en-KE')}

/* ---------------- ILANA · storefront + M-Pesa STK Push ---------------- */
export interface IlanaProduct {id:string;name:string;line:string;price:number;swatch:string}
export const ilanaProducts:IlanaProduct[]=[
 {id:'atlas-chain',name:'Atlas Chain',line:'Necklace · Gold-tone',price:4500,swatch:'#c9a35f'},
 {id:'mara-hoops',name:'Mara Hoops',line:'Earrings · Brass',price:2800,swatch:'#b0894a'},
 {id:'savanna-cuff',name:'Savanna Cuff',line:'Bracelet · Recycled brass',price:3600,swatch:'#d4b07a'},
 {id:'rift-ring',name:'Rift Ring',line:'Ring · Sterling silver',price:3200,swatch:'#c8c8ce'},
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
export interface Listing{id:string;title:string;price:number;condition:string;location:string;keywords:string;swatch:string}
export const remarketListings:Listing[]=[
 {id:'bike',title:'Mountain bike',price:18000,condition:'Good',location:'Nairobi · CBD',keywords:'bike bicycle cycle mtb',swatch:'#4fb8a3'},
 {id:'laptop',title:'Lenovo ThinkPad T14',price:45000,condition:'Like new',location:'Nairobi · Westlands',keywords:'laptop thinkpad lenovo computer',swatch:'#c99a3f'},
 {id:'sofa',title:'Two-seater sofa',price:12000,condition:'Fair',location:'Nairobi · Kilimani',keywords:'sofa couch furniture',swatch:'#8b8f9b'},
 {id:'camera',title:'Canon EOS M50',price:38000,condition:'Very good',location:'Nairobi · Karen',keywords:'camera canon photography',swatch:'#a06a8f'},
 {id:'textbooks',title:'Engineering textbooks (6)',price:3500,condition:'Annotated',location:'Campus pickup',keywords:'books textbook engineering study',swatch:'#5f7fae'},
 {id:'guitar',title:'Acoustic guitar',price:9500,condition:'Good',location:'Nairobi · Ngong Rd',keywords:'guitar music instrument',swatch:'#b8725c'},
];
export function searchListings(query:string){
 const tokens=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 if(!tokens.length)return remarketListings;
 return remarketListings.filter(item=>tokens.every(token=>(item.title+' '+item.keywords).toLocaleLowerCase().includes(token)));
}
export function isValidOffer(n:number){return Number.isFinite(n)&&n>0}
export type OfferTone='accept'|'counter'|'decline';
export function counterPrice(price:number){return Math.round(price*0.92/50)*50}
/* The patient seller: >=85% of asking accepts, >=55% counters just under asking, below that declines. */
export function sellerReply(offer:number,price:number):{tone:OfferTone;text:string}{
 const ratio=offer/price;
 if(ratio>=0.85)return{tone:'accept',text:`Deal — ${formatKES(offer)} works for me. When can you pick it up?`};
 if(ratio>=0.55)return{tone:'counter',text:`Close — meet me at ${formatKES(counterPrice(price))} and it’s yours today.`};
 return{tone:'decline',text:`That’s below my lowest — I can’t go under ${formatKES(counterPrice(price))}.`};
}
/* ---------------- VibeMeet · realtime chat ---------------- */
export interface VibeChannel{id:string;label:string;topic:string}
export const vibeChannels:VibeChannel[]=[
 {id:'general',label:'# general',topic:'Everyone hangs out here'},
 {id:'dev-kenya',label:'# dev-kenya',topic:'Nairobi tech scene'},
 {id:'marketplace',label:'# marketplace',topic:'Buy, sell, trade'},
];
export interface VibeMessage{from:string;initials:string;text:string;time:string;self?:boolean}
export const vibeThreads:Record<string,VibeMessage[]>={
 general:[
  {from:'Achieng O.',initials:'AO',text:'Has anyone tried the new rooftop cinema?',time:'18:02'},
  {from:'Brian K.',initials:'BK',text:'Went last week — sound is okay, vibe is great.',time:'18:05'},
  {from:'Wanjiru M.',initials:'WM',text:'Group trip on Friday?',time:'18:11'},
 ],
 'dev-kenya':[
  {from:'Otieno J.',initials:'OJ',text:'Anyone running Daraja in production? How are you validating callbacks?',time:'09:14'},
  {from:'You',initials:'JN',text:'We did idempotent callbacks + a server-side state machine on ILANA — solid so far.',time:'09:20',self:true},
  {from:'Achieng O.',initials:'AO',text:'How rough is the sandbox-to-production jump?',time:'09:23'},
 ],
 marketplace:[
  {from:'Brian K.',initials:'BK',text:'Selling a 24" monitor, like new.',time:'12:40'},
  {from:'Wanjiru M.',initials:'WM',text:'Price?',time:'12:44'},
  {from:'Brian K.',initials:'BK',text:'14k, slightly negotiable.',time:'12:47'},
 ],
};
export const vibeMembers=[
 {name:'Achieng O.',initials:'AO',online:true},
 {name:'Brian K.',initials:'BK',online:true},
 {name:'Wanjiru M.',initials:'WM',online:true},
 {name:'Otieno J.',initials:'OJ',online:false},
];
export const vibeReplies:string[]=['Haha, so true','+1, same here','Good idea — DM me the details?','Just saw this — count me in','Got a link? Drop it here'];
export function pickReply(seed:number){const pool=vibeReplies;return pool[((seed%pool.length)+pool.length)%pool.length]}

/* ---------------- Student Hub · timetable + grades ---------------- */
export const hubDays=['mon','tue','wed','thu','fri'] as const;
export type HubDay=typeof hubDays[number];
export const hubDayLabels:Record<HubDay,string>={
 mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',
};
export interface HubClass{time:string;course:string;room:string}
export const hubSchedule:Record<HubDay,HubClass[]>={
 mon:[{time:'08:00',course:'Data Structures',room:'LH 2'},{time:'11:00',course:'Discrete Maths',room:'LH 5'},{time:'14:00',course:'Web Dev Lab',room:'CL 3'}],
 tue:[{time:'09:00',course:'Database Systems',room:'LH 1'},{time:'13:00',course:'Operating Systems',room:'LH 4'}],
 wed:[{time:'08:00',course:'Data Structures',room:'LH 2'},{time:'10:00',course:'Networks',room:'LH 6'},{time:'15:00',course:'Intro to ML',room:'CL 1'}],
 thu:[{time:'09:00',course:'Database Systems',room:'LH 1'},{time:'14:00',course:'Software Engineering',room:'LH 3'}],
 fri:[{time:'10:00',course:'ML Lab',room:'CL 2'},{time:'13:00',course:'Study group',room:'Library'}],
};
export interface HubCourse{code:string;name:string;grade:number;credits:number}
export const hubCourses:HubCourse[]=[
 {code:'CSC 201',name:'Data Structures',grade:78,credits:4},
 {code:'CSC 210',name:'Database Systems',grade:84,credits:3},
 {code:'CSC 220',name:'Operating Systems',grade:71,credits:4},
 {code:'MAT 204',name:'Discrete Maths',grade:66,credits:3},
 {code:'CSC 230',name:'Intro to ML',grade:81,credits:3},
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