import { useEffect, useState } from 'react';
import { copy, expertiseAreas, projects, site, social, type Category } from './content';
import { filterProjects, buildResume, projectCount } from './model';
import { Sculpture } from './Sculpture';
import { ContactForm } from './ContactForm';
import { ProjectCarousel } from './components/ProjectCarousel';
import { CaseStudyDialog } from './components/CaseStudyDialog';
import { CommandPalette, type PaletteCommand } from './components/CommandPalette';
import { Reveal } from './components/Reveal';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '↘'}</span>;
}

function SocialIcon({ kind }: { kind: 'github' | 'linkedin' | 'whatsapp' }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, focusable: 'false' as const };
  if (kind === 'github') return <svg {...common}><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.36 1.08 2.94.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>;
  if (kind === 'linkedin') return <svg {...common}><path d="M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM5.6 9.9h2.68V18H5.6V9.9Zm4.36 0h2.56v1.1h.04c.36-.67 1.22-1.38 2.52-1.38 2.7 0 3.2 1.78 3.2 4.08V18h-2.68v-3.8c0-.9-.02-2.06-1.26-2.06-1.26 0-1.46.98-1.46 2v3.86H9.96V9.9Z"/></svg>;
  return <svg {...common}><path d="M20.52 3.48A11.8 11.8 0 0 0 12.03 0C5.5 0 .2 5.3.2 11.82c0 2.08.54 4.12 1.58 5.92L.1 24l6.42-1.64a11.8 11.8 0 0 0 5.5 1.37h.01c6.52 0 11.82-5.3 11.83-11.82 0-3.16-1.23-6.13-3.34-8.43ZM12.03 21.3h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.81.97 1.02-3.72-.24-.38a9.78 9.78 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.02 6.93 2.88a9.73 9.73 0 0 1 2.87 6.93c0 5.4-4.4 9.8-9.72 9.8Zm5.38-7.35c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.94 1.16-.17.19-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.48-1.76-1.65-2.06-.17-.29-.02-.45.13-.6.13-.13.3-.35.44-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.66-.51h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.74-.71 1.99-1.4.24-.68.24-1.27.17-1.39-.08-.12-.27-.2-.56-.34Z"/></svg>;
}

const categories: Category[] = ['all', 'web', 'ai', 'quant', 'cyber'];

