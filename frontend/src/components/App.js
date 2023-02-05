import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import { Route, withRouter, Switch, useHistory, Redirect } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.js';
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from './InfoToolTip';
import * as auth from "../utils/auth.js";

function App() {
  const [isUpdateAvatarPopupOpen, setIsUpdateAvatarPopupOpen] = React.useState(false);
  const [isUpdateProfilePopupOpen, setIsUpdateProfilePopupOpen] = React.useState(false);
  const [isAddElementPopupOpen, setIsAddElementPopupOpen] = React.useState(false);
  const [isConfirmDeletionPopupOpen, setIsConfirmDeletionPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = React.useState(false);
  const [deletionCardId, setDeletionCardId] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({ name: '', about: '', _id: '', avatar: '' });
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [headerLink, setHeaderLink] = React.useState({ route: "/sign-up", name: "Регистрация" });
  const history = useHistory();
  const [userEmail, setUserEmail] = React.useState("");

  function handleLogin(email, password) {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setUserEmail(email);
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch(() => {
        setIsRegisterSuccess(false);
        setInfoTooltipPopupOpen(true);
      });
  }

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res.status !== 400) {
          history.push("/sign-in");
          setIsRegisterSuccess(true);
          setInfoTooltipPopupOpen(true);
          setIsRegisterSuccess(true);
        }
      })
      .catch(() => {
        setIsRegisterSuccess(false);
      })
      .finally(() => {
        setInfoTooltipPopupOpen(true);
      });
  }

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  function handleTokenCheck() {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setUserEmail(res.data.email);
            setLoggedIn(true);
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        })
    }
  }

  React.useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((userData) => {
          setCurrentUser(userData)
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        })
    }
  }, [loggedIn]);

  function logOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
  }

  // 1) - open all popups
  function handleUpdateAvatarClick() {
    setIsUpdateAvatarPopupOpen(true);
  }

  function handleUpdateProfileClick() {
    setIsUpdateProfilePopupOpen(true);
  }

  function handleAddElementClick() {
    setIsAddElementPopupOpen(true);
  }

  function handleEConfirmDeletionClick(cardId) {
    setDeletionCardId(cardId);
    setIsConfirmDeletionPopupOpen(true);
  }

  // 2) - оpen a chosen card
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // 3) - close all popups
  function closeAllPopups() {
    setIsUpdateAvatarPopupOpen(false);
    setIsUpdateProfilePopupOpen(false);
    setIsAddElementPopupOpen(false);
    setIsConfirmDeletionPopupOpen(false);
    setSelectedCard(null);
    setInfoTooltipPopupOpen(false);
  }

  // 4) close via clicking on overlay
  function closeViaOverlayClick(event) {
    if (event.target.classList.contains('popup')) {
      closeAllPopups();
    }
  }

  //5 state-lifting
  React.useEffect(() => {
    if (loggedIn) {
      api
        .getInitialCards()
        .then((cards) => {
          setCards(cards)
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        })
    }
  }, [loggedIn]);

  function handleCardLike(card) {

    const isLiked = card.likes.some(i => i._id === currentUser._id);//проверка наличия like

    api.toggleLikeApi(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err.message));
  }

  // 6) api functions:
  function handleUpdateUser(userName, job) {
    api
      .editProfile(userName, job)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(link) {
    api
      .updateAvatar(link)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onConfirmDeletion() {
    //обновление api
    console.log(deletionCardId)
    api.deleteCard(deletionCardId)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== deletionCardId));
        setIsConfirmDeletionPopupOpen(false);
      })
      .catch(err => console.log(err.message));
  }

  function handleAddPlaceSubmit(title, link) {
    api
      .addCard(title, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser} >

      <div className="page">
        <div className="page__container">
          <Header headerLink={headerLink} userEmail={userEmail} loggedIn={loggedIn} logOut={logOut} />
          <Switch>
            <Route path="/sign-up">
              <Register handleHeaderLink={setHeaderLink} onRegister={handleRegister} />
            </Route>
            <Route path="/sign-in">
              <Login handleHeaderLink={setHeaderLink} onLogin={handleLogin} />
            </Route>
            <ProtectedRoute
              exact path="/"
              loggedIn={loggedIn}
              component={Main}
              onChangeAvatar={handleUpdateAvatarClick}
              onUpdateProfile={handleUpdateProfileClick}
              onAddElement={handleAddElementClick}
              onCardClick={handleCardClick}
              onDeleteClick={handleEConfirmDeletionClick}
              cards={cards}
              handleCardLike={handleCardLike} >
            </ProtectedRoute>
            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="./sign-in" />}
            </Route>
          </Switch>
          {loggedIn && <Footer />}

          <ImagePopup card={selectedCard} onClose={closeAllPopups} onOverlay={closeViaOverlayClick} />

          {/*update avatar*/}
          <EditAvatarPopup isOpen={isUpdateAvatarPopupOpen} onCloseIcon={closeAllPopups} onOverlay={closeViaOverlayClick} onUpdateAvatar={handleUpdateAvatar} />

          {/*update profile*/}
          <EditProfilePopup isOpen={isUpdateProfilePopupOpen} onCloseIcon={closeAllPopups} onOverlay={closeViaOverlayClick} onUpdateUser={handleUpdateUser} />

          {/*add element*/}
          <AddPlacePopup isOpen={isAddElementPopupOpen} onCloseIcon={closeAllPopups} onOverlay={closeViaOverlayClick} onAddElement={handleAddPlaceSubmit} />

          {/*confirm deletion*/}
          <DeleteCardPopup isOpen={isConfirmDeletionPopupOpen} onCloseIcon={closeAllPopups} onOverlay={closeViaOverlayClick} onConfirmDeletion={onConfirmDeletion} />

          {/*info tooltip*/}
          <InfoTooltip isOpen={isInfoTooltipPopupOpen} isRegisterSuccess={isRegisterSuccess} onCloseIcon={closeAllPopups} onOverlay={closeViaOverlayClick} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
