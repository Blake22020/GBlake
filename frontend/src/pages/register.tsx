import { registerRequest1 } from "../services/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setMeta } from "../services/description";
import toast from "react-hot-toast";
import Input from "../components/Input";
import Button from "../components/Button";

function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Регистрация | GBlake";
        setMeta("description", "Регистрация");
    }, []);

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
            toast.error("Имя пользователя не может быть пустым.");
            return false;
        }
        if (username.length < 3 || username.length > 30) {
            toast.error("Имя должно быть от 3 до 30 символов.");
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            toast.error("Имя может содержать только буквы, цифры и _");
            return false;
        }

        if (!email.trim()) {
            toast.error("Email обязателен.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Неверный формат email.");
            return false;
        }

        if (password.length < 8) {
            toast.error("Пароль должен быть не короче 8 символов.");
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            toast.error(
                "Пароль должен содержать хотя бы одну заглавную букву.",
            );
            return false;
        }
        if (!/\d/.test(password)) {
            toast.error("Пароль должен содержать хотя бы одну цифру.");
            return false;
        }

        if (password !== repeatPassword) {
            toast.error("Пароли не совпадают.");
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
                toast.error("Сервер не ответил или вернул ошибку.");
                return;
            }

            if (data.token && data.user) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("id", String(data.user.id));
                navigate("/register2");
            } else {
                const msg = data.message || "Неизвестная ошибка сервера";
                toast.error(msg);
            }
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            toast.error(errMsg);
        }
    };

    return (
        <div className="bg-[#191919] w-screen overflow-y-hidden register-main-window">
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
                        <h1 className="flex flex-col after:bg-primary-600 after:mt-[8px] after:rounded-[35px] after:w-full after:h-[6px] font-[700] text-[2rem] text-primary-600 max-[430px]:text-[1.3rem] max-[600px]:text-[1.5rem] after:content-[''] cursor-pointer">
                            Регистрация
                        </h1>
                    </div>

                    <form
                        className="flex flex-col gap-[40px] max-[430px]:gap-[15px] max-[600px]:gap-[20px] register-form"
                        onSubmit={handleSubmit}
                    >
                        <Input
                            placeholder="Уникальное имя"
                            id="username-input"
                            type="text"
                            onChange={handleChange}
                            className="px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] text-[2rem] max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <Input
                            placeholder="Почта"
                            id="email-input"
                            type="email"
                            onChange={handleChange}
                            className="px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] text-[2rem] max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <Input
                            placeholder="Пароль"
                            id="password-input"
                            type="password"
                            onChange={handleChange}
                            className="px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] text-[2rem] max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <Input
                            placeholder="Повторите пароль"
                            id="repeatPassword-input"
                            type="password"
                            onChange={handleChange}
                            className="px-[25px] max-[900px]:px-[20px] py-[15px] max-[900px]:py-[10px] text-[2rem] max-[600px]:text-[1rem] max-[900px]:text-[1.5rem]"
                        />
                        <Button
                            type="submit"
                            onClick={() => {}}
                            className="p-[20px] max-[900px]:p-[15px] text-[2rem] max-[600px]:text-[1rem] max-[900px]:text-[1.5rem] text-center cursor-pointer"
                        >
                            Регистрация
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
