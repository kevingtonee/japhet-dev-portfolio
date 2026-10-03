import {useState,type ReactNode} from 'react';
import type {Locale} from './content';
import {addToCart,cartCount,cartTotal,formatKES,hubCourses,hubDayLabels,hubDays,hubSchedule,ilanaProducts,isValidOffer,averageGrade,gradeLetter,nextStk,orderCode,pickReply,remarketListings,searchListings,sellerReply,vibeChannels,vibeMembers,vibeThreads,type Cart,type HubDay,type StkState} from './demo-model';
import './project-art.css';

type DemoProps={interactive?:boolean;locale?:Locale};
function DemoControl({interactive,children,onClick,active,className='',label}:{interactive?:boolean;children:ReactNode;onClick?:()=>void;active?:boolean;className?:string;label?:string}) {
 return interactive?<button className={className} onClick={onClick} aria-pressed={active} aria-label={label}>{children}</button>:<div className={className} data-active={active}>{children}</div>;
}

/* ---------------- ILANA — storefront + M-Pesa STK Push ---------------- */
function Ilana({interactive=false,locale='en'}:DemoProps) {
 const cn=locale==='cn';
 const [cart,setCart]=useState<Cart>({});
 const [stk,setStk]=useState<StkState>('idle');
 const shownCart=interactive?cart:{'atlas-chain':1,'mara-hoops':1};
 const shownStk:StkState=interactive?stk:'prompted';
 const total=cartTotal(shownCart),count=cartCount(shownCart);
 function pay(){
  setStk(nextStk('idle'));
  setTimeout(()=>setStk(nextStk('sending')),1100);
  setTimeout(()=>setStk(nextStk('prompted')),2600);
 }
 return <div className="il-shop">
  <div className="mock-toolbar"><b><span className="mock-symbol">◆</span> ILANA</b><span>{cn?'珠宝 · 内罗毕':'Jewellery · Nairobi'}</span><small>{cn?'购物袋':'BAG'} ({count})</small></div>
  <div className="il-body">
   <div className="il-products">{ilanaProducts.map(p=><div key={p.id} className="il-product">
    <div className="il-gem" style={{background:p.swatch}} aria-hidden="true"><span>◆</span></div>
    <b>{p.name[locale]}</b><small>{p.line[locale]}</small>
    <div className="il-buy"><span>{formatKES(p.price)}</span><DemoControl interactive={interactive} className="il-add" onClick={()=>setCart(addToCart(cart,p.id))} label={cn?'加入购物袋':'Add to bag'}>{(shownCart[p.id]||0)>0?'✓ '+shownCart[p.id]:'+ '+ (cn?'加入':'Add')}</DemoControl></div>
   </div>)}</div>
   <div className="il-cart">
    <small>{cn?'购物袋':'YOUR BAG'}</small>
    {count===0?<p className="il-empty">{cn?'购物袋是空的 —— 先挑一件首饰。':'Your bag is empty — pick a piece first.'}</p>:
     <ul>{ilanaProducts.filter(p=>shownCart[p.id]).map(p=><li key={p.id}><span>{p.name[locale]} × {shownCart[p.id]}</span><span>{formatKES(p.price*shownCart[p.id])}</span></li>)}</ul>}
    <div className="il-total"><span>{cn?'合计':'Total'}</span><b>{formatKES(total)}</b></div>
    <DemoControl interactive={interactive&&count>0&&shownStk==='idle'} className={'il-pay '+(shownStk!=='idle'?'is-busy':'')} onClick={pay} label={cn?'使用 M-Pesa 支付':'Pay with M-Pesa'}>
     {shownStk==='idle'?(cn?'用 M-Pesa 支付':'Pay with M-Pesa'):shownStk==='sending'?(cn?'正在发送 STK Push…':'Sending STK push…'):shownStk==='prompted'?(cn?'📱 请在手机上输入 PIN':'📱 Enter PIN on your phone'):(cn?'✓ 支付成功':'✓ Payment confirmed')}
    </DemoControl>
    <div className={'il-status is-'+shownStk} role={interactive?'status':undefined}>
     {shownStk==='sending'&&(cn?'正在连接 Safaricom Daraja…':'Contacting Safaricom Daraja…')}
     {shownStk==='prompted'&&(cn?'STK Push 已发送至 07XX ··· 218':'STK push sent to 07XX ··· 218')}
     {shownStk==='confirmed'&&(cn?`订单 ${orderCode(total)} 已确认 · 回执已存档`:`Order ${orderCode(total)} confirmed · receipt stored`)}
     {shownStk==='idle'&&(cn?'沙箱演示 · 不会真实扣款':'Sandbox slice · no real charge')}
    </div>
   </div>
  </div>
 </div>;
}

