
import { Component, Input, Inject, HostListener, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import { environment } from '../../../../../apps/default/src/environments/environment';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {

  @HostListener('dblclick', ['$event'])
  onDblClick(event) {
    console.log('dblclick', event);
    ($(this.froalaEditor.nativeElement) as any).froalaEditor('edit.on');
//    ($(this.froalaEditor.nativeElement) as any).froalaEditor('events.trigger', 'click', [], true);
//    ($(this.froalaEditor.nativeElement) as any).froalaEditor('events.focus');
//    ($(this.froalaEditor.nativeElement) as any).froalaEditor('events.trigger', 'focus', [], true);

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
      initOnClick : false,
      charCounterCount: false,
      charCounterMax: 3000,
      toolbarSticky: false,
      toolbarBottom: true,
      toolbarButtons: ['undo', 'redo' , 'bold', 'italic', 'underline', 'strikeThrough', 'color', 'fontFamily', 'fontSize', 'emoticons', '-', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent']
    };
  }

  ngAfterViewInit() {
    ($(this.froalaEditor.nativeElement) as any).froalaEditor('edit.off');
    ($(this.froalaEditor.nativeElement) as any).on('froalaEditor.blur', (e, editor) => {
      setTimeout(() => {
        this.textTosave.emit(this.editorContent);
        editor.edit.off();
      });
    });
  }
}
