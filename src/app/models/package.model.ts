export type PackagePriority = 'CRITICAL' | 'STANDARD' | 'LOW';
export type PackageStatus = 'IN_TRANSIT' | 'INSPECTED' | 'REJECTED';

export interface WarehousePackage {
  /** Identificador UUID. */
  id: string;
  /** Código de seguimiento con formato LTK-XXXX-ES. */
  trackingCode: string;
  destinationHub: string;
  weightKg: number;
  priority: PackagePriority;
  status: PackageStatus;
  timestamp: Date;
}
