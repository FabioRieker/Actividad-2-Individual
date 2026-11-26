import { TestBed } from '@angular/core/testing';

import { PackageService } from './package.service';

const TRACKING_CODE = /^LTK-\d{4}-ES$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('PackageService', () => {
  let service: PackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageService);
  });

  it('expone un mock inicial con identificadores y códigos válidos', () => {
    const packages = service.packages();

    expect(packages.length).toBeGreaterThanOrEqual(8);
    for (const pkg of packages) {
      expect(pkg.id).toMatch(UUID);
      expect(pkg.trackingCode).toMatch(TRACKING_CODE);
      expect(pkg.timestamp).toBeInstanceOf(Date);
    }
    expect(new Set(packages.map((p) => p.id)).size).toBe(packages.length);
  });

  it('mezcla prioridades y estados', () => {
    const packages = service.packages();

    expect(new Set(packages.map((p) => p.priority)).size).toBe(3);
    expect(new Set(packages.map((p) => p.status)).size).toBe(3);
  });

  it('updateStatus cambia solo el paquete indicado', () => {
    const [target, ...rest] = service.packages();

    service.updateStatus(target.id, 'REJECTED');

    const updated = service.packages();
    expect(updated.find((p) => p.id === target.id)?.status).toBe('REJECTED');
    expect(updated.filter((p) => p.id !== target.id)).toEqual(rest);
  });

  it('updateStatus es inmutable: crea nuevo array y nuevo objeto', () => {
    const before = service.packages();
    const target = before[0];
    const snapshot = { ...target };

    service.updateStatus(target.id, 'INSPECTED');

    const after = service.packages();
    expect(after).not.toBe(before);
    expect(after[0]).not.toBe(target);
    expect(target).toEqual(snapshot);
  });

  it('updateStatus con id inexistente no altera los datos', () => {
    const before = service.packages();

    service.updateStatus('00000000-0000-4000-8000-000000000000', 'INSPECTED');

    expect(service.packages()).toEqual(before);
  });
});
