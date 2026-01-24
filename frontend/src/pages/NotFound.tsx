import { useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import '../styles/pages/notFound.css'
import { setMeta } from "../services/description";
import { useEffect } from "react";

function NotFound() {
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "404 | GBlake";
		setMeta("description", "Страница не найдена");
	}, []);


	return (
		<div className="notFoundPage">
			{localStorage.getItem('token') ? <LoginNavbarHeader /> : <MainNavbarHeader />}
			<div className="notFoundWindow">
				<div className="notFoundText">
					<h1>404</h1>
					<p>Такой страницы нет</p>
				</div>
				<button className="toMainButton" onClick={() => { navigate('/') }}>Вернуться на главную</button>
			</div>
		</div>
	)
}

export default NotFound;