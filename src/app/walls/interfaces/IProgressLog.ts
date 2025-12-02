export interface IProgressLog {
  id: string;
  wallId: string;
  milestone: number;
  photos: string[];
  registeredAt: Date | string;
}

export interface IRegisterProgress {
  wallId: string;
  milestone: number;
  photos: string[];
}
