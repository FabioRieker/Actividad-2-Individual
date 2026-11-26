import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

import type { PackagePriority, PackageStatus, WarehousePackage } from '../../models/package.model';

interface BadgeView {
  readonly label: string;
  readonly color: 'danger' | 'warning' | 'medium' | 'success' | 'primary';
}

const PRIORITY_VIEW: Record<PackagePriority, BadgeView> = {
  CRITICAL: { label: 'Crítica', color: 'danger' },
  STANDARD: { label: 'Estándar', color: 'primary' },
  LOW: { label: 'Baja', color: 'medium' },
};

const STATUS_VIEW: Record<PackageStatus, BadgeView> = {
  IN_TRANSIT: { label: 'En tránsito', color: 'warning' },
  INSPECTED: { label: 'Inspeccionado', color: 'success' },
  REJECTED: { label: 'Rechazado', color: 'danger' },
};

/**
 * Tarjeta de un paquete. Solo recibe datos y emite eventos: no inyecta servicios.
 */
@Component({
  selector: 'app-package-item',
  standalone: true,
  imports: [IonBadge, IonButton, IonIcon],
  templateUrl: './package-item.component.html',
  styleUrl: './package-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageItemComponent {
  /** Paquete a mostrar (obligatorio). */
  readonly package = input.required<WarehousePackage>();

  /**
   * Emite el cambio de estado solicitado. El PDF propone EventEmitter con
   * `newStatus: string`; se usa output() con la unión literal, compatible y más estricto.
   */
  readonly statusChange = output<{ id: string; newStatus: PackageStatus }>();

  protected readonly weightLabel = computed(
    () =>
      `${this.package().weightKg.toLocaleString('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      })} kg`,
  );
  protected readonly priorityView = computed(() => PRIORITY_VIEW[this.package().priority]);
  protected readonly statusView = computed(() => STATUS_VIEW[this.package().status]);
  protected readonly statusClass = computed(
    () => `package-item--${this.package().status.toLowerCase().replace('_', '-')}`,
  );

  constructor() {
    addIcons({ checkmarkCircleOutline, closeCircleOutline });
  }

  protected request(newStatus: PackageStatus): void {
    this.statusChange.emit({ id: this.package().id, newStatus });
  }
}
