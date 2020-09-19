React Recast
=========================

A general-purpose reducer for React.


## Installation

React Recast requires **React 16.8.0 or later.**

To use React Recast with your React app, install it as a dependency:

```bash
# If you use npm:
npm install react-recast

# Or if you use Yarn:
yarn add react-recast
```

Note that both `react` and `lodash-es` are peer dependencies of this plugin that need to be installed separately.


## Example

Create a `userStore.js` store file and import the plugin:

```jsx
import { noop } from 'lodash-es';
import { mapReducer } from 'react-recast';
import React, { createContext, useReducer, useContext } from 'react';

const initialState = null;

const StateContext = createContext(initialState);
const DispatchContext = createContext(noop);

export function useUserState() {
  return useContext(StateContext);
}

export function useUserDispatch() {
  return useContext(DispatchContext);
}

export function UserStoreProvider({ children }) {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
```

Instead of mutating the state directly, you specify the mutations you want to happen with plain objects called actions. Wrap the actions on the hook, similar to `mapStateToProps` function of the Redux.

```js
function useUserActions() {
  const userDispatch = useUserDispatch();

  return {
    setUser: (user) => userDispatch({
      type: 'set',
      payload: user
    }),

    updateUser: (partialUser) => userDispatch({
      type: 'merge',
      payload: partialUser
    })
  };
}
```

You can call `setUser` and `updateUser` of `useUserActions` function from your component.

```jsx
function ExampleComponent() {
  const user = useUserState();
  const { setUser, updateUser } = useUserActions();

  return (
    <>
      <p>{user ? `Welcome! ID: ${user.id}, Name: ${user.name}` : 'You are not logged in.'}</p>
      <button onClick={() => setUser({id: 1, name: 'Sanonz'})}>login</button>
      <button onClick={() => updateUser({name: 'yourNewName'})}>update</button>
      <button onClick={() => setUser(null)}>logout</button>
    </>
  );
}
```

This is an interactive version of the code that you can play with online.

[Todo List Example](https://codesandbox.io/embed/todo-list-react-recast-7ktmc?fontsize=14&hidenavigation=1&theme=dark)

## Documentation

### `mapReducer`

 Action                                            | Description
---------------------------------------------------|-------------------------------------
`{type: 'set', payload: x}`                        | Sets the `x` of the object.
`{type: 'merge', payload: x}`                      | Deeply mix the properties of `x` into the object.

---

### `listReducer`

It's extends `mapReducer`. See the base `mapReducer` reducer for common actions.

 Action                                            | Description
---------------------------------------------------|-------------------------------------
`{type: 'add', payload: x}`                        | Appends the `x` to the end of this list.
`{type: 'addAll', payload: [x]}`                   | Appends all of the elements in the `x` collection to the end of this list.
`{type: 'insert', index: idx, payload: x}`         | Inserts the `x` at the `idx` in this list.
`{type: 'insertAll', index: idx, payload: [x]}`    | Inserts all of the `[x]` at the `idx` in this list.
`{type: 'replace', payload: {oldValue, newValue}}` | Replaces each element of this list with the result of applying the operator to that element.
`{type: 'shift'}`                                  | Removes the first element from the list.
`{type: 'pop'}`                                    | Removes the last element from the list.
`{type: 'remove', payload: x}`                     | Removes the first occurrence of the `x` from this list.
`{type: 'removeAll', payload: [x]}`                | Removes from this list all of its elements that are contained in the `[x]`.
`{type: 'removeAt', index: idx}`                   | Removes the object at `idx` from this list.

---

## Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/sanonz/react-recast/issues).

## License

[MIT](LICENSE.md)