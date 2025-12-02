import { IProgressLog } from "./IProgressLog";

export interface IWall {
  progressLogs: IProgressLog[];
  id:           string;
  elementId:    string;
  budgetCode:   string | null;
  concreteVol:  string;
  formworkArea: string;
  unitCost:     string;
  createdAt:    Date;
}
