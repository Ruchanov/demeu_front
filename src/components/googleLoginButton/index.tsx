import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
    const { login_google } = useAuthStore();
    const navigate = useNavigate();

    const handleSuccess = async (response: any) => {
        console.log("Google Login Success:", response);

        if (!response.credential) {
            console.error("No credential received from Google");
            return;
        }

        try {
            const backendResponse = await axios.post(
                "http://localhost:8000/auth/google/login/",
                { id_token: response.credential },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Backend Response:", backendResponse.data);
            login_google(backendResponse.data.access_token);
            navigate("/");
        } catch (error) {
            console.error("Error sending token to backend:", error);
        }
    };

    const handleError = () => {
        console.error("Google Login Failed");
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="outline"
            size="large"
            shape="pill"
            width="400"
        />

    );
};

export default GoogleLoginButton;