import {useRef,useState} from 'react';
import {copy} from './content';
export const FORMSPREE_URL='https://formspree.io/f/xgokqedp';
export function ContactForm() {
 const c=copy;
 const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
 const [message,setMessage]=useState('');
 const [errors,setErrors]=useState<{name?:string;email?:string;message?:string}>({});
 const formRef=useRef<HTMLFormElement>(null);
 function fieldError(name:'name'|'email'|'message',field:HTMLInputElement|HTMLTextAreaElement){
  if(!field.validity.valueMissing&&!field.validity.typeMismatch&&!field.validity.tooShort)return undefined;
  return name==='name'?c.formNameError:name==='email'?c.formEmailError:c.formMessageError;
 }
 function validateOne(name:'name'|'email'|'message'){
  const form=formRef.current;if(!form)return true;
  const field=form.elements.namedItem(name) as HTMLInputElement|HTMLTextAreaElement|null;
  if(!field)return true;
  const error=fieldError(name,field);
  setErrors(prev=>({...prev,[name]:error}));
  return !error;
 }
 async function onSubmit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  const form=formRef.current;if(!form)return;
  const names=['name','email','message'] as const;
  const next:typeof errors={};
  let ok=true;
  for(const name of names){
   const field=form.elements.namedItem(name) as HTMLInputElement|HTMLTextAreaElement|null;
   if(!field)continue;
   const error=fieldError(name,field);
   next[name]=error;if(error)ok=false;
  }
  setErrors(next);
  if(!ok){setStatus('error');setMessage(c.formFix);return}
  setStatus('sending');setMessage(c.formSending);
  try{
   const res=await fetch(FORMSPREE_URL,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
   if(res.ok){form.reset();setErrors({});setStatus('success');setMessage(c.formSuccess)}
   else{
    let detail='';
    try{const data=await res.json() as {errors?:{message?:string}[]};detail=data.errors?.[0]?.message||''}catch{detail=''}
    setStatus('error');setMessage(detail||c.formFailed);
   }
  }catch{
   setStatus('error');setMessage(c.formNetwork+c.email);
  }
 }
 const statusClass=status==='success'?'form-note is-success':status==='error'?'form-note is-error':'form-note';
 return <form ref={formRef} className="contact-form" action={FORMSPREE_URL} method="POST" noValidate onSubmit={onSubmit}>
  <h3>{c.formTitle}</h3>
  <div className={'form-field'+(errors.name?' has-error':'')}>
   <label htmlFor="contact-name">{c.formName}</label>
   <input id="contact-name" name="name" type="text" autoComplete="name" placeholder={c.formNamePlaceholder} required minLength={2} aria-invalid={!!errors.name} aria-describedby={errors.name?'contact-name-error':undefined} onBlur={()=>validateOne('name')} onInput={()=>{if(errors.name)validateOne('name')}}/>
   {errors.name&&<span id="contact-name-error" className="form-error" role="alert">{errors.name}</span>}
  </div>
  <div className={'form-field'+(errors.email?' has-error':'')}>
   <label htmlFor="contact-email-field">{c.formEmail}</label>
   <input id="contact-email-field" name="email" type="email" autoComplete="email" placeholder={c.formEmailPlaceholder} required aria-invalid={!!errors.email} aria-describedby={errors.email?'contact-email-error':undefined} onBlur={()=>validateOne('email')} onInput={()=>{if(errors.email)validateOne('email')}}/>
   {errors.email&&<span id="contact-email-error" className="form-error" role="alert">{errors.email}</span>}
  </div>
  <div className={'form-field'+(errors.message?' has-error':'')}>
   <label htmlFor="contact-message">{c.formMessage}</label>
   <textarea id="contact-message" name="message" placeholder={c.formMessagePlaceholder} required minLength={10} aria-invalid={!!errors.message} aria-describedby={errors.message?'contact-message-error':undefined} onBlur={()=>validateOne('message')} onInput={()=>{if(errors.message)validateOne('message')}}/>
   {errors.message&&<span id="contact-message-error" className="form-error" role="alert">{errors.message}</span>}
  </div>
  <button type="submit" className="primary-action form-submit" disabled={status==='sending'}>{status==='sending'?c.formSending:c.formSend}<span aria-hidden="true">↗</span></button>
  <p className={statusClass} role="status" aria-live="polite">{message}</p>
 </form>;
}