import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { WallsService } from '../../services/walls.service';
import { Table } from '../../components/table/table';

@Component({
  selector: 'app-wall-table-page',
  imports: [Table],
  templateUrl: './wall-table-page.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WallTablePage {
  wallsService = inject(WallsService);

  wallsResource = rxResource({
    stream: () => this.wallsService.getWalls(),
  });

  searchTerm = signal<string>('');
  walls = linkedSignal(() => this.wallsResource.value() ?? []);

  debounceEffect = effect((onCleanup) => {
    const search = this.searchTerm();

    const timeout = setTimeout(() => {
      const allWalls = this.wallsResource.value() ?? [];
      if (!search) this.walls.set(allWalls);

      this.walls.set(allWalls.filter((wall) => wall.elementId.includes(search)));
    }, 1000);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
