import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';


const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.render(
  app,
  document.getElementById('root')
);
