import { describe, it, expect } from 'vitest';
import { copy, projects, site, type Category } from '../src/content';
import { buildResume, filterProjects, projectCount, surfacePoint, globePoint, rotateY, rotateX, fibonacciLatLon } from '../src/model';

describe('portfolio data', () => {
  it('has six distinct, complete cases', () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(6);
    for (const project of projects) {
      expect(project.architecture).toHaveLength(4);
      expect(project.categories.length).toBeGreaterThan(0);
      expect(project.challenges).toBeTruthy();
      for (const [key, value] of Object.entries(project)) {
        if (key === 'shot' || key === 'links') continue;
        expect(value).toBeTruthy();
      }
    }
  });

  const counts: Record<Category, number> = { all: 6, web: 5, ai: 2, quant: 0, cyber: 0 };
  for (const category of ['all', 'web', 'ai', 'quant', 'cyber'] as Category[]) {
    it(`filters ${category}`, () => {
      const selected = filterProjects(projects, category);
      expect(selected).toHaveLength(counts[category]);
      expect(projectCount(projects, category)).toBe(counts[category]);
      if (category !== 'all') expect(selected.every((p) => p.categories.includes(category))).toBe(true);
    });
  }

  it('supports projects belonging to multiple categories', () => {
    const nuru = projects.find((p) => p.id === 'nuru');
    expect(nuru?.categories).toEqual(['ai', 'web']);
  });

  it('builds a resume with real contact details and projects', () => {
    const text = buildResume();
    expect(text).toContain(site.email);
    expect(text).toContain(site.github);
    expect(text).toContain(copy.role);
    projects.forEach((p) => expect(text).toContain(p.name));
  });

  it('contact email is the configured address', () => {
    expect(site.email).toBe('japhetkevingtone@gmail.com');
  });

  it('social links are real https URLs', () => {
    expect(site.github).toMatch(/^https:\/\/github\.com\//);
    expect(site.linkedin).toMatch(/^https:\/\//);
    expect(site.whatsappUrl).toBe('https://wa.me/254701616751');
  });

  it('has no student/degree identity claims in public copy', () => {
    const blob = JSON.stringify({ copy, projects, site });
    expect(blob).not.toMatch(/Software engineering degree|BSc Software Engineering|Student & builder|Completing a software engineering degree/i);
  });
});

describe('globe geometry', () => {
  it('sphere points sit on the unit radius', () => {
    for (let a = 0; a < 12; a++) for (let o = 0; o < 12; o++) {
      const p = globePoint((a / 12) * Math.PI - Math.PI / 2, (o / 12) * Math.PI * 2);
      const r = Math.hypot(p[0], p[1], p[2]);
      expect(r).toBeCloseTo(1, 10);
    }
  });
  it('longitude wraps continuously', () => {
    const first = globePoint(0.3, 0);
    const last = globePoint(0.3, Math.PI * 2);
    first.forEach((v, i) => expect(v).toBeCloseTo(last[i], 10));
  });
  it('rotations preserve radius', () => {
    const p: [number, number, number] = globePoint(0.5, 1.1);
    for (const a of [0, 0.4, 1.2, Math.PI]) {
      for (const q of [rotateY(p, a), rotateX(p, a)]) {
        expect(Math.hypot(q[0], q[1], q[2])).toBeCloseTo(1, 10);
      }
    }
  });
  it('fibonacci chips spread without clumping', () => {
    const n = 8;
    const pts: Array<[number, number, number]> = [];
    for (let i = 0; i < n; i++) {
      const [lat, lon] = fibonacciLatLon(i, n);
      pts.push(globePoint(lat, lon));
    }
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]);
      expect(d).toBeGreaterThan(0.7);
    }
  });
  it('legacy torus surface still wraps (deprecated)', () => {
    for (const form of [0, 1]) {
      const first = surfacePoint(0, 0, form);
      const last = surfacePoint(Math.PI * 2, Math.PI * 2, form);
      first.forEach((v, i) => expect(v).toBeCloseTo(last[i], 8));
    }
  });
  it('both forms produce finite bounded geometry', () => {
    for (const form of [0, 1]) for (let u = 0; u < 6.3; u += 0.1) for (let v = 0; v < 6.3; v += 0.3) for (const value of surfacePoint(u, v, form)) {
      expect(Number.isFinite(value)).toBe(true);
      expect(Math.abs(value)).toBeLessThan(1.7);
    }
  });
  it('switching form changes the geometry', () => {
    expect(surfacePoint(0.7, 0.4, 0)).not.toEqual(surfacePoint(0.7, 0.4, 1));
  });
});
