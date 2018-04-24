import { Action } from '@ngrx/store';
import { Box } from '@labdat/data-models';

export const LOAD = '[Boxes] Load';
export const LOAD_SUCCESS = '[Boxes] Load Success';
export const LOAD_FAILURE = '[Boxes] Load Failure';
export const ADD = '[Boxes] Add';
export const ADD_SUCCESS = '[Boxes] Add Success';
export const ADD_FAILURE = '[Boxes] Add Failure';
export const UPDATE = '[Box] Update';
export const UPDATE_SUCCESS = '[Box] Update Success';
export const UPDATE_FAILURE = '[Box] Update Failure';
export const UPDATE_ALL = '[Boxes] Update';
export const UPDATE_ALL_SUCCESS = '[Boxes] Update Success';
export const UPDATE_ALL_FAILURE = '[Boxes] Update Failure';
export const DELETE = '[Boxes] Delete';
export const DELETE_SUCCESS = '[Boxes] Delete Success';
export const DELETE_FAILURE = '[Boxes] Delete Failure';
export const DELETE_IMAGE = '[Boxes] Delete Image';
export const DELETE_IMAGE_SUCCESS = '[Boxes] Delete Image Success';
export const DELETE_IMAGE_FAILURE = '[Boxes] Delete Image Failure';
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
  | UpdateAll
  | UpdateAllSuccess
  | UpdateAllFailure
  | Delete
  | DeleteSuccess
  | DeleteFailure
  | DeleteImage
  | DeleteImageSuccess
  | DeleteImageFailure;

export class Load implements Action {
  readonly type = LOAD;
  constructor(public payload: { slideId: string }) {}
}
export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;
  constructor(public payload: { boxes: Box[] }) {}
}

export class LoadFailure implements Action {
  readonly type = LOAD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Add implements Action {
  readonly type = ADD;
  constructor(public payload: { box: Box }) {}
}

export class AddSuccess implements Action {
  readonly type = ADD_SUCCESS;
  constructor(public payload: {box: Box }) {}
}

export class AddFailure implements Action {
  readonly type = ADD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload: { box: { id: number; changes: any } }) {}
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload: { box: { id: number; changes: any } }) {}
}

export class UpdateFailure implements Action {
  readonly type = UPDATE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class UpdateAll implements Action {
  readonly type = UPDATE_ALL;
  constructor(public payload: {boxes :  any }) {}
}

export class UpdateAllSuccess implements Action {
  readonly type = UPDATE_ALL_SUCCESS;
  constructor(public payload: { boxes: any }) {}
}

export class UpdateAllFailure implements Action {
  readonly type = UPDATE_ALL_FAILURE;
  constructor(public payload: { error: any }) {}
}
export class Delete implements Action {
  readonly type = DELETE;
  constructor(public payload: { boxId: string }) {}
}

export class DeleteSuccess implements Action {
  readonly type = DELETE_SUCCESS;
  constructor(public payload: { boxId: string }) {}
}

export class DeleteFailure implements Action {
  readonly type = DELETE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class DeleteImage implements Action {
  readonly type = DELETE_IMAGE;
  constructor(public payload: { imageId: string }) {}
}

export class DeleteImageSuccess implements Action {
  readonly type = DELETE_IMAGE_SUCCESS;
  constructor(public payload: { imageId: string }) {}
}

export class DeleteImageFailure implements Action {
  readonly type = DELETE_IMAGE_FAILURE;
  constructor(public payload: { error: any }) {}
}
