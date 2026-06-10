import { useNavigate } from "react-router-dom";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as PeopleIcon } from "../../assets/people.svg";

function LoginNavbar({ open }: any) {
    const navigate = useNavigate();

    return (
        <div
            className={
                open
                    ? "loginNavbar open fixed z-99 p-[20px] pt-[110px] bg-bg-elevated flex flex-col top-0 left-0 bottom-0 w-[200px] border-r-2 border-solid border-r-white/25 gap-[28px] translate-x-0 max-[900px]:min-[600px]:w-[200px] max-[900px]:p-[10px] max-[900px]:min-[600px]:pt-[110px] transition-transform duration-300 ease-out max-[600px]:pt-[90px] max-[600px]:w-[150px]"
                    : "loginNavbar open fixed z-99 p-[20px] pt-[110px] bg-bg-elevated flex flex-col top-0 left-0 bottom-0 w-[200px] border-r-2 border-solid border-r-white/25 gap-[28px] translate-x-[-100%] max-[900px]:min-[600px]:w-[200px]  max-[900px]:min-[600px]:p-[10px] max-[900px]:min-[600px]:pt-[110px] transition-transform duration-300 ease-out"
            }
        >
            <button
                className="flex justify-center items-center gap-[10px] bg-primary-600 hover:bg-primary-500 hover:shadow-[0_0_100px_rgba(110,91,255,0.25)] p-[10px] border-0 rounded-[25px] w-full h-fit font-[500] text-[1.3rem] text-white max-[900px]:min-[600px]:text-[1rem] transition-all hover:translate-y-[-5px] duration-200 cursor-pointer createButton"
                onClick={() => {
                    navigate("/create");
                }}
            >
                <PlusIcon
                    width="24"
                    height="24"
                    className="max-[600px]:hidden fill-white w-[24px] h-[24px]"
                />
                Создать
            </button>
            <div className="flex flex-col gap-[16px] buttons">
                <button
                    className="flex justify-center items-center gap-[8px] bg-bg-contactButton hover:bg-bg-contactButtonHover px-0 py-[10px] border-0 rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:text-[1rem] text-center no-underline hover:translate-y-[-5px] duration-200 cursor-pointer"
                    onClick={() => {
                        navigate("/followings");
                    }}
                >
                    <PeopleIcon
                        width="24"
                        height="24"
                        className="max-[600px]:hidden fill-white w-[24px] h-[24px]"
                    />
                    Подписки
                </button>
                <button
                    onClick={() => {
                        navigate("/likes");
                    }}
                    className="flex justify-center items-center gap-[8px] bg-bg-contactButton hover:bg-bg-contactButtonHover px-0 py-[10px] border-0 rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:text-[1rem] text-center no-underline hover:translate-y-[-5px] duration-200 cursor-pointer"
                >
                    Лайки
                </button>
                <button
                    onClick={() => {
                        navigate("/admin");
                    }}
                    className="flex justify-center items-center gap-[8px] bg-bg-contactButton hover:bg-bg-contactButtonHover px-0 py-[10px] border-0 rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:text-[1rem] text-center no-underline hover:translate-y-[-5px] duration-200 cursor-pointer"
                >
                    Админ панель
                </button>
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                    className="flex justify-center items-center gap-[8px] bg-red-600/50 hover:bg-red-600/80 px-0 py-[10px] border-0 rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:text-[1rem] text-center no-underline hover:translate-y-[-5px] duration-200 cursor-pointer"
                >
                    Выйти / Очистить
                </button>
            </div>
            <h1 className="text-[1.6rem] text-white">Контакты</h1>
            <div className="flex flex-col gap-[28px] p-0 w-full h-fit font-[300] contacts">
                <a
                    className="items-center bg-bg-contactButton hover:bg-bg-contactButtonHover py-[10px] rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:min-[600px]:text-[1rem] text-center no-underline hover:translate-y-[-5px] duration-200 cursor-pointer contactButton txt-white"
                    href="https://t.me/blake22020"
                >
                    Telegram
                </a>
                <a
                    className="items-center bg-bg-contactButton hover:bg-bg-contactButtonHover py-[10px] rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:min-[600px]:text-[1rem] text-center no-underline hover:translate-y-[-5px] duration-200 cursor-pointer contactButton txt-white"
                    href="mailto:mr.blake.hero@mail.ru"
                >
                    Mail
                </a>
                <a
                    className="items-center bg-bg-contactButton hover:bg-bg-contactButtonHover py-[10px] rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:min-[600px]:text-[1rem] text-center no-underline hover:translate-y-[-5px] duration-200 cursor-pointer contactButton txt-white"
                    href="https://github.com/blake22020"
                >
                    Github
                </a>
                <a
                    className="items-center bg-bg-contactButton opacity-50 py-[10px] rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:min-[600px]:text-[1rem] text-center no-underline duration-200 cursor-not-allowed contactButton txt-white"
                    href="https://gblake.ru"
                >
                    Скоро
                </a>
            </div>
        </div>
    );
}

export default LoginNavbar;
