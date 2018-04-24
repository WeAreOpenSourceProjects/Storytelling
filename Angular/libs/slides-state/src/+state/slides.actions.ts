import { Action } from '@ngrx/store';
import { Slide } from '@labdat/data-models';
import { Update } from '@ngrx/entity/src/models';

export const LOAD = '[Slides] Load';
export const LOAD_SUCCESS = '[Slides] Load Success';
export const LOAD_FAILURE = '[Slides] Load Failure';
export const ADD = '[Slides] Add';
export const ADD_SUCCESS = '[Slides] Add Success';
export const ADD_FAILURE = '[Slides] Add Failure';
export const BULK_UPDATE = '[Slides] Bulk Update';
export const BULK_UPDATE_SUCCESS = '[Slides] Bulk Update Success';
export const BULK_UPDATE_FAILURE = '[Slides] Bulk Update Failure';
export const UPDATE = '[Slide] Update';
export const UPDATE_SUCCESS = '[Slide] Update Success';
export const UPDATE_FAILURE = '[Slide] Update Failure';
export const DELETE = '[Slides] Delete';
export const DELETE_SUCCESS = '[Slides] Delete Success';
export const DELETE_FAILURE = '[Slides] Delete Failure';
export const UPDATE_ON_DELETE = '[Slides] Update On Delete';
export const UPDATE_STATE = '[Slide] Update State';
export const CONFIRM_STATE = '[Slide] Confirm State';
export const CONFIRM_STATE_SUCCESS = '[Slide] Confirm State Success';
export const CONFIRM_STATE_FAILURE = '[Slide] Confirm State Failure';
export const LOAD_ONE = '[Slide] Load one';
export const LOAD_ONE_SUCCESS = '[Slide] Load one Success';

export type Actions =
  | Load
  | LoadSuccess
  | LoadFailure
  | Add
  | AddSuccess
  | AddFailure
  | BulkUpdate
  | BulkUpdateSuccess
  | BulkUpdateFailure
  | UpdateSlide
  | UpdateSuccess
  | UpdateFailure
  | Delete
  | DeleteSuccess
  | DeleteFailure
  | UpdateState
  | DeleteSuccess
  | DeleteFailure
  | UpdateOnDelete
  | LoadOne
  | LoadOneSuccess
  | ConfirmState
  | ConfirmStateSuccess;

export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: { presentationId: string }) {}
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: { slides: Slide[] }) {}
}

export class LoadFailure implements Action {
  readonly type = LOAD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class LoadOne implements Action {
  readonly type = LOAD_ONE;
  constructor(public payload: { slideId: string }) {}
}
export class LoadOneSuccess implements Action {
  readonly type = LOAD_ONE_SUCCESS;
  constructor(public payload: { slide: Slide }) {}
}


export class Add implements Action {
  readonly type = ADD;
  constructor(public payload: Slide) {}
}

export class AddSuccess implements Action {
  readonly type = ADD_SUCCESS;
  constructor(public payload: Slide) {}
}

export class AddFailure implements Action {
  readonly type = ADD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class BulkUpdate implements Action {
  readonly type = BULK_UPDATE;
  constructor(public payload: Update<Slide>[]) {}
}

export class BulkUpdateSuccess implements Action {
  readonly type = BULK_UPDATE_SUCCESS;
  constructor(public payload: Update<Slide>[]) {}
}

export class BulkUpdateFailure implements Action {
  readonly type = BULK_UPDATE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class UpdateSlide implements Action {
  readonly type = UPDATE;
  constructor(public payload: { slide: any }) {}
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload: { slide: any }) {}
}

export class UpdateFailure implements Action {
  readonly type = UPDATE_FAILURE;
  constructor(public payload: { error: any }) {}
}


export class UpdateState implements Action {
  readonly type = UPDATE_STATE;
  constructor(public payload: { slide: { id: number; changes: any } }) {}
}

export class ConfirmState implements Action {
  readonly type = CONFIRM_STATE;
  constructor(public payload: { slide, boxes }) {}
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: { slideId: string }) {}
}

export class DeleteSuccess implements Action {
  readonly type = DELETE_SUCCESS;
  constructor(public payload: { slide: Slide }) {}
}

export class DeleteFailure implements Action {
  readonly type = DELETE_FAILURE;
  constructor(public payload: { error: any }) {}
}


export class UpdateOnDelete implements Action {
  readonly type = UPDATE_ON_DELETE;
  constructor(public payload: { slide: Slide }) {}
}



export class ConfirmStateSuccess implements Action {
  readonly type = CONFIRM_STATE_SUCCESS;
  constructor(public payload: { slide: any }) {}
}
