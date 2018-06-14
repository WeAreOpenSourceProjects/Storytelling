import { Action } from '@ngrx/store';

export const FORM_INIT = '[ConnectForm] Init Form';
export const FORM_SUBMIT = '[ConnectForm] Submit Form';
export const FORM_SUBMIT_SUCCESS = '[ConnectForm] Submit Form Success';
export const FORM_SUBMIT_ERROR = '[ConnectForm] Submit Form Error';
export const UPDATE_FORM = '[ConnectForm] Update Form';

export type Actions = InitForm | SubmitForm | SubmitFormSuccess | SubmitFormError | UpdateForm;

export class InitForm implements Action {
  readonly type = FORM_INIT;
  constructor(public payload: { path: string }) {}
}

// tslint:disable-next-line:max-classes-per-file
export class SubmitForm implements Action {
  readonly type = FORM_SUBMIT;
  constructor(public payload: { path: string }) { }
}

// tslint:disable-next-line:max-classes-per-file
export class SubmitFormSuccess implements Action {
  readonly type = FORM_SUBMIT_SUCCESS;
  constructor(public payload: { path: string }) { }
}

// tslint:disable-next-line:max-classes-per-file
export class SubmitFormError implements Action {
  readonly type = FORM_SUBMIT_ERROR;
  constructor(public payload: { path: string; error: string }) { }
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateForm implements Action {
  readonly type = UPDATE_FORM;
  constructor(public payload: { path: string; value: any }) { }
}
