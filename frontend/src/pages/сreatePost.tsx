import { useState, FormEvent, useEffect } from 'react'
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import '../styles/pages/createPost.css'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import { createPost } from '../services/api'

function CreatePost() {

    
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate])
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalText, setModalText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = () => {
        if (!title.trim()) {
            setModalTitle('Ошибка валидации')
            setModalText('Заголовок не может быть пустым')
            setIsModalOpen(true)
            return false
        }
        
        if (title.trim().length < 3) {
            setModalTitle('Ошибка валидации')
            setModalText('Заголовок должен содержать минимум 3 символа')
            setIsModalOpen(true)
            return false
        }
        
        if (!text.trim()) {
            setModalTitle('Ошибка валидации')
            setModalText('Текст поста не может быть пустым')
            setIsModalOpen(true)
            return false
        }
        
        if (text.trim().length < 10) {
            setModalTitle('Ошибка валидации')
            setModalText('Текст поста должен содержать минимум 10 символов')
            setIsModalOpen(true)
            return false
        }
        
        return true
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        const token = localStorage.getItem('token')
        if (!token) {
            setModalTitle('Ошибка авторизации')
            setModalText('Вы не авторизованы. Пожалуйста, войдите в систему.')
            setIsModalOpen(true)
            return
        }

        setIsLoading(true)

        try {
            await createPost(title, text, token)
            navigate('/')
        } catch (error: any) {
            console.error('Error creating post:', error)
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message || 'Произошла ошибка при создании поста'
                
                if (status === 401) {
                    setModalTitle('Ошибка авторизации')
                    setModalText('Ваша сессия истекла. Пожалуйста, войдите снова.')
                } else if (status === 400) {
                    setModalTitle('Ошибка запроса')
                    setModalText(message)
                } else if (status >= 500) {
                    setModalTitle('Ошибка сервера')
                    setModalText('Сервер временно недоступен. Попробуйте позже.')
                } else {
                    setModalTitle('Ошибка')
                    setModalText(message)
                }
            } else if (error.request) {
                setModalTitle('Ошибка сети')
                setModalText('Не удалось подключиться к серверу. Проверьте интернет-соединение.')
            } else {
                setModalTitle('Неизвестная ошибка')
                setModalText('Произошла непредвиденная ошибка. Попробуйте снова.')
            }
            
            setIsModalOpen(true)
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <div className="createPost">
            <LoginNavbarHeader />
            <div className="createPostMain">
                <div className="createPostCard">
                    <button className="closeButton" onClick={() => {navigate("/")}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50"><g data-name="Layer 2"><g data-name="close"><rect width="50" height="50" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg></button>
                    <h1>Создание поста</h1>
                    <form className="createPostForm" onSubmit={handleSubmit}>
                        <div className="createPostInputs">
                            <input 
                                placeholder="Заголовок" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isLoading}
                                maxLength={100}
                            />
                            <textarea 
                                placeholder="Текст" 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                disabled={isLoading}
                                maxLength={5000}
                                rows={6}
                            />
                        </div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Создание поста...' : 'Выложить пост'}
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
    )
}

export default CreatePost;