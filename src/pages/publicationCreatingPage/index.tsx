import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';
import { usePublicationsStore } from "../../store/publicationStore";
import Input from "../../shared/ui/input/input";
import Button from "../../shared/ui/button/button";

const categories = [
    "medicine", "emergency", "charity", "education",
    "ecology", "sports", "animals", "cancer", "general"
];

const CreatePublication = () => {
    const { addPublication } = usePublicationsStore();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        title: '', category: '', description: '', bank_details: '',
        amount: '', contact_name: '', contact_email: '', contact_phone: '',
    });

    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (files: FileList | null) => {
        if (files) {
            setMediaFiles([...mediaFiles, ...Array.from(files)]);
        }
    };

    const removeFile = (index: number) => {
        setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            form.append(key, formData[key as keyof typeof formData]);
        });

        mediaFiles.forEach((file) => {
            if (file.type.startsWith("image")) {
                form.append('uploaded_images', file);
            } else if (file.type.startsWith("video")) {
                form.append('uploaded_videos', file);
            }
        });

        try {
            const response = await addPublication(form);
            console.log(response)
            if (response) {
                alert(t('publication_created_successfully'));

                setFormData({
                    title: '', category: '', description: '', bank_details: '',
                    amount: '', contact_name: '', contact_email: '', contact_phone: '',
                });
                setMediaFiles([]);
            } else {
                alert(t('error_creating_publication'));
            }
        } catch (error) {
            alert(t('error_creating_publication'));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.container}>
            <h2>{t('create_post')}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.titleCategoryBlock}>
                    <label>{t('post_title')}</label>
                    <Input type="text" name="title" value={formData.title} onChange={handleChange} placeholder={t('enter_description')} required={true} />
                    <label>{t('category')}</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">{t('select_category')}</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {t(category)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.uploadArea}
                     onDragOver={(e) => e.preventDefault()}
                     onDrop={(e) => {
                         e.preventDefault();
                         handleFileUpload(e.dataTransfer.files);
                     }}
                     onClick={() => document.getElementById("fileInput")?.click()}
                >
                    {mediaFiles.length === 0 ? (
                        <div className={styles.uploadPlaceholder}>
                            <span className={styles.uploadIcon}>➕</span>
                            <p>{t('add_photo_or_video')}</p>
                        </div>
                    ) : (
                        <div className={styles.filePreviews}>
                            {mediaFiles.map((file, index) => (
                                <div key={index} className={styles.filePreview}>
                                    {file.type.startsWith('image') ? (
                                        <img src={URL.createObjectURL(file)} alt="preview" />
                                    ) : (
                                        <video src={URL.createObjectURL(file)} controls />
                                    )}
                                    <button className={styles.removeFile} onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}>✖</button>
                                </div>
                            ))}
                            <div className={styles.addMore} onClick={() => document.getElementById("fileInput")?.click()}>
                                <span>➕</span>
                                <p>{t('add_more')}</p>
                            </div>
                        </div>
                    )}
                    <input id="fileInput" type="file" multiple accept="image/*,video/mp4" hidden onChange={(e) => handleFileUpload(e.target.files)} />
                </div>

                <label>{t('description')}</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required={true}
                    placeholder={t('enter_description')}
                    className={styles.description}
                />
                <div className={styles.formSections}>
                    {/* ✅ Левая часть (Банк реквизиты) */}
                    <div className={styles.bankDetails}>
                        <label>{t('bank_details_amount')}</label>
                        <Input type="text" name="bank_details" value={formData.bank_details} onChange={handleChange} required={true} placeholder={t('bank_details_amount')} />
                        <Input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder={t('enter_amount')} required={true} />
                    </div>

                    {/* ✅ Правая часть (Контактные данные) */}
                    <div className={styles.contactInfo}>
                        <label>{t('contact_info')} *</label>
                        <Input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} placeholder={t('enter_name')} required={true} />
                        <Input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} placeholder={t('enter_email')} required={true} />
                        <Input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder={t('enter_number')} required={true} />
                    </div>
                </div>

                <Button type="submit" disabled={loading} className={styles.button}>
                    {loading ? t('loading') : t('submit_post')}
                </Button>

            </form>
        </div>
    );
};

export default CreatePublication;