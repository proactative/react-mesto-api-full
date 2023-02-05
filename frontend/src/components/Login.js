import React from "react";
import { withRouter } from 'react-router-dom';

function Login({handleHeaderLink, onLogin}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    React.useEffect(() => {
        handleHeaderLink({ route: "/sign-up", name: "Регистрация" });
    }, []);

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }

    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onLogin(email, password);
    }

    return (
        <section className='login'>
            <h2 className='login__title'>Вход</h2>
            <form className='login__form' noValidate onSubmit={handleSubmit}>
                <input className='login__input' type='email' name='email' id='email' required placeholder='Email' value={email || ''} onChange={handleChangeEmail} ></input>
                <input className='login__input' type='password' name='password' id='password' required placeholder='Пароль' value={password || ''} onChange={handleChangePassword} ></input>
                <button className='login__button' type='submit'>Войти</button>
            </form>
        </section>
    )
}

export default withRouter(Login);
