import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const Authentication = () => {
  const [email, setEmail] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const [authenticationMessage, setAuthenticationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const sendAuthenticationData = async () => {
    if (!capturedImage || !email) {
      console.error('Пожалуйста, заполните все поля и сделайте снимок.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(capturedImage), 'webcam_image.jpeg');
      formData.append('email', email);
      const response = await axios.post('http://localhost:8000/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.message === 'User logged in successfully') {
        setAuthenticationMessage(`Успешная аутентификация для ${response.data.data}, имя пользователя: ${response.data.username}`);
        // Очищаем ошибку в случае успешной аутентификации
        setErrorMessage('');
      } else {
        setAuthenticationMessage('Ошибка аутентификации');
        // Очищаем сообщение об успешной аутентификации в случае ошибки
        setAuthenticationMessage('');
      }
    } catch (error) {
      console.error('Ошибка отправки данных аутентификации:', error);
      if (error.response && error.response.status === 404) {
        setErrorMessage('Пользователь не найден');
      } else {
        setErrorMessage('Ошибка при отправке данных аутентификации');
      }
      // Очищаем сообщение об успешной аутентификации в случае ошибки
      setAuthenticationMessage('');
    }
  };

  // Helper function to convert base64 data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Аутентификация</h2>
      <div style={{ width: '300px' }}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ position: 'relative', width: '100%', height: '300px', marginTop: '10px' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '5px' }}
          />
          <button onClick={captureImage} style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>Сделать снимок</button>
        </div>
        {capturedImage && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <img src={capturedImage} alt="Снимок" style={{ width: '200px', borderRadius: '5px' }} />
            <button onClick={sendAuthenticationData} style={{ marginTop: '10px' }}>Вход</button>
          </div>
        )}
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {authenticationMessage && <p>{authenticationMessage}</p>}
    </div>
  );
};

export default Authentication;
