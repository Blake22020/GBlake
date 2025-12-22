import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'
import Snowfall from 'react-snowfall'
import { BrowserRouter } from 'react-router-dom'; 


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
	<BrowserRouter>
		<Snowfall
		color="#ffffff91"
		style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100dvw',
			height: '100dvh',
			pointerEvents: 'none',
			zIndex: 1000,
		}}
		speed={[0.5, 1]}
		/>
		<App />
	</BrowserRouter>
);
 