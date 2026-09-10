export type ViewMode = 'upload' | 'gallery' | 'series' | 'about';

export interface ArchivalRights {
  fineArtPrint: boolean;
  editorialLore: boolean;
  nftToken: boolean;
}

export type VisibilityMode = 'public' | 'curators' | 'cipher';

export interface PlateMetadata {
  id: string;
  plateNumber: string;
  uuid: string;
  title: string;
  filename: string;
  series: string;
  epoch: string;
  medium: string;
  lore: string;
  tags: string[];
  rights: ArchivalRights;
  visibility: VisibilityMode;
  imageUrl: string;
  resolution: string;
  colorDepth: string;
  fileSize: string;
  progress: number;
  gamma: number;
  deepShadowsPercent: number;
  midtoneInkPercent: number;
  crimsonLightPercent: number;
  exhibitionLighting: string;
  isMuseumReady: boolean;
  ingestedAt: string;
  isStaged?: boolean;
}

export interface CollectionSeries {
  id: string;
  name: string;
  epoch: string;
  status: 'Open' | 'Archived' | 'Sealed' | 'In Progress';
  plateCount: number;
  description: string;
  coverImage: string;
  curatorNote: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  subtitle?: string;
  type?: 'success' | 'info' | 'warning';
}
