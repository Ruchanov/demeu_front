import React, { useState } from "react";
import styles from "./ContactPage.module.scss";
import Input from "../../shared/ui/input/input";
import Button from "../../shared/ui/button/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import IconSvg from "../../shared/assets/icons/Icon";

const ContactPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const [phoneError, setPhoneError] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        phone: "+7",
        message: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            let digitsOnly = value.replace(/\D/g, "");

            if (!digitsOnly.startsWith("7")) {
                digitsOnly = "7" + digitsOnly;
            }

            const phone = "+7" + digitsOnly.slice(1, 11); // +7 + 10 цифр
            setFormData({ ...formData, phone });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setMediaFiles((prev) => [...prev, ...files]);
    };

    const handleDeleteImage = (index) => {
        const updated = [...mediaFiles];
        updated.splice(index, 1);
        setMediaFiles(updated);
    };


    const removeImage = (e, index) => {
        e.preventDefault();
        const newFiles = [...mediaFiles];
        newFiles.splice(index, 1);
        setMediaFiles(newFiles);
        setFormData({ ...formData, file: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValidPhone = /^\+7\d{10}$/.test(formData.phone);
        if (!isValidPhone) {
            setPhoneError(true);
            return;
        }

        setPhoneError(false);
        setLoading(true);

        const data = new FormData();
        data.append("theme", formData.subject);
        data.append("phone_number", formData.phone);
        data.append("text", formData.message);
        if (formData.file?.length) {
            formData.file.forEach((file) => {
                data.append("uploaded_images", file);
            });
        }

        try {
            const response = await fetch("http://localhost:8000/info/feedback/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });

            if (response.ok) {
                // Сброс формы
                setFormData({
                    subject: "",
                    phone: "+7",
                    message: "",
                    file: null,
                });
                navigate("/profiles/me");
            } else {
                console.error("Failed to submit form", response.status);
            }
        } catch (error) {
            console.error("Network error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{t("contact_us")}</h2>
            <p className={styles.subtitle}>{t("contact_subtitle")}</p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                    <label>{t("subject")}</label>
                    <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={styles.inputFull}
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label>{t("phone")}</label>
                    <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${styles.inputFull} ${phoneError ? styles.inputError : ""}`}
                        placeholder="+7XXXXXXXXXX"
                    />
                    {phoneError && (
                        <span className={styles.errorText}>{t("invalid_phone")}</span>
                    )}
                </div>

                <div className={styles.inputWrapper}>
                    <label>{t("message")}</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={styles.textarea}
                        placeholder={t("message_placeholder")}
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label className={styles.label}>{t("upload_images")}</label>
                    <p className={styles.hintText}>{t("upload_hint")}</p>

                    <div className={styles.imageContainer}>
                        {mediaFiles.map((file, index) => (
                            <div key={index} className={styles.imageWrapper}>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className={styles.imagePreview}
                                />
                                <button
                                    type="button"
                                    className={styles.deleteImage}
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}

                        <label className={styles.addImage}>
                            <IconSvg name="cameraIcon" width="40px" height="40px" />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className={styles.fileInput}
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.submitButtonWrapper}>
                    <Button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? t("sending") : t("send")}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ContactPage;