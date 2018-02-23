import { Action } from '@ngrx/store';
import { Presentation, Box, Slide } from '@labdat/data-models';

export const SEARCH = '[Presentations] Search';
export const SEARCH_SUCCESS = '[Presentations] Search Success';
export const SEARCH_FAILURE = '[Presentations] Search Failure';
export const GET_ONE = '[Presentations] Get One';
export const GET_ONE_SUCCESS = '[Presentations] Get One Success';
export const GET_ONE_FAILURE = '[Presentations] Get One Failure';
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
  | Search
  | SearchSuccess
  | SearchFailure
  | GetOne
  | GetOneSuccess
  | GetOneFailure
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
  | DeleteFailure;

export class Search implements Action {
  readonly type = SEARCH;
  constructor(public payload: { pageIndex: number; pageSize: number; search?: any }) {}
}

export class SearchSuccess implements Action {
  readonly type = SEARCH_SUCCESS;
  constructor(public payload: { presentations: Presentation[]; presentationCount: any }) {}
}

export class SearchFailure implements Action {
  readonly type = SEARCH_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class GetOne implements Action {
  readonly type = GET_ONE;
  constructor(public payload: { presentationId: string }) {}
}

export class GetOneSuccess implements Action {
  readonly type = GET_ONE_SUCCESS;
  constructor(public payload: { presentation: Presentation }) {}
}

export class GetOneFailure implements Action {
  readonly type = GET_ONE_FAILURE;
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
  constructor(public payload: { id: string; changes: any }) {}
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload: { id: string; changes: any }) {}
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
  constructor(
    public payload: {
      presentationId: string;
      slideIds: string[];
      boxIds: string[];
    }
  ) {}
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
  constructor(public payload: Presentation) {}
}

export class CopyFailure implements Action {
  readonly type = COPY_FAILURE;
  constructor(public payload: any) {}
}
