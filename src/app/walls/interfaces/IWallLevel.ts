import { IProgressLog } from './IProgressLog';
export interface IWallLevel {
  progressLogs: IProgressLog[];
  id:           string;
  wallId:       string;
  level:        number;
  isActive:     boolean;
  completed:    boolean;
  completedAt:  Date;
  createdAt:    Date;
}
