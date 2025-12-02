import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WallsService } from '../../services/walls.service';
import { ProgressRegistry } from "../../components/progress-registry/progress-registry";

@Component({
  selector: 'app-wall-detail-page',
  imports: [DatePipe, DecimalPipe, RouterLink, ProgressRegistry],
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
  selectedPhoto = signal<string | null>(null);
  openModal = signal(false);

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

  getProgressPercentage(): number {
    const wall = this.wallResource.value();
    if (!wall || !wall.progressLogs) return 0;

    return this.progressMap[wall.progressLogs.length - 1];
  }

  getCurrentMilestone(): number {
    const wall = this.wallResource.value();
    if (!wall || !wall.progressLogs) return 0;

    return Math.max(...wall.progressLogs.map((log) => log.milestone));
  }

  getMilestoneLog(milestone: number) {
    const wall = this.wallResource.value();
    if (!wall || !wall.progressLogs) return null;

    return wall.progressLogs.find((log) => log.milestone === milestone);
  }
}
