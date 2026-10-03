import {useState,type ReactNode} from 'react';
import {addToCart,cartCount,cartTotal,formatKES,hubCourses,hubDayLabels,hubDays,hubSchedule,ilanaProducts,isValidOffer,averageGrade,gradeLetter,nextStk,orderCode,pickReply,remarketListings,searchListings,sellerReply,vibeChannels,vibeMembers,vibeThreads,nuruAnswers,nuruFallback,nuruRespond,nuruSuggestions,gradeFeatureMeta,predictGrade,gradeMargin,type Cart,type GradeFeatures,type HubDay,type NuruAnswer,type StkState} from './demo-model';
import './project-art.css';

type DemoProps={interactive?:boolean};
function DemoControl({interactive,children,onClick,active,className='',label}:{interactive?:boolean;children:ReactNode;onClick?:()=>void;active?:boolean;className?:string;label?:string}) {
 return interactive?<button className={className} onClick={onClick} aria-pressed={active} aria-label={label}>{children}</button>:<div className={className} data-active={active}>{children}</div>;
}

/* ---------------- ILANA — storefront + M-Pesa STK Push ---------------- */
function Ilana({interactive=false}:DemoProps) {
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
  <div className="mock-toolbar"><b><span className="mock-symbol">◆</span> ILANA</b><span>Jewellery · Nairobi</span><small>BAG ({count})</small></div>
  <div className="il-body">
   <div className="il-products">{ilanaProducts.map(p=><div key={p.id} className="il-product">
    <div className="il-gem" style={{background:p.swatch}} aria-hidden="true"><span>◆</span></div>
    <b>{p.name}</b><small>{p.line}</small>
    <div className="il-buy"><span>{formatKES(p.price)}</span><DemoControl interactive={interactive} className="il-add" onClick={()=>setCart(addToCart(cart,p.id))} label="Add to bag">{(shownCart[p.id]||0)>0?'✓ '+shownCart[p.id]:'+ Add'}</DemoControl></div>
   </div>)}</div>
   <div className="il-cart">
    <small>YOUR BAG</small>
    {count===0?<p className="il-empty">Your bag is empty — pick a piece first.</p>:
     <ul>{ilanaProducts.filter(p=>shownCart[p.id]).map(p=><li key={p.id}><span>{p.name} × {shownCart[p.id]}</span><span>{formatKES(p.price*shownCart[p.id])}</span></li>)}</ul>}
    <div className="il-total"><span>Total</span><b>{formatKES(total)}</b></div>
    <DemoControl interactive={interactive&&count>0&&shownStk==='idle'} className={'il-pay '+(shownStk!=='idle'?'is-busy':'')} onClick={pay} label="Pay with M-Pesa">
     {shownStk==='idle'?'Pay with M-Pesa':shownStk==='sending'?'Sending STK push…':shownStk==='prompted'?'📱 Enter PIN on your phone':'✓ Payment confirmed'}
    </DemoControl>
    <div className={'il-status is-'+shownStk} role={interactive?'status':undefined}>
     {shownStk==='sending'&&'Contacting Safaricom Daraja…'}
     {shownStk==='prompted'&&'STK push sent to 07XX ··· 218'}
     {shownStk==='confirmed'&&`Order ${orderCode(total)} confirmed · receipt stored`}
     {shownStk==='idle'&&'Sandbox slice · no real charge'}
    </div>
   </div>
  </div>
 </div>;
}
/* ---------------- ReMarket — listings + offers ---------------- */
interface OfferMsg{who:'me'|'seller';text:string}
function Remarket({interactive=false}:DemoProps) {
 const [query,setQuery]=useState('');
 const [selectedId,setSelectedId]=useState(remarketListings[0].id);
 const [thread,setThread]=useState<OfferMsg[]>([]);
 const [draft,setDraft]=useState('');
 const items=interactive?searchListings(query):remarketListings;
 const selected=remarketListings.find(l=>l.id===selectedId)||items[0]||remarketListings[0];
 const shownThread:OfferMsg[]=interactive?thread:[
  {who:'me',text:'Offer: '+formatKES(16000)},
  {who:'seller',text:sellerReply(16000,18000).text},
 ];
 function send(){
  const offer=Number(draft.replace(/[^\d.]/g,''));
  if(!isValidOffer(offer))return;
  setThread([...thread,{who:'me',text:'Offer: '+formatKES(offer)}]);
  setDraft('');
  setTimeout(()=>setThread(current=>[...current,{who:'seller',text:sellerReply(offer,selected.price).text}]),900);
 }
 return <div className="rm-app">
  <div className="mock-toolbar"><b>Re<span className="mock-symbol">Market</span></b><span>Buy smart · Sell what you no longer need</span><small>SAMPLE DATA</small></div>
  <div className="rm-body">
   <div className="rm-list">
    <div className="rm-search">{interactive?<input value={query} aria-label="Search listings" placeholder="Search bike, camera, sofa…" onChange={e=>{setQuery(e.target.value);const first=searchListings(e.target.value)[0];if(first)setSelectedId(first.id)}}/>:<span>Search listings…</span>}</div>
    {items.length?items.map(l=><DemoControl key={l.id} interactive={interactive} active={selected.id===l.id} onClick={()=>{setSelectedId(l.id);setThread([])}} className={'rm-item '+(selected.id===l.id?'is-current':'')} label={l.title}>
      <i style={{background:l.swatch}} aria-hidden="true"/><span><b>{l.title}</b><small>{l.location} · {l.condition}</small></span><em>{formatKES(l.price)}</em>
     </DemoControl>):<div className="rm-empty">No matching listings<small>Try another keyword, or clear the search.</small></div>}
   </div>
   <div className="rm-detail">
    <div className="rm-detail-head"><i style={{background:selected.swatch}} aria-hidden="true"/><div><b>{selected.title}</b><small>{selected.location} · {selected.condition}</small></div><em>{formatKES(selected.price)}</em></div>
    <div className="rm-thread" role={interactive?'log':undefined}>
     {shownThread.map((m,i)=><p key={i} className={'rm-msg is-'+m.who}>{m.text}</p>)}
     {!shownThread.length&&<p className="rm-hint">Make an offer — the seller replies.</p>}
    </div>
    <div className="rm-offer">
     {interactive?<><input value={draft} inputMode="numeric" aria-label="Offer amount" placeholder="Your offer (KES)" onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}}/>
      <button onClick={send}>Send offer</button></>:<><span>Your offer (KES)</span><span className="rm-fake-btn">Send offer</span></>}
    </div>
   </div>
  </div>
 </div>;
}
/* ---------------- VibeMeet — realtime chat ---------------- */
function Vibemeet({interactive=false}:DemoProps) {
 const [channelId,setChannelId]=useState(vibeChannels[0].id);
 const [draft,setDraft]=useState('');
 const [threads,setThreads]=useState<Record<string,{from:string;initials:string;text:string;time:string;self?:boolean}[]>>(()=>{
  const init:Record<string,{from:string;initials:string;text:string;time:string;self?:boolean}[]>={};
  for(const ch of vibeChannels)init[ch.id]=vibeThreads[ch.id].map(m=>({...m}));
  return init;
 });
 const [typing,setTyping]=useState(false);
 const current=vibeChannels.find(c=>c.id===channelId)||vibeChannels[0];
 const messages=threads[current.id];
 function send(){
  const text=draft.trim();
  if(!text)return;
  setThreads(prev=>({...prev,[current.id]:[...prev[current.id],{from:'You',initials:'JN',text,time:'now',self:true}]}));
  setDraft('');
  setTyping(true);
  setTimeout(()=>{
   setTyping(false);
   setThreads(prev=>({...prev,[current.id]:[...prev[current.id],{from:'Achieng O.',initials:'AO',text:pickReply(Date.now()),time:'now'}]}));
  },1400);
 }
 return <div className="vm-app">
  <div className="mock-toolbar"><b>Vibe<span className="mock-symbol">Meet</span></b><span>Connect in realtime</span><small>SAMPLE DATA</small></div>
  <div className="vm-body">
   <div className="vm-rail">
    <div className="vm-brand">V</div>
    {vibeChannels.map(ch=><DemoControl key={ch.id} interactive={interactive} active={current.id===ch.id} onClick={()=>{setChannelId(ch.id);setDraft('')}} className={'vm-channel '+(current.id===ch.id?'is-current':'')} label={ch.label}>{ch.label}</DemoControl>)}
    <div className="vm-members">{vibeMembers.map(m=><div key={m.initials} className={'vm-member '+(m.online?'is-online':'')}><span className="vm-avatar">{m.initials}</span><span className="vm-dots"><b>.</b><b>.</b><b>.</b></span></div>)}</div>
   </div>
   <div className="vm-main">
    <div className="vm-head"><b>{current.label}</b><span>{current.topic}</span><i className="vm-live" aria-hidden="true">LIVE</i></div>
    <div className="vm-thread" role={interactive?'log':undefined}>
     {messages.map((m,i)=><div key={i} className={'vm-msg '+(m.self?'is-self':'')}><span className="vm-avatar">{m.initials}</span><div><small>{m.from} · {m.time}</small><p>{m.text}</p></div></div>)}
     {typing&&<div className="vm-typing"><span className="vm-avatar">AO</span><p>Achieng is typing<i className="vm-dots"><b>.</b><b>.</b><b>.</b></i></p></div>}
    </div>
    <div className="vm-composer">
     {interactive?<><input value={draft} aria-label={'Message '+current.label} placeholder={'Message '+current.label} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing)send()}}/><button onClick={send}>Send</button></>:<><span>Message…</span><span className="vm-fake-btn">Send</span></>}
    </div>
   </div>
  </div>
 </div>;
}
/* ---------------- Student Hub — timetable + grades ---------------- */
function Studenthub({interactive=false}:DemoProps) {
 const [day,setDay]=useState<HubDay>('mon');
 const shownDay=interactive?day:'wed';
 const avg=averageGrade(hubCourses);
 return <div className="sh-app">
  <div className="mock-toolbar"><b>student<span className="mock-symbol">hub</span></b><span>Week 6 · Semester 2</span><small>IN DEVELOPMENT</small></div>
  <div className="sh-body">
   <div className="sh-planner">
    <div className="sh-days">{hubDays.map(d=><DemoControl key={d} interactive={interactive} active={shownDay===d} onClick={()=>setDay(d)} className={'sh-day '+(shownDay===d?'is-current':'')} label={hubDayLabels[d]}>{hubDayLabels[d]}</DemoControl>)}</div>
    <div className="sh-classes">{hubSchedule[shownDay].map(c=><div key={c.time+c.room} className="sh-class"><span className="sh-time">{c.time}</span><b>{c.course}</b><small>{c.room}</small></div>)}</div>
    <p className="sh-note">✓ No clashes this week — the timetable is modelled as recurring blocks</p>
   </div>
   <div className="sh-grades">
    <div className="sh-avg"><small>WEIGHTED AVERAGE</small><b>{avg}</b><span className="sh-letter">{gradeLetter(avg)}</span></div>
    {hubCourses.map(c=><div key={c.code} className="sh-course"><div><b>{c.code}</b><span>{c.name}</span><em>{c.grade}%</em></div><div className="sh-bar"><i style={{width:c.grade+'%'}} data-letter={gradeLetter(c.grade)}/></div></div>)}
   </div>
  </div>
 </div>;
}

