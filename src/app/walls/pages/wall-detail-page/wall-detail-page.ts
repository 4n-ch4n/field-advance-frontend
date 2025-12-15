import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WallsService } from '../../services/walls.service';
import { ProgressRegistry } from "../../components/progress-registry/progress-registry";
import { IWallLevel } from '../../interfaces/IWallLevel';

@Component({
  selector: 'app-wall-detail-page',
  imports: [DatePipe, RouterLink, ProgressRegistry],
  templateUrl: './wall-detail-page.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WallDetailPage {
  activatesRoute = inject(ActivatedRoute);
  wallsService = inject(WallsService);

  wallId = toSignal(this.activatesRoute.params.pipe(map((params) => params['id'])));
  openModal = signal(false);
  currentLevel = signal(1);

  progressMap: { [key: number]: number } = {
    0: 0,
    1: 10,
    2: 30,
    3: 75,
    4: 95,
    5: 100,
  };

  wallResource = rxResource({
    params: () => ({ id: this.wallId() }),
    stream: ({ params }) => this.wallsService.getWallById(params.id),
  });

  getCurrentWallLevel(): IWallLevel | undefined {
    const wall = this.wallResource.value();
    if (!wall || !wall.wallLevels) return undefined;

    return wall.wallLevels.find(wl => wl.level === this.currentLevel());
  }

  isLevelActive(level: number): boolean {
    const wall = this.wallResource.value();
    const wallLevel = wall?.wallLevels?.find(wl => wl.level === level);
    return wallLevel?.isActive || false;
  }

  setCurrentLevel(level: number): void {
    const wall = this.wallResource.value();
    const wallLevel = wall?.wallLevels?.find(wl => wl.level === level);

    if (wallLevel) {
      this.currentLevel.set(level);
    }
  }

  isLevelCompleted(level: number): boolean {
    const wall = this.wallResource.value();
    const wallLevel = wall?.wallLevels?.find(wl => wl.level === level);
    return wallLevel?.completed || false;
  }

  canActivateNextLevel(): boolean {
    const currentWallLevel = this.getCurrentWallLevel();
    if (!currentWallLevel) return false;

    const currentMilestone = this.getCurrentMilestone();
    return currentMilestone >= 4 && !currentWallLevel.completed;
  }

  canRegisterProgress(): boolean {
    const wallLevel = this.getCurrentWallLevel();
    if (!wallLevel) return false;

    if (wallLevel.completed && !wallLevel.isActive) return false;

    if (!wallLevel.isActive) return false;

    return this.getCurrentMilestone() < 5;
  }

  getProgressPercentage(): number {
    const wallLevel = this.getCurrentWallLevel();
    if (!wallLevel || !wallLevel.progressLogs) return 0;

    const currentMilestone = this.getCurrentMilestone();
    return this.progressMap[currentMilestone] || 0;
  }

  getCurrentMilestone(): number {
    const wallLevel = this.getCurrentWallLevel();
    if (!wallLevel || !wallLevel.progressLogs || wallLevel.progressLogs.length === 0) return 0;

    return Math.max(...wallLevel.progressLogs.map((log) => log.milestone));
  }

  getMilestoneLog(milestone: number) {
    const wallLevel = this.getCurrentWallLevel();
    if (!wallLevel || !wallLevel.progressLogs) return null;

    return wallLevel.progressLogs.find((log) => log.milestone === milestone);
  }
}
