import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';
import { usePublicationsStore } from "../../store/publicationStore";
import Input from "../../shared/ui/input/input";
import Button from "../../shared/ui/button/button";
import CreatePublicationPopup from "../../components/createPublicationPopup/createPublicationPopup";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../../store/profileStore";
import medIcon from '../../shared/assets/icons/cat_med.svg';
import emerIcon from '../../shared/assets/icons/cat_emer.svg';
import charIcon from '../../shared/assets/icons/cat_char.svg';
import eduIcon from '../../shared/assets/icons/cat_edu.svg';
import envIcon from '../../shared/assets/icons/cat_env.svg';
import spoIcon from '../../shared/assets/icons/cat_spo.svg';
import aniIcon from '../../shared/assets/icons/cat_ani.svg';
import cancIcon from '../../shared/assets/icons/cat_canc.svg';
import genIcon from '../../shared/assets/icons/cat_gen.svg';
import backgroundImg from "../../shared/assets/images/create_post_bg.svg";
import {createPublication} from "../../api/publicationsApi";
import {useAuthStore} from "../../store/authStore";
const categoryIcons: Record<string, string> = {
    medicine: medIcon,
    emergency: emerIcon,
    charity: charIcon,
    education: eduIcon,
    ecology: envIcon,
    sports: spoIcon,
    animals: aniIcon,
    cancer: cancIcon,
    general: genIcon
};

const categories = [
    "medicine", "emergency", "charity", "education",
    "ecology", "sports", "animals", "general"
];




