import { Action } from '@ngrx/store';
import { Presentation, Box, Slide } from '@labdat/data-models';

export const LOAD = '[Presentations] Load';
export const LOAD_SUCCESS = '[Presentations] Load Success';
export const LOAD_FAILURE = '[Presentations] Load Failure';
export const ADD = '[Presentations] Add';
export const ADD_SUCCESS = '[Presentations] Add Success';
export const ADD_FAILURE = '[Presentations] Add Failure';
export const COPY = '[Presentations] Copy';
export const COPY_SUCCESS = '[Presentations] Copy Success';
export const COPY_FAILURE = '[Presentations] Copy Failure';
export const UPDATE = '[Presentations] Update';
export const UPDATE_SUCCESS = '[Presentations] Update Success';
export const UPDATE_FAILURE = '[Presentations] Update Failure';
export const DELETE = '[Presentations] Delete';
export const DELETE_SUCCESS = '[Presentations] Delete Success';
export const DELETE_FAILURE = '[Presentations] Delete Failure';

export type Actions =
| Load
| LoadSuccess
| LoadFailure
| Add
| AddSuccess
| AddFailure
| Copy
| CopySuccess
| CopyFailure
| Update
| UpdateSuccess
| UpdateFailure
| Delete
| DeleteSuccess
| DeleteFailure
;

export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: { pageIndex: number, pageSize: number, search?: any}) {}
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: {
    presentations: Presentation[],
    slides: Slide[],
    boxes: Box[]
  }) { }
}

export class LoadFailure implements Action {
  readonly type = LOAD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Add implements Action {
  readonly type = ADD;
  constructor(public payload: Presentation) {}
}

export class AddSuccess implements Action {
  readonly type = ADD_SUCCESS;
  constructor(public payload: Presentation) {}
}

export class AddFailure implements Action {
  readonly type = ADD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload: { id: string, changes: any }) {}
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload: { id: string, changes: any }) {}
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
  constructor(public payload: {
    presentationId: string,
    slideIds: string[],
    boxIds: string[]
  }) { }
}

export class DeleteFailure implements Action {
  readonly type = DELETE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Copy implements Action {
  readonly type = COPY;
  constructor(public payload: string) {}
}

export class CopySuccess implements Action {
  readonly type = COPY_SUCCESS;
  constructor(public payload: {
    presentation: Presentation,
    slides: Slide[],
    boxes: Box[]
  }) {}
}

export class CopyFailure implements Action {
  readonly type = COPY_FAILURE;
  constructor(public payload: any) {}
}
