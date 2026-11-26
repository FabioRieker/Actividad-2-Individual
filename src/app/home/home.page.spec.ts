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

describe('HomePage integración con PackageItemComponent', () => {
  it('cambia el estado en el servicio y lo refleja en la UI al pulsar el botón del hijo', () => {
    const fixture = TestBed.createComponent(HomePage);
    const service = TestBed.inject(PackageService);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const target = service.packages().find((p) => p.status === 'IN_TRANSIT');
    if (!target) {
      throw new Error('El mock debe contener un paquete IN_TRANSIT');
    }
    const button = host.querySelector<HTMLElement>(
      `ion-button[aria-label="Marcar paquete ${target.trackingCode} como inspeccionado"]`,
    );
    expect(button).not.toBeNull();

    button?.click();
    fixture.detectChanges();

    expect(service.packages().find((p) => p.id === target.id)?.status).toBe('INSPECTED');
    const article = button?.closest('app-package-item');
    expect(article?.textContent).toContain('Estado: Inspeccionado');
  });
});
