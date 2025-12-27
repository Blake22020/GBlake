import React from 'react';
import LoginNavbarHeader from "./layouts/loginNavbarHeader";
import MainNavbar from "./components/navbars/mainNavbar";
import MainNavbarHeader from "./layouts/mainNavbarHeader";
import MainPage from './pages/main'
import Register from './pages/register'
import Register2 from './pages/register2';
import Login from './pages/login';
import { Routes, Route } from "react-router-dom";
import CreatePost from './pages/сreatePost';

function App() {
	return (
		<Routes>
			<Route path="/" element={<MainPage />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/register2" element={<Register2 />} />
			<Route path="/create" element={<CreatePost />} />
		</Routes>
	);
}

export default App;
