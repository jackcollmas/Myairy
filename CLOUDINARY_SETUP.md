# Cloudinary Image Upload Setup Guide

## Overview
Your Myairy journal app now supports image uploads! Images are stored on Cloudinary's cloud platform, which offers a generous free tier perfect for personal use.

## Features Added
✅ **Upload images** - Click the 📷 button to upload photos  
✅ **Image preview** - Preview before sending  
✅ **Automatic optimization** - Cloudinary auto-optimizes images  
✅ **Fullscreen view** - Click any image to view in fullscreen  
✅ **Caption support** - Add text captions to your images  
✅ **Mixed content** - Images work alongside text and AI chat  

## Cloudinary Free Tier
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Perfect for**: Personal journal with daily photos

## Setup Instructions

### Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up for a free account (no credit card required)
3. Verify your email address
4. Log into the Cloudinary console

### Step 2: Get Your Credentials
After logging in, you'll see your **Dashboard**:

1. Look for the **Account Details** section
2. You'll see three key values:
   - **Cloud Name** (e.g., `dab123xyz`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

### Step 3: Configure Your App
Open your `.env` file and replace the placeholder values:

```env
# Cloudinary Configuration for Image Uploads
CLOUDINARY_CLOUD_NAME="your_actual_cloud_name"
CLOUDINARY_API_KEY="your_actual_api_key"
CLOUDINARY_API_SECRET="your_actual_api_secret"
```

**Example with real values:**
```env
CLOUDINARY_CLOUD_NAME="dab123xyz"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123"
```

### Step 4: Start the Server
```bash
npm run dev
```

### Step 5: Test It Out!
1. Open your journal app: `http://localhost:3000`
2. Unlock with your PIN
3. Open or create a journal entry
4. Click the 📷 button
5. Select an image
6. Preview it and click "Send Image"
7. Your image will upload and appear in your journal!

## How to Use

### Upload an Image
1. **Open a journal entry**
2. **Click the 📷 camera button** (next to the Send button)
3. **Select an image** from your device
4. **Preview appears** - verify it looks good
5. **Optional**: Add a caption in the text input
6. **Click "Send Image"** to add it to your journal

### View Images
- **In Journal**: Images appear inline with messages
- **Fullscreen**: Click any image to view fullscreen
- **Exit Fullscreen**: Click anywhere to close

### Add Captions
Type your caption in the message input **before** clicking "Send Image". The caption will appear above the image.

### Mixed Content
You can freely mix:
- Text messages
- Images with captions
- AI chat messages (with @)
- Images + text + AI all together!

## Technical Details

### Image Processing
When you upload an image, Cloudinary automatically:
- **Limits width** to 1200px (maintains aspect ratio)
- **Optimizes quality** for faster loading
- **Converts format** to WebP for modern browsers
- **Stores original** in case you need it

### File Support
Supported formats:
- JPEG / JPG
- PNG
- GIF (animated GIFs work!)
- WebP

### File Size Limit
- Maximum upload size: **10 MB per image**
- Most phone photos are 2-5 MB, so this is plenty

### Storage Location
All images are stored in a folder called **myairy-journal** in your Cloudinary account. You can view them in the Cloudinary Media Library.

### API Endpoint
**URL**: `/api/upload-image`  
**Method**: POST (multipart/form-data)  
**Response**:
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/myairy-journal/abc123.jpg",
  "publicId": "myairy-journal/abc123",
  "width": 1200,
  "height": 900,
  "format": "jpg"
}
```

## Troubleshooting

### "Cloudinary not configured" error
**Fix**: Make sure all three values are set in `.env`:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Then restart the server.

### Upload fails silently
**Check**:
1. Browser console (F12) for errors
2. File size is under 10 MB
3. File format is supported (JPEG, PNG, GIF, WebP)
4. Internet connection is active

### Image not displaying
**Check**:
1. The URL is valid (starts with `https://res.cloudinary.com`)
2. Your Cloudinary account is active
3. Browser console for image loading errors

### Preview modal stuck
**Fix**: 
- Click "Cancel" to close
- Refresh the page if needed

## Managing Your Images

### View All Images
1. Log into [Cloudinary Console](https://console.cloudinary.com)
2. Click **Media Library** in the sidebar
3. Navigate to **myairy-journal** folder
4. See all your uploaded images

### Delete Images
In the Cloudinary console:
1. Go to Media Library
2. Select images you want to delete
3. Click the trash icon

**Note**: Deleting from Cloudinary won't remove the URL from your journal entries, so do this carefully.

### Download Images
From Cloudinary console:
1. Open any image
2. Click the download icon
3. Original quality file downloads

## Privacy & Security

### Where are images stored?
- **Cloudinary's servers** (not your local machine)
- **Secure HTTPS** URLs
- **Private by default** (only accessible via URL)

### Who can see my images?
- Anyone with the image URL can view it
- URLs are long and random (hard to guess)
- Not indexed by search engines
- Your Cloudinary account is private

### Can I make images truly private?
Yes! In Cloudinary console:
1. Go to Settings → Security
2. Enable **Secure URLs**
3. Requires additional setup (see Cloudinary docs)

For a personal journal, the default security is usually sufficient.

## Cost Management

### Monitor Usage
Check your usage in Cloudinary dashboard:
1. Dashboard shows current month usage
2. Storage, bandwidth, and transformations
3. Free tier limits displayed

### Stay Within Free Tier
**Tips**:
- The free tier is generous (25 GB storage)
- A typical journal photo is 2-5 MB
- You can store ~5,000 photos
- Monthly bandwidth resets each month

### If You Exceed Limits
- Cloudinary will notify you
- Uploads may be temporarily paused
- Upgrade options available (paid plans start at $99/year)

## Advanced Features (Optional)

### Custom Image Transformations
Cloudinary supports powerful transformations. You can modify the upload code in `server.ts` to add:
- Watermarks
- Filters and effects
- Face detection and cropping
- Text overlays

See [Cloudinary Transformation Docs](https://cloudinary.com/documentation/transformation_reference)

### Image Metadata
Currently, we store:
- URL
- Public ID
- Dimensions
- Format

You could extend this to store:
- Original filename
- Upload date
- EXIF data
- Geolocation (if available)

## Integration with AI Chat

Images work great with AI chat! Try:
- Upload an image of a recipe → `@Can you suggest wine pairings?`
- Upload a photo from your day → `@What do you think about this moment?`
- Upload a screenshot → `@Can you explain what's happening here?`

**Note**: The AI doesn't currently analyze images (text-only), but this feature could be added using Groq's vision models in the future!

## Future Enhancements

Possible additions:
- [ ] Multiple image uploads (gallery view)
- [ ] Image editing (crop, rotate, filters)
- [ ] Video support
- [ ] AI image analysis and descriptions
- [ ] Automatic album creation
- [ ] Image search by date or caption
- [ ] Export journals with embedded images

---

**Happy journaling with images! 📷✨**

For Cloudinary support, visit: https://support.cloudinary.com
