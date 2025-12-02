import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IWall } from '../../interfaces/IWall';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  imports: [RouterLink],
  templateUrl: './table.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table {
  walls = input.required<IWall[]>();
}
