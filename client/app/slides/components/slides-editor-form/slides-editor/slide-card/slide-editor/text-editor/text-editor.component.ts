import { Component, OnInit, Input } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  private editorOptions: Object;//option of the text editor
  @Input() text: any;
  @Input() width: number;
  @Input() height: number;
  constructor(public dialogRef: MdDialogRef<TextEditorComponent>) {
    let baseURL = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseURL += `:${environment.backend.port}`;
    }
    this.editorOptions = {
      heightMin: 200,
      heightMax: 400,
      widthMax : 1000,
      charCounterMax: 3000,
      toolbarSticky: false,
      imageUploadURL: `${baseURL}${environment.backend.endpoints.imagesServer}`,
      imageManagerLoadURL: `${baseURL}${environment.backend.endpoints.imagesServer}`
    };
  }

  ngOnInit() {
  }

}
