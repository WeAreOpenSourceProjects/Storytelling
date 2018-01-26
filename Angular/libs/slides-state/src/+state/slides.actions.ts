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
export const DELETE = '[Slides] Delete';
export const DELETE_SUCCESS = '[Slides] Delete Success';
export const DELETE_FAILURE = '[Slides] Delete Failure';
export const UPDATE_ON_DELETE = '[Slides] Update On Delete';

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
| Delete
| DeleteSuccess
| DeleteFailure
| UpdateOnDelete
;

export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: { presentationId: string }) {}
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: { slides: Slide[]}) {}
}

export class LoadFailure implements Action {
  readonly type = LOAD_FAILURE;
  constructor(public payload: { error: any }) {}
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

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: { slideId: string }) {}
}

export class DeleteSuccess implements Action {
  readonly type = DELETE_SUCCESS;
  constructor(public payload: { slide: Slide }) {}
}

export class UpdateOnDelete implements Action {
  readonly type = UPDATE_ON_DELETE;
  constructor(public payload: { slide: Slide }) {}
}


export class DeleteFailure implements Action {
  readonly type = DELETE_FAILURE;
  constructor(public payload: { error: any }) {}
}
