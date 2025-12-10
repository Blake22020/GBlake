import React from 'react';
import MainHeader from './components/headers/mainHeader'
import LoginHeader from "./components/headers/loginHeader";
import MainNavbar from './components/navbars/mainNavbar'

function App() {
  return (
    <div className="App">
        <LoginHeader />
        <MainNavbar />
    </div>
  );
}

export default App;
