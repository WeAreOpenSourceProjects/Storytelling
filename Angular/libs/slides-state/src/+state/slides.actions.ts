import { Action } from '@ngrx/store';
import { Slide } from '@labdat/data-models';

export const ADD = '[Slides] Add';
export const ADD_SUCCESS = '[Slides] Add Success';
export const ADD_FAILURE = '[Slides] Add Failure';
export const UPDATE = '[Slides] Update';
export const UPDATE_SUCCESS = '[Slides] Update Success';
export const UPDATE_FAILURE = '[Slides] Update Failure';
export const DELETE = '[Slides] Delete';
export const DELETE_SUCCESS = '[Slides] Delete Success';
export const DELETE_FAILURE = '[Slides] Delete Failure';

export type Actions =
| Add
| AddSuccess
| AddFailure
| Update
| UpdateSuccess
| UpdateFailure
| Delete
| DeleteSuccess
| DeleteFailure
;

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

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload: { slide: { id: number, changes: any }}) {}
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload: { slide: { id: number, changes: any }}) {}
}

export class UpdateFailure implements Action {
  readonly type = UPDATE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: string) {}
}

export class DeleteSuccess implements Action {
  readonly type = DELETE_SUCCESS;
  constructor(public payload: Slide) {}
}

export class DeleteFailure implements Action {
  readonly type = DELETE_FAILURE;
  constructor(public payload: { error: any }) {}
}
