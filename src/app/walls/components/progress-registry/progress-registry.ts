import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WallsService } from '../../services/walls.service';
import { IRegisterProgress } from '../../interfaces/IProgressLog';

@Component({
  selector: 'app-progress-registry',
  imports: [ReactiveFormsModule],
  templateUrl: './progress-registry.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressRegistry implements OnInit {
  fb = inject(FormBuilder);
  wallService = inject(WallsService);

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);
  base64Images = signal<string[]>([]);
  isSubmitting = signal(false);

  currentMilestone = input.required<number>();
  wallId = input.required<string>();

  closeDialog = output<void>();
  submitSuccess = output<void>();

  milestoneForm = this.fb.group({
    wallId: ['', Validators.required],
    milestone: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    photos: [[] as string[]],
  });

  ngOnInit(): void {
    this.setFormValue(this.wallId(), this.currentMilestone());
  }

  setFormValue(wallId: string, milestone: number) {
    this.milestoneForm.patchValue({ milestone: milestone + 1, wallId: wallId });
  }

  async onFilesChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (!fileList || fileList.length === 0) {
      this.tempImages.set([]);
      this.base64Images.set([]);
      this.milestoneForm.patchValue({ photos: [] });
      return;
    }

    this.imageFileList = fileList;

    const previewArray: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      try {
        const dataUrl = await this.fileToBase64(file);
        previewArray.push(dataUrl);
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }

    this.tempImages.set(previewArray);
    this.base64Images.set(previewArray);
    this.milestoneForm.patchValue({ photos: previewArray });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    const currentPreview = this.tempImages();
    const currentBase64 = this.base64Images();

    this.tempImages.set(currentPreview.filter((_, i) => i !== index));
    this.base64Images.set(currentBase64.filter((_, i) => i !== index));

    this.milestoneForm.patchValue({
      photos: currentBase64.filter((_, i) => i !== index),
    });
  }

  clearAllImages(): void {
    this.tempImages.set([]);
    this.base64Images.set([]);
    this.milestoneForm.patchValue({ photos: [] });

    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onClose(): void {
    this.closeDialog.emit();
  }

  onSubmit(): void {
    if (this.milestoneForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.milestoneForm.value;
    const progressLike: Partial<IRegisterProgress> = {
      ...formData as any,
    };

    this.wallService.registryProgress(progressLike).subscribe((res) => {
      this.isSubmitting.set(false);
      this.submitSuccess.emit();
      this.onClose();
    });
  }
}
