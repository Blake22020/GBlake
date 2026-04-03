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
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearch = () => {
        if (inputValue.trim()) {
            navigate(`/search?q=${inputValue}`);
        }
    };

    useEffect(() => {
        setInputValue(searchParams.get("q") || "");
    }, [searchParams]);

    return (
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between border-b-2 border-white/20 bg-bg-elevated px-4 py-2.5 text-white z-[99] sm:px-5 md:px-[30px]">
            <div
                className={`items-center gap-[5px] ${isSearchOpen ? "hidden" : "flex"}`}
            >
                <div
                    className="flex cursor-pointer flex-col gap-[5px] sm:hidden"
                    onClick={openFunction}
                >
                    <div
                        className={`h-[5px] w-[30px] rounded-full bg-white transition-transform duration-200 ${open ? "translate-y-[10px] rotate-[135deg]" : ""}`}
                    ></div>
                    <div
                        className={`h-[5px] w-[30px] rounded-full bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
                    ></div>
                    <div
                        className={`h-[5px] w-[30px] rounded-full bg-white transition-transform duration-200 ${open ? "-translate-y-[10px] -rotate-[135deg]" : ""}`}
                    ></div>
                </div>
                <h1 className="text-[1.4rem] font-medium sm:text-[1.7rem] md:text-[2rem]">
                    GBlake
                </h1>
            </div>

            <div
                className={`items-center gap-1 rounded-full bg-white/20 px-[5px] py-[5px] transition-all duration-200 md:flex ${isSearchOpen ? "flex w-[95%]" : "hidden w-[300px] md:w-[500px]"}`}
            >
                <svg
                    className="fill-white"
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
                    className="w-full border-none bg-transparent text-[0.85rem] text-white outline-none placeholder:text-white/50 focus:ring-0 sm:text-[0.9rem] md:text-base px-1"
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

            <div
                className={`items-center gap-3.5 ${isSearchOpen ? "hidden" : "flex"}`}
            >
                <svg
                    onClick={() => setIsSearchOpen(true)}
                    className="cursor-pointer fill-white md:hidden"
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
                    className="rounded-full bg-primary-600 px-[20px] py-[5px] text-[0.8rem] text-white transition-colors hover:bg-primary-500 sm:px-[25px] sm:text-base md:px-[35px]"
                    type="button"
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    Войти
                </button>
            </div>

            {isSearchOpen && (
                <svg
                    onClick={() => setIsSearchOpen(false)}
                    className="cursor-pointer fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
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
            )}
        </header>
    );
}

export default MainHeader;