const CreatePublication = () => {
    const token = useAuthStore((state) => state.token); // ✅ Вызов хука в правильном месте

    const { addPublication } = usePublicationsStore();
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '', category: 'medicine', description: '', bank_details: '',
        amount: '', contact_name: '', contact_email: '', contact_phone: '',
        // id_card: null,
        // supporting_documents: null,
        // income_statement: null,
    });
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, navigate]);

    const { user } = useProfileStore();

    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const getFileIcon = (file) => {
        const ext = file.name.split('.').pop().toLowerCase();
        if (["pdf"].includes(ext)) return "📄"; // PDF
        return "📁";
    };

    const removeFile = (key: string, indexToRemove: number, event: React.MouseEvent) => {
        // event.stopPropagation(); // Остановить всплытие клика
        // event.preventDefault(); // Остановить стандартное поведение браузера

        setUploadedFiles((prev) => ({
            ...prev,
            [key]: prev[key].filter((_, index) => index !== indexToRemove),
        }));
    };


    const removeImage = (e, indexToRemove) => {
        e.stopPropagation();
        setMediaFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
        id_card: [],
        supporting_documents: [],
        income_statement: [],
    });


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const selectedFiles = Array.from(event.target.files || []);
        if (!selectedFiles.length) return;

        setUploadedFiles((prev) => {
            const existingFiles = prev[key] || [];

            if (existingFiles.length + selectedFiles.length > 5) {
                alert(t('file_upload_limit_exceeded')); // ✅ Можно заменить на toast
                return prev; // ничего не меняем
            }

            return {
                ...prev,
                [key]: [...existingFiles, ...selectedFiles],
            };
        });

        // Сбрасываем значение input, чтобы можно было повторно выбрать тот же файл
        event.target.value = '';
    };


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "media" | "documents", fieldName?: string) => {
        if (!e.target.files || e.target.files.length === 0) return;

        if (type === "media") {
            setMediaFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
        }
        // else if (type === "documents" && fieldName) {
        //     setFormData((prevState) => ({
        //         ...prevState,
        //         [fieldName]: e.target.files[0], // ✅ Берем только первый файл (File)
        //     }));
        // }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    const toggleCategory = (categoryName: string) => {
        setOpenCategory(openCategory === categoryName ? null : categoryName);
    };
    const documentCategories = [
        {
            name: 'medicine',
            documents: ['Medical certificate', 'Invoices', 'Doctor referral'],
        },
        {
            name: 'education',
            documents: ['School enrollment proof', 'Scholarship letter'],
        },
        {
            name: 'ecology',
            documents: ['Ecological project approval'],
        },
        {
            name: 'emergency',
            documents: ['Disaster relief request', 'Government approval'],
        },
        {
            name: 'charity',
            documents: ['Non-profit registration', 'Fundraising authorization'],
        },
        {
            name: 'animals',
            documents: ['Veterinary certificate'],
        },
        {
            name: 'general',
            documents: ['General support document'],
        },
        {
            name: 'sports',
            documents: ['Sports competition registration'],
        },
    ];
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!formData.category) {
            alert(t('choose_the_category'));
            setLoading(false);
            return;
        }
        const form = new FormData();

        form.append("title", formData.title);
        form.append("category", formData.category);
        form.append("description", formData.description || "");
        form.append("bank_details", formData.bank_details || "");
        form.append("amount", formData.amount);
        form.append("contact_name", formData.contact_name);
        form.append("contact_email", formData.contact_email);
        form.append("contact_phone", formData.contact_phone);


        if (mediaFiles.length > 0) {
            mediaFiles.forEach((file) => {
                if (file.type.startsWith("image")) {
                    form.append("uploaded_images", file);
                } else if (file.type.startsWith("video")) {
                    form.append("uploaded_videos", file);
                }
            });
        }

        let documentTypes: string[] = [];

        if (uploadedFiles.id_card.length > 0) {
            uploadedFiles.id_card.forEach((file) => {
                form.append("uploaded_documents", file);
                documentTypes.push("identity");
            });
        }

        if (uploadedFiles.income_statement.length > 0) {
            uploadedFiles.income_statement.forEach((file) => {
                form.append("uploaded_documents", file);
                documentTypes.push("income"); // Каждый файл - "income"
            });
        }

        if (uploadedFiles.supporting_documents.length > 0) {
            uploadedFiles.supporting_documents.forEach((file) => {
                form.append("uploaded_documents", file);
                documentTypes.push("supporting"); // Каждый файл - "supporting"
            });
        }

        documentTypes.forEach((type) => {
            form.append("uploaded_document_types[]", type);
        });

        const handleSubmit = async () => {
            try {
                const response = await createPublication(form, token);
                setIsPopupOpen(true);
            } catch (error) {
                alert("Failed to create publication!");
            }
            finally {
                setLoading(false);
            }
        };
        handleSubmit();
    };





    return (
        <div className={styles.container}>
            <div className={styles.leftSide} style={{backgroundImage: `url(${backgroundImg})`}}>
                <h2>{t('create_post')}</h2>
                <p className={styles.subtitle}>{t('support_every_soul')}</p> {/* Добавляем сабтекст */}
                <div className={styles.steps}>
                    {[1, 2, 3].map((stepNum) => (
                        <div
                            key={stepNum}
                            className={`${styles.step} ${step === stepNum ? styles.active : ''}`}
                            onClick={() => setStep(stepNum)}
                        >
                            {stepNum}
                        </div>
                    ))}
                </div>


            </div>

            <div className={styles.rightSide}>
                {step === 1 && (
                    <div className={styles.formStep}>
                        <label>{t('post_title')}</label>
                        <Input type="text" name="title" value={formData.title} onChange={handleChange} required/>
                        <label>{t('category')}</label>
                        <div className={styles.categoriesContainer}>
                            {categories.map((category) => {
                                const iconPath = categoryIcons[category];

                                return (
                                    <div
                                        key={category}
                                        className={`${styles.categoryItem} ${formData.category === category ? styles.active : ''}`}
                                        onClick={() => setFormData({...formData, category})}
                                    >
                                        <div className={styles.iconWrapper}>
                                            <img src={iconPath} alt={category} className={styles.categoryIcon}/>
                                        </div>
                                        <p className={styles.categoryName}>{t(category)}</p>
                                    </div>
                                );
                            })}
                        </div>


                        <label>{t('upload_media')}</label>
                        <div className={styles.mediaUpload}>
                            {mediaFiles.map((file, index) => (
                                <div key={index} className={styles.imagePreview}>
                                    <img src={URL.createObjectURL(file)} alt={`Uploaded ${index}`}/>
                                    <button className={styles.removeImage} onClick={(e) => removeImage(e, index)}>✖
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <div className={styles.addMore}
                                 onClick={() => document.getElementById('mediaFileInput')?.click()}>
                                <span>+</span>
                                <p>{t('add_more')}</p>
                            </div>

                            {/* File Input */}
                            <input
                                id="mediaFileInput"
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                style={{display: 'none'}}
                                onChange={(e) => handleFileUpload(e, "media")}
                            />
                        </div>


                        <label>{t('description')}</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={styles.descriptionField}
                            rows={5} // Set initial height
                            placeholder={t("Enter detailed description here...")}
                        />

                        <div className={styles.firstPageButtons}>
                            <Button className={styles.smallButton} onClick={() => setStep(2)}>
                                {t('continue')}
                            </Button>
                        </div>

                    </div>
                )}

                {step === 2 && (
                    <div className={styles.secondPage}>
                        <h3>{t('required_documents')}</h3>

                        {/* Required Documents List */}
                        <div className={styles.documentsList}>
                            {documentCategories.map((category) => (
                                <div
                                    key={category.name}
                                    className={`${styles.documentCategory} ${openCategory === category.name ? styles.active : ''}`}
                                    onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                                    style={{zIndex: openCategory === category.name ? 9999 : 'auto'}} // 🔹 Boost z-index for the open category
                                >
                                    <div className={styles.categoryHeader}
                                         style={{fontWeight: 'normal'}}>  {/* ✅ Ensure no bold */}
                                        <span>{t(category.name)}</span>
                                        <span className={styles.dropdownIcon}>
            {openCategory === category.name ? '▲' : '▼'}
        </span>
                                    </div>
                                    <ul className={styles.subDocuments}
                                        style={{
                                            display: openCategory === category.name ? 'block' : 'none',
                                            zIndex: 99999, // 🔹 Ensure dropdown is always on top
                                        }}>
                                        {category.documents.map((doc) => (
                                            <li key={doc}>{t(doc)}</li>
                                        ))}
                                    </ul>
                                </div>

                            ))}
                        </div>


                        <div className={styles.fileUploadContainer}>
                            {/* First Upload Field */}
                            <div className={styles.fileUploadSection}>
                                <label className={styles.fileLabel}>
                                    {t('id_card')} <span style={{color: 'red'}}>*</span>
                                </label>
                                <div className={styles.uploadDescription}>{t('id_card_description')}</div>
                                <div className={styles.fileUploadArea}>
                                    <div className={styles.fileListContainer}>
                                        {uploadedFiles.id_card.map((file, index) => (
                                            <div key={index} className={styles.fileItem}>
                                                <span className={styles.fileIcon}>{getFileIcon(file)}</span>
                                                <span className={styles.fileName}>{file.name}</span>
                                                <button
                                                    className={styles.removeFileButton}
                                                    onClick={(e) => removeFile("id_card", index, e)}
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))}

                                        {/* Кнопка «Қосу» — единственная, которая вызывает file input */}
                                        <div
                                            className={styles.addMoreFile}
                                            onClick={() => document.getElementById("id_card")?.click()}
                                        >
                                            <span>+</span>
                                            <p>{t('add_more')}</p>
                                            <input
                                                id="id_card"
                                                type="file"
                                                className={styles.hiddenFileInput}
                                                multiple
                                                onChange={(e) => handleFileChange(e, "id_card")}
                                                style={{display: 'none'}}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div className={styles.fileUploadSection}>
                                <label className={styles.fileLabel}>
                                    {t('supporting_documents')} <span style={{color: 'red'}}>*</span>
                                </label>
                                <div className={styles.uploadDescription}>{t('supporting_docs_description')}</div>
                                <div className={styles.fileUploadArea}>
                                    <div className={styles.fileListContainer}>
                                        {uploadedFiles.supporting_documents.map((file, index) => (
                                            <div key={index} className={styles.fileItem}>
                                                <span className={styles.fileIcon}>{getFileIcon(file)}</span>
                                                <span className={styles.fileName}>{file.name}</span>
                                                <button
                                                    className={styles.removeFileButton}
                                                    onClick={(e) => removeFile("supporting_documents", index, e)}
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))}

                                        {/* Кнопка «Қосу» — единственная, которая вызывает file input */}
                                        <div
                                            className={styles.addMoreFile}
                                            onClick={() => document.getElementById("supporting_documents")?.click()}
                                        >
                                            <span>+</span>
                                            <p>{t('add_more')}</p>
                                            <input
                                                id="supporting_documents"
                                                type="file"
                                                className={styles.hiddenFileInput}
                                                multiple
                                                onChange={(e) => handleFileChange(e, "supporting_documents")}
                                                style={{display: 'none'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className={styles.fileUploadSection}>
                                <label className={styles.fileLabel}>
                                    {t('income_statement')} <span style={{color: 'red'}}>*</span>
                                </label>
                                <div className={styles.uploadDescription}>{t('income_statement_description')}</div>
                                <div className={styles.fileUploadArea}>
                                    <div className={styles.fileListContainer}>
                                        {uploadedFiles.income_statement.map((file, index) => (
                                            <div key={index} className={styles.fileItem}>
                                                <span className={styles.fileIcon}>{getFileIcon(file)}</span>
                                                <span className={styles.fileName}>{file.name}</span>
                                                <button
                                                    className={styles.removeFileButton}
                                                    onClick={(e) => removeFile("income_statement", index, e)}
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))}

                                        {/* Кнопка «Қосу» — единственная, которая вызывает file input */}
                                        <div
                                            className={styles.addMoreFile}
                                            onClick={() => document.getElementById("income_statement")?.click()}
                                        >
                                            <span>+</span>
                                            <p>{t('add_more')}</p>
                                            <input
                                                id="income_statement"
                                                type="file"
                                                className={styles.hiddenFileInput}
                                                multiple
                                                onChange={(e) => handleFileChange(e, "income_statement")}
                                                style={{display: 'none'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className={styles.bankAmountSection}>
                            {/* Bank Details Field */}
                            <div className={styles.bankFieldContainer}>
                                <div className={styles.labelContainer}>
                                    <span className={styles.labelText}>{t("bank_details")}</span>
                                </div>
                                <input
                                    type="text"
                                    name="bank_details"
                                    value={formData.bank_details || ""}
                                    onChange={handleChange}
                                    placeholder={t("bank_details_placeholder")}
                                    className={styles.inputField}
                                />
                            </div>

                            {/* Required Amount Field */}
                            <div className={styles.bankFieldContainer}>
                                <div className={styles.labelContainer}>
                                    <span className={styles.labelText}>{t("required_amount")}</span>
                                </div>
                                <input
                                    type="text"
                                    name="amount"
                                    value={formData.amount || ""}
                                    onChange={handleChange}
                                    placeholder={t("enter_amount")}
                                    className={styles.inputField}
                                />
                            </div>
                        </div>


                        {/* Navigation Buttons */}
                        <div className={styles.navigationButtons}>
                            <Button className={styles.backButton} onClick={() => setStep(1)}>
                                {t('back')}
                            </Button>
                            <Button className={styles.smallButton} onClick={() => setStep(3)}>
                                {t('continue')}
                            </Button>
                        </div>
                    </div>
                )}


                {step === 3 && (
                    <div className={styles.thirdStepContainer}>
                        <div className={styles.thirdStepBox}>
                            <h3>{t('contact_info')}</h3>

                            <Input
                                type="text"
                                name="contact_name"
                                value={formData.contact_name}
                                onChange={handleChange}
                                required
                                placeholder={t('contact_person')}
                                className={styles.inputField}
                            />
                            <Input
                                type="email"
                                name="contact_email"
                                value={formData.contact_email}
                                onChange={handleChange}
                                required
                                placeholder={t('email')}
                                className={styles.inputField}
                            />
                            <Input
                                type="tel"
                                name="contact_phone"
                                value={formData.contact_phone}
                                onChange={handleChange}
                                required
                                placeholder={t('phone_number')}
                                className={styles.inputField}
                            />

                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={styles.submitButton}
                            >
                                {loading ? t('loading') : t('submit_post')}
                            </Button>

                            <CreatePublicationPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CreatePublication;
