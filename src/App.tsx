import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthorizationPage from './pages/authorization/authorizationPage';
import Header from './shared/ui/header';

const App = () => {
  return (
    <div>
      <Header></Header>
      <Routes>
      <Route path="/auth" element={<AuthorizationPage />} />
      <Route path="/" element={<div>Главная страница</div>} />
    </Routes>
    </div>

  );
};

export default App;
