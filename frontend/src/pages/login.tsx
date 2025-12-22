import '../styles/pages/login.css';
import { loginRequest } from '../services/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: '', 
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [formError, setFormError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsLoading(true);

        const { identifier, password } = formData;

        if (!identifier.trim() || !password.trim()) {
            setFormError('Заполните все поля');
            setIsLoading(false);
            return;
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
        const payload = isEmail
            ? { email: identifier.trim(), password }
            : { username: identifier.trim(), password };

        try {
            const res = await loginRequest(payload);

            if (res?.token) {
                localStorage.setItem('token', res.token);
                navigate('/');
            } else {
                setFormError('Сервер не вернул токен');
            }
        } catch (err: any) {
            let msg = 'Неизвестная ошибка';

            if (err.response) {
                const { status, data } = err.response;

                if (status === 400 || status === 404) {
                    msg = data?.message || 'Неверные данные для входа';
                } else if (status >= 500) {
                    msg = 'Сервер временно недоступен';
                } else {
                    msg = data?.message || 'Ошибка входа';
                }
            } else if (err.request) {
                msg = 'Нет соединения с сервером';
            }

            setFormError(msg);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="login-main-window">
            <div className="login-window">
                <div className="login">
                    <div className="login-header">
                        <h1>Вход</h1>
                        <h1 onClick={() => {
                            navigate('/register');
                        }} >Регистрация</h1>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            placeholder="Почта или юзернейм"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                        />
                        <input
                            placeholder="Пароль"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button type="submit">Войти</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;