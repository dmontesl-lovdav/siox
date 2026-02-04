// src/app/modules/administracion-temas/administracion-temas.component.ts
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { ThemeCustomService } from '../../services/theme-custom.service';

type VarItem = { name: string; label: string; type?: 'color' | 'text' };
type VarGroup = { title: string; vars: VarItem[] };
type VarGroupWithState = VarGroup & { _collapsed?: boolean };

@Component({
  selector: 'app-administracion-temas',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule], // 👈 necesario para <i nz-icon>
  templateUrl: './administracion-temas.component.html',
  styleUrls: ['./administracion-temas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministracionTemasComponent implements OnInit {
  // Grupos plegables
groups: VarGroupWithState[] = [
  {
    title: 'Header (barra verde)',
    vars: [
      { name: '--header-bg', label: 'Header: fondo (barra verde)' },
      { name: '--header-fg', label: 'Header: texto / iconos' },
      { name: '--brand',    label: 'Header: marca primaria (verde)' },
      { name: '--brand-2',  label: 'Header: acento dorado' },
    ],
  },
  {
    title: 'Breadcrumb',
    vars: [
      { name: '--breadcrumb-bg',     label: 'Breadcrumb: fondo' },
      { name: '--breadcrumb-fg',     label: 'Breadcrumb: texto' },
      { name: '--breadcrumb-strong', label: 'Breadcrumb: resaltado' },
    ],
  },
  {
    title: 'Global (contenido y bordes)',
    vars: [
      { name: '--layout-bg',   label: 'App: fondo general' },
      { name: '--surface',     label: 'Superficies / tarjetas' },
      { name: '--text',        label: 'Texto principal' },
      { name: '--text-muted',  label: 'Texto atenuado' },
      { name: '--border',      label: 'Borde' },
      { name: '--border-soft', label: 'Borde suave' },
    ],
  },
  {
    title: 'Tabla (Ant Design)',
    vars: [
      { name: '--table-head-bg',  label: 'Tabla: encabezado (fondo)' },
      { name: '--table-head-fg',  label: 'Tabla: encabezado (texto)' },
      { name: '--table-sorter-bg',label: 'Tabla: celda ordenada (fondo)' },
      { name: '--accent',         label: 'Tabla: flechas de orden (acento)' },
    ],
  },
  {
    title: 'Paginación',
    vars: [
      { name: '--pagination-active-bg',     label: 'Paginación: página activa (fondo)' },
      { name: '--pagination-active-border', label: 'Paginación: página activa (borde)' },
    ],
  },
  {
    title: 'Botón primario',
    vars: [
      { name: '--btn-primary-bg',       label: 'Botón primario: fondo' },
      { name: '--btn-primary-fg',       label: 'Botón primario: texto' },
      { name: '--btn-primary-hover-bg', label: 'Botón primario: hover' },
    ],
  },
  {
    title: 'Botón “Carga masiva”',
    vars: [
      { name: '--btn-mass-bg',     label: 'Carga masiva: fondo' },
      { name: '--btn-mass-fg',     label: 'Carga masiva: texto' },
      { name: '--btn-mass-border', label: 'Carga masiva: borde' },
      { name: '--btn-mass-hover-bg', label: 'Carga masiva: hover' },
    ],
  },
  {
    title: 'Botón de ícono',
    vars: [
      { name: '--icon-button-border',   label: 'Botón ícono: borde' },
      { name: '--icon-button-fg',       label: 'Botón ícono: ícono' },
      { name: '--icon-button-hover-bg', label: 'Botón ícono: hover (fondo)' },
    ],
  },
  {
    title: 'Panel lateral / Menú',
    vars: [
      { name: '--sidebar-bg',  label: 'Sidebar: fondo' },
      { name: '--menu-accent', label: 'Menú: acento (separadores/hover)' },
    ],
  },
  {
    title: 'Footer',
    vars: [
      { name: '--footer-fg', label: 'Footer: texto/iconos' },
    ],
  },
].map((g, i) => ({ ...g, _collapsed: i > 0 })); // abierto 1°, los demás cerrados

  toggleGroup(g: VarGroupWithState) {
    g._collapsed = !g._collapsed;
  }

  // overrides en vivo
  overrides: Record<string, string> = {};

  constructor(private customTheme: ThemeCustomService) {}

  ngOnInit(): void {
    this.overrides = this.customTheme.getAll();
  }

  getVar(name: string): string {
    const key = name.startsWith('--') ? name : `--${name}`;
    if (this.overrides[key]) return this.toHexOrKeep(this.overrides[key]);
    const val = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
    return this.toHexOrKeep(val || '#000000');
  }

  setVar(name: string, value: string) {
    const key = name.startsWith('--') ? name : `--${name}`;
    this.customTheme.apply({ [key]: value });
    this.overrides = this.customTheme.getAll();
  }

  resetVar(name: string) {
    const key = name.startsWith('--') ? name : `--${name}`;
    this.customTheme.reset([key]);
    this.overrides = this.customTheme.getAll();
  }

  resetGroup(group: VarGroup) {
    const keys = group.vars.map(v => v.name);
    this.customTheme.reset(keys);
    this.overrides = this.customTheme.getAll();
  }

  resetAll() {
    this.customTheme.reset();
    this.overrides = this.customTheme.getAll();
  }

  exportOverrides() {
    const data = JSON.stringify(this.customTheme.getAll(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'theme-overrides.json' });
    a.click();
    URL.revokeObjectURL(url);
  }

  async importOverrides(file: File | null | undefined) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Record<string, string>;
      this.customTheme.apply(parsed);
      this.overrides = this.customTheme.getAll();
    } catch {
      alert('Archivo inválido. Debe ser un JSON con pares { "--var": "#rrggbb" }.');
    }
  }

  private toHexOrKeep(input: string): string {
    const v = input.trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v;
    const m = v.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (m) {
      const r = Number(m[1]).toString(16).padStart(2, '0');
      const g = Number(m[2]).toString(16).padStart(2, '0');
      const b = Number(m[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return v;
  }

  trackByVar = (_: number, v: VarItem) => v.name;
  trackByGroup = (_: number, g: VarGroup) => g.title;
}
