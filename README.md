# Quick Start Checklist

## 🎯 Get Your App Running in 5 Minutes

### ✅ Step 1: Set Up Firebase (Required)
- [ ] Go to https://console.firebase.google.com/
- [ ] Create new project or select existing one
- [ ] Go to Project Settings (⚙️ icon)
- [ ] Copy your Firebase config values
- [ ] Open `script.js` and replace lines 5-12 with your config

### ✅ Step 2: Enable Authentication
- [ ] In Firebase Console → Authentication → Sign-in method
- [ ] Enable **Email/Password**
- [ ] Enable **Google**
- [ ] For Google: Click Google, add OAuth Consent Screen

### ✅ Step 3: Set Up Google Sign-In (Optional)
- [ ] Go to https://console.cloud.google.com/
- [ ] Select your Firebase project
- [ ] Go to Credentials → Create OAuth 2.0 Client ID
- [ ] Choose Web application
- [ ] Add `http://localhost:3000` to Authorized redirect URIs
- [ ] Copy Client ID and update line 88 in script.js

### ✅ Step 4: Test Your App
- [ ] Run app with HTTPS enabled (required for camera!)
  - Use `python -m http.server` for local testing with HTTPS via localhost
  - Or use VSCode's Live Server extension
- [ ] Open in browser
- [ ] Create account or sign in
- [ ] Allow camera permissions when prompted
- [ ] You should see "📷 Camera active - scan a QR code"

### ✅ Step 5: Test QR Scanning
- [ ] Point camera at a QR code
- [ ] Result should appear in the scan box
- [ ] Click "Copy to Clipboard" to copy result
- [ ] Try scanning different QR codes

---

## 🔧 Troubleshooting

### Camera Not Showing
**Problem**: "❌ Camera access denied"
- ✓ Check browser camera permissions
- ✓ Grant permission in browser settings
- ✓ Restart browser
- ✓ Try HTTPS (required)

### No QR codes being scanned
**Problem**: Camera works but no scanning
- ✓ Make sure QR code is in focus
- ✓ Try better lighting
- ✓ Move closer to QR code
- ✓ Try different QR code

### Firebase Error: "apiKey is undefined"
**Problem**: App not loading
- ✓ Check Firebase config in script.js
- ✓ Make sure all fields are filled
- ✓ No extra quotes or formatting issues

### Google Sign-In not working
**Problem**: Button doesn't work
- ✓ Check Client ID in line 88 of script.js
- ✓ Verify redirect URI in Google Console
- ✓ Make sure OAuth Consent Screen is set up

---

## 📁 Project Structure
```
creative_application/
├── index.html              # Main page
├── script.js              # All JavaScript (auth + scanner)
├── style.css              # Styling
├── FIREBASE_SETUP.md      # Detailed Firebase guide
├── CHANGES.md             # What was changed
└── README.md              # This file
```

---

## 🔐 Security Reminders
⚠️ **DO NOT** share your Firebase credentials!
- Don't commit `script.js` with real keys to GitHub
- Use environment variables for production
- Rotate API keys regularly
- Enable Firebase Security Rules

---

## 📚 Useful Links
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Html5QRCode](https://scanapp.org/html5-qrcode.html)

---

## ✨ Features
✅ Email/Password authentication
✅ Google Sign-In
✅ QR code scanning
✅ Copy to clipboard
✅ Mobile responsive
✅ Secure Firebase backend

---

Need help? Read `FIREBASE_SETUP.md` for detailed instructions!
