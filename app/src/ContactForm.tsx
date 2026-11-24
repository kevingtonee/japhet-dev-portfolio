import { useRef, useState } from 'react';
import { copy, site } from './content';

export const FORMSPREE_URL = site.formspree;

type FieldName = 'name' | 'email' | 'subject' | 'message';

export function ContactForm() {
  const c = copy;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  function fieldError(name: FieldName, field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    if (name === 'subject') {
      if (!field.value) return c.formSubjectError;
      return undefined;
    }
    if (!field.validity.valueMissing && !field.validity.typeMismatch && !field.validity.tooShort) return undefined;
    if (name === 'name') return c.formNameError;
    if (name === 'email') return c.formEmailError;
    return c.formMessageError;
  }

  function validateOne(name: FieldName) {
    const form = formRef.current;
    if (!form) return true;
    const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (!field) return true;
    const error = fieldError(name, field);
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const names: FieldName[] = ['name', 'email', 'subject', 'message'];
    const next: Partial<Record<FieldName, string>> = {};
    let ok = true;
    for (const name of names) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!field) continue;
      const error = fieldError(name, field);
      next[name] = error;
      if (error) ok = false;
    }
    setErrors(next);
    if (!ok) {
      setStatus('error');
      setMessage(c.formFix);
      return;
    }

    setStatus('sending');
    setMessage(c.formSending);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.reset();
        setErrors({});
        setStatus('success');
        setMessage(c.formSuccess);
      } else {
        let detail = '';
        try {
          const data = await res.json() as { errors?: { message?: string }[] };
          detail = data.errors?.[0]?.message || '';
        } catch {
          detail = '';
        }
        setStatus('error');
        setMessage(detail || c.formFailed);
      }
    } catch {
      setStatus('error');
      setMessage(c.formNetwork + site.email);
    }
  }

  const statusClass = status === 'success' ? 'form-note is-success' : status === 'error' ? 'form-note is-error' : 'form-note';

  return (
    <form ref={formRef} className="contact-form" action={FORMSPREE_URL} method="POST" noValidate onSubmit={onSubmit}>
      <h3>{c.formTitle}</h3>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="form-honeypot" />

      <div className={`form-field${errors.name ? ' has-error' : ''}`}>
        <label htmlFor="contact-name">{c.formName}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={c.formNamePlaceholder}
          required
          minLength={2}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          onBlur={() => validateOne('name')}
          onInput={() => { if (errors.name) validateOne('name'); }}
        />
        {errors.name && <span id="contact-name-error" className="form-error" role="alert">{errors.name}</span>}
      </div>

      <div className={`form-field${errors.email ? ' has-error' : ''}`}>
        <label htmlFor="contact-email-field">{c.formEmail}</label>
        <input
          id="contact-email-field"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={c.formEmailPlaceholder}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          onBlur={() => validateOne('email')}
          onInput={() => { if (errors.email) validateOne('email'); }}
        />
        {errors.email && <span id="contact-email-error" className="form-error" role="alert">{errors.email}</span>}
      </div>

      <div className={`form-field${errors.subject ? ' has-error' : ''}`}>
        <label htmlFor="contact-subject">{c.formSubject}</label>
        <select
          id="contact-subject"
          name="subject"
          required
          defaultValue=""
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          onBlur={() => validateOne('subject')}
          onChange={() => { if (errors.subject) validateOne('subject'); }}
        >
          <option value="" disabled>Select an inquiry type</option>
          {c.inquiryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {errors.subject && <span id="contact-subject-error" className="form-error" role="alert">{errors.subject}</span>}
      </div>

      <div className={`form-field${errors.message ? ' has-error' : ''}`}>
        <label htmlFor="contact-message">{c.formMessage}</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder={c.formMessagePlaceholder}
          required
          minLength={10}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          onBlur={() => validateOne('message')}
          onInput={() => { if (errors.message) validateOne('message'); }}
        />
        {errors.message && <span id="contact-message-error" className="form-error" role="alert">{errors.message}</span>}
      </div>

      <button type="submit" className="primary-action form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? c.formSending : c.formSend}<span aria-hidden="true"> ↗</span>
      </button>
      <p className={statusClass} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