/* ---------------- Nuru AI · support copilot (scripted slice) ---------------- */
interface NuruTurn{q:string;a:NuruAnswer}
function Nuru({interactive=false}:DemoProps) {
 const [turns,setTurns]=useState<NuruTurn[]>([]);
 const [draft,setDraft]=useState('');
 const [thinking,setThinking]=useState(false);
 const shownTurns:NuruTurn[]=interactive?turns:[{q:nuruAnswers[1].question,a:nuruAnswers[1]}];
 function ask(text:string){
  const q=text.trim();
  if(!q||thinking)return;
  setDraft('');setThinking(true);
  setTimeout(()=>{setTurns(t=>[...t,{q,a:nuruRespond(q)}]);setThinking(false)},700);
 }
 return <div className="nu-app">
  <div className="mock-toolbar"><b>Nuru <span className="mock-symbol">AI</span></b><span>Support copilot · grounded in shop data</span><small>SCRIPTED · NO LIVE MODEL</small></div>
  <div className="nu-body">
   <div className="nu-thread" role={interactive?'log':undefined}>
    {shownTurns.map((t,i)=><div key={i} className="nu-turn">
     <p className="nu-q">{t.q}</p>
     <div className="nu-a"><p>{t.a.answer}</p>
      <div className="nu-sources">{t.a.sources.map(s=><span key={s}>▸ {s}</span>)}</div>
      {t.a.id===nuruFallback.id&&<span className="nu-handoff">→ Hands off to WhatsApp</span>}
     </div>
    </div>)}
    {!shownTurns.length&&<p className="nu-empty">Ask about materials, delivery, payment or returns.</p>}
    {thinking&&<p className="nu-thinking">Retrieving from catalogue<i className="vm-dots"><b>.</b><b>.</b><b>.</b></i></p>}
   </div>
   <div className="nu-suggest">{nuruSuggestions.map(s=>interactive?<button key={s} onClick={()=>ask(s)}>{s}</button>:<span key={s}>{s}</span>)}</div>
   <div className="nu-composer">
    {interactive?<><input value={draft} aria-label="Ask the copilot" placeholder="Ask a customer question…" onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing)ask(draft)}}/><button onClick={()=>ask(draft)}>Ask</button></>:<><span>Ask a customer question…</span><span className="nu-fake-btn">Ask</span></>}
   </div>
  </div>
 </div>;
}
/* ---------------- GradeCast · ML grade forecast ---------------- */
function Gradecast({interactive=false}:DemoProps) {
 const [features,setFeatures]=useState<GradeFeatures>({coursework:72,attendance:84,study:3});
 const shown=interactive?features:{coursework:72,attendance:84,study:3};
 const grade=predictGrade(shown),lever=gradeMargin(shown);
 const leverLabel=gradeFeatureMeta.find(m=>m.key===lever)?.label||'';
 return <div className="gc-app">
  <div className="mock-toolbar"><b>Grade<span className="mock-symbol">Cast</span></b><span>Linear model · runs in your browser</span><small>SYNTHETIC TRAINING DATA</small></div>
  <div className="gc-body">
   <div className="gc-controls">
    {gradeFeatureMeta.map(m=><div key={m.key} className="gc-field">
     <div className="gc-label"><b>{m.label}</b><small>{m.hint}</small></div>
     {interactive?<input type="range" min={m.min} max={m.max} step={m.key==='study'?0.5:1} value={shown[m.key]} aria-label={m.label} onChange={e=>setFeatures({...features,[m.key]:Number(e.target.value)})}/>:<div className="gc-fake-range"><i style={{width:(shown[m.key]/m.max*100)+'%'}}/></div>}
     <span className="gc-value">{shown[m.key]}{m.unit}</span>
    </div>)}
   </div>
   <div className="gc-result">
    <small>FORECAST · FINAL GRADE</small>
    <b>{grade}</b>
    <span className={'gc-letter gc-'+gradeLetter(grade)}>{gradeLetter(grade)}</span>
    <p>Biggest lever right now: <strong>{leverLabel.toLowerCase()}</strong></p>
   </div>
  </div>
 </div>;
}

