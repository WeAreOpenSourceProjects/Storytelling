import {
  Component,
  Input,
  Inject,
  HostListener,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnInit
} from '@angular/core';
import { environment } from '../../../../../apps/default/src/environments/environment';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  @HostListener('dblclick', ['$event'])
  onDblClick(event) {
    this.froalaEditor('events.trigger', 'froalaEditor.focus');
    //    this.froalaEditor('edit.on');
  }

  private froalaEditor;

  @Input() public editorContent: any;

  @Input() public id: any;

  @Output() public textTosave: EventEmitter<string> = new EventEmitter();

  private editorOptions: Object;

  ngOnInit() {
    let baseURL = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseURL += `:${environment.backend.port}`;
    }

    this.editorOptions = {
      events: {
        'froalaEditor.blur': (e, editor) => {
          this.textTosave.emit(this.editorContent);
          //this.froalaEditor('edit.off');
        }
      },
      toolbarInline: true,
      initOnClick: true,
      charCounterCount: false,
      toolbarButtons: [
        'undo',
        'redo',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'color',
        'fontFamily',
        'fontSize',
        'emoticons',
        '-',
        'paragraphFormat',
        'align',
        'formatOL',
        'formatUL',
        'indent',
        'outdent'
      ]
    };
  }

  setControls(controls) {
    this.froalaEditor = controls.getEditor();
    controls.initialize();
    //    this.froalaEditor('edit.off');
  }
}
