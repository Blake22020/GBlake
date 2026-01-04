import MainPage from './pages/main'
import Register from './pages/register'
import Register2 from './pages/register2';
import Login from './pages/login';
import { Routes, Route } from "react-router-dom";
import CreatePost from './pages/сreatePost';
import User from './pages/User';
import NotFound from './pages/NotFound';
import Search from './pages/Search';

function App() {
	return (
		<Routes>
			<Route path="/" element={<MainPage />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/register2" element={<Register2 />} />
			<Route path="/create" element={<CreatePost />} />
			<Route path="/user/:id" element={<User />} />
			<Route path="/search" element={<Search />} />


			<Route path="*" element={<NotFound />} />

		</Routes>
	);
}

export default App;
