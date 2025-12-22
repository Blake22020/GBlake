import '../styles/pages/register.css'
import { registerRequest1  } from '../services/api'
import React, { useState  } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal';


function Register() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: '', text: '' });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

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

    const validate = (): boolean => {
        const { username, email, password, repeatPassword } = formData;

        // Username
        if (!username.trim()) {
            openModal('Ошибка', 'Имя пользователя не может быть пустым.');
            return false;
        }
        if (username.length < 3 || username.length > 30) {
            openModal('Ошибка', 'Имя должно быть от 3 до 30 символов.');
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            openModal('Ошибка', 'Имя может содержать только буквы, цифры и _');
            return false;
        }

        // Email
        if (!email.trim()) {
            openModal('Ошибка', 'Email обязателен.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            openModal('Ошибка', 'Неверный формат email.');
            return false;
        }

        // Password
        if (password.length < 8) {
            openModal('Ошибка', 'Пароль должен быть не короче 8 символов.');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            openModal('Ошибка', 'Пароль должен содержать хотя бы одну заглавную букву.');
            return false;
        }
        if (!/\d/.test(password)) {
            openModal('Ошибка', 'Пароль должен содержать хотя бы одну цифру.');
            return false;
        }

        // Repeat password
        if (password !== repeatPassword) {
            openModal('Ошибка', 'Пароли не совпадают.');
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
                openModal('Ошибка регистрации', 'Сервер не ответил или вернул ошибку.');
                return;
            }

            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', data.user.id.toString());
                navigate('/register2');
            } else {
                const msg = data.message || 'Неизвестная ошибка сервера';
                openModal('Ошибка регистрации', msg);
            }
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || error.message || 'Неизвестная ошибка';
            openModal('Ошибка регистрации', errMsg);
        }
    };
 


    return (
        <div className='register-main-window'>
            <div className='register-window'>
                <div className='register'>
                    <div className='register-header'>
                        <h1 onClick={() => {
                            navigate("/login")
                        }}>Вход</h1>
                        <h1>Регистрация</h1>
                    </div>
                    <form className='register-form' onSubmit={handleSubmit}     >
                        <input placeholder='Уникальное имя' id='username-input' type='text' onChange={handleChange} />
                        <input placeholder='Почта' id='email-input' type='email'  onChange={handleChange} />
                        <input placeholder='Пароль' id='password-input' type='password'  onChange={handleChange} />
                        <input placeholder='Повторите пароль' id='repeatPassword-input' type='password' onChange={handleChange} />
                        <button type='submit'>
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
    )
}

export default Register;