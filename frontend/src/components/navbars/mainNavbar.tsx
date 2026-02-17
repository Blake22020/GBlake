import { useNavigate } from "react-router-dom";

function MainNavbar({ open }: any) {
    const navigate = useNavigate();

    return (
        <div
            className={
                open
                    ? "mainNavbar open fixed z-99 p-[20px] pt-[110px] bg-bg-elevated flex flex-col top-0 left-0 bottom-0 w-[200px] border-r-2 border-solid border-r-white/25 gap-[28px] translate-x-0 max-[900px]:min-[600px]:w-[200px] max-[900px]:p-[10px] max-[900px]:min-[600px]:pt-[110px] transition-transform duration-300 ease-out max-[600px]:pt-[90px] max-[600px]:w-[150px]"
                    : "mainNavbar open fixed z-99 p-[20px] pt-[110px] bg-bg-elevated flex flex-col top-0 left-0 bottom-0 w-[200px] border-r-2 border-solid border-r-white/25 gap-[28px] translate-x-[-100%] max-[900px]:min-[600px]:w-[200px]  max-[900px]:min-[600px]:p-[10px] max-[900px]:min-[600px]:pt-[110px] transition-transform duration-300 ease-out"
            }
        >
            <button
                className="flex justify-center items-center gap-[10px] bg-primary-600 hover:bg-primary-500 hover:shadow-[0_0_100px_rgba(110,91,255,0.25)] p-[10px] border-0 rounded-[25px] w-full h-fit font-[500] text-[1.3rem] text-white max-[900px]:min-[600px]:text-[1rem] transition-all hover:translate-y-[-5px] duration-200 cursor-pointer createButton"
                onClick={() => {
                    navigate("/login");
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="max-[600px]:hidden fill-white w-[24px] h-[24px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g clip-path="url(#clip0_7_6)">
                        <path
                            d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z"
                            fill="white"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_7_6">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                Создать
            </button>
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
                <a className="items-center bg-bg-contactButton opacity-50 py-[10px] rounded-[25px] w-full text-[1.3rem] text-white max-[900px]:min-[600px]:text-[1rem] text-center no-underline duration-200 cursor-not-allowed contactButton txt-white">
                    Скоро
                </a>
            </div>
        </div>
    );
}

export default MainNavbar;
