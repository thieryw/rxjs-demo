/* eslint-disable react-hooks/exhaustive-deps */
import React, {memo, useState, useEffect, useReducer} from 'react';
import ReactDOM from 'react-dom';
import { useConstCallback } from "powerhooks";
import type { Store } from "./store";
import { getStore } from "./store";
import { concatMap, from } from "rxjs";


const App = memo((props: Store) => {

  const { tasks, newTask$, newTask } = props;

  const [textInput, setTextInput] = useState("");
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChange = useConstCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  });

  const handleSubmit = useConstCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newTask$.next(textInput);
    setTextInput("");
  });


  useEffect(() => {
    const subscription = newTask$.pipe(
      concatMap(description => from(newTask(description))),
    ).subscribe(() => {
      forceUpdate();
    });

    return () => subscription.unsubscribe();

  }, []);

  return <div>
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} value={textInput} />
    </form>

    <div>
      {
        tasks.map(
          ({ description, id }) => 
            <div key={id}><p>{description}</p></div>
        ).reverse()
      }
    </div>


  </div>

})

const AppWrapper = memo(() => {
  const [store, setStore] = useState<Store | undefined>(undefined);

  useEffect(() => {
    getStore().then(value => {
      setStore(value);
    })
  }, [])

  return <>
    {
      store === undefined ? <h1>Loading...</h1> : <App {...store} />
    }
  </>
})

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
  document.getElementById('root')
);

