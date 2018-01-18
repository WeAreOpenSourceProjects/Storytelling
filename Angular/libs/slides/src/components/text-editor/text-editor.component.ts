
import { Component, Input, Inject, HostListener, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import { environment } from '../../../../../apps/default/src/environments/environment';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {
  @HostListener('dblclick', ['$event']) onDblClick(event) {
    $(this.froalaEditor.nativeElement).froalaEditor('events.focus');
  }
  @HostListener('window:click', ['$event']) onClickOut(event) {
    $(this.froalaEditor.nativeElement).froalaEditor('events.trigger', 'blur', [], true);
  }

  @ViewChild('froalaEditor') froalaEditor: ElementRef;

  private editorOptions: Object;//option of the text editor
  @Input() editorContent : any;
  @Output() textTosave: EventEmitter<string> = new EventEmitter();
  constructor() {
    let baseURL = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseURL += `:${environment.backend.port}`;
    }
    this.editorOptions = {
      toolbarInline: true,
      iframe: false,
      initOnClick :false,
      heightMin: 200,
      heightMax: 400,
      widthMax: 1000,
      charCounterMax: 3000,
      toolbarSticky: false
    };
  }
}
