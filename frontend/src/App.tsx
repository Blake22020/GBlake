import React from 'react';
import MainHeader from './components/headers/mainHeader'
import LoginHeader from "./components/headers/loginHeader";
import MainNavbar from './components/navbars/mainNavbar'
import LoginNavbar from './components/navbars/loginNavbar'
import LoginNavbarHeader from "./layouts/loginNavbarHeader";
import MainNavbarHeader from "./layouts/mainNavbarHeader";

function App() {
  return (
    <div className="App">
        <LoginNavbarHeader></LoginNavbarHeader>
    </div>
  );
}

export default App;