/* ---------------- ReMarket — listings + offers ---------------- */
interface OfferMsg{who:'me'|'seller';text:string}
function Remarket({interactive=false,locale='en'}:DemoProps) {
 const cn=locale==='cn';
 const [query,setQuery]=useState('');
 const [selectedId,setSelectedId]=useState(remarketListings[0].id);
 const [thread,setThread]=useState<OfferMsg[]>([]);
 const [draft,setDraft]=useState('');
 const items=interactive?searchListings(query):remarketListings;
 const selected=remarketListings.find(l=>l.id===selectedId)||items[0]||remarketListings[0];
 const shownThread:OfferMsg[]=interactive?thread:[
  {who:'me',text:cn?'出价 '+formatKES(16000):'Offer: '+formatKES(16000)},
  {who:'seller',text:sellerReply(16000,selected.price==null?18000:18000,locale).text},
 ];
 function send(){
  const offer=Number(draft.replace(/[^\d.]/g,''));
  if(!isValidOffer(offer))return;
  setThread([...thread,{who:'me',text:(cn?'出价 ':'Offer: ')+formatKES(offer)}]);
  setDraft('');
  setTimeout(()=>setThread(current=>[...current,{who:'seller',text:sellerReply(offer,selected.price,locale).text}]),900);
 }
 return <div className="rm-app">
  <div className="mock-toolbar"><b>Re<span className="mock-symbol">Market</span></b><span>{cn?'买得聪明 · 卖掉闲置':'Buy smart · Sell what you no longer need'}</span><small>{cn?'示例数据':'SAMPLE DATA'}</small></div>
  <div className="rm-body">
   <div className="rm-list">
    <div className="rm-search">{interactive?<input value={query} aria-label={cn?'搜索商品':'Search listings'} placeholder={cn?'搜索 bike、camera、沙发…':'Search bike, camera, sofa…'} onChange={e=>{setQuery(e.target.value);const first=searchListings(e.target.value)[0];if(first)setSelectedId(first.id)}}/>:<span>{cn?'搜索商品…':'Search listings…'}</span>}</div>
    {items.length?items.map(l=><DemoControl key={l.id} interactive={interactive} active={selected.id===l.id} onClick={()=>{setSelectedId(l.id);setThread([])}} className={'rm-item '+(selected.id===l.id?'is-current':'')} label={l.title[locale]}>
      <i style={{background:l.swatch}} aria-hidden="true"/><span><b>{l.title[locale]}</b><small>{l.location[locale]} · {l.condition[locale]}</small></span><em>{formatKES(l.price)}</em>
     </DemoControl>):<div className="rm-empty">{cn?'没有匹配的商品':'No matching listings'}<small>{cn?'换个关键词，或清空搜索。':'Try another keyword, or clear the search.'}</small></div>}
   </div>
   <div className="rm-detail">
    <div className="rm-detail-head"><i style={{background:selected.swatch}} aria-hidden="true"/><div><b>{selected.title[locale]}</b><small>{selected.location[locale]} · {selected.condition[locale]}</small></div><em>{formatKES(selected.price)}</em></div>
    <div className="rm-thread" role={interactive?'log':undefined}>
     {shownThread.map((m,i)=><p key={i} className={'rm-msg is-'+m.who}>{m.text}</p>)}
     {!shownThread.length&&<p className="rm-hint">{cn?'出一个价，卖家会回复。':'Make an offer — the seller replies.'}</p>}
    </div>
    <div className="rm-offer">
     {interactive?<><input value={draft} inputMode="numeric" aria-label={cn?'出价金额':'Offer amount'} placeholder={cn?'你的出价（KES）':'Your offer (KES)'} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}}/>
      <button onClick={send}>{cn?'发送出价':'Send offer'}</button></>:<><span>{cn?'你的出价（KES）':'Your offer (KES)'}</span><span className="rm-fake-btn">{cn?'发送出价':'Send offer'}</span></>}
    </div>
   </div>
  </div>
 </div>;
}

