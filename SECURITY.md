# Bill Generator - Security Guidelines

## Security Measures Implemented

### 1. **Production Build Configuration**
- ✅ APK builds configured for production in `eas.json`
- ✅ Network debugging disabled (`enableNetworkDebugging: false`)
- ✅ Network inspector disabled (`enableNetworkInspector: false`)
- ✅ No hardcoded API keys or credentials detected

### 2. **Code Security**
- ✅ TypeScript enabled for type safety
- ✅ No sensitive data stored in plain text
- ✅ Input validation implemented in calculations

### 3. **Android App Signing**
To build the secure APK, use:
```bash
eas build --platform android --profile production
```

This will:
- Enable code minification (ProGuard/R8)
- Obfuscate class and method names
- Remove debugging symbols
- Sign the APK

### 4. **Key Security Practices**

#### Before Building:
1. Update version number in `app.json` if this is for distribution
2. Ensure `app.json` -> `android.package` matches your signing certificate
3. Never share your app signing keystore file

#### During Distribution:
1. Share the APK directly - not through app stores
2. Verify recipient identity before sharing
3. Consider sending via secure channel

#### Local Data:
- The app stores all bill data locally on device
- No data is sent to external servers
- Users have full control over their bill data

### 5. **Environment Variables**
- Use `.env.local` for sensitive configuration (don't commit to git)
- Reference `.env.example` for template variables
- Add `.env.local` to `.gitignore`

### 6. **Permissions**
Current app permissions:
- `INTERNET` - For viewing/sharing PDFs
- `WRITE_EXTERNAL_STORAGE` - For saving files
- `READ_EXTERNAL_STORAGE` - For accessing documents

These are the minimum required for bill generation functionality.

### 7. **Build Command**
```bash
# Install dependencies
npm install

# Build production APK (creates unsigned APK)
eas build --platform android --profile production

# For signed APK with your credentials
eas build --platform android --profile production --auto-submit
```

### 8. **Future Security Enhancements**
- [ ] Add app lock with PIN/biometric
- [ ] Encrypt local data storage
- [ ] Implement secure backup mechanism
- [ ] Add remote backup with encryption

## Recommendations for Family Use
1. Share APK only with trusted family members
2. Keep version updated with security fixes
3. Monitor for suspicious activity
4. Consider password-protecting bill data if needed

## No External APIs
This app is completely self-contained and doesn't depend on:
- Cloud services
- Third-party APIs
- Authentication servers
- Analytics services (except Expo telemetry)

Your family member's data stays completely private.
