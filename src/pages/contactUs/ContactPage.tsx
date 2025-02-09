import React, { useState } from "react";
import styles from "./ContactPage.module.scss";
import Input from "../../shared/ui/input/input";
import Button from "../../shared/ui/button/button";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        subject: "",
        fullName: "",
        phone: "",
        email: "",
        message: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{t("contact_us")}</h2>
            <p className={styles.subtitle}>{t("contact_subtitle")}</p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                    <label>{t("subject")}</label>
                    <Input name="subject" value={formData.subject} onChange={handleChange} className={styles.inputFull} />
                </div>

                <div className={styles.inputWrapper}>
                    <label>{t("full_name")}</label>
                    <Input name="fullName" value={formData.fullName} onChange={handleChange} className={styles.inputFull} />
                </div>

                <div className={styles.inputWrapper}>
                    <label>{t("phone")}</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} className={styles.inputFull} />
                </div>

                <div className={styles.inputWrapper}>
                    <label>{t("email")}</label>
                    <Input name="email" value={formData.email} onChange={handleChange} className={styles.inputFull} />
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

                <div className={styles.fileUploadWrapper}>
                    <label>{t("upload_file")}</label>
                    <div className={styles.fileInputContainer}>
                        <input type="file" onChange={handleFileChange} className={styles.fileInput} />
                        {formData.file && <p>{formData.file.name}</p>}
                    </div>
                </div>

                <div className={styles.submitButtonWrapper}>
                    <Button type="submit" className={styles.submitButton}>{t("send")}</Button>
                </div>
            </form>
        </div>
    );
};

export default ContactPage;