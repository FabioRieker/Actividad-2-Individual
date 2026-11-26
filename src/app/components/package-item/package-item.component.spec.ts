import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { WarehousePackage } from '../../models/package.model';
import { PackageService } from '../../services/package.service';

import { PackageItemComponent } from './package-item.component';

const BASE: WarehousePackage = {
  id: '11111111-1111-4111-8111-111111111111',
  trackingCode: 'LTK-0001-ES',
  destinationHub: 'Madrid Centro',
  weightKg: 12.5,
  priority: 'CRITICAL',
  status: 'IN_TRANSIT',
  timestamp: new Date('2026-01-01T10:00:00Z'),
};

describe('PackageItemComponent', () => {
  let fixture: ComponentFixture<PackageItemComponent>;
  let emitted: { id: string; newStatus: WarehousePackage['status'] }[];

  function create(pkg: WarehousePackage): HTMLElement {
    fixture = TestBed.createComponent(PackageItemComponent);
    fixture.componentRef.setInput('package', pkg);
    emitted = [];
    fixture.componentInstance.statusChange.subscribe((e) => emitted.push(e));
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function button(el: HTMLElement, fragment: string): HTMLElement {
    const found = Array.from(el.querySelectorAll<HTMLElement>('ion-button')).find((b) =>
      (b.getAttribute('aria-label') ?? '').includes(fragment),
    );
    if (!found) {
      throw new Error(`Botón no encontrado: ${fragment}`);
    }
    return found;
  }

  function isDisabled(b: HTMLElement): boolean {
    return Reflect.get(b, 'disabled') === true || b.hasAttribute('disabled');
  }

  let serviceCreations = 0;

  beforeEach(() => {
    serviceCreations = 0;
    TestBed.configureTestingModule({
      imports: [PackageItemComponent],
      providers: [
        {
          provide: PackageService,
          useFactory: () => {
            serviceCreations += 1;
            return new PackageService();
          },
        },
      ],
    });
  });

  it('renderiza los datos del input con badges de texto', () => {
    const el = create(BASE);
    const text = el.textContent ?? '';

    expect(text).toContain('LTK-0001-ES');
    expect(text).toContain('Madrid Centro');
    expect(text).toContain('12,5 kg');
    expect(text).toContain('Prioridad: Crítica');
    expect(text).toContain('Estado: En tránsito');
    expect(el.querySelector('.package-item--in-transit')).not.toBeNull();
  });

  it('botones con aria-label que incluye el trackingCode', () => {
    const el = create(BASE);

    expect(button(el, 'inspeccionado').getAttribute('aria-label')).toContain('LTK-0001-ES');
    expect(button(el, 'rechazado').getAttribute('aria-label')).toContain('LTK-0001-ES');
  });

  it('emite INSPECTED al pulsar el botón de check', () => {
    const el = create(BASE);
    button(el, 'inspeccionado').click();

    expect(emitted).toEqual([{ id: BASE.id, newStatus: 'INSPECTED' }]);
  });

  it('emite REJECTED al pulsar el botón de cierre', () => {
    const el = create(BASE);
    button(el, 'rechazado').click();

    expect(emitted).toEqual([{ id: BASE.id, newStatus: 'REJECTED' }]);
  });

  it('deshabilita el botón del estado actual', () => {
    const el = create({ ...BASE, status: 'INSPECTED' });

    expect(isDisabled(button(el, 'inspeccionado'))).toBe(true);
    expect(isDisabled(button(el, 'rechazado'))).toBe(false);
    expect(el.querySelector('.package-item--inspected')).not.toBeNull();
  });

  it('no inyecta PackageService', () => {
    create(BASE);
    button(fixture.nativeElement as HTMLElement, 'inspeccionado').click();

    expect(serviceCreations).toBe(0);
  });
});
