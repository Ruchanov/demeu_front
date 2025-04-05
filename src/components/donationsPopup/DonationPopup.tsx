import React, {useEffect, useRef, useState} from 'react';
import styles from './donationPopup.module.scss';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { createDonation } from '../../api/donationsApi';
import IconSvg from "../../shared/assets/icons/Icon";
import { createPortal } from 'react-dom';

interface DonationPopupProps {
    onClose: () => void;
    publicationId: number;
    onDonationSuccess?: () => void;
}

const DonationPopup: React.FC<DonationPopupProps> = ({ onClose, publicationId, onDonationSuccess }) => {
    const { t } = useTranslation();
    const token = useAuthStore.getState().token;
    const [saveCard, setSaveCard] = useState(false);
    const quickAmounts = [500, 1000, 5000, 10000];
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [supportPercentage, setSupportPercentage] = useState<number>(0.21);

    // Card form states
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const popupRef = useRef<HTMLDivElement>(null);
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    // useEffect(() => {
    //     const modalRoot = document.getElementById('modal-root') || document.body;
    //     const el = popupRef.current;
    //     if (el && modalRoot) {
    //         modalRoot.appendChild(el);
    //         return () => { modalRoot.removeChild(el); };
    //     }
    // }, []);

    const supportAmount = Math.round(amount * supportPercentage);
    const total = amount + supportAmount;

    const isFormValid = () => {
        return (
            amount > 0 &&
            cardNumber.replace(/\s/g, '').length === 16 &&
            /^\d{2}\/\d{2}$/.test(expiry) &&
            cvv.length === 3
        );
    };

    const handleDonate = async () => {
        if (!token) {
            alert(t('login_first'));
            return;
        }

        try {
            setLoading(true);
            await createDonation(
                publicationId,
                {
                    donor_amount: amount,
                    support_percentage: Math.round(supportPercentage * 100),
                },
                token
            );
            alert(t('donation_success'));
            onDonationSuccess?.();
            onClose();
        } catch (error) {
            console.error("Ошибка:", error);
            alert(t('donation_error'));
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button className={styles.close} onClick={onClose}>×</button>
                <div className={styles.highsection}>
                    <div className={styles.donationAmount}>
                        <h2>{t('donation_amount')}</h2>
                        <div className={styles.quickButtons}>
                            {quickAmounts.map((val) => (
                                <button key={val} onClick={() => setAmount(val)}>
                                    {val.toLocaleString()} ₸
                                </button>
                            ))}
                        </div>

                        <div className={styles.amountInputWrapper}>
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={amount === 0 ? '' : amount}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9.]/g, '');
                                    setAmount(raw === '' ? 0 : parseFloat(raw));
                                }}
                                className={styles.amountInput}
                            />
                            <span className={styles.currency}>₸</span>
                        </div>


                        <div className={styles.supportBox}>
                            <p>{t('support_demeu_description')}</p>

                            <input
                                type="range"
                                min={0}
                                max={35}
                                value={Math.round(supportPercentage * 100)}
                                step={1}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    setSupportPercentage(val / 100);
                                }}
                                className={styles.slider}
                                style={{
                                    background: `linear-gradient(
      to right,
      #00b46e 0%,
      #00b46e ${supportPercentage * 100 * 100 / 35}%,
      #ddd ${supportPercentage * 100 * 100 / 35}%,
      #ddd 100%
    )`,
                                }}
                            />


                            <div className={styles.sliderValueWrapper}>
                                <span
                                    className={styles.sliderValue}
                                    style={{ left: `${supportPercentage * 100 * 100 / 35}%` }}
                                >
                                    {Math.round(supportPercentage * 100)}%
                                </span>
                            </div>
                            <div className={styles.barLabels}>
                                <span>0%</span>
                                <span>35%</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.paymentMethod}>
                        <h2>{t('payment_method')}</h2>

                        {/* Card Number */}
                        <div className={styles.inputGroup}>
                            <label>{t('card_number')}</label>
                            <div className={styles.underlineInput}>
                                <input
                                    type="text"
                                    maxLength={19}
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '').slice(0, 16);
                                        const formatted = rawValue.replace(/(.{4})/g, '$1 ').trim();
                                        setCardNumber(formatted);
                                    }}
                                />
                                <IconSvg name="cardIcon2" />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>{t('expiry')}</label>
                                <div className={styles.underlineInput}>
                                    <input
                                        type="text"
                                        maxLength={5}
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                            if (val.length >= 3) {
                                                val = val.slice(0, 2) + '/' + val.slice(2);
                                            }
                                            setExpiry(val);
                                        }}
                                    />
                                    <IconSvg name="ddmmIcon" />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>{t('cvv')}</label>
                                <div className={styles.underlineInput}>
                                    <input
                                        type="password"
                                        maxLength={3}
                                        placeholder="•••"
                                        value={cvv}
                                        onChange={(e) => {
                                            const digits = e.target.value.replace(/\D/g, '').slice(0, 3);
                                            setCvv(digits);
                                        }}
                                    />
                                    <IconSvg name="cvvIcon" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.saveCard}>
                            <label className={styles.customCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={saveCard}
                                    onChange={() => setSaveCard((prev) => !prev)}
                                />
                                <span className={styles.checkmark}></span>
                                {t('save_card_for_future')}
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.summary}>
                    <div className={styles.line}>
                        <span>{t('your_donation')}</span>
                        <span>{amount.toLocaleString()} ₸</span>
                    </div>
                    <div className={styles.line}>
                        <span>{t('support_demeu')}</span>
                        <span className={styles.supportGreen}>{supportAmount.toLocaleString()} ₸</span>
                    </div>
                    <div className={styles.total}>
                        <span>{t('total')}</span>
                        <span>{total.toLocaleString()} ₸</span>
                    </div>
                </div>

                <button
                    className={styles.confirm}
                    onClick={handleDonate}
                    disabled={loading || !isFormValid()}
                >
                    {loading ? t('loading') : t('donate_now')}
                </button>
            </div>
        </div>,
    modalRoot
    );
};

export default DonationPopup;
