// ====== OTP Authentication using Firebase ======

let recaptchaVerifier = null;
let confirmationResult = null;

// Setup invisible reCAPTCHA
function setupRecaptcha() {
    if (!firebaseAuth) {
        console.warn('Firebase not initialized — using demo OTP mode');
        return false;
    }

    try {
        recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            callback: (response) => {
                console.log('reCAPTCHA verified');
            }
        });
        return true;
    } catch (error) {
        console.warn('reCAPTCHA setup error:', error.message);
        return false;
    }
}

// Send OTP to phone number
async function sendOTP(phoneNumber) {
    // Ensure phone number has country code
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+91' + phoneNumber;
    }

    // Demo mode if Firebase is not configured
    if (!firebaseAuth || firebaseConfig.apiKey === 'YOUR_FIREBASE_API_KEY') {
        console.log('Demo mode: OTP "sent" to', phoneNumber);
        return { success: true, demo: true, message: t('otp_sent') };
    }

    try {
        if (!recaptchaVerifier) {
            const ok = setupRecaptcha();
            if (!ok) return { success: true, demo: true, message: t('otp_sent') };
        }

        confirmationResult = await firebaseAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
        return { success: true, demo: false, message: t('otp_sent') };
    } catch (error) {
        console.error('Send OTP error:', error);
        // Reset reCAPTCHA on error
        if (recaptchaVerifier) {
            recaptchaVerifier.clear();
            recaptchaVerifier = null;
        }
        return { success: false, message: error.message };
    }
}

// Verify OTP code
async function verifyOTP(otpCode) {
    // Demo mode — accept any 4-digit code
    if (!confirmationResult) {
        console.log('Demo mode: OTP verified with code', otpCode);
        return { success: true, demo: true, message: t('otp_verified') };
    }

    try {
        const result = await confirmationResult.confirm(otpCode);
        const user = result.user;
        console.log('Firebase user authenticated:', user.phoneNumber);
        return {
            success: true,
            demo: false,
            message: t('otp_verified'),
            user: {
                uid: user.uid,
                phone: user.phoneNumber
            }
        };
    } catch (error) {
        console.error('Verify OTP error:', error);
        return { success: false, message: t('otp_error') };
    }
}
