# APK Build Instructions for Secure Distribution

## Quick Start - Build Production APK

### 1. Install Dependencies (first time only)
```bash
npm install
```

### 2. Build Secure APK
```bash
# Create a production APK
eas build --platform android --profile production
```

### 3. Set Up App Signing (First Build Only)
When you run the build command, EAS will ask if you want to:
- **Generate a new keystore** (Choose this for first build)
- Use an existing keystore

**IMPORTANT:** 
- Save your keystore file credentials in a secure location
- Never share or lose your keystore - you can't update the app without it
- Store the keystore file safely (backup to external drive)

### 4. Download the APK
After build completes, you can:
- Download directly from EAS Dashboard
- Share via secure channel with family member

## Security Checklist Before Sharing

- [ ] Version number updated in `app.json` (if needed)
- [ ] Verified eas.json is configured for production
- [ ] Keystore credentials saved securely
- [ ] No environment files (.env.local) committed to git
- [ ] Tested APK on your device first

## Sharing the APK

1. Download the APK from EAS or build locally
2. Send via secure channel (encrypted email, cloud storage, direct transfer)
3. Have recipient install via Android file manager or ADB

## Size & Performance

- APK should be ~50-70MB with all dependencies
- No external network dependencies
- Fast startup and offline functionality

## Troubleshooting

### Build fails with "Development build not available"
- This is normal for production builds
- Use `eas build --platform android` without `--profile production` if you need a debug build

### Can't update app after first build
- You must use the same keystore
- Restore keystore from backup if needed

### How to get APK file locally
```bash
eas build --platform android --profile production --local
```
This builds locally without uploading to EAS.

## Support

For more security info, see `SECURITY.md`
