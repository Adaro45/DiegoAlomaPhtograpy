import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageList from './pages/ImageList';  // Asegúrate que la ruta sea correcta
import ImageFormPage from './pages/ImageFormPage';
import PreviewImage from './pages/PreviewImage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageList />} />
        <Route path="/images/new" element={<ImageFormPage />} />
        <Route path="/images/:id/edit" element={<ImageFormPage />} />
        <Route path="/images/:id/preview" element={<PreviewImage />} />
      </Routes>
    </Router>
  );
}

export default App;