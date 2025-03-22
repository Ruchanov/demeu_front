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
import About from "./pages/aboutUs/aboutUs";
import AboutPostPage from "./pages/aboutPost/aboutPost";
import SearchPage from "./pages/search_page";
import MainPage from "./pages/mainPage";
import FavoritesPage from "./pages/favoritesPage/FavoritesPage";
import AllPublicationsPage from "./pages/AllPublicationsPage/AllPublicationsPage";



const App = () => {
  return (
    <div>
      <Header></Header>
      <Routes>
          <Route path="/auth" element={<AuthorizationPage />} />
          <Route path="/categories" element={<CategoryPage />}/>
          <Route path="/share" element={<SharePopup />}/>
          <Route path="/profiles/me" element={<ProfilePage />} />
          <Route path="/profiles/:id" element={<ProfilePage />} />
          <Route path="/contact_us" element={<ContactPage />}/>
          <Route path="/about_us" element={<About />}/>
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
          <Route path="/create_publication" element={<PublicationCreatingPage />} />
          <Route path="/publications/:id" element={<AboutPostPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/publications" element={<AllPublicationsPage />} />
      </Routes>
    </div>
  );
};

export default App;
