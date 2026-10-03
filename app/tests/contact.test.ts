import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {FORMSPREE_URL,ContactForm} from '../src/ContactForm';
import {copy} from '../src/content';

describe('contact form',()=>{
 it('posts to the same Formspree endpoint as the legacy site',()=>{
  expect(FORMSPREE_URL).toBe('https://formspree.io/f/xgokqedp');
  const html=renderToStaticMarkup(createElement(ContactForm));
  expect(html).toContain('action="https://formspree.io/f/xgokqedp"');
  expect(html).toContain('name="name"');
  expect(html).toContain('name="email"');
  expect(html).toContain('name="message"');
  expect(html).toContain('aria-live="polite"');
 });
 it('renders the contact form labels',()=>{
  const html=renderToStaticMarkup(createElement(ContactForm));
  expect(html).toContain(copy.formTitle);
 });
});
