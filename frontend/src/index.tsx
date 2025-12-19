import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'
import Snowfall from 'react-snowfall'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
		<Snowfall
			color="#fff"
			style={{height: '100%'}}
		/> 
		<App />
  </React.StrictMode>
);
