// --- Firebase Configuration ---
// Replace with your Firebase config from Firebase Console
const firebaseConfig = {
   apiKey: "AIzaSyA0RZ_9PjrRMjcGoYUvEKlZeGtGQbDbBEg",
  authDomain: "queue-manage-653af.firebaseapp.com",
  projectId: "queue-manage-653af",
  storageBucket: "queue-manage-653af.firebasestorage.app",
  messagingSenderId: "327457406558",
  appId: "1:327457406558:web:c6d71a24bb7485e5e0fecf",
  measurementId: "G-2XZP32T69P"
};

// Initialize Firebase
let auth;
let loginPage, appPage, loginForm, logoutBtn, signupLink;

// Wait for Firebase to be available
function initializeApp() {
    try {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        
        // Get DOM elements
        loginPage = document.getElementById('login-page');
        appPage = document.getElementById('app-page');
        loginForm = document.getElementById('login-form');
        logoutBtn = document.getElementById('logout-btn');
        signupLink = document.getElementById('signup-link');
        
        if (!loginForm) {
            console.error('Login form not found!');
            return;
        }
        
        // Attach event listeners
        loginForm.addEventListener('submit', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        signupLink.addEventListener('click', handleSignupClick);
        
        // Check authentication status
        checkLoginStatus();
        
        // Initialize Google Sign-In
        initializeGoogleSignIn();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// --- Authentication System ---

// Check authentication status
function checkLoginStatus() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            showApp();
        } else {
            // User is signed out
            showLogin();
        }
    });
}

function showLogin() {
    loginPage.style.display = 'flex';
    appPage.style.display = 'none';
}

function showApp() {
    loginPage.style.display = 'none';
    appPage.style.display = 'block';
    // Auto-start scanner after slight delay
    setTimeout(() => {
        initScanner();
    }, 500);
}

// Handle email/password login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
        alert('Please fill in email and password');
        return;
    }

    try {
        console.log('Attempting to sign in with:', email);
        // Sign in with existing account only
        const result = await auth.signInWithEmailAndPassword(email, password);
        console.log('Sign in successful! User:', result.user.email);
        
        // Clear form
        loginForm.reset();
        
        // Wait a moment then show app
        setTimeout(() => {
            showApp();
        }, 500);
        
    } catch (error) {
        console.error('Sign in error code:', error.code);
        console.error('Sign in error message:', error.message);
        
        // Handle different error cases
        if (error.code === 'auth/user-not-found') {
            alert('Account not found. Please check your email and try again.');
        } else if (error.code === 'auth/wrong-password') {
            alert('Incorrect password. Please try again.');
        } else if (error.code === 'auth/invalid-email') {
            alert('Invalid email format.');
        } else if (error.code === 'auth/too-many-requests') {
            alert('Too many login attempts. Please try again later.');
        } else if (error.code === 'auth/user-disabled') {
            alert('This account has been disabled.');
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Handle logout
async function handleLogout() {
    stopScanner();
    try {
        await auth.signOut();
        loginForm.reset();
        showLogin();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out: ' + error.message);
    }
}

// Handle signup link click
function handleSignupClick() {
    alert('Use the form above to create a new account. Fill in all fields and click Sign In.');
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    try {
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
    } catch (error) {
        console.error('Google Sign-In initialization error:', error);
    }
}

// Handle Google Sign-In
async function handleGoogleSignIn(response) {
    try {
        // Decode JWT using the jwt-decode library
        const userObject = jwt_decode(response.credential);
        
        // Sign in with Google token using Firebase
        const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
        await auth.signInWithCredential(credential);
    } catch (error) {
        console.error('Google sign-in error:', error);
        alert('Error signing in with Google: ' + error.message);
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    initializeApp();
});

// Using jwt-decode library
const jwt_decode = window.jwt_decode;

// --- QR Scanner Setup ---
let html5QrCode = null;
let scanResultBox = null;
let copyBtn = null;
let lastScanResult = null;
let scannerActive = false;

// Initialize scanner elements
function initScannerElements() {
    if (!scanResultBox) scanResultBox = document.getElementById('scan-result');
    if (!copyBtn) copyBtn = document.getElementById('copy-btn');
}

function onScanSuccess(decodedText, decodedResult) {
    if (lastScanResult !== decodedText && scanResultBox) {
        lastScanResult = decodedText;
        scanResultBox.textContent = decodedText;
        if (copyBtn) copyBtn.classList.remove('hidden');
        
        // Provide visual feedback
        scanResultBox.style.borderColor = "var(--accent)";
        setTimeout(() => {
            scanResultBox.style.borderColor = "var(--border)";
        }, 1000);
    }
}

function onScanFailure(error) {
    // Ignore scan failures and keep scanning
    // console.log("Scan attempt failed:", error);
}

async function checkCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        // Stop the stream immediately after checking
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.error("Camera permission error:", error);
        if (scanResultBox) {
            if (error.name === 'NotAllowedError') {
                scanResultBox.textContent = "❌ Camera access denied. Please allow camera permissions in browser settings.";
            } else if (error.name === 'NotFoundError') {
                scanResultBox.textContent = "❌ No camera device found. Please connect a camera.";
            } else if (error.name === 'NotReadableError') {
                scanResultBox.textContent = "❌ Camera is in use by another application. Please close it and try again.";
            } else {
                scanResultBox.textContent = "❌ Error accessing camera: " + error.message;
            }
        }
        return false;
    }
}

