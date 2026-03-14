import "../styles/pages/register.css";
import { registerRequest1 } from "../services/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { setMeta } from "../services/description";

function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Регистрация | GBlake";
        setMeta("description", "Регистрация");
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: "", text: "" });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id.replace("-input", "")]: value,
        }));
    };

    const validate = (): boolean => {
        const { username, email, password, repeatPassword } = formData;

        if (!username.trim()) {
            openModal("Ошибка", "Имя пользователя не может быть пустым.");
            return false;
        }
        if (username.length < 3 || username.length > 30) {
            openModal("Ошибка", "Имя должно быть от 3 до 30 символов.");
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            openModal("Ошибка", "Имя может содержать только буквы, цифры и _");
            return false;
        }

        if (!email.trim()) {
            openModal("Ошибка", "Email обязателен.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            openModal("Ошибка", "Неверный формат email.");
            return false;
        }

        if (password.length < 8) {
            openModal("Ошибка", "Пароль должен быть не короче 8 символов.");
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            openModal(
                "Ошибка",
                "Пароль должен содержать хотя бы одну заглавную букву.",
            );
            return false;
        }
        if (!/\d/.test(password)) {
            openModal("Ошибка", "Пароль должен содержать хотя бы одну цифру.");
            return false;
        }

        if (password !== repeatPassword) {
            openModal("Ошибка", "Пароли не совпадают.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const { repeatPassword, ...dataToSend } = formData;

        try {
            const data = await registerRequest1(dataToSend);
            if (!data) {
                openModal(
                    "Ошибка регистрации",
                    "Сервер не ответил или вернул ошибку.",
                );
                return;
            }

            if (data.token && data.user) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("id", String(data.user.id));
                navigate("/register2");
            } else {
                const msg = data.message || "Неизвестная ошибка сервера";
                openModal("Ошибка регистрации", msg);
            }
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            openModal("Ошибка регистрации", errMsg);
        }
    };

    return (
        <div className="bg-bg-elevated w-screen overflow-y-hidden register-main-window">
            <div className="flex justify-center items-center bg-gradient-to-b from-[rgba(110,91,255,0.35)] to-[rgba(11,12,16,1)] w-screen h-screen register-window">
                <div className="flex flex-col gap-[66px] max-[900px]:gap-[30px] bg-white/10 p-[25px] max-[430px]:p-[10px] border-[1.5px] border-white/30 border-solid rounded-[55px] max-[430px]:rounded-[35px] w-[678px] max-[430px]:w-[300px] max-[600px]:w-[400px] max-[900px]:w-[500px] text-white register">
                    <div className="flex justify-between max-[430px]:justify-between max-[430px]:p-[10px] px-[25px] register-header">
                        <h1
                            onClick={() => {
                                navigate("/login");
                            }}
                            className="font-[700] text-[2rem] max-[430px]:text-[1.3rem] max-[600px]:text-[1.5rem] cursor-pointer"
                        >
                            Вход
                        </h1>
                        <h1 className="flex flex-col bg-primary-600 mt-[8px] rounded-[35px] w-full h-[6px] font-[700] text-[2rem] text-primary-600 max-[430px]:text-[1.3rem] max-[600px]:text-[1.5rem] after:content-[''] cursor-pointer">
                            Регистрация
                        </h1>
                    </div>

                    <form
                        className="flex flex-col gap-[40px] max-[430px]:gap-[15px] max-[600px]:gap-[20px] register-form"
                        onSubmit={handleSubmit}
                    >
                        <input
                            placeholder="Уникальное имя"
                            id="username-input"
                            type="text"
                            onChange={handleChange}
                            className="bg-white/10 px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] border-0 rounded-[35px] outline-none font-[500] text-[2rem] text-white max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <input
                            placeholder="Почта"
                            id="email-input"
                            type="email"
                            onChange={handleChange}
                            className="bg-white/10 px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] border-0 rounded-[35px] outline-none font-[500] text-[2rem] text-white max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <input
                            placeholder="Пароль"
                            id="password-input"
                            type="password"
                            onChange={handleChange}
                            className="bg-white/10 px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] border-0 rounded-[35px] outline-none font-[500] text-[2rem] text-white max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <input
                            placeholder="Повторите пароль"
                            id="repeatPassword-input"
                            type="password"
                            onChange={handleChange}
                            className="bg-white/10 px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] border-0 rounded-[35px] outline-none font-[500] text-[2rem] text-white max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <button
                            type="submit"
                            className="bg-primary-600 p-[20px] max-[900px]:px-[20px] max-[900px]:py-[10px] border-0 outline-none text-[2rem] text-white max-[600px]:text-[1rem] max-[900px]:text-[1.5rem] text-center cursor-pointer roudned-[35px]"
                        >
                            Регистрация
                        </button>
                    </form>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData.title}
                text={modalData.text}
            />
        </div>
    );
}

export default Register;
