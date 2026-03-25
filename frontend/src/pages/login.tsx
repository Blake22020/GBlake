import "../styles/pages/login.css";
import { loginRequest } from "../services/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { setMeta } from "../services/description";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    useEffect(() => {
        document.title = "Вход | GBlake";
        setMeta("description", "Вход");
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: "", text: "" });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { identifier, password } = formData;

        if (!identifier.trim() || !password.trim()) {
            openModal("Ошибка заполнения формы", "Заполните все поля");
            return;
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
        const payload = isEmail
            ? { email: identifier.trim(), password }
            : { username: identifier.trim(), password };

        try {
            const res = await loginRequest(payload);

            if (res?.token) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("id", res.user.id);

                navigate("/");
            } else {
                openModal("Ошибка входа", "Сервер не вернул токен");
            }
        } catch (err: any) {
            let msg = "Неизвестная ошибка";

            if (err.response) {
                const { status, data } = err.response;

                if (status === 400 || status === 404) {
                    msg = data?.message || "Неверные данные для входа";
                } else if (status >= 500) {
                    msg = "Сервер временно недоступен";
                } else {
                    msg = data?.message || "Ошибка входа";
                }
            } else if (err.request) {
                msg = "Нет соединения с сервером";
            }

            openModal("Ошибка входа", msg);
        }
    };

    return (
        <div className="bg-[#191919] w-screen h-screen login-main-window">
            <div className="flex justify-center items-center bg-gradient-to-b from-[rgba(110,91,255,0.35)] to-[rgba(11,12,16,1)] w-screen h-screen login-window">
                <div className="flex flex-col gap-[66px] max-[900px]:gap-[30px] bg-white/10 p-[25px] max-[430px]:p-[10px] border-[1.5px] border-white/30 border-solid rounded-[55px] max-[430px]:rounded-[35px] w-[678px] max-[430px]:w-[300px] max-[600px]:w-[400px] max-[900px]:w-[500px] text-white login">
                    <div className="flex justify-between max-[430px]:justify-between max-[430px]:p-[10px] px-[25px] loginPage-header">
                        <h1 className="flex flex-col after:bg-primary-600 after:mt-[8px] after:rounded-[35px] after:w-full after:h-[6px] font-[700] text-[2rem] text-primary-600 max-[430px]:text-[1.3rem] max-[600px]:text-[1.5rem] after:content-[''] cursor-pointer">
                            Вход
                        </h1>
                        <h1
                            onClick={() => {
                                navigate("/register");
                            }}
                            className="font-[700] text-[2rem] max-[430px]:text-[1.3rem] max-[600px]:text-[1.5rem] cursor-pointer"
                        >
                            Регистрация
                        </h1>
                    </div>
                    <form
                        className="flex flex-col gap-[40px] max-[430px]:gap-[15px] max-[600px]:gap-[20px] max-[900px]:gap-[30px] login-form"
                        onSubmit={handleSubmit}
                    >
                        <input
                            placeholder="Почта или юзернейм"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            className="bg-white/10 px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] border-0 rounded-[35px] outline-none font-[500] text-[2rem] text-white max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <input
                            placeholder="Пароль"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-white/10 px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] border-0 rounded-[35px] outline-none font-[500] text-[2rem] text-white max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <button
                            type="submit"
                            className="bg-primary-600 hover:bg-primary-600/75 p-[20px] max-[900px]:p-[15px] border-0 rounded-[35px] outline-none text-[2rem] text-white max-[600px]:text-[1rem] max-[900px]:text-[1.5rem] text-center cursor-pointer"
                        >
                            Войти
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

export default Login;
