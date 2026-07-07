# 🚀 Deploying Saarthi AI (Bharat One) to Vercel

This repository is pre-configured for a seamless **one-click deployment** to Vercel. Both the rich, animated React Vite frontend and the high-fidelity Node.js Express server (routing all Gemini and search grounding APIs) will run perfectly.

---

## 🛠️ Pre-configured Files Added
1.  **`api/index.ts`**: The serverless entry point that exports the Express app so Vercel can run it as a serverless function.
2.  **`vercel.json`**: Configures Vercel's edge network to route `/api/*` to the serverless function, serve static assets instantly, and handle Single-Page Application (SPA) fallback routing.
3.  **`server.ts`**: Updated with a clean serverless check to bypass port listeners when deployed to Vercel, while remaining fully operational for local development (`npm run dev`).

---

## 📥 How to Deploy (Step-by-Step)

### Step 1: Push to GitHub
1. Create a new repository on your GitHub account.
2. Push this project code to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Configure full-stack Vercel deployment"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Import to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Select your newly created GitHub repository and click **Import**.

### Step 3: Configure Environment Variables
Before clicking **Deploy**, expand the **Environment Variables** section and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `your-gemini-api-key` | **Required.** Powers AI Copilot, Live Scheme Search (Google Grounded), and Image Integrity Verification. |
| `OPENAI_API_KEY` | `your-openai-api-key` | *Optional.* Used for high-speed Whisper speech transcription (falls back to Gemini if omitted). |

### Step 4: Click Deploy!
Vercel will automatically:
- Install the dependencies.
- Build your highly polished React SPA.
- Set up the serverless backend routes.
- Serve your production-ready, secure application in seconds!

---

## 🔒 Security Best Practices
- The frontend client never has access to, or exposure of, your secret API keys. 
- All API calls (such as Gemini 3.5 and Google Search Grounding) are routed securely through the `/api/*` serverless backend proxy.
- Ensure your `GEMINI_API_KEY` is kept safe and never committed to public git history.
