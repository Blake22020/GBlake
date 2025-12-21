import '../styles/pages/login.css';
import { loginRequest } from '../services/api';
import React, { useState } from 'react';

function Login() {
    const [formData, setFormData] = useState({
        identifier: '', // будет либо email, либо username
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Определяем, что ввёл пользователь: email или username
        const { identifier, password } = formData;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

        const payload = {
            ...(isEmail ? { email: identifier } : { username: identifier }),
            password,
        };

        try {
            const res = await loginRequest(payload); // loginRequest должен принимать { email?, username?, password }

            if (res.token) {
                localStorage.setItem('token', res.token);
                // Перенаправление или обновление состояния
                console.log('Успешный вход');
            } else {
                alert('Ошибка входа');
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка сети или сервера');
        }
    };

    return (
        <div className="login-main-window">
            <div className="login-window">
                <div className="login">
                    <div className="login-header">
                        <h1>Вход</h1>
                        <h1>Регистрация</h1>
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

export default Login; // ✅ Исправлено: не Register!