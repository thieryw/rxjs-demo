import React, {memo, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { App } from "./App";
import { getStore } from "./store";
import type { Store } from "./store";
import { ThemeProvider } from "./theme";


const SplashScreenProvider = memo(() => {

  const [store, setStore] = useState<Store | undefined>(undefined);

  useEffect(() => {
    getStore().then(store => {
      setStore(store);
    })
  }, [])


  return store === undefined ? <h1>Loading...</h1> : <App {...store} />
})

ReactDOM.render(
  <ThemeProvider>
    <React.StrictMode>
      <SplashScreenProvider />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root')
);

