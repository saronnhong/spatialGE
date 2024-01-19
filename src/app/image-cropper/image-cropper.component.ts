import { AfterViewInit, Component } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements AfterViewInit {
  imageUrl = 'assets/GSM6433599_117D_tissue_hires_image.png';
  croppedImage = '';
  cropper: any

  constructor() { }

  ngAfterViewInit(): void {
    this.runCropperJS()
  }

  runCropperJS() {
    const image = document.getElementById('image') as HTMLImageElement | null;;
    if (image) {
      this.cropper = new Cropper(image, {
        zoomable: true,
        scalable: true,
        // aspectRatio: 16 / 9,

        // crop: () => {
        //   const canvas = cropper.getCroppedCanvas();
        //   this.croppedImage = canvas.toDataURL("image/png")
        // }
      });
      console.log("crop: ", this.croppedImage)
    } else {
      console.error('Image element not found');
    }
  }

  zoomIn() {
    if (this.cropper) {
      this.cropper.zoom(0.1);
    }
  }

  zoomOut() {
    if (this.cropper) {
      this.cropper.zoom(-0.1);
    }
  }

  moveLeft() {
    if (this.cropper) {
      this.cropper.move(-1, 0);
    }
  }

  moveRight() {
    if (this.cropper) {
      this.cropper.move(1, 0);
    }
  }

  moveUp() {
    if (this.cropper) {
      this.cropper.move(0, -1);
    }
  }

  moveDown() {
    if (this.cropper) {
      this.cropper.move(0, 1);
    }
  }

  setAspectRatio(ratio: number | null) {
    this.cropper.setAspectRatio(ratio);
  }

  downloadCroppedImage() {
    if (this.cropper) {
      const croppedCanvas = this.cropper.getCroppedCanvas();
      const dataUrl = croppedCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = 'cropped_image.png';
      downloadLink.click();
    }
  }
}
