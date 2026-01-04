import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/components/headers/loginHeader.css'
import { useEffect, useState } from 'react';

type Props = {
    openFunction: () => void;
    open: boolean
}


function LoginHeader({ openFunction, open } : Props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParams.get('q') || '');


    const handleSearch = () => {
        if (inputValue.trim()) {
            navigate(`/search?q=${inputValue}`)

        }
    };
    
    useEffect(() => {
        setInputValue(searchParams.get('q') || '');
    }, [searchParams]);

    return (
        <header className='login-header'>
            <div className='title'>
                <div className='burger' onClick={() => openFunction()}>
                    <div className={open ? 'line top open' : 'line top'}></div>
                    <div className={open ? 'line middle open' : 'line middle'}></div>
                    <div className={open ? 'line bottom open' : 'line bottom'}></div>
                </div>
                <h1>GBlake</h1>
            </div>
            <div className="search-bar">
                <svg className="search-icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="search"><rect width="24" height="24" opacity="0"/><path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"/></g></g></svg>
                <input
                    className='search-input'
                    type='text'
                    placeholder='Поиск в GBlake'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                        handleSearch();
                        }
                    }}
                />
            </div>
            <div className='mobileIcon'>
                <svg  onClick={() => {
                    const title = document.querySelector('.login-header .title') as HTMLElement;
                    const mobileIcon = document.querySelector('.login-header .mobileIcon') as HTMLElement;
                    const closeIcon = document.querySelector('.login-header .closeIcon') as HTMLElement;
                    const searchBar = document.querySelector('.login-header .search-bar') as HTMLElement;
                    const searchInput = document.querySelector('.login-header .search-bar input') as HTMLElement;

                    searchBar.style.display = 'flex';
                    searchBar.style.width = '95%';
                    searchInput.style.width = '100%';
                    title.style.display = 'none'
                    mobileIcon.style.display = 'none'
                    closeIcon.style.display = 'block'


                }} className="search-icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="search"><rect width="24" height="24" opacity="0"/><path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"/></g></g></svg>
                <a href='https://gblake.ru/users/'>
                    {localStorage.getItem('avatar') ? <img src={'https://gblake.ru/uploads/' + localStorage.getItem('avatar')} alt=''/> : <img src='https://cdn-icons-png.flaticon.com/512/149/149071.png' alt=''/> }
                </a>
            </div>
            <svg onClick={() => {
                const title = document.querySelector('.login-header .title') as HTMLElement;
                const mobileIcon = document.querySelector('.login-header .mobileIcon') as HTMLElement;
                const closeIcon = document.querySelector('.login-header .closeIcon') as HTMLElement;
                const searchBar = document.querySelector('.login-header .search-bar') as HTMLElement;

                searchBar.style.display = 'none';
                searchBar.style.width = '300px';
                title.style.display = 'flex'
                mobileIcon.style.display = 'flex'
                closeIcon.style.display = 'none'

            }} className='closeIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg>
        </header>
    )
}

export default LoginHeader;