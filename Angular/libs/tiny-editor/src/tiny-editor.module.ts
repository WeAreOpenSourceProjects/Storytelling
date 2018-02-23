import { EditorModule } from '@tinymce/tinymce-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TinyEditorComponent } from './components/tiny-editor/tiny-editor.component';

@NgModule({
  imports: [CommonModule, EditorModule],
  declarations: [TinyEditorComponent],
  exports: [TinyEditorComponent]
})
export class TinyEditorModule {}
