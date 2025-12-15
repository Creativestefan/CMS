# Cloudflare R2 Setup Instructions

This document explains how to configure Cloudflare R2 for file uploads in your portfolio CMS.

## Environment Variables

All Cloudflare R2 credentials are stored as **environment variables** in Supabase, not hardcoded in the application.

### Required Variables

- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_R2_ACCESS_KEY_ID` - R2 API Access Key ID
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY` - R2 API Secret Access Key

### Optional Variables (with defaults)

- `CLOUDFLARE_R2_BUCKET_NAME` - Default: `stephen`
- `CLOUDFLARE_R2_PUBLIC_DOMAIN` - Default: `https://pub-3092f30748a044f6abcf47bd10270d53.r2.dev`

## How to Update Environment Variables in Supabase

1. **Go to your Supabase Project Dashboard**
   - Navigate to: https://supabase.com/dashboard

2. **Open Edge Functions Settings**
   - Click on "Edge Functions" in the left sidebar
   - Click on "make-server-c0b89456" (your server function)
   - Click on the "Settings" or "Secrets" tab

3. **Add/Update Environment Variables**
   - Click "Add new secret" or "Edit" on existing secrets
   - Set the following values:

   ```
   CLOUDFLARE_ACCOUNT_ID = your_account_id_here
   CLOUDFLARE_R2_ACCESS_KEY_ID = your_access_key_id_here
   CLOUDFLARE_R2_SECRET_ACCESS_KEY = your_secret_access_key_here
   ```

4. **Optional: Customize Bucket and Domain**
   - Only add these if you want to override the defaults:
   ```
   CLOUDFLARE_R2_BUCKET_NAME = your-custom-bucket-name
   CLOUDFLARE_R2_PUBLIC_DOMAIN = https://your-custom-domain.r2.dev
   ```

5. **Redeploy the Edge Function**
   - After updating environment variables, you may need to redeploy the function
   - Click "Deploy" or wait for automatic redeployment

## Getting Cloudflare R2 Credentials

### Step 1: Create an R2 Bucket

1. Go to Cloudflare Dashboard: https://dash.cloudflare.com
2. Navigate to **R2** in the left sidebar
3. Click **Create bucket**
4. Name it `stephen` (or any name you prefer)
5. Click **Create bucket**

### Step 2: Generate R2 API Token

1. In the R2 section, click **Manage R2 API Tokens**
2. Click **Create API Token**
3. Give it a descriptive name (e.g., "Portfolio CMS Upload")
4. Set permissions to **Admin Read & Write**
5. Click **Create API Token**
6. **IMPORTANT:** Copy both the **Access Key ID** and **Secret Access Key**
   - You won't be able to see the Secret Access Key again!

### Step 3: Enable Public Access (Optional)

If you want uploaded files to be publicly accessible:

1. Go to your bucket settings
2. Click on **Settings** > **Public Access**
3. Enable **Allow public access**
4. Copy your **Public Bucket URL** (e.g., `https://pub-xxxxx.r2.dev`)
5. Add this as `CLOUDFLARE_R2_PUBLIC_DOMAIN` in Supabase

## Troubleshooting

### Upload Error: "InvalidAccessKeyId"

- Verify that `CLOUDFLARE_R2_ACCESS_KEY_ID` matches the Access Key ID from Cloudflare
- Make sure there are no extra spaces in the environment variable
- Try regenerating the API token in Cloudflare

### Upload Error: "Unauthorized"

- Check that the API token has **Admin Read & Write** permissions
- Verify the `CLOUDFLARE_ACCOUNT_ID` is correct
- Make sure the bucket name matches `CLOUDFLARE_R2_BUCKET_NAME`

### Files Upload but Can't Be Accessed

- Verify the bucket has public access enabled
- Check that `CLOUDFLARE_R2_PUBLIC_DOMAIN` matches your bucket's public URL
- Ensure the public domain doesn't have a trailing slash

## Security Notes

- **Never commit** actual credentials to Git
- Use the `.env.example` file as a template only
- Store all secrets in Supabase environment variables
- Rotate API tokens periodically for security