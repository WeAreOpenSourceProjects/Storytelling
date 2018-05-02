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

declare let global: any;
const getGlobal = (): any => (typeof window !== 'undefined' ? window : global);
const getTinymce = () => {
  const global = getGlobal();
  return global && global.tinymce ? global.tinymce : null;
};

@Component({
  selector: 'app-tiny-editor',
  templateUrl: './tiny-editor.component.html',
  styleUrls: ['./tiny-editor.component.scss']
})
export class TinyEditorComponent {
  @ViewChild('editor') public editorComponent: ElementRef;

  @Input() public initialValue = '';
  @Input() presentationMode: Boolean;
  @Output() public textToSave = new EventEmitter();

  public activeEditor: any;

  constructor(private elementRef: ElementRef) {}

  @Input()
  public init = {
    menubar: false,
    theme: 'inlite',
    insert_toolbar: 'blockquote | numlist bullist | alignleft aligncenter alignright alignjustify',
    selection_toolbar:
      'quicklink | bold italic fontselect fontsizeselect forecolor backcolor | alignleft aligncenter alignright alignjustify',
    init_instance_callback: editor => {
      editor.focus();
      editor.on('blur', e => {
        editor.setMode('readonly');
        this.textToSave.emit(editor.getContent());
      });
    },
    content_style:
      '.mce-content-body { font-size: 24pt; font-family: Arial,sans-serif; } [contenteditable] { outline: none; }'
  };

  public inline = true;

  @Input() public plugins = ['link', 'textcolor', 'colorpicker', 'lists', 'advlist'];

  public setEditMode(value) {
    if (value) {
      this.activeEditor.setMode('design');
    } else this.activeEditor.setMode('readonly');
  }

  ngAfterViewInit() {
    (this.editorComponent as any).registerOnChange(function() {});
    (this.editorComponent as any).registerOnTouched(function() {});
    this.activeEditor = getTinymce().activeEditor;
    if (this.presentationMode) {
      this.activeEditor.setMode('readonly');
    }
  }
}
