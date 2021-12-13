/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Store } from "./store";
import { ThemeProvider } from "./theme";
import { getStore } from "./store";
import { App } from "./App";




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
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

