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
import {useAuthStore} from "./store/authStore";
import MainPage from "./pages/mainPage";
import FavoritesPage from "./pages/favoritesPage/FavoritesPage";
import AllPublicationsPage from "./pages/AllPublicationsPage/AllPublicationsPage";
import CategoryDetailPage from "./pages/CategoryDetailPage/CategoryDetailPage";
// import '/shared/assets/icons/sprite.svg';
import PrivacyTermsPage from './pages/privacyTerms/PrivacyTermsPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CertificatesPage from "./pages/SertificatesPage/CertificatesPage";

const stripePromise = loadStripe('pk_test_51RK0652fyilaIvPMKB45ecEn57csGdfFm6JXc2leu3BpD4YoDTGYR8rEhuztLZtyJ6xduBY9G51fMXFcQozNVbvk00pBmgeydn');

const App = () => {
    const data = useAuthStore((state) => state.token);
    return (
        <Elements stripe={stripePromise}>
            <div>
                <Header></Header>
                <Routes>
                    <Route path="/auth" element={<AuthorizationPage />} />
                    <Route path="/categories" element={<CategoryPage />}/>
                    <Route path="/categories/:category" element={<CategoryDetailPage />} />
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
                    <Route path="" element={<MainPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/publications" element={<AllPublicationsPage />} />
                    <Route path="/rules" element={<PrivacyTermsPage />} />
                    <Route path="/certificates" element={<CertificatesPage />} />

                </Routes>
            </div>
        </Elements>
  );
};

export default App;
