import { Action } from '@ngrx/store';
import { Box } from '@labdat/data-models';

export const LOAD = '[Boxes] Load';
export const LOAD_SUCCESS = '[Boxes] Load Success';
export const LOAD_FAILURE = '[Boxes] Load Failure';
export const ADD = '[Boxes] Add';
export const ADD_SUCCESS = '[Boxes] Add Success';
export const ADD_FAILURE = '[Boxes] Add Failure';
export const UPDATE = '[Boxes] Update';
export const UPDATE_SUCCESS = '[Boxes] Update Success';
export const UPDATE_FAILURE = '[Boxes] Update Failure';
export const DELETE = '[Boxes] Delete';
export const DELETE_SUCCESS = '[Boxes] Delete Success';
export const DELETE_FAILURE = '[Boxes] Delete Failure';

export type Actions =
| Load
| LoadSuccess
| LoadFailure
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

export class Load implements Action {
  readonly type = LOAD;
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: { boxes: Box[]}) {}
}

export class LoadFailure implements Action {
  readonly type = LOAD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Add implements Action {
  readonly type = ADD;
  constructor(public payload: { boxe: Box }) {}
}

export class AddSuccess implements Action {
  readonly type = ADD_SUCCESS;
  constructor(public payload: { boxe: Box }) {}
}

export class AddFailure implements Action {
  readonly type = ADD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload: { boxe: { id: number, changes: any }}) {}
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload: { boxe: { id: number, changes: any }}) {}
}

export class UpdateFailure implements Action {
  readonly type = UPDATE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: { boxIds: string[] }) {}
}

export class DeleteSuccess implements Action {
  readonly type = DELETE_SUCCESS;
  constructor(public payload: { boxIds: string[] }) {}
}

export class DeleteFailure implements Action {
  readonly type = DELETE_FAILURE;
  constructor(public payload: { error: any }) {}
}
