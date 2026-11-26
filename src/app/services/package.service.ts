import { Injectable, signal } from '@angular/core';

import type { PackageStatus, WarehousePackage } from '../models/package.model';

const INITIAL_PACKAGES: readonly WarehousePackage[] = [
  {
    id: '3f1c2a9e-5b7d-4c1a-9e0f-1a2b3c4d5e01',
    trackingCode: 'LTK-0001-ES',
    destinationHub: 'Madrid-Coslada',
    weightKg: 12.5,
    priority: 'CRITICAL',
    status: 'IN_TRANSIT',
    timestamp: new Date('2026-11-02T08:15:00Z'),
  },
  {
    id: '6b9d4e72-1c3a-4f58-8a21-7d0e9f1b2c02',
    trackingCode: 'LTK-0002-ES',
    destinationHub: 'Barcelona-El Prat',
    weightKg: 4.2,
    priority: 'STANDARD',
    status: 'IN_TRANSIT',
    timestamp: new Date('2026-11-02T08:42:00Z'),
  },
  {
    id: 'a8e5c1d3-9f24-4b6e-b7a0-3c5d8e2f4a03',
    trackingCode: 'LTK-0003-ES',
    destinationHub: 'Valencia-Manises',
    weightKg: 27.8,
    priority: 'LOW',
    status: 'INSPECTED',
    timestamp: new Date('2026-11-02T09:05:00Z'),
  },
  {
    id: 'c2d7f0b4-6a18-4e93-95c1-8b4e1a7d6f04',
    trackingCode: 'LTK-0004-ES',
    destinationHub: 'Sevilla-La Rinconada',
    weightKg: 1.9,
    priority: 'CRITICAL',
    status: 'REJECTED',
    timestamp: new Date('2026-11-02T09:30:00Z'),
  },
  {
    id: 'd4a9e6c8-2b51-4d07-8c3e-5f1a0b9e7c05',
    trackingCode: 'LTK-0005-ES',
    destinationHub: 'Bilbao-Zamudio',
    weightKg: 8.0,
    priority: 'STANDARD',
    status: 'INSPECTED',
    timestamp: new Date('2026-11-02T10:10:00Z'),
  },
  {
    id: 'e7b3a5f9-8d62-4a14-b0c7-2e6d9c1f3b06',
    trackingCode: 'LTK-0006-ES',
    destinationHub: 'Zaragoza-PLAZA',
    weightKg: 15.3,
    priority: 'LOW',
    status: 'IN_TRANSIT',
    timestamp: new Date('2026-11-02T10:45:00Z'),
  },
  {
    id: 'f0c8d2e1-4a39-4b75-a6d8-9c3e5b7a1d07',
    trackingCode: 'LTK-0007-ES',
    destinationHub: 'Málaga-Guadalhorce',
    weightKg: 33.6,
    priority: 'STANDARD',
    status: 'REJECTED',
    timestamp: new Date('2026-11-02T11:20:00Z'),
  },
  {
    id: '1a2b3c4d-5e6f-4a8b-9c0d-1e2f3a4b5c08',
    trackingCode: 'LTK-0008-ES',
    destinationHub: 'Madrid-Coslada',
    weightKg: 0.7,
    priority: 'CRITICAL',
    status: 'IN_TRANSIT',
    timestamp: new Date('2026-11-02T11:55:00Z'),
  },
];

@Injectable({ providedIn: 'root' })
export class PackageService {
  private readonly _packages = signal<readonly WarehousePackage[]>(INITIAL_PACKAGES);

  readonly packages = this._packages.asReadonly();

  updateStatus(id: string, newStatus: PackageStatus): void {
    this._packages.update((current) => current.map((pkg) => (pkg.id === id ? { ...pkg, status: newStatus } : pkg)));
  }
}
