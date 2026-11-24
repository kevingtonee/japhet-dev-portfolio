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

const categories: Category[] = ['all', 'web', 'ai', 'quant', 'cyber'];

export function App() {
  const [category, setCategory] = useState<Category>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
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
              <a key={item.id} href={`#${item.id}`}>
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
              <div className="hero-links">
                <a href={social.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>
                <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a>
                <a href={social.whatsapp} target="_blank" rel="noreferrer">WhatsApp <Arrow diagonal /></a>
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
                  <div className="contact-socials">
                    <a href={social.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
                    <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
                    <a href={social.whatsapp} target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a>
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
