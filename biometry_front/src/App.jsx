import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const sendImage = async () => {
    if (!capturedImage) {
      console.error('No image captured.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(capturedImage), 'webcam_image.jpeg');
      formData.append('email', 'Skader-kot@mail.ru'),
      formData.append('username', 'Skader-kot');
      await axios.post('http://localhost:8000/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image sent successfully.');
    } catch (error) {
      console.error('Error sending image:', error);
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
    <div>
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%', borderRadius: '5px' }}
        />
        <button onClick={captureImage}>Capture</button>
      </div>
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" style={{ width: '200px' }} />
          <button onClick={sendImage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default App;
