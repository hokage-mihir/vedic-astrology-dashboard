# Cache Clearing Guide for PWA Updates

When you push new updates to the PWA, there are multiple layers of caching that can prevent users from seeing the latest version. Here's how to clear each layer:

## 🔍 Check Current Version

Look at the footer of the app - you should see a small version number like `v1.1.0-accordion+bottomsheet`. If you don't see this or see an older version, follow the steps below.

## 📱 On Your Phone (iOS/Android)

### Method 1: Hard Refresh (Quickest)
1. **Close the app completely** (swipe up from app switcher)
2. **Re-open the app**
3. **Pull down to refresh** (if available)
4. Check the version number in the footer

### Method 2: Clear PWA Cache (iOS)
1. Open **Settings** app
2. Go to **Safari** > **Advanced** > **Website Data**
3. Search for your domain name
4. Swipe left and **Delete**
5. Restart Safari
6. Visit your site fresh

### Method 3: Clear PWA Cache (Android)
1. Go to **Settings** > **Apps**
2. Find your PWA app in the list
3. Tap **Storage & cache**
4. Tap **Clear storage** and **Clear cache**
5. Re-install the PWA from the browser

### Method 4: Reinstall PWA (Both iOS/Android)
1. **Delete the app** from home screen
2. **Clear browser cache**:
   - iOS: Settings > Safari > Clear History and Website Data
   - Android: Chrome > Settings > Privacy > Clear browsing data
3. **Visit the site** in browser
4. **Install the PWA** again

## 💻 On Desktop (Testing)

### Chrome/Edge:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage** in the left sidebar
4. Check **all boxes** (Cache, Service Worker, etc.)
5. Click **Clear site data**
6. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Service Worker Specific:
1. DevTools > **Application** > **Service Workers**
2. Check **Update on reload**
3. Click **Unregister** next to your service worker
4. Refresh the page

## ☁️ Cloudflare Pages Cache

If the deployment succeeded but still showing old version, you may need to purge Cloudflare cache:

### Via Cloudflare Dashboard:
1. Log into Cloudflare Dashboard
2. Go to your domain
3. **Caching** > **Configuration**
4. Click **Purge Everything**
5. Wait 30 seconds
6. Test again

### Via URL Purge:
1. Go to **Caching** > **Configuration**
2. Click **Custom Purge**
3. Enter specific URLs:
   ```
   https://yourdomain.com/
   https://yourdomain.com/index.html
   https://yourdomain.com/assets/*
   ```
4. Click **Purge**

## 🚀 For Developers: Deployment Checklist

### Before Pushing to Production:
1. ✅ Build locally: `npm run build`
2. ✅ Test build: `npm run preview`
3. ✅ Verify version number appears
4. ✅ Commit changes with clear message
5. ✅ Push to GitHub

### After Deploying:
1. ✅ Wait for Cloudflare Pages build to complete
2. ✅ Check deployment logs for errors
3. ✅ Visit site in **incognito/private mode** first
4. ✅ Verify version number in footer
5. ✅ Test all new features
6. ✅ If old version shows, purge Cloudflare cache

### Force Users to Update:
If you want to force all users to get the new version, you can:

1. **Update the manifest version** in `vite.config.js`:
   ```javascript
   manifest: {
     name: 'Moon Mood - Vedic Astrology Dashboard',
     version: '1.1.0', // Update this
     // ...
   }
   ```

2. **Change service worker strategy** to force update:
   ```javascript
   registerType: 'autoUpdate', // Already set
   ```

3. **Show update notification** (already implemented via UpdateToast)

## 🔧 Debug Tips

### Check What Version is Deployed:
```bash
# View the footer source in production
curl https://yourdomain.com | grep -i "version"
```

### Check Service Worker:
1. Open DevTools > Application > Service Workers
2. Check **Update on reload**
3. Look at the **Status** - should be "activated and running"
4. Check **Source** - should show recent file timestamp

### Check Manifest:
1. DevTools > Application > Manifest
2. Verify **name**, **version**, and **icons** are correct

### Common Issues:

| Issue | Solution |
|-------|----------|
| Old version showing on phone | Clear PWA cache or reinstall app |
| New features not working | Check browser console for errors |
| Bottom sheet not appearing | Verify BottomSheet.jsx in dist bundle |
| Accordion not collapsing | Check PersonalStatusCard.jsx compact prop |
| Changes work locally but not production | Purge Cloudflare cache |

## 📊 Verify Deployment

After clearing caches, verify these features work:

### Accordion Cards:
- ✅ Chandrashtam card shows **compact/collapsed** by default
- ✅ Click to **expand** shows full details
- ✅ Rahu Kalam card also **compact/collapsed**
- ✅ Progress bar (not ring) in collapsed Chandrashtam

### Bottom Sheets:
- ✅ Click "Location" opens **bottom sheet** (not dropdown)
- ✅ Bottom sheet **slides up from bottom**
- ✅ Has **drag handle** at top
- ✅ Click "Rashi" opens **bottom sheet**
- ✅ Can **search locations** in sheet
- ✅ Tap **backdrop to close**

## 🆘 Still Not Working?

If you've tried everything:

1. Wait **5 minutes** - DNS/CDN propagation
2. Try **different browser** - rules out browser-specific cache
3. Try **different device** - rules out device-specific cache
4. Check **Cloudflare Pages build logs** - might be build errors
5. Check **browser console** for JavaScript errors

---

**Last Updated:** 2025-11-04
**Current Version:** v1.1.0-accordion+bottomsheet