export function App() {
  const [category, setCategory] = useState<Category>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const c = copy;
  const items = filterProjects(projects, category);
  const project = projects.find((p) => p.id === selected) || null;

  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.title = `${c.name} | ${site.shortRole}`;
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Explore the engineering work, AI experiments, software projects and developing research interests of Japhet Nyangaresi across software engineering, artificial intelligence and quantitative finance.',
    );
  }, [c.name]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const ids = ['top', 'about', 'projects', 'research', 'expertise', 'contact'];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.25, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function download() {
    try {
      const blob = new Blob(['\ufeff' + buildResume()], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'japhet-nyangaresi-resume.txt';
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(c.downloaded);
    } catch {
      setNotice(c.downloadFailed);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setNotice(c.copied);
    } catch {
      setNotice(c.copyFailed);
    }
  }

  const commands: PaletteCommand[] = [
    { id: 'home', label: 'Go to Home', hint: '00', keywords: 'top hero home', run: () => scrollTo('top') },
    { id: 'about', label: 'Go to About', hint: '01', keywords: 'about bio identity', run: () => scrollTo('about') },
    { id: 'projects', label: 'Go to Projects', hint: '02', keywords: 'work projects portfolio', run: () => scrollTo('projects') },
    { id: 'research', label: 'Go to Research', hint: '03', keywords: 'research notes journal quant ai security', run: () => scrollTo('research') },
    { id: 'expertise', label: 'Go to Expertise', hint: '04', keywords: 'skills expertise disciplines', run: () => scrollTo('expertise') },
    { id: 'contact', label: 'Go to Contact', hint: '05', keywords: 'contact email whatsapp message', run: () => scrollTo('contact') },
    ...projects.map((p) => ({
      id: 'case-' + p.id,
      label: 'Open case study: ' + p.name,
      hint: p.year,
      keywords: 'project ' + p.name + ' ' + p.tags.join(' '),
      run: () => {
        scrollTo('projects');
        setSelected(p.id);
      },
    })),
    { id: 'resume', label: 'Download resume', hint: '.txt', keywords: 'cv download text resume', run: download },
    { id: 'print', label: 'Print resume / Save PDF', hint: 'A4', keywords: 'cv print pdf save', run: () => window.print() },
    { id: 'github', label: 'Open GitHub', hint: '↗', keywords: 'code repositories source github', run: () => window.open(social.github, '_blank', 'noreferrer') },
    { id: 'linkedin', label: 'Open LinkedIn', hint: '↗', keywords: 'profile social network linkedin', run: () => window.open(social.linkedin, '_blank', 'noreferrer') },
    { id: 'whatsapp', label: 'Open WhatsApp', hint: '↗', keywords: 'whatsapp chat message phone', run: () => window.open(social.whatsapp, '_blank', 'noreferrer') },
    { id: 'email', label: 'Copy email address', hint: site.email, keywords: 'mail contact clipboard email', run: copyEmail },
  ];

  const navItems = [
    { id: 'top', label: c.nav[0] },
    { id: 'about', label: c.nav[1] },
    { id: 'projects', label: c.nav[2] },
    { id: 'research', label: c.nav[3] },
    { id: 'expertise', label: c.nav[4] },
    { id: 'contact', label: c.nav[5] },
  ];

  const emptyTitle = category === 'quant' ? c.quantEmptyTitle : category === 'cyber' ? c.cyberEmptyTitle : 'No projects yet';
  const emptyBody =
    category === 'quant' ? c.quantEmptyBody : category === 'cyber' ? c.cyberEmptyBody : c.emptyCategoryBody;

  return (
    <>
      <a className="skip-link" href="#projects">{c.skip}</a>
      <div className="screen-content">
        <header className="site-header">
          <a href="#top" className="wordmark" aria-label={`${c.name} ${c.resumeLabel}`}>
            <span className="logo-mark" aria-hidden="true">✳</span>
            <span>
              {c.roman}
              <small>{c.resumeLabel}</small>
            </span>
          </a>
          <nav aria-label="Main navigation">
            {navItems.map((item, i) => (
              <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? 'is-active' : ''} aria-current={activeSection === item.id ? 'true' : undefined}>
                {item.label}
                <span>{String(i).padStart(2, '0')}</span>
              </a>
            ))}
          </nav>
          <button className="palette-trigger" onClick={() => setPaletteOpen(true)} aria-label={`${c.paletteTitle} (Ctrl K)`}>
            <span>{c.paletteButton}</span>
            <kbd>Ctrl K</kbd>
          </button>
        </header>

        <main>
          <section className="hero section-shell" id="top" aria-labelledby="hero-title">
            <div className="hero-intro">
              <div className="availability"><span /> {c.available}</div>
              <p className="hero-role">{c.role}</p>
              <h1 id="hero-title" className="english-name">
                {c.name}
                <span className="name-stop">.</span>
              </h1>
              <p className="hero-statement">
                {c.heroTitle[0]}<br />{c.heroTitle[1]}<br /><span className="hero-statement-accent">{c.heroTitle[2]}</span>
              </p>
              <p className="hero-eyebrow">{c.heroIntro}</p>
              <p className="hero-description">{c.heroDescription}</p>
              <div className="hero-actions">
                <a className="primary-action" href="#projects">{c.viewWork}<Arrow /></a>
                <a className="text-action" href="#contact">{c.contactCta}<Arrow diagonal /></a>
              </div>
              <div className="hero-links" aria-label="Social links">
                <a className="social-link social-github" href={social.github} target="_blank" rel="noreferrer"><SocialIcon kind="github" /><span>GitHub</span><Arrow diagonal /></a>
                <a className="social-link social-linkedin" href={social.linkedin} target="_blank" rel="noreferrer"><SocialIcon kind="linkedin" /><span>LinkedIn</span><Arrow diagonal /></a>
                <a className="social-link social-whatsapp" href={social.whatsapp} target="_blank" rel="noreferrer"><SocialIcon kind="whatsapp" /><span>WhatsApp</span><Arrow diagonal /></a>
              </div>
              <p className="fiction-notice"><span aria-hidden="true">◌</span> {c.statusNote}</p>
            </div>
            <Sculpture />
            <div className="hero-baseline">
              <span>{c.location}</span>
              <span>{c.eyebrow}</span>
              <a href="#projects" aria-label={c.viewWork}>↓</a>
            </div>
          </section>

          <section className="about-section section-shell" id="about" aria-labelledby="about-title">
            <Reveal className="about-left">
              <img className="about-photo" src="/img/profile.jpg" alt="Portrait of Japhet Nyangaresi" width="118" height="118" loading="lazy" />
              <p className="section-kicker">01 / {c.aboutLabel}</p>
              <h2 id="about-title">{c.aboutTitle[0]}<br /><span>{c.aboutTitle[1]}</span></h2>
              <p className="about-body">{c.aboutBody}</p>
              <p className="about-body">{c.aboutBody2}</p>
              <div className="about-stamp" aria-hidden="true"><span>THINK</span><b>✳</b><span>BUILD</span><b>✳</b><span>LEARN</span></div>
            </Reveal>
            <div className="principles">
              {c.principles.map((p, i) => (
                <Reveal key={p[0]} delay={i * 90}>
                  <div className="principle-row">
                    <span>{p[0]}</span>
                    <div>
                      <h3>{p[1]}</h3>
                      <p>{p[2]}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="work-section section-shell" id="projects" aria-labelledby="projects-title">
            <Reveal>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">02 / PROJECTS</p>
                  <h2 id="projects-title">{c.selected}<span className="tiny-sup">{String(projects.length).padStart(2, '0')}</span></h2>
                </div>
                <p>{c.selectedSub}<br /><span>{c.projectHint}</span></p>
              </div>
            </Reveal>
            <Reveal>
              <div className="filter-row">
                <div role="group" aria-label="Project categories">
                  {categories.map((k) => (
                    <button key={k} onClick={() => setCategory(k)} aria-pressed={category === k}>
                      {c[k]}
                      <span>{String(projectCount(projects, k)).padStart(2, '0')}</span>
                    </button>
                  ))}
                </div>
                <span role="status" aria-live="polite">{items.length} {c.resultCount}</span>
              </div>
            </Reveal>
            {items.length > 0 ? (
              <ProjectCarousel items={items} onOpen={setSelected} />
            ) : (
              <Reveal>
                <div className="category-empty" role="status" aria-live="polite">
                  <p className="category-empty-kicker">{category === 'quant' ? 'QUANTITATIVE FINANCE' : 'CYBERSECURITY'}</p>
                  <h3>{emptyTitle}</h3>
                  <p>{emptyBody}</p>
                </div>
              </Reveal>
            )}
          </section>

          <section className="research-section section-shell" id="research" aria-labelledby="research-title">
            <Reveal>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">03 / {c.researchKicker.toUpperCase()}</p>
                  <h2 id="research-title">{c.researchTitle}</h2>
                </div>
                <p>{c.researchSub}</p>
              </div>
            </Reveal>
            <div className="research-grid">
              <Reveal>
                <article className="research-feature">
                  <p className="research-label">JOURNAL STATUS</p>
                  <h3>{c.researchEmptyTitle}</h3>
                  <p>{c.researchEmptyBody}</p>
                </article>
              </Reveal>
              <div className="research-topics">
                {c.researchTopics.map(([title, body], i) => (
                  <Reveal key={title} delay={i * 70}>
                    <article className="research-topic">
                      <span className="research-index">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h3>{title}</h3>
                        <p>{body}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="expertise-section section-shell" id="expertise" aria-labelledby="expertise-title">
            <Reveal>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">04 / {c.expertiseKicker.toUpperCase()}</p>
                  <h2 id="expertise-title">{c.expertiseTitle}</h2>
                </div>
                <p>{c.expertiseSub}</p>
              </div>
            </Reveal>
            <div className="expertise-grid">
              {expertiseAreas.map((area, i) => (
                <Reveal key={area.id} delay={i * 70}>
                  <article className="expertise-card">
                    <div className="expertise-head">
                      <span className="expertise-index">{String(i + 1).padStart(2, '0')}</span>
                      <h3>{area.title}</h3>
                    </div>
                    <p className="expertise-desc">{area.description}</p>
                    <ul className="expertise-list">
                      {area.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <div className="expertise-tech">
                      {area.technologies.map((tech) => <span key={tech}>{tech}</span>)}
                    </div>
                    {area.note && <p className="expertise-note">{area.note}</p>}
                    <button className="text-action expertise-link" onClick={() => { setCategory(area.id); scrollTo('projects'); }}>
                      View {c[area.id]} <Arrow diagonal />
                    </button>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="contact-section section-shell" id="contact" aria-labelledby="contact-title">
            <Reveal>
              <p className="section-kicker">05 / {c.contactKicker.toUpperCase()}</p>
              <div className="contact-layout">
                <div>
                  <h2 id="contact-title">{c.contactTitle[0]}<br /><span>{c.contactTitle[1]}</span></h2>
                  <p>{c.contactBody}</p>
                  <ContactForm />
                </div>
                <div className="contact-details">
                  <div className="contact-card">
                    <p className="contact-card-label">Email</p>
                    <a className="contact-email" href={`mailto:${site.email}`}>{site.email}</a>
                    <p className="contact-provisional">{site.emailNote}</p>
                    <button className="text-action" onClick={copyEmail}>{c.copyEmail} <span aria-hidden="true">↗</span></button>
                  </div>
                  <div className="contact-card">
                    <p className="contact-card-label">{c.whatsappLabel}</p>
                    <a className="contact-email" href={site.whatsappUrl} target="_blank" rel="noreferrer">{site.whatsappNumber}</a>
                    <p>{c.contactNote}</p>
                  </div>
                  <div className="contact-socials" aria-label="Social links">
                    <a className="social-link social-github" href={social.github} target="_blank" rel="noreferrer"><SocialIcon kind="github" /><span>GitHub</span><span className="contact-social-arrow" aria-hidden="true">↗</span></a>
                    <a className="social-link social-linkedin" href={social.linkedin} target="_blank" rel="noreferrer"><SocialIcon kind="linkedin" /><span>LinkedIn</span><span className="contact-social-arrow" aria-hidden="true">↗</span></a>
                    <a className="social-link social-whatsapp" href={social.whatsapp} target="_blank" rel="noreferrer"><SocialIcon kind="whatsapp" /><span>WhatsApp</span><span className="contact-social-arrow" aria-hidden="true">↗</span></a>
                  </div>
                  <div className="resume-actions">
                    <button onClick={download}>{c.download} ↓</button>
                    <button onClick={() => window.print()}>{c.print} ↗</button>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="site-footer">
          <a href="#top">✳ {c.roman}</a>
          <div className="system-status">
            <span className="status-title">{c.systemStatus}</span>
            <ul>{c.statusItems.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <span>{c.footer}</span>
          <span>© 2026 · {c.location}</span>
        </footer>
      </div>

      <section className="print-resume" aria-label="Resume summary">
        <h1>{c.name} / {c.roman}</h1>
        <h2>{c.role}</h2>
        <p>{site.location} · {site.email} · {site.github} · {site.linkedin}</p>
        <p>{c.heroIntro}</p>
        <p>{c.heroDescription}</p>
        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.id}>
            <h3>{p.name} — {p.headline}</h3>
            <p>{p.role}</p>
            <p>{p.summary}</p>
            <p>{p.result}</p>
          </article>
        ))}
        <h2>Expertise</h2>
        {expertiseAreas.map((area) => (
          <p key={area.id}><strong>{area.title}:</strong> {area.items.join(', ')}.</p>
        ))}
      </section>

      <CaseStudyDialog project={project} onClose={() => setSelected(null)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <div className={`toast ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">{notice}</div>
    </>
  );
}
