import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import type { SearchbarCustomEvent, SelectCustomEvent } from '@ionic/angular/standalone';

import { PackageItemComponent } from '../components/package-item/package-item.component';
import type { PackagePriority, PackageStatus } from '../models/package.model';
import { PackageService } from '../services/package.service';
import type { PriorityFilter } from '../services/package.service';

const PRIORITY_FILTERS: readonly PriorityFilter[] = ['ALL', 'CRITICAL', 'STANDARD', 'LOW'];

const PRIORITY_LABEL: Record<PackagePriority, string> = {
  CRITICAL: 'Crítica',
  STANDARD: 'Estándar',
  LOW: 'Baja',
};

const FILTER_LABEL: Record<PriorityFilter, string> = { ALL: 'Todas', ...PRIORITY_LABEL };

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    PackageItemComponent,
  ],
})
export class HomePage {
  private readonly service = inject(PackageService);

  protected readonly filteredPackages = this.service.filteredPackages;
  protected readonly priorityFilter = this.service.priorityFilter;
  protected readonly priorityFilters = PRIORITY_FILTERS;
  protected readonly filterLabel = FILTER_LABEL;

  protected onSearch(event: SearchbarCustomEvent): void {
    this.service.setSearchTerm(event.detail.value ?? '');
  }

  protected onPriorityChange(event: SelectCustomEvent<PriorityFilter>): void {
    this.service.setPriorityFilter(event.detail.value);
  }

  protected onStatusChange(e: { id: string; newStatus: PackageStatus }): void {
    this.service.updateStatus(e.id, e.newStatus);
  }
}
