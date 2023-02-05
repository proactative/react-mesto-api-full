import React from 'react';
import failImage from '../images/fail-image.svg';
import successImage from '../images/success-image.svg'

function InfoTooltip({ isOpen, isRegisterSuccess, name, onCloseIcon, onOverlay }) {
  
  const message = isRegisterSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.';
  const image = isRegisterSuccess ? successImage : failImage;

  return (
    <div onClick={(e) => onOverlay(e)} className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button type="button" aria-label="Закрытие попапа" className="popup__close" onClick={onCloseIcon}></button>
        <img className="popup__info-image" src={image} />
        <h2 className="popup__message-info">{message}</h2>
      </div>
    </div>
  )
}

export default InfoTooltip;