/* ---------------- VibeMeet — realtime chat ---------------- */
interface ChatMsg{from:string;initials:string;text:string;time:string;self?:boolean}
function Vibemeet({interactive=false,locale='en'}:DemoProps) {
 const cn=locale==='cn';
 const [channel,setChannel]=useState(vibeChannels[0].id);
 const [extra,setExtra]=useState<Record<string,ChatMsg[]>>({});
 const [draft,setDraft]=useState('');
 const [typing,setTyping]=useState(false);
 const base:ChatMsg[]=vibeThreads[channel].map(m=>({from:m.from,initials:m.initials,text:m.text[locale],time:m.time,self:m.self}));
 const messages=[...base,...(extra[channel]||[])];
 const current=vibeChannels.find(c=>c.id===channel)||vibeChannels[0];
 function send(){
  const text=draft.trim();if(!text)return;
  const mine:ChatMsg={from:'You',initials:'JN',text,time:cn?'刚刚':'now',self:true};
  setExtra(e=>({...e,[channel]:[...(e[channel]||[]),mine]}));setDraft('');setTyping(true);
  const seed=(extra[channel]||[]).length+channel.length;
  setTimeout(()=>{setTyping(false);setExtra(e=>({...e,[channel]:[...(e[channel]||[]),{from:'Achieng O.',initials:'AO',text:pickReply(locale,seed),time:cn?'刚刚':'now'}]}))},1400);
 }
 return <div className="vm-app">
  <div className="vm-rail">
   <b className="vm-brand">vibe<span>meet</span></b>
   <small>{cn?'频道':'CHANNELS'}</small>
   {vibeChannels.map(c=><DemoControl key={c.id} interactive={interactive} active={current.id===c.id} onClick={()=>{setChannel(c.id);setTyping(false)}} className={'vm-channel '+(current.id===c.id?'is-current':'')} label={c.label}>{c.label}</DemoControl>)}
   <small>{cn?'在线':'ONLINE'}</small>
   {vibeMembers.map(m=><div key={m.name} className="vm-member"><i className={m.online?'is-online':''} aria-hidden="true"/><span>{m.name}</span></div>)}
  </div>
  <div className="vm-main">
   <div className="vm-head"><b>{current.label}</b><span>{current.topic[locale]}</span><i className="vm-live" aria-hidden="true">{cn?'实时':'LIVE'}</i></div>
   <div className="vm-thread" role={interactive?'log':undefined}>
    {messages.map((m,i)=><div key={i} className={'vm-msg '+(m.self?'is-self':'')}><span className="vm-avatar">{m.initials}</span><div><small>{m.from} · {m.time}</small><p>{m.text}</p></div></div>)}
    {typing&&<div className="vm-typing"><span className="vm-avatar">AO</span><p>{cn?'Achieng 正在输入':'Achieng is typing'}<i className="vm-dots"><b>.</b><b>.</b><b>.</b></i></p></div>}
   </div>
   <div className="vm-composer">
    {interactive?<><input value={draft} aria-label={cn?'发送消息到 '+current.label:'Message '+current.label} placeholder={cn?'发消息到 '+current.label:'Message '+current.label} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing)send()}}/><button onClick={send}>{cn?'发送':'Send'}</button></>:<><span>{cn?'发消息…':'Message…'}</span><span className="vm-fake-btn">{cn?'发送':'Send'}</span></>}
   </div>
  </div>
 </div>;
}

