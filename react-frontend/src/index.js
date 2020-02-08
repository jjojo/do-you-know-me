import React from 'react';
import { render } from "react-dom";
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import SocketProvider from './sockets/socketProvider';



const renderApp = App => {
  render(
    <SocketProvider>
      <App/>
    </SocketProvider>,
    document.getElementById("root")
  );
}

renderApp(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
