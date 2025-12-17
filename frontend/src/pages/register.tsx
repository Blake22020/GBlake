import '../styles/pages/register.css'
import { registerRequest1  } from '../services/api'
import React, { useState  } from 'react'


function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id.replace('-input', '')]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.repeatPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        const { repeatPassword, ...dataToSend } = formData;
        registerRequest1(dataToSend);
    };



    return (
        <div className='register-main-window'>
            <div className='register-window'>
                <div className='register'>
                    <div className='register-header'>
                        <h1>Вход</h1>
                        <h1>Регистрация</h1>
                    </div>
                    <form className='register-form' onSubmit={handleSubmit}     >
                        <input placeholder='Уникальное имя' id='username-input' type='text' onChange={handleChange} />
                        <input placeholder='Почта' id='mail-input' type='email'  onChange={handleChange} />
                        <input placeholder='Пароль' id='password-input' type='password'  onChange={handleChange} />
                        <input placeholder='Повторите пароль' id='repeat-password-input' type='password' onChange={handleChange} />
                        <button type='submit'>
                            Регистрация
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;