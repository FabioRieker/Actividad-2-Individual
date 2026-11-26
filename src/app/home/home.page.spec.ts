import { TestBed } from '@angular/core/testing';

import { PackageService } from '../services/package.service';

import { HomePage } from './home.page';

describe('HomePage', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

describe('filteredPackages (computed)', () => {
  let service: PackageService;

  beforeEach(() => {
    service = TestBed.inject(PackageService);
  });

  it('devuelve todos sin filtros', () => {
    expect(service.filteredPackages().length).toBe(service.packages().length);
  });

  it('filtra por código sin distinguir mayúsculas', () => {
    service.setSearchTerm('ltk-0003');
    expect(service.filteredPackages().map((p) => p.trackingCode)).toEqual(['LTK-0003-ES']);
  });

  it('filtra por prioridad', () => {
    service.setPriorityFilter('CRITICAL');
    const result = service.filteredPackages();
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.priority === 'CRITICAL')).toBe(true);
  });

  it('combina búsqueda y prioridad', () => {
    service.setPriorityFilter('LOW');
    service.setSearchTerm('0001');
    expect(service.filteredPackages()).toEqual([]);
  });

  it('reacciona a cambios de estado', () => {
    service.setSearchTerm('0001');
    const id = service.filteredPackages()[0].id;
    service.updateStatus(id, 'REJECTED');
    expect(service.filteredPackages()[0].status).toBe('REJECTED');
  });
});
