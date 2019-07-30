import React from 'react';
import { render } from 'react-dom';
import App from './App';

function renderApp() {
  render(<App />, document.getElementById("root"));
}

renderApp();

module.hot.accept();