const demos:Record<string,(props:DemoProps)=>ReactNode>={ilana:Ilana,remarket:Remarket,vibemeet:Vibemeet,studenthub:Studenthub,nuru:Nuru,gradecast:Gradecast};
const indexLabel:Record<string,string>={ilana:'01 / ADD TO CART · STK PUSH',remarket:'02 / SEARCH · OFFER · DEAL',vibemeet:'03 / REALTIME · PRESENCE',studenthub:'04 / TIMETABLE · GRADES',nuru:'05 / RAG · TOOL-USE · HANDOFF',gradecast:'06 / LINEAR MODEL · IN-BROWSER'};
const coverLabel:Record<string,string>={ilana:'E-COMMERCE · M-PESA',remarket:'MARKETPLACE · OFFERS',vibemeet:'SOCIAL · REALTIME',studenthub:'PLANNER · GRADES',nuru:'AI · SUPPORT COPILOT',gradecast:'ML · GRADE FORECAST'};
export function ProjectArt({id}:{id:string}) {
 const Cover=demos[id]||Studenthub;
 return <div className={'project-visual mock-cover mock-'+id} aria-hidden="true"><div className="mock-cover-label"><span>{id.toUpperCase()} / {coverLabel[id]||'CASE'}</span><span>DESIGNED & CODED</span></div><div className="mock-cover-app"><Cover/></div><span className="mock-cover-index">{indexLabel[id]||''}</span></div>;
}
export function ProjectDemo({id}:{id:string}) {
 const Demo=demos[id]||Studenthub;
 return <div className={'project-demo demo-'+id}><Demo interactive/></div>;
}