import { registerRequest2  } from '../services/api'
import React, { useState, useRef, useEffect  } from 'react'
import '../styles/pages/register2.css'


function Register2() {
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleAddClick() {
        if(!fileInputRef.current) return 
        fileInputRef.current.click();
    }

    const [avatar, setAvatar] = useState<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log('ref: ', fileInputRef.current)
        const file = e.target.files?.[0];

        if(!file) return;
        setAvatar(file)
        console.log(file);
    }

    const previewUrl = avatar ? URL.createObjectURL(avatar) : null;

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [previewUrl])

    async function handleSubmit() {
        if(!avatar) {
            alert('Выбери фото')
            return
        }

        if(!name.trim()) {
            alert('Введи имя')
            return
        }

        const formData = new FormData();
        formData.append('avatar', avatar);
        formData.append('name', name);
        formData.append('bio', bio);

        registerRequest2({visualName: name, bio: bio}, localStorage.getItem('token'))
    }

    return (
        <div className='register-main-window'>
            <div className='register-window'>
                <div className='register2'>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <div className='addCard' onClick={handleAddClick}>
                        <div className='addIcon' id='addIcon'>
                            { previewUrl ? (<img src={ previewUrl } alt='Твоя аватарка'/>) : (<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_7_6)">
                                        <path d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" fill="white"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_7_6">
                                            <rect width="100%" height="100%" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>) }                            
                        </div>
                        { previewUrl ? "Фото добавлено" : "Добавить фото" }
                    </div>
                    <form className='addForm' onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <div className='addInputs'>
                            <input placeholder='Отображаемое имя' onChange={(e) => {setName(e.target.value)}} maxLength={40} />
                            <textarea
                                placeholder='Описание'
                                rows={2}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={80}
                            />              
                      </div>
                        <button type='submit'>Создать профиль</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register2;