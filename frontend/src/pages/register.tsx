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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.repeatPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        const { repeatPassword, ...dataToSend } = formData;
        const data = await registerRequest1(dataToSend);
        if(data.token && data.user) {
            try {
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', data.user.id.toString())
                navigate('/register2')
            } catch (error) {
                openModal('Ошибка регистрации', 'Ошибка при сохранении токена:' + error);
            }
        } else {
            openModal('Ошибка регистрации', 'Неизвестная ошибка')
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