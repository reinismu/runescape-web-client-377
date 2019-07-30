import React from 'react';
import { hot } from 'react-hot-loader';
import Counter from './Counter';
import { Problem } from './Problem';
import { WebScape } from './WebScape';

const App = () => {
  return (
    <div>
      <WebScape />
    </div>
  );
};

export default hot(module)(App);