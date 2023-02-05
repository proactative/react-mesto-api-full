import React from "react";
import { Link, withRouter } from 'react-router-dom';

function Register({handleHeaderLink, onRegister}) {
    const [email, setEmail] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    React.useEffect(() => {
        handleHeaderLink({ route: "/sign-in", name: "Вход" });
    }, []);

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }

    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (email && password) {
        onRegister(email, password);
        }
    }

    return (
        <section className="register">
            <h2 className="register__title">Регистрация</h2>
            <form className="register__form" noValidate onSubmit={handleSubmit}>
                <input className="register__input" type='email' name="email" id="email" required placeholder="Email"  value={email || ''} onChange={handleChangeEmail} ></input>
                <input className="register__input" type='password' name="password" id="password" required placeholder="Пароль" value={password || ''} onChange={handleChangePassword} ></input>
                <button className='register__button' type="submit">Зарегистрироваться</button>
            </form>
            <p className="register__login-question">Уже зарегистрированы?{' '}
                <Link to="/sign-in" className="register__login-link">Войти</Link>
            </p>
        </section>

    )
}

export default withRouter(Register);
