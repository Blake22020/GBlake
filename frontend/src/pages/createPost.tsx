import { useState, FormEvent, useEffect } from "react";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import { setMeta } from "../services/description";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";

function CreatePost() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        document.title = "Создание поста | GBlake";
        setMeta("description", "Создание поста в GBlake");
    }, []);

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!title.trim()) {
            toast.error("Заголовок не может быть пустым");
            return false;
        }

        if (title.trim().length < 3) {
            toast.error("Заголовок должен содержать минимум 3 символа");
            return false;
        }

        if (!text.trim()) {
            toast.error("Текст поста не может быть пустым");
            return false;
        }

        if (text.trim().length < 10) {
            toast.error("Текст поста должен содержать минимум 10 символов");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Вы не авторизованы. Пожалуйста, войдите в систему.");
            return;
        }

        setIsLoading(true);

        try {
            await createPost(title, text, token);
            navigate("/");
        } catch (error: any) {
            console.error("Error creating post:", error);

            if (error.response) {
                const status = error.response.status;
                const message =
                    error.response.data?.message ||
                    "Произошла ошибка при создании поста";

                if (status === 401) {
                    toast.error(
                        "Ваша сессия истекла. Пожалуйста, войдите снова.",
                    );
                } else if (status === 400) {
                    toast.error(message);
                } else if (status >= 500) {
                    toast.error(
                        "Сервер временно недоступен. Попробуйте позже.",
                    );
                } else {
                    toast.error(message);
                }
            } else if (error.request) {
                toast.error(
                    "Не удалось подключиться к серверу. Проверьте интернет-соединение.",
                );
            } else {
                toast.error(
                    "Произошла непредвиденная ошибка. Попробуйте снова.",
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="createPost">
            <LoginNavbarHeader />
            <div className="flex flex-col pt-[50px] nav:pt-[65px] pb-[110px] pl-[0px] xs:pl-[200px] w-full min-h-screen object-cover createPostMain">
                <div className="relative flex flex-col flex-1 justify-center items-center gap-[30px] xs:gap-[50px] createPostCard">
                    <button
                        className="absolute top-[15px] right-[15px] xs:top-[20px] xs:right-[20px] md:top-[30px] md:right-[30px] nav:top-[50px] nav:right-[50px] border-none bg-transparent w-[30px] h-[30px] xs:w-[35px] xs:h-[35px] md:w-[40px] md:h-[40px] nav:w-[50px] nav:h-[50px] cursor-pointer closeButton flex items-center justify-center p-0"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <svg
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="50"
                            height="50"
                        >
                            <g data-name="Layer 2">
                                <g data-name="close">
                                    <rect
                                        width="50"
                                        height="50"
                                        transform="rotate(180 12 12)"
                                        opacity="0"
                                    />
                                    Z
                                    <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
                                </g>
                            </g>
                        </svg>
                    </button>
                    <h1 className="text-[1.3rem] min-[480px]:text-[1.5rem] xs:text-[1.8rem] md:text-[2rem] nav:text-[2.5rem] lg:text-[3rem] text-primary-600">
                        Создание поста
                    </h1>
                    <form
                        className="flex flex-col gap-[25px] xs:gap-[30px] nav:gap-[40px] lg:gap-[50px] w-[95%] min-[480px]:w-[90%] md:w-[70%] nav:w-[60%] xl:w-[40%] max-w-[600px] createPostForm"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-[20px] xs:gap-[25px] nav:gap-[30px] lg:gap-[40px] createPostInputs">
                            <Input
                                placeholder="Заголовок"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={100}
                                className="px-[20px] min-[480px]:px-[25px] xs:px-[30px] nav:px-[40px] py-[10px] min-[480px]:py-[12px] xs:py-[15px] nav:py-[20px] text-[1.3rem] min-[480px]:text-[1.5rem] xs:text-[1.8rem] md:text-[2rem] nav:text-[2.5rem] lg:text-[3rem]"
                            />
                            <Textarea
                                placeholder="Текст"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                maxLength={5000}
                                rows={6}
                                className="px-[20px] min-[480px]:px-[25px] xs:px-[30px] nav:px-[40px] py-[10px] min-[480px]:py-[12px] xs:py-[15px] nav:py-[20px] text-[1rem] nav:text-[1.2rem] lg:text-[1.5rem]"
                            />
                        </div>
                        <Button
                            type="submit"
                            onClick={() => {}}
                            className="px-[30px] md:px-[10px] py-[10px] min-[480px]:py-[12px] xs:py-[15px] nav:py-[20px] lg:py-[25px] text-[1rem] min-[480px]:text-[1.1rem] xs:text-[1.3rem] nav:text-[1.8rem] lg:text-[2rem]"
                        >
                            {isLoading ? "Создание поста..." : "Выложить пост"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
