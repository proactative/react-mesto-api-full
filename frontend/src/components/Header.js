import React from 'react';
import headerLogo from '../images/header-logo.svg';
import { Link } from 'react-router-dom';

function Header({ headerLink, userEmail, loggedIn, logOut }) {

    return (
        <header className="header">
            <img className="header__logo" src={headerLogo} alt="логотип" />
            {!loggedIn && <Link className="header__link" to={headerLink.route}>{headerLink.name}</Link>}
            {loggedIn && <div className="header__menu">
                <span className="header__userEmail">email{userEmail}</span>
                <Link className="header__link header__link_exit" to='/sign-in' onClick={logOut}>Выйти</Link>
            </div>}
        </header>
    )
}

export default Header