import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Props = {
    openFunction: () => void;
    open: boolean;
};

function MainHeader({ openFunction, open }: Props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

    const handleSearch = () => {
        if (inputValue.trim()) {
            navigate(`/search?q=${inputValue}`);
        }
    };

    useEffect(() => {
        setInputValue(searchParams.get("q") || "");
    }, [searchParams]);

    return (
        <header className="top-0 right-0 left-0 z-[99] fixed flex justify-between items-center max-[600px]:gap-[10px] bg-bg-elevated px-[30px] max-[600px]:px-[15px] max-[900px]:min-[600px]:px-[20px] py-[10px] border-white/25 border-b-2 font-['Montserrat'] text-white main-header">
            <div className="flex items-center gap-[20px] cursor-pointer title">
                <div
                    className="hidden max-[600px]:flex flex-col gap-[5px] h-full burger"
                    onClick={() => openFunction()}
                >
                    <div
                        className={`bg-white h-[5px] w-[30px] rounded-[10px] transition-all duration-200 ease-in-out ${open ? "translate-y-[10px] rotate-[135deg]" : ""}`}
                    ></div>
                    <div
                        className={`bg-white h-[5px] w-[30px] rounded-[10px] transition-all duration-200 ease-in-out ${open ? "opacity-0" : ""}`}
                    ></div>
                    <div
                        className={`bg-white h-[5px] w-[30px] rounded-[10px] transition-all duration-200 ease-in-out ${open ? "-translate-y-[10px] rotate-45" : ""}`}
                    ></div>
                </div>
                <h1 className="text-[2rem] max-[600px]:text-[1.4rem] max-[900px]:min-[600px]:text-[1.7rem]">
                    GBlake
                </h1>
            </div>
            <div className="max-[600px]:hidden flex items-center gap-[4px] bg-white/20 autofill:shadow-[inset_0_0_0_1000px_#0b0c10] focus:shadow-none autofill:[-webkit-text-fill-color:white] p-[5px] rounded-[25px] focus:outline-none focus:ring-0 w-[500px] max-[900px]:min-[600px]:w-[300px] h-fit search-bar">
                <svg
                    className="fill-white search-icon"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <g data-name="Layer 2">
                        <g data-name="search">
                            <rect width="24" height="24" opacity="0" />
                            <path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" />
                        </g>
                    </g>
                </svg>
                <input
                    className="bg-transparent border-0 outline-none w-full max-[600px]:w-[160px] max-[900px]:min-[600px]:w-250px h-fit text-[1rem] text-white max-[600px]:text-[0.75rem] max-[900px]:min-600px[]:text-[0.9rem] placeholder:text-white/50 search-input"
                    type="text"
                    placeholder="Поиск в GBlake"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
            </div>
            <div className="flex items-center gap-[14px] mobileIcon">
                <svg
                    onClick={() => {
                        const title = document.querySelector(
                            ".main-header .title",
                        ) as HTMLElement;
                        const mobileIcon = document.querySelector(
                            ".main-header .mobileIcon",
                        ) as HTMLElement;
                        const closeIcon = document.querySelector(
                            ".main-header .closeIcon",
                        ) as HTMLElement;
                        const searchBar = document.querySelector(
                            ".main-header .search-bar",
                        ) as HTMLElement;

                        searchBar.style.display = "flex";
                        searchBar.style.width = "95%";
                        title.style.display = "none";
                        mobileIcon.style.display = "none";
                        closeIcon.style.display = "block";
                    }}
                    className="hidden max-[600px]:block cursor-pointer search-icon"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <g data-name="Layer 2">
                        <g data-name="search">
                            <rect width="24" height="24" opacity="0" />
                            <path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" />
                        </g>
                    </g>
                </svg>
                <button
                    className="bg-primary-600 hover:bg-primary-500 px-[35px] max-[600px]:px-[20px] max-[900px]:min-[600px]:px-[25px] py-[5px] border-0 rounded-[35px] text-[1rem] text-white max-[600px]:text-[0.8rem] transition-all duration-200 ease-out cursor-pointer loginButton"
                    type="button"
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    Войти
                </button>
            </div>
            <svg
                onClick={() => {
                    const title = document.querySelector(
                        ".main-header .title",
                    ) as HTMLElement;
                    const mobileIcon = document.querySelector(
                        ".main-header .mobileIcon",
                    ) as HTMLElement;
                    const closeIcon = document.querySelector(
                        ".main-header .closeIcon",
                    ) as HTMLElement;
                    const searchBar = document.querySelector(
                        ".main-header .search-bar",
                    ) as HTMLElement;

                    searchBar.style.display = "none";
                    title.style.display = "flex";
                    searchBar.style.width = "300px";
                    mobileIcon.style.display = "flex";
                    closeIcon.style.display = "none";
                }}
                className="hidden cursor-pointer closeIcon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <g data-name="Layer 2">
                    <g data-name="close">
                        <rect
                            width="24"
                            height="24"
                            transform="rotate(180 12 12)"
                            opacity="0"
                        />
                        <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
                    </g>
                </g>
            </svg>
        </header>
    );
}

export default MainHeader;
