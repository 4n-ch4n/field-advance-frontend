import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WallsService } from '../../services/walls.service';

@Component({
  selector: 'app-report-page',
  imports: [RouterLink],
  templateUrl: './report-page.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPage {
  wallsService = inject(WallsService);

  isDownloading = signal(false);
  downloadSuccess = signal(false);

  downloadReport() {
    this.isDownloading.set(true);
    this.downloadSuccess.set(false);

    this.wallsService.downloadReport().subscribe((res) => {
      const url = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-muros-${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(url);
      this.downloadSuccess.set(true);
      this.isDownloading.set(false);

      setTimeout(() => {
        this.downloadSuccess.set(false);
      }, 3000);
    });
  }
}
