
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
    ($(this.froalaEditor.nativeElement) as any).froalaEditor('edit.on');
    ($(this.froalaEditor.nativeElement) as any).froalaEditor('events.focus');
//    ($(this.froalaEditor.nativeElement) as any).froalaEditor('events.trigger', 'blur', [], true);

}

//  @HostListener('window:click', ['$event'])
//  onClickOut(event) {
//    ($(this.froalaEditor.nativeElement) as any).froalaEditor('events.trigger', 'blur', [], true);
//    ($(this.froalaEditor.nativeElement) as any).froalaEditor('edit.off');
//  }

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
      initOnClick :true,
      heightMin: 200,
      heightMax: 400,
      widthMax: 1000,
      charCounterMax: 3000,
      toolbarSticky: false,
      toolbarBottom: false,
      toolbarButtons: ['undo', 'redo' , '-', 'bold', 'italic', 'underline']
    };
  }

  ngAfterViewInit() {
    ($(this.froalaEditor.nativeElement) as any).froalaEditor('edit.off');
    ($(this.froalaEditor.nativeElement) as any).on('froalaEditor.blur', (e, editor) => {
      console.log('blur');
      this.textTosave.emit(this.editorContent);
      editor.edit.off();
    });
  }
}
