### `package.service.ts`

```typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { WarehousePackage } from "../models/warehouse-package.model";

export type PriorityFilter = WarehousePackage["priority"] | "all";

export interface PackageFilter {
  term: string;
  priority: PriorityFilter;
}

@Injectable({ providedIn: "root" })
export class PackageService {
  private readonly packagesSubject = new BehaviorSubject<
    readonly WarehousePackage[]
  >([]);

  readonly packages$: Observable<readonly WarehousePackage[]> =
    this.packagesSubject.asObservable();

  setPackages(packages: readonly WarehousePackage[]): void {
    this.packagesSubject.next([...packages]);
  }

  searchPackages(
    filter: PackageFilter,
  ): Observable<readonly WarehousePackage[]> {
    const term = filter.term.trim().toLowerCase();

    return of(this.packagesSubject.getValue()).pipe(
      delay(150),
      map((packages) =>
        packages.filter((pkg) => {
          const matchesTerm =
            term === "" || pkg.trackingCode.toLowerCase().includes(term);
          const matchesPriority =
            filter.priority === "all" || pkg.priority === filter.priority;
          return matchesTerm && matchesPriority;
        }),
      ),
    );
  }
}
```

### `package-list.page.ts`

```typescript
import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  SearchbarInputEventDetail,
  SelectChangeEventDetail,
} from "@ionic/angular/standalone";
import { BehaviorSubject, combineLatest } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { WarehousePackage } from "../models/warehouse-package.model";
import { PackageService, PriorityFilter } from "../services/package.service";

@Component({
  selector: "app-package-list",
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItem,
    IonLabel,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Paquetes</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          placeholder="Buscar por código de seguimiento"
          aria-label="Buscar por código de seguimiento"
          [debounce]="0"
          (ionInput)="onSearch($event)"
        ></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-select
          label="Prioridad"
          interface="popover"
          [value]="priority()"
          (ionChange)="onPriorityChange($event)"
        >
          <ion-select-option value="all">Todas</ion-select-option>
          <ion-select-option value="alta">Alta</ion-select-option>
          <ion-select-option value="media">Media</ion-select-option>
          <ion-select-option value="baja">Baja</ion-select-option>
        </ion-select>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        @for (pkg of filteredPackages(); track pkg.trackingCode) {
          <ion-item>
            <ion-label>
              <h2>{{ pkg.trackingCode }}</h2>
              <p>{{ pkg.status }} · {{ pkg.priority }}</p>
            </ion-label>
          </ion-item>
        } @empty {
          <ion-item>
            <ion-label>No hay paquetes que coincidan.</ion-label>
          </ion-item>
        }
      </ion-list>
    </ion-content>
  `,
})
export class PackageListPage implements OnInit {
  private readonly packageService = inject(PackageService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchTerm$ = new BehaviorSubject<string>("");
  private readonly priority$ = new BehaviorSubject<PriorityFilter>("all");

  readonly priority = signal<PriorityFilter>("all");
  readonly filteredPackages = signal<readonly WarehousePackage[]>([]);

  ngOnInit(): void {
    const term$ = this.searchTerm$.pipe(
      map((term) => term.trim()),
      debounceTime(300),
      distinctUntilChanged(),
    );

    combineLatest([
      term$,
      this.priority$.pipe(distinctUntilChanged()),
      this.packageService.packages$,
    ])
      .pipe(
        switchMap(([term, priority]) =>
          this.packageService.searchPackages({ term, priority }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((packages) => this.filteredPackages.set(packages));
  }

  onSearch(event: CustomEvent<SearchbarInputEventDetail>): void {
    this.searchTerm$.next(event.detail.value ?? "");
  }

  onPriorityChange(
    event: CustomEvent<SelectChangeEventDetail<PriorityFilter>>,
  ): void {
    const value = event.detail.value ?? "all";
    this.priority.set(value);
    this.priority$.next(value);
  }
}
```
