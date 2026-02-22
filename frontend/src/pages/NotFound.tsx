import { useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import "../styles/pages/notFound.css";
import { setMeta } from "../services/description";
import { useEffect } from "react";

function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "404 | GBlake";
        setMeta("description", "Страница не найдена");
    }, []);

    return (
        <div className="box-border flex pt-[65px] pl-[200px] w-[100dvh] h-[100dvh] object-cover overflow-y-hidden notFoundPage">
            {localStorage.getItem("token") ? (
                <LoginNavbarHeader />
            ) : (
                <MainNavbarHeader />
            )}
            <div className="flex flex-col flex-1 justify-center items-center gap-[100px] overflow-y-hidden notFoundWindow">
                <div className="flex flex-col gap-[35px] text-center notFoundText">
                    <h1 className="drop-shadow-[0_0_200px_rgba(110,91,255,0.45)] text-[20rem] text-primary-600">
                        404
                    </h1>
                    <p className="text-[3rem] text-500 text-white">
                        Такой страницы нет
                    </p>
                </div>
                <button
                    className="bg-primary-600 hover:shadow-[0_0_100px_rgba(110,91,255,0.25)] active:shadow-none px-[30px] py-[20px] border-0 rounded-[55px] text-[2rem] text-500 text-white active:scale-95 transition-all duration-300 ease-in-out cursor-pointer toMainButton"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Вернуться на главную
                </button>
            </div>
        </div>
    );
}

export default NotFound;
