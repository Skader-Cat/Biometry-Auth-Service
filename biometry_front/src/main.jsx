import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Обновленный импорт

import Registration from './Registration';
import Authentication from './Authentication';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes> {/* Обернуть маршруты в Routes */}
        <Route path="/" element={<Registration />} /> {/* Использовать элемент маршрута */}
        <Route path="/auth" element={<Authentication />} /> {/* Использовать элемент маршрута */}
      </Routes>
    </Router>
  </React.StrictMode>,
);
