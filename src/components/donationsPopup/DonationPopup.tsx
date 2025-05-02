import React, { useRef, useState } from 'react';
import styles from './donationPopup.module.scss';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import IconSvg from '../../shared/assets/icons/Icon';

interface DonationPopupProps {
    onClose: () => void;
    publicationId: number;
    onDonationSuccess?: () => void;
}

const DonationPopup: React.FC<DonationPopupProps> = ({ onClose, publicationId, onDonationSuccess }) => {
    const { t } = useTranslation();
    const token = useAuthStore.getState().token;
    const quickAmounts = [500, 1000, 5000, 10000];
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [supportPercentage, setSupportPercentage] = useState<number>(0.21);
    const [saveCard, setSaveCard] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const popupRef = useRef<HTMLDivElement>(null);
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    const supportAmount = Math.round(amount * supportPercentage);
    const total = amount + supportAmount;

    const isFormValid = () => amount > 0;

    const handleDonate = async () => {
        if (!token || !stripe || !elements) {
            alert(t('stripe_unavailable'));
            return;
        }

        try {
            setLoading(true);

            // Step 1: Create PaymentIntent on backend
            const response = await axios.post(
                `http://127.0.0.1:8000/donations/create-payment-intent/`,
                {
                    donor_amount: amount,
                    support_percentage: Math.round(supportPercentage * 100),
                    publication_id: publicationId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const clientSecret = response.data.client_secret;

            // Step 2: Confirm payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                }
            });

            if (result.error) {
                console.error(result.error.message);
                alert(t('donation_error'));
            } else if (result.paymentIntent?.status === 'succeeded') {
                alert(t('donation_success'));
                onDonationSuccess?.();
                onClose();
            }
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

                    <div>
                        <h2>{t('payment_method')}</h2>
                        <div className={styles.inputGroup}>
                            <label>{t('card_number')}</label>
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#333',
                                            fontFamily: 'inherit',
                                            '::placeholder': { color: '#bbb' }
                                        },
                                        invalid: {
                                            color: '#e5424d',
                                        }
                                    }
                                }}
                            />
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
