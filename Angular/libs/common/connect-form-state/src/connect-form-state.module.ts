import { NgModule } from '@angular/core';
import { connectFormReducer } from './+state/reducers/connect-form-state.reducer';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [StoreModule.forFeature('connectForm', connectFormReducer)]
})
export class ConnectFormStateModule { }
