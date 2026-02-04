import { Injectable } from '@angular/core';

export type ThemeOverrides = Record<string, string>; // { '--header-bg': '#123456', ... }

const STORAGE_KEY = 'theme_overrides_v1';
const KNOWN_VARS = [
  '--layout-bg','--surface','--text','--text-muted','--placeholder','--border','--border-soft',
  '--brand','--on-brand','--brand-2','--header-bg','--header-fg',
  '--table-head-bg','--table-head-fg','--table-sorter-bg','--accent',
  '--pagination-active-bg','--pagination-active-border',
  '--btn-primary-bg','--btn-primary-fg','--btn-primary-hover-bg',
  '--btn-mass-bg','--btn-mass-fg','--btn-mass-border','--btn-mass-hover-bg',
  '--icon-button-border','--icon-button-fg','--icon-button-hover-bg',
  '--breadcrumb-bg','--breadcrumb-fg','--breadcrumb-strong',
];

@Injectable({ providedIn: 'root' })
export class ThemeCustomService {
  private root = document.documentElement;
  private overrides: ThemeOverrides = {};

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { this.overrides = JSON.parse(saved); } catch {}
      this.applyAll();
    }
  }

  getAll() { return { ...this.overrides }; }

  /** Aplica un subset y persiste */
  apply(partial: Partial<ThemeOverrides>) {
    Object.entries(partial).forEach(([k,v]) => {
      if (!k.startsWith('--')) k = `--${k}`; // permite pasar 'header-bg'
      if (!KNOWN_VARS.includes(k)) KNOWN_VARS.push(k);
      this.overrides[k] = v!;
      this.root.style.setProperty(k, v!);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.overrides));
  }

  /** Restaura defaults de un conjunto de variables o todas */
  reset(keys?: string[]) {
    const list = keys?.length ? keys : Object.keys(this.overrides);
    list.forEach(k => {
      if (!k.startsWith('--')) k = `--${k}`;
      delete this.overrides[k];
      this.root.style.removeProperty(k);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.overrides));
  }

  private applyAll() {
    Object.entries(this.overrides).forEach(([k,v]) => this.root.style.setProperty(k, v));
  }
}
