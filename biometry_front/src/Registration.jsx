import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const sendRegistrationData = async () => {
    if (!capturedImage || !username || !email) {
      console.error('Пожалуйста, заполните все поля и сделайте снимок.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(capturedImage), 'webcam_image.jpeg');
      formData.append('email', email);
      formData.append('username', username);
      await axios.post('http://localhost:8000/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Данные регистрации успешно отправлены.');
    } catch (error) {
      console.error('Ошибка при отправке данных регистрации:', error);
    }
  };

  // Вспомогательная функция для преобразования базового 64-битного URI в Blob
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ marginRight: '20px', width: '300px' }}>
        <h2>Регистрация</h2>
        <div>
          <label>Имя пользователя:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: '100%', height: '100%', borderRadius: '5px', marginTop: '10px' }}
          />
          <button onClick={captureImage} style={{ marginTop: '10px' }}>Сделать снимок</button>
        </div>
        {capturedImage && (
          <div>
            <button onClick={sendRegistrationData} style={{ marginTop: '10px' }}>Зарегистрироваться</button>
          </div>
        )}
      </div>
      {capturedImage && (
        <div>
          <h2>Захваченное изображение</h2>
          <img src={capturedImage} alt="Захваченное" style={{ width: '400px', height: '300px', borderRadius: '5px' }} />
        </div>
      )}
    </div>
  );
};

export default Registration;