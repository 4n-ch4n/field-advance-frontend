import { IWallLevel } from "./IWallLevel";

export interface IWall {
  wallLevels: IWallLevel[];
  id:           string;
  elementId:    string;
  budgetCode:   string | null;
  concreteVol:  string;
  formworkArea: string;
  unitCost:     string;
  createdAt:    Date;
}
