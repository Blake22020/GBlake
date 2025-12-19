import React from 'react';
import LoginNavbarHeader from "./layouts/loginNavbarHeader";
import MainNavbar from "./components/navbars/mainNavbar";
import MainNavbarHeader from "./layouts/mainNavbarHeader";
import MainPage from './pages/main'
import Register from './pages/register'
import Register2 from './pages/register2';
import Snowfall from 'react-snowfall'

function App() {
  return (
    <div className="App">
		<Snowfall
			color="#fff"
			style={{height: '100%'}}
		/>   
		<MainPage />
    </div>
  );
}

export default App;
