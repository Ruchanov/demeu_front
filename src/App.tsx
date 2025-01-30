import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthorizationPage from './pages/authorization/authorizationPage';
import Header from './shared/ui/header';
import CategoryPage from "./pages/categoryPage/categoryPage";
import SharePopup from "./components/sharePopup/SharePopup";

const App = () => {
  return (
    <div>
      <Header></Header>
      <Routes>
        <Route path="/auth" element={<AuthorizationPage />} />
        <Route path="/" element={<div>Главная страница</div>} />
        <Route path="/categories" element={<CategoryPage />}/>
          <Route path="share" element={<SharePopup />}/>
      </Routes>
    </div>

  );
};

export default App;
