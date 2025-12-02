import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { type IWall } from '../interfaces/IWall';
import { IProgressLog, IRegisterProgress } from '../interfaces/IProgressLog';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class WallsService {
  private http = inject(HttpClient);

  getWalls() {
    return this.http.get<IWall[]>(`${baseUrl}/walls`);
  }

  getWallById(id: string) {
    return this.http.get<IWall>(`${baseUrl}/walls/id/${id}`);
  }

  downloadReport() {
    return this.http.get(`${baseUrl}/walls/report`, {
      responseType: 'blob',
    });
  }

  registryProgress(progressLike: Partial<IRegisterProgress>) {
    return this.http.post<IProgressLog>(`${baseUrl}/progress`, progressLike);
  }
}
