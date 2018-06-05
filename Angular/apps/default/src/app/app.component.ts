import { Component, HostListener, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class.mat-typography')
  matTypo() {
    return true;
  }

  @HostListener('dragover', ['$event'])
  stoprDragover(event) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  stopDrop(event) {
    event.preventDefault();
  }

  constructor(private mdIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    ['file', 'editor', 'action', 'navigation', 'av', 'image', 'content', 'hardware','social'].forEach(iconSet =>
      mdIconRegistry.addSvgIconSetInNamespace(
        iconSet,
        sanitizer.bypassSecurityTrustResourceUrl(`assets/svg-sprite-${iconSet}.svg`)
      )
    );
    mdIconRegistry.addSvgIcon('file-image', sanitizer.bypassSecurityTrustResourceUrl(`assets/file.svg`));
  }
}
