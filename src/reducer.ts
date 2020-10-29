import { isArray, mergeWith, pull, pullAll, pullAt } from 'lodash-es';

export type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends Array<infer I>
    ? Array<PartialDeep<I>>
    : PartialDeep<T[P]>;
};

export interface SetAction<State> {
  type: 'set';
  payload: State;
}

export interface MergeAction<State> {
  type: 'merge';
  payload: PartialDeep<State>;
}

export type MapActions<State> = SetAction<State> | MergeAction<State>;

export function mapReducer<State>(state: State, action: MapActions<State>) {
  switch(action.type) {
    case 'set':
      return action.payload;

    case 'merge':
      return mergeWith({}, state, action.payload, (objValue, srcValue) => {
        if (isArray(objValue)) {
          return srcValue;
        }
      });

    default:
      throw new Error();
  }
}

export interface ListState<Item> {
  list: Item[];
}

export interface AddAction<Item> {
  type: 'add';
  payload: Item;
}

export interface AddAllAction<Item> {
  type: 'addAll';
  payload: Item[];
}

export interface InsertAction<Item> {
  type: 'insert';
  index: number;
  payload: Item;
}

export interface InsertAllAction<Item> {
  type: 'insertAll';
  index: number;
  payload: Item[];
}

export interface ReplaceAction<Item> {
  type: 'replace';
  payload: {
    oldValue: Item;
    newValue: Item;
  };
}

export interface ShiftAction {
  type: 'shift';
}

export interface PopAction {
  type: 'pop';
}

export interface RemoveAction<Item> {
  type: 'remove';
  payload: Item;
}

export interface RemoveAllAction<Item> {
  type: 'removeAll';
  payload: Item[];
}

export interface RemoveAtAction {
  type: 'removeAt';
  index: number | number[];
}

export type ListActions<Item> = AddAction<Item> | AddAllAction<Item> |
                                InsertAction<Item> | InsertAllAction<Item> | ReplaceAction<Item> |
                                ShiftAction | PopAction | RemoveAction<Item> | RemoveAllAction<Item> | RemoveAtAction;

export type CombineActions<Item, State> = ListActions<Item> | MapActions<State>;

export function listReducer<Item, State extends ListState<Item>>(state: State, action: CombineActions<Item, State>) {
  switch(action.type) {
    case 'add':
      return {
        ...state,
        list: [...state.list, action.payload],
      };

    case 'addAll':
      return {
        ...state,
        list: state.list.concat(action.payload),
      };

    case 'insert': {
      const list = state.list.slice();
      list.splice(action.index, 0, action.payload);

      return {...state, list};
    }

    case 'insertAll': {
      const list = state.list.slice();
      list.splice(action.index, 0, ...action.payload);

      return {...state, list};
    }

    case 'replace': {
      let idx = state.list.indexOf(action.payload.oldValue);
      if (~idx) {
        const list = state.list.slice();
        list.splice(idx, 1, action.payload.newValue);

        return {...state, list};
      }

      return state;
    }

    case 'shift':
      return {
        ...state,
        list: state.list.slice(1, state.list.length),
      };

    case 'pop':
      return {
        ...state,
        list: state.list.slice(0, state.list.length - 1),
      };

    case 'remove':
      return {
        ...state,
        list: pull(state.list.slice(), action.payload),
      };

    case 'removeAll':
      return {
        ...state,
        list: pullAll(state.list.slice(), action.payload),
      };

    case 'removeAt':
      return {
        ...state,
        list: pullAt(state.list.slice(), action.index),
      };

    default:
      return mapReducer(state, action);
  }
}