async function initScanner() {
    if (scannerActive) {
        console.log("Scanner already active");
        return;
    }

    initScannerElements();

    // Check camera permission first
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) {
        return;
    }

    try {
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("reader");
        }

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            aspectRatio: 1.0
        };

        // Start the scanner with environment camera
        await html5QrCode.start(
            { facingMode: { ideal: "environment" } },
            config,
            onScanSuccess,
            onScanFailure
        );

        scannerActive = true;
        console.log("QR Scanner started successfully");
        if (scanResultBox) {
            scanResultBox.textContent = "📷 Camera active - scan a QR code";
            scanResultBox.style.borderColor = "var(--accent)";
        }
    } catch (err) {
        console.error("Error starting scanner:", err);
        scannerActive = false;
        if (scanResultBox) {
            if (err.toString().includes("Permission denied")) {
                scanResultBox.textContent = "❌ Camera permission required";
            } else if (err.toString().includes("OverconstrainedError")) {
                scanResultBox.textContent = "❌ Camera not compatible. Try using the rear camera.";
            } else {
                scanResultBox.textContent = "❌ Error: " + err.message;
            }
        }
    }
}

function stopScanner() {
    if (html5QrCode && scannerActive) {
        html5QrCode.stop()
            .then(() => {
                html5QrCode.clear();
                html5QrCode = null;
                scannerActive = false;
                console.log("QR Scanner stopped successfully");
            })
            .catch(error => {
                console.error("Error stopping scanner:", error);
                // Force cleanup
                try {
                    html5QrCode.clear();
                    html5QrCode = null;
                    scannerActive = false;
                } catch (e) {
                    console.error("Error during force cleanup:", e);
                }
            });

        lastScanResult = null;
        if (scanResultBox) {
            scanResultBox.textContent = "No result yet";
            scanResultBox.style.borderColor = "var(--border)";
        }
        if (copyBtn) copyBtn.classList.add('hidden');
    }
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize scanner elements
    initScannerElements();
    
    // Setup copy button if it exists
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (lastScanResult) {
                navigator.clipboard.writeText(lastScanResult).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = "✓ Copied!";
                    copyBtn.style.background = "#059669";
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = "var(--accent)";
                    }, 2000);
                }).catch(err => {
                    console.error("Copy error:", err);
                });
            }
        });
    }
});

// Handle page visibility changes to pause/resume scanner
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopScanner();
    } else if (appPage.style.display !== 'none') {
        // Only restart if app is visible
        setTimeout(() => {
            initScanner();
        }, 500);
    }
});
