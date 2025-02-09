import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthorizationPage from './pages/authorization/authorizationPage';
import Header from './shared/ui/header';
import CategoryPage from "./pages/categoryPage/categoryPage";
import SharePopup from "./components/sharePopup/SharePopup";
import ProfilePage from "./pages/profile/ProfilePage";
import ContactPage from "./pages/contactUs/ContactPage";
import ForgotPasswordForm from "./components/forgotPasswordForm/forgotPassword";
import ResetPasswordForm from "./components/ResetPasswordForm/resetPasswordForm";
import PublicationCreatingPage from "./pages/publicationCreatingPage";
import MainPage from "./pages/mainPage";
import AboutUs from "./pages/aboutUs/aboutUs";
import About from "./pages/aboutUs/aboutUs";

const App = () => {
  return (
    <div>
      <Header></Header>
      <Routes>
          <Route path="/auth" element={<AuthorizationPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/categories" element={<CategoryPage />}/>
          <Route path="/share" element={<SharePopup />}/>
          <Route path="/profile/me" element={<ProfilePage />}/>
          <Route path="/contact_us" element={<ContactPage />}/>
          <Route path="/about_us" element={<About />}/>
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
          <Route path="/create_publication" element={<PublicationCreatingPage />} />
      </Routes>
    </div>
  );
};

export default App;
