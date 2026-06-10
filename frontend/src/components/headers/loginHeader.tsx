import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import { ReactComponent as Logo } from "../../assets/logo.svg";

type Props = {
    openFunction: () => void;
    open: boolean;
};

function LoginHeader({ openFunction, open }: Props) {
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
                className={`items-center gap-5 ${isSearchOpen ? "hidden" : "flex"}`}
            >
                <div
                    className="flex cursor-pointer flex-col gap-[5px] xs:hidden"
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
                <div
                    className="flex cursor-pointer items-center gap-[4px]"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <Logo className="h-[26px] w-[26px] shrink-0 sm:h-[32px] sm:w-[32px] md:h-[38px] md:w-[38px]" />
                    <h1 className="text-[1.4rem] font-semibold text-primary-600 sm:text-[1.7rem] md:text-[2rem]">
                        GBlake
                    </h1>
                </div>
            </div>

            <div
                className={`items-center gap-1 rounded-full bg-white/20 px-[5px] py-[5px] transition-all duration-200 md:flex ${isSearchOpen ? "flex w-[95%]" : "hidden w-[300px] md:w-[500px]"}`}
            >
                <SearchIcon className="fill-white" width="24" height="24" />
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
                <SearchIcon
                    onClick={() => setIsSearchOpen(true)}
                    className="cursor-pointer fill-white md:hidden"
                    width="24"
                    height="24"
                />
                <button
                    onClick={() => {
                        navigate("/user/" + localStorage.getItem("id"));
                    }}
                    className="block h-8 w-8 overflow-hidden rounded-full cursor-pointer"
                >
                    {localStorage.getItem("avatar") ? (
                        <img
                            className="h-full w-full object-cover"
                            src={
                                process.env.REACT_APP_API_URL +
                                "" +
                                localStorage.getItem("avatar")
                            }
                            alt=""
                        />
                    ) : (
                        <img
                            className="h-full w-full object-cover"
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            alt=""
                        />
                    )}
                </button>
            </div>

            {isSearchOpen && (
                <CloseIcon
                    onClick={() => setIsSearchOpen(false)}
                    className="cursor-pointer fill-white"
                    width="24"
                    height="24"
                />
            )}
        </header>
    );
}

export default LoginHeader;
