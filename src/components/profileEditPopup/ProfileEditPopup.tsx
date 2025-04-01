import React, { useState, useEffect } from "react";
import styles from "./ProfileEditPopup.module.scss";
import Input from "../../shared/ui/input/input";
import Button from "../../shared/ui/button/button";
import IconSvg from "../../shared/assets/icons/Icon";
import { useProfileStore } from "../../store/profileStore";
import { useTranslation } from "react-i18next";
import defaultAvatar from "../../shared/assets/images/profile_default.png";

const countries = ["Kazakhstan", "Russia", "Uzbekistan", "Kyrgyzstan", "Turkmenistan"];
const regionsByCountry = {
    Kazakhstan: ["Almaty", "Astana", "Shymkent", "Atyrau", "Aktobe", "Karaganda", "Pavlodar", "Taraz", "Oskemen", "Semey"],
    Russia: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Chelyabinsk", "Omsk", "Samara", "Rostov-on-Don"],
    Uzbekistan: ["Tashkent", "Samarkand", "Bukhara", "Namangan", "Andijan", "Fergana", "Nukus", "Urgench", "Kokand"],
    Kyrgyzstan: ["Bishkek", "Osh", "Jalal-Abad", "Karakol", "Tokmok", "Talas", "Naryn", "Batken"],
    Turkmenistan: ["Ashgabat", "Turkmenabat", "Dashoguz", "Mary", "Balkanabat"]
};

const ProfileEditPopup = ({ onClose }) => {
    const { user, fetchUserProfile, updateUserProfile } = useProfileStore();
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

    const [previewUrl, setPreviewUrl] = useState(
        typeof user?.avatar === "string" ? user.avatar : ""
    );

    useEffect(() => {
        if (user?.avatar && typeof user.avatar === "string") {
            setPreviewUrl(user.avatar);
        }
    }, [user?.avatar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, avatar: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            formDataToSend.append("phone_number", formData.phone_number);
            formDataToSend.append("birth_date", formData.birth_date);
            formDataToSend.append("country", formData.country);
            formDataToSend.append("city", formData.region);
            formDataToSend.append("bio", formData.bio);

            if (formData.avatar && formData.avatar instanceof File) {
                formDataToSend.append("avatar", formData.avatar);
            }

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
                            src={previewUrl || defaultAvatar}
                            alt="Avatar"
                            className={styles.avatar}
                        />
                        <div className={styles.uploading} >
                            <label htmlFor="avatarUpload" className={styles.avatarLabel}>
                                {t('upload_photo')}
                            </label>
                        </div>
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
                                <Input name="first_name" value={formData.first_name} readOnly onChange={() => {}}
                                       className={styles.readonlyInput} />
                            </div>

                            <div className={styles.inputWrapper}>
                                <label>{t('last_name')}</label>
                                <Input name="last_name" value={formData.last_name} readOnly onChange={() => {}}
                                       className={styles.readonlyInput} />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.inputWrapper}>
                                <label>{t('email')}</label>
                                <Input
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    onChange={() => {}}
                                    className={styles.readonlyInput}
                                />
                            </div>

                            <div className={styles.inputWrapper}>
                                <label>{t('phone')}</label>
                                <Input
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={(e) => {
                                        const input = e.target.value;

                                        // Если пользователь стер +7, снова добавим
                                        const sanitized = input.startsWith('+7') ? input : '+7' + input.replace(/[^0-9]/g, '');
                                        setFormData({ ...formData, phone_number: sanitized });
                                    }}
                                    placeholder="+7**********"
                                    style={{ color: formData.phone_number ? '#000' : '#999' }} // делаем placeholder светлым
                                />
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
