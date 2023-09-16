import './styles.css';
import Graphs from './components/Graphs';
import React from 'react';
import Fetch from './components/Fetch'
export const App = () => {
  return (
    <div>
      <Graphs />
      <p>{process.env.NODE_ENV}</p>
      <p>{process.env.name}</p>
    </div>
  );
};
