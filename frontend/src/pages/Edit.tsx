import { useEffect, useState } from "react";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import "../styles/pages/edit.css";
import { setMeta } from "../services/description";
import { useNavigate } from "react-router-dom";
import { getUserData, updateUserProfile, uploadAvatar } from "../services/api";

interface UserData {
    id: string;
    username: string;
    visualName: string;
    bio: string;
    avatar: string;
}

function Edit() {

    useEffect(() => {
        document.title = "Редактирование профиля | GBlake";
        setMeta("description", "Редактирование профиля");
    }, []);

    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        visualName: '',
        bio: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const data = await getUserData(token);
                setUserData(data);
                setFormData({
                    username: data.username || '',
                    visualName: data.visualName || '',
                    bio: data.bio || ''
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                navigate(`/${userData?.id || localStorage.getItem('id')}`);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setIsLoading(true);

        try {
            await updateUserProfile(formData, token);

            if (avatarFile) {
                await uploadAvatar(avatarFile, token);
            }

            if (formData.visualName) {
                localStorage.setItem('visualName', formData.visualName);
            }

            navigate(`/${userData?.id || localStorage.getItem('id')}`);
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            alert(error.message || 'Не удалось обновить профиль');
        } finally {
            setIsLoading(false);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="editPage">
            <LoginNavbarHeader />
            <div className="editWindow">
                <button className="closeButton" onClick={() => {navigate("/")}} ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><g data-name="Layer 2"><g data-name="close"><rect width="50" height="50" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg></button>
                <form className="editForm" onSubmit={handleSubmit} >
                    <div className="inputs">
                        <div className="addCard" onClick={() => document.getElementById('avatar-upload')?.click()}>
                            <img 
                                src={avatarFile ? URL.createObjectURL(avatarFile) : `https://gblake.ru/uploads/${userData.avatar}`}
                                alt=''
                            />
                            <h2>Загрузить фото</h2>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                                id="avatar-upload"
                            />
                        </div>
                        <div className="textInputs">
                            <input 
                                name="username"
                                placeholder='Уникальное имя' 
                                maxLength={20} 
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                            <input 
                                name="visualName"
                                placeholder='Отображаемое имя' 
                                maxLength={40} 
                                value={formData.visualName}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="bio"
                                placeholder="Описание"
                                rows={2}
                                maxLength={80}
                                value={formData.bio}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Сохранение...' :  'Сохранить'}
                        Сохранить
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Edit;