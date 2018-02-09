
import { Component, Input, Inject, HostListener, Output, EventEmitter, ElementRef, ViewChild, OnInit } from '@angular/core';
import { environment } from '../../../../../apps/default/src/environments/environment';

declare let global: any;
const getGlobal = (): any => typeof window !== 'undefined' ? window : global;
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

  @ViewChild('editor')
  public editorComponent: ElementRef;

  public activeEditor: any;

  public init = {
    menubar: false,
    theme: 'inlite',
    insert_toolbar: 'blockquote | numlist bullist | alignleft aligncenter alignright alignjustify',
    selection_toolbar: 'quicklink | bold italic fontselect fontsizeselect forecolor backcolor | alignleft aligncenter alignright alignjustify',
    init_instance_callback: function (editor) {
      editor.focus();
      editor.on('blur', function (e) {
        editor.setMode('readonly');
      });
    },
    content_style: ".mce-content-body { font-size: 24pt; font-family: Arial,sans-serif; }",
  };

  public inline = true;

  public plugins = ['link', 'textcolor', 'colorpicker', 'lists', 'advlist'];

  public setEditMode() {
    this.activeEditor.setMode('design');
  }

  ngAfterViewInit() {
    (this.editorComponent as any).registerOnChange(function () { });
    (this.editorComponent as any).registerOnTouched(function() { });
    this.activeEditor = getTinymce().activeEditor;
  }
}
