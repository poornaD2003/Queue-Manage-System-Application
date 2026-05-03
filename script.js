// --- Authentication System ---
const loginPage = document.getElementById('login-page');
const appPage = document.getElementById('app-page');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const signupLink = document.getElementById('signup-link');

// Check if user is already logged in
function checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        showApp();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginPage.style.display = 'flex';
    appPage.style.display = 'none';
}

function showApp() {
    loginPage.style.display = 'none';
    appPage.style.display = 'block';
    // Auto-start scanner
    setTimeout(() => {
        initScanner();
    }, 500);
}

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!username || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Store user info (in production, you'd send this to a backend)
    const user = {
        username: username,
        email: email,
        loginTime: new Date().toISOString(),
        method: 'email'
    };

    localStorage.setItem('user', JSON.stringify(user));
    
    // Clear form
    loginForm.reset();
    
    // Show app
    showApp();
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    stopScanner();
    localStorage.removeItem('user');
    showLogin();
    loginForm.reset();
});

// Handle signup link click
signupLink.addEventListener('click', () => {
    alert('Sign up feature coming soon! For now, you can create an account using the login form.');
});

// Initialize Google Sign-In
window.onload = () => {
    google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleGoogleSignIn
    });

    google.accounts.id.renderButton(
        document.getElementById('google-signin-container'),
        {
            theme: 'filled_blue',
            size: 'large',
            width: '100%',
            text: 'signin_with'
        }
    );

    checkLoginStatus();
};

// Handle Google Sign-In
function handleGoogleSignIn(response) {
    // Decode JWT using the jwt-decode library
    const userObject = jwt_decode(response.credential);
    
    const user = {
        username: userObject.name,
        email: userObject.email,
        picture: userObject.picture,
        loginTime: new Date().toISOString(),
        method: 'google'
    };

    localStorage.setItem('user', JSON.stringify(user));
    showApp();
}

// Using jwt-decode library
const jwt_decode = window.jwt_decode;

// --- QR Scanner Setup ---
let html5QrCode = null;
let scanResultBox = null;
let copyBtn = null;
let lastScanResult = null;

// Initialize scanner elements (they will exist after page loads)
function initScannerElements() {
    if (!scanResultBox) scanResultBox = document.getElementById('scan-result');
    if (!copyBtn) copyBtn = document.getElementById('copy-btn');
}

function onScanSuccess(decodedText, decodedResult) {
    if (lastScanResult !== decodedText && scanResultBox) {
        lastScanResult = decodedText;
        scanResultBox.textContent = decodedText;
        if (copyBtn) copyBtn.classList.remove('hidden');
        
        // Optional: Provide visual feedback
        scanResultBox.style.borderColor = "var(--accent)";
        setTimeout(() => {
            scanResultBox.style.borderColor = "var(--border)";
        }, 1000);
    }
}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning
}

function initScanner() {
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        // Request camera permission first, then start scanner
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(() => {
            // Permission granted, now start the scanner
            html5QrCode.start(
                { facingMode: { ideal: "environment" } },
                config,
                onScanSuccess,
                onScanFailure
            ).catch(err => {
                console.error("Error starting scanner", err);
                if (scanResultBox) scanResultBox.textContent = "Error accessing webcam.";
            });
        })
        .catch(err => {
            console.error("Camera permission denied or unavailable", err);
            if (scanResultBox) scanResultBox.textContent = "Camera access denied. Please allow camera permissions.";
        });
    }
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            html5QrCode = null;
        }).catch(error => {
            console.error("Failed to stop scanner.", error);
            
            // Fallback attempt to clear if stop fails
            try {
                html5QrCode.clear();
                html5QrCode = null;
            } catch(e) {}
        });
        lastScanResult = null;
        if (scanResultBox) scanResultBox.textContent = "No result yet";
        if (copyBtn) copyBtn.classList.add('hidden');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize scanner elements
    initScannerElements();
    
    // Setup copy button if it exists
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (lastScanResult) {
                navigator.clipboard.writeText(lastScanResult).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = "Copied!";
                    copyBtn.style.background = "#059669";
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = "var(--accent)";
                    }, 2000);
                });
            }
        });
    }
});