/* ---------------- Student Hub — timetable + grades ---------------- */
function Studenthub({interactive=false,locale='en'}:DemoProps) {
 const cn=locale==='cn';
 const [day,setDay]=useState<HubDay>('mon');
 const shownDay=interactive?day:'wed';
 const avg=averageGrade(hubCourses);
 return <div className="sh-app">
  <div className="mock-toolbar"><b>student<span className="mock-symbol">hub</span></b><span>{cn?'第 6 周 · 第 2 学期':'Week 6 · Semester 2'}</span><small>{cn?'开发中':'IN DEVELOPMENT'}</small></div>
  <div className="sh-body">
   <div className="sh-planner">
    <div className="sh-days">{hubDays.map(d=><DemoControl key={d} interactive={interactive} active={shownDay===d} onClick={()=>setDay(d)} className={'sh-day '+(shownDay===d?'is-current':'')} label={hubDayLabels[d][locale]}>{hubDayLabels[d][locale]}</DemoControl>)}</div>
    <div className="sh-classes">{hubSchedule[shownDay].map(c=><div key={c.time+c.room} className="sh-class"><span className="sh-time">{c.time}</span><b>{c.course[locale]}</b><small>{c.room}</small></div>)}</div>
    <p className="sh-note">{cn?'✓ 本周无撞课 —— 课表按可重复课块建模':'✓ No clashes this week — the timetable is modelled as recurring blocks'}</p>
   </div>
   <div className="sh-grades">
    <div className="sh-avg"><small>{cn?'加权平均':'WEIGHTED AVERAGE'}</small><b>{avg}</b><span className="sh-letter">{gradeLetter(avg)}</span></div>
    {hubCourses.map(c=><div key={c.code} className="sh-course"><div><b>{c.code}</b><span>{c.name[locale]}</span><em>{c.grade}%</em></div><div className="sh-bar"><i style={{width:c.grade+'%'}} data-letter={gradeLetter(c.grade)}/></div></div>)}
   </div>
  </div>
 </div>;
}

const indexLabel:Record<string,string>={ilana:'01 / ADD TO CART · STK PUSH',remarket:'02 / SEARCH · OFFER · DEAL',vibemeet:'03 / REALTIME · PRESENCE',studenthub:'04 / TIMETABLE · GRADES'};
const coverLabel:Record<string,string>={ilana:'E-COMMERCE · M-PESA',remarket:'MARKETPLACE · OFFERS',vibemeet:'SOCIAL · REALTIME',studenthub:'PLANNER · GRADES'};
export function ProjectArt({id}:{id:string}) {
 return <div className={'project-visual mock-cover mock-'+id} aria-hidden="true"><div className="mock-cover-label"><span>{id.toUpperCase()} / {coverLabel[id]||'CASE'}</span><span>DESIGNED & CODED</span></div><div className="mock-cover-app">{id==='ilana'?<Ilana/>:id==='remarket'?<Remarket/>:id==='vibemeet'?<Vibemeet/>:<Studenthub/>}</div><span className="mock-cover-index">{indexLabel[id]||''}</span></div>;
}
export function ProjectDemo({id,locale}:{id:string;locale:Locale}) {
 return <div className={'project-demo demo-'+id}>{id==='ilana'?<Ilana interactive locale={locale}/>:id==='remarket'?<Remarket interactive locale={locale}/>:id==='vibemeet'?<Vibemeet interactive locale={locale}/>:<Studenthub interactive locale={locale}/>}</div>;
}
