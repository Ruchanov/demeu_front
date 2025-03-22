import React, { useState } from "react";
import styles from "./ProfileEditPopup.module.scss";
import Input from "../../shared/ui/input/input";
import Button from "../../shared/ui/button/button";
import IconSvg from "../../shared/assets/icons/Icon";
import { useProfileStore } from "../../store/profileStore";
import { useTranslation } from "react-i18next";

const countries = ["Kazakhstan", "Russia", "Uzbekistan", "Kyrgyzstan", "Turkmenistan"];
const regionsByCountry = {
    Kazakhstan: ["Almaty", "Astana", "Shymkent", "Atyrau", "Aktobe", "Karaganda", "Pavlodar", "Taraz", "Oskemen", "Semey"],
    Russia: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Chelyabinsk", "Omsk", "Samara", "Rostov-on-Don"],
    Uzbekistan: ["Tashkent", "Samarkand", "Bukhara", "Namangan", "Andijan", "Fergana", "Nukus", "Urgench", "Kokand"],
    Kyrgyzstan: ["Bishkek", "Osh", "Jalal-Abad", "Karakol", "Tokmok", "Talas", "Naryn", "Batken"],
    Turkmenistan: ["Ashgabat", "Turkmenabat", "Dashoguz", "Mary", "Balkanabat"]
};

const ProfileEditPopup = ({ onClose }) => {
    const { user, updateUserProfile, fetchUserProfile } = useProfileStore();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone_number: user?.phone_number || "",
        birth_date: user?.birth_date || "",
        country: user?.country || "",
        region: user?.city || "",
        bio: user?.bio || "",
        email: user?.email || "",
        avatar: user?.avatar || ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, avatar: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            console.log("📌 Отправляемые данные:", [...formDataToSend.entries()]);

            await updateUserProfile(formDataToSend);
            await fetchUserProfile();
            onClose();
        } catch (error) {
            console.error("❌ Ошибка при обновлении профиля:", error);
        }
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>{t('update')}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <IconSvg name="closeIcon" width="25px" height="25px" />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.avatarSection}>
                        <img
                            src={formData.avatar instanceof File ? URL.createObjectURL(formData.avatar) : user?.avatar}
                            alt="Avatar"
                            className={styles.avatar}
                        />

                        <label htmlFor="avatarUpload" className={styles.avatarLabel}>
                            {t('upload_photo')}
                        </label>
                        <input
                            type="file"
                            id="avatarUpload"
                            accept="image/*"
                            className={styles.hiddenInput}
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.inputWrapper}>
                                <label>{t('first_name')}</label>
                                <Input name="first_name" value={formData.first_name} onChange={handleChange} />
                            </div>

                            <div className={styles.inputWrapper}>
                                <label>{t('last_name')}</label>
                                <Input name="last_name" value={formData.last_name} onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.inputWrapper}>
                                <label>{t('email')}</label>
                                <Input name="email" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className={styles.inputWrapper}>
                                <label>{t('phone')}</label>
                                <Input name="phone_number" value={formData.phone_number} onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.inputWrapper}>
                                <label>{t('birth_date')}</label>
                                <Input name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Выбор страны */}
                        <div className={styles.inputWrapper}>
                            <label>{t('country')}</label>
                            <select name="country" value={formData.country} onChange={handleChange} className={styles.input}>
                                <option value="">{t('choose_country')}</option>
                                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Выбор региона (появляется только если страна выбрана) */}
                        {formData.country && regionsByCountry[formData.country] && (
                            <div className={styles.inputWrapper}>
                                <label>{t('region')}</label>
                                <select name="region" value={formData.region} onChange={handleChange} className={styles.input}>
                                    <option value="">{t('choose_region')}</option>
                                    {regionsByCountry[formData.country].map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <label>{t('additional_info')}</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className={styles.textarea}
                            placeholder={t('additional_info')}
                        />

                        <div className={styles.footer}>
                            <Button type="submit" className={styles.submitButton}>{t('save')}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditPopup;
