import React from 'react';
import searchSvg from '../../assets/search.svg';
import '../../styles/components/headers/mainHeader.css'

function MainHeader() {
    return (
        <header>
            <h1>GBlake</h1>
            <div className="search-bar">
                <img src={searchSvg} alt=''/>
                <input className='search-input' type='text' placeholder='Поиск в GBlake' />
            </div>
            <button className='login' type='button'>Войти</button>
        </header>
    )
}

export default MainHeader;