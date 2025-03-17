import React, { useState, useEffect, useRef } from "react";
import styles from "./EditPostPopup.module.scss";
import IconSvg from "../../shared/assets/icons/Icon";
import { useTranslation } from "react-i18next";

interface PostData {
    title: string;
    category: string;
    description: string;
    amount: string;
    bank_details: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    images: (File | string)[];
}

interface EditPostPopupProps {
    post: PostData;
    onClose: () => void;
    onSave: (data: FormData) => void;
}

const categories: string[] = [
    "Медициналық",
    "Төтенше жағдай",
    "Қайырымдылық",
    "Білім беру саласы",
    "Жануарлар",
    "Экологиялық",
    "Спорт",
    "Жалпы қаражат жинау"
];

const EditPostPopup: React.FC<EditPostPopupProps> = ({ post, onClose, onSave }) => {
    const { t } = useTranslation();
    const categoryRef = useRef<HTMLDivElement>(null);
    const [showCategories, setShowCategories] = useState<boolean>(false);

    const [formData, setFormData] = useState<PostData>({
        title: post?.title || "",
        category: post?.category || "",
        description: post?.description || "",
        amount: post?.amount || "",
        bank_details: post?.bank_details || "",
        contact_name: post?.contact_name || "",
        contact_email: post?.contact_email || "",
        contact_phone: post?.contact_phone || "",
        images: post?.images || [],
    });

    // Выбор категории
    const handleCategorySelect = (category: string) => {
        setFormData({ ...formData, category });
        setShowCategories(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Функция получения URL изображения
    const getImageUrl = (image: string | File | undefined | null) => {
        if (!image) return null;

        if (typeof image === "string") {
            if (!image.trim()) return null; // Пустая строка
            return image.startsWith("http") ? image : `/uploads/${image}`;
        }

        if (image instanceof File) {
            return URL.createObjectURL(image);
        }

        return null;
    };


    // Загрузка изображений
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        if (formData.images.length + files.length > 5) return;

        setFormData({
            ...formData,
            images: [...formData.images, ...files],
        });
    };

    // Удаление фото
    const handleDeleteImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    // Перетаскивание фото (Drag & Drop)
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData("imageIndex", index.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("imageIndex"));
        if (isNaN(draggedIndex) || draggedIndex === index) return;

        const newImages = [...formData.images];
        const [draggedImage] = newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);
        setFormData({ ...formData, images: newImages });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // Функция отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("amount", formData.amount);
        formDataToSend.append("bank_details", formData.bank_details);
        formDataToSend.append("contact_name", formData.contact_name);
        formDataToSend.append("contact_email", formData.contact_email);
        formDataToSend.append("contact_phone", formData.contact_phone);

        // Добавляем файлы (если они новые)
        formData.images.forEach((img) => {
            if (img instanceof File) {
                formDataToSend.append("images", img);
            }
        });

        await onSave(formDataToSend);
        onClose();
    };

    // Закрытие dropdown при клике вне
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategories(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>{t("updatePost")}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <IconSvg name="closeIcon" width="25px" height="25px" />
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>{t("title")}</label>
                    <div className={styles.inputWrapper}>
                        <IconSvg name="textIcon" width="20px" height="20px" />
                        <input
                            className={styles.input}
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <label className={styles.label}>{t("category")}</label>
                    <div className={styles.categorySelect} ref={categoryRef} onClick={() => setShowCategories(!showCategories)}>
                        <span>{formData.category || t("chooseCategory")}</span>
                        <IconSvg name={showCategories ? "dropupIcon" : "dropdownIcon"} width="20px" height="20px" />
                    </div>

                    {showCategories && (
                        <div className={styles.categoryDropdown}>
                            {categories.map((cat) => (
                                <div key={cat} className={styles.categoryItem} onClick={() => handleCategorySelect(cat)}>
                                    {cat}
                                </div>
                            ))}
                        </div>
                    )}

                    <label className={styles.label}>{t("upload_images")}</label>
                    <div className={styles.imageContainer}>
                        {formData.images.map((img, index) => {
                            const imageUrl = getImageUrl(img);
                            return imageUrl ? (
                                <div
                                    key={index}
                                    className={styles.imageWrapper}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragOver={handleDragOver}
                                >
                                    <img src={imageUrl} alt="Preview" className={styles.imagePreview} />
                                    <button type="button" className={styles.deleteImage} onClick={() => handleDeleteImage(index)}>✖</button>
                                </div>
                            ) : null;
                        })}
                    </div>

                    {formData.images.length < 5 && (
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className={styles.fileInput} />
                    )}

                    {/* Описание */}
                    <label className={styles.label}>{t("description")}</label>
                    <div className={styles.inputWrapper}>
                        <IconSvg name="descriptionIcon" width="20px" height="20px" />
                        <textarea
                            className={styles.textarea}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Сумма */}
                    <label className={styles.label}>{t("amount")}</label>
                    <div className={styles.inputWrapper}>
                        <IconSvg name="moneyIcon" width="20px" height="20px" />
                        <input
                            className={styles.input}
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Банк */}
                    <label className={styles.label}>{t("bank_details")}</label>
                    <div className={styles.inputWrapper}>
                        <IconSvg name="cardIcon" width="20px" height="20px" />
                        <input
                            className={styles.input}
                            name="bank_details"
                            value={formData.bank_details}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Контактное лицо */}
                    <label className={styles.label}>{t("contact_name")}</label>
                    <div className={styles.inputWrapper}>
                        <IconSvg name="userIcon" width="20px" height="20px" />
                        <input
                            className={styles.input}
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <label className={styles.label}>{t("contact_email")}</label>
                    <div className={styles.inputWrapper}>
                        <IconSvg name="emailIcon" width="20px" height="20px" />
                        <input
                            className={styles.input}
                            type="email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Телефон */}
                    <label className={styles.label}>{t("contact_phone")}</label>
                    <div className={styles.inputWrapper}>
                        <IconSvg name="phoneicon" width="20px" height="20px" />
                        <input
                            className={styles.input}
                            type="tel"
                            name="contact_phone"
                            value={formData.contact_phone}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>{t("save")}</button>
                </form>
            </div>
        </div>
    );
};

export default EditPostPopup;
