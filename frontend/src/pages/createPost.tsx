import { useState, FormEvent, useEffect } from "react";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import "../styles/pages/createPost.css";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { createPost } from "../services/api";
import { setMeta } from "../services/description";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!title.trim()) {
            setModalTitle("Ошибка валидации");
            setModalText("Заголовок не может быть пустым");
            setIsModalOpen(true);
            return false;
        }

        if (title.trim().length < 3) {
            setModalTitle("Ошибка валидации");
            setModalText("Заголовок должен содержать минимум 3 символа");
            setIsModalOpen(true);
            return false;
        }

        if (!text.trim()) {
            setModalTitle("Ошибка валидации");
            setModalText("Текст поста не может быть пустым");
            setIsModalOpen(true);
            return false;
        }

        if (text.trim().length < 10) {
            setModalTitle("Ошибка валидации");
            setModalText("Текст поста должен содержать минимум 10 символов");
            setIsModalOpen(true);
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
            setModalTitle("Ошибка авторизации");
            setModalText("Вы не авторизованы. Пожалуйста, войдите в систему.");
            setIsModalOpen(true);
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
                    setModalTitle("Ошибка авторизации");
                    setModalText(
                        "Ваша сессия истекла. Пожалуйста, войдите снова.",
                    );
                } else if (status === 400) {
                    setModalTitle("Ошибка запроса");
                    setModalText(message);
                } else if (status >= 500) {
                    setModalTitle("Ошибка сервера");
                    setModalText(
                        "Сервер временно недоступен. Попробуйте позже.",
                    );
                } else {
                    setModalTitle("Ошибка");
                    setModalText(message);
                }
            } else if (error.request) {
                setModalTitle("Ошибка сети");
                setModalText(
                    "Не удалось подключиться к серверу. Проверьте интернет-соединение.",
                );
            } else {
                setModalTitle("Неизвестная ошибка");
                setModalText(
                    "Произошла непредвиденная ошибка. Попробуйте снова.",
                );
            }

            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="createPost">
            <LoginNavbarHeader />
            <div className="flex flex-col pt-[65px] max-[600px]:pt-[50px] max-[900px]:pt-[50px] pb-[110px] pl-[200px] max-[600px]:pl-0 max-[900px]:pl-[200px] w-screen min-h-screen object-cover createPostMain">
                <div className="relative flex flex-col flex-1 justify-center items-center gap-[50px] max-[600px]:gap-[30px] createPostCard">
                    <button
                        className="top-[50px] ma-[600px]:top-[20px] max-[360px]:top-[15px] max-[900px]:top-[30px] right-[50px] max-[360px]:right-[15px] max-[600px]:right-[20px] max-[900px]:right-[30px] absolute bg-none max-[768px]:px-[6px] max-[768px]:py-[18px] border-none w-[50px] max-[360px]:w-[30px] max-[600px]:w-[35px] max-[900px]:w-[40px] h-[50px] max-[360px]:h-[30px] max-[600px]:h-[35px] max-[900px]:h-[40px] max-[768px]:text-[1.5rem] cursor-pointer closeButton"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <svg
                            className="w-[50px] max-[360px]:w-[30px] max-[600px]:w-[35px] max-[900px]:w-[40px] h-[50px] max-[360px]:h-[30px] max-[600px]:h-[35px] max-[900px]:h-[40px]"
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
                    <h1 className="text-[3rem] text-primary-600 max-[360px]:text-[1.3rem] max-[480px]:text-[1.5rem] max-[600px]:text-[1.8rem] max-[768px]:text-[2rem] max-[900px]:text-[2.5rem]">
                        Создание поста
                    </h1>
                    <form
                        className="flex flex-col gap-[50px] max-[480px]:gap-[25px] max-[600px]:gap-[30px] max-[900px]:gap-[40px] w-[30%] max-[1200px]:w-[40%] max-[360px]:w-[95%] max-[900px]:w-[90%] max-w-[600px] createPostForm"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-[40px] max-[480px]:gap-[20px] max-[600px]:gap-[25px] max-[900px]:gap-[30px] createPostInputs">
                            <input
                                placeholder="Заголовок"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isLoading}
                                maxLength={100}
                                className="bg-white/15 px-[40px] max-[360px]:px-[20px] max-[480px]:px-[25px] max-[600px]:px-[30px] py-[20px] max-[360px]:py-[10px] max-[480px]:py-[12px] max-[600px]:py-[15px] border-0 rounded-[35px] max-[480px]:rounded-[20px] max-[600px]:rounded-[25px] outline-none text-[3rem] text-[white] hover:text-white/20 focus:text-white/25 max-[360px]:text-[1.3rem] max-[480px]:text-[1.5rem] max-[600px]:text-[1.8rem] max-[768px]:text-[2rem] max-[900px]:text-[2.5rem] placeholder:text-white/35"
                            />
                            <textarea
                                placeholder="Текст"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                disabled={isLoading}
                                maxLength={5000}
                                rows={6}
                                className="bg-white/15 px-[40px] max-[360px]:px-[20px] max-[480px]:px-[25px] max-[600px]:px-[30px] py-[20px] max-[360px]:py-[10px] max-[480px]:py-[12px] max-[600px]:py-[15px] border-0 rounded-[35px] max-[480px]:rounded-[20px] max-[600px]:rounded-[25px] outline-none min-h-[300px] max-[480px]:min-h-[150px] max-[600px]:min-h-[180px] max-[768px]:min-h-[200px] max-[900px]:min-h-[250px] text-[1.5rem] text-[white] hover:text-white/20 focus:text-white/25 max-[600p]:text-[1rem] max-[768px]:text-[1rem] max-[900px]:text-[1.2rem] placeholder:text-white/35 resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary-600 hover:bg-primary-400 px-[10px] max-[360px]:px-[30px] max-[480px]:px-[4px] max-[600px]:px-[5px] max-[900px]:px-[8px] py-[25px] max-[360px]:py-[10px] max-[480px]:py-[12px] max-[600px]:py-[15px] max-[900px]:py-[20px] border-0 rounded-[35px] max-[480px]:rounded-[20px] max-[600px]:rounded-[25px] outline-0 text-[2rem] text-white max-[360px]:text-[1rem] max-[480px]:text-[1.1rem] max-[600px]:text-[1.3rem] max-[900px]:text-[1.8rem] transition-all duration-300 ease-in-out cursor-pointer"
                        >
                            {isLoading ? "Создание поста..." : "Выложить пост"}
                        </button>
                    </form>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                text={modalText}
            />
        </div>
    );
}

export default CreatePost;
