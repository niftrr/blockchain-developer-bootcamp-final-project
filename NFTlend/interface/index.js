// import React from "react";
// import ReactDOM from "react-dom";
// import "./globals.css"
// import "./styleguide.css"
// import App from "./App";

// ReactDOM.render(<App />, document.getElementById("app"));

import React from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import "./globals.css"
import "./styleguide.css"
import App from './App';

const renderMethod = module.hot ? render : hydrate;

export const Client = () => {
  return (
    <BrowserRouter>
          <App />

    </BrowserRouter>
  );
};

renderMethod(<Client />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}