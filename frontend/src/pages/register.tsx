import '../styles/pages/register.css'

function Register() {
    return (
        <div className='register-main-window'>
            <div className='register-window'>
                <div className='register'>
                    <div className='register-header'>
                        <h1>Вход</h1>
                        <h1>Регистрация</h1>
                    </div>
                    <form className='register-form'>
                        <input placeholder='Уникальное имя' id='username-input' type='text'  />
                        <input placeholder='Почта' id='mail-input' type='email'  />
                        <input placeholder='Пароль' id='password-input' type='password'  />
                        <input placeholder='Повторите пароль' id='repeat-password-input' type='password' />
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