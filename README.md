<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c4a8d9b9-b4a3-4f8c-9e76-76f869c5389d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 🚀 Free Hosting & Deployment

Since this is a client-side React + Vite application, you can host it completely for **free** forever. We highly recommend using one of the following services, which automatically build and deploy your app whenever you push to GitHub:

### Option 1: Vercel (Recommended)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a free account.
3. Click **Add New** -> **Project**.
4. Import your GitHub repository.
5. Vercel will auto-detect Vite. Click **Deploy**. Your app will be live on a free `.vercel.app` domain.

### Option 2: Netlify
1. Push this repository to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and create a free account.
3. Click **Add new site** -> **Import an existing project**.
4. Select GitHub and authorize.
5. Choose your repository and click **Deploy Site**. Your app will be live on a free `.netlify.app` domain.

## 🎓 Embedding in Canvas LMS

Once your application is deployed to one of the free hosts above, you can embed it seamlessly into a Canvas Page or Assignment using an `iframe`. This allows students to interact with the sandbox directly inside their course materials without being redirected to an external website.

1. Copy the URL of your deployed application (e.g., `https://my-econ-app.vercel.app/`).
2. In Canvas, open the Page or Assignment where you want to embed the tool.
3. Switch the Rich Content Editor to **HTML Editor** (usually an icon like `</>` at the bottom right).
4. Paste the following snippet, replacing `YOUR_DEPLOYED_URL_HERE` with your actual URL:

```html
<iframe 
  src="YOUR_DEPLOYED_URL_HERE" 
  width="100%" 
  height="850px" 
  style="border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);" 
  title="Microeconomics Interactive Sandbox"
  allowfullscreen
></iframe>
```

5. Save and publish your Canvas page. The app will now load directly inline!
