# 🇮🇳 Bharat One (Saarthi AI)

> **One AI. Every Government Service.**

Bharat One (Saarthi AI) is an AI-powered civic companion designed to simplify how citizens interact with government services. Instead of navigating multiple portals and departments, users can ask questions in natural language, report civic issues, discover nearby government services, and receive personalized scheme recommendations—all through a unified AI experience.

Built for **DEVENGERS PromptWars 2026**.

---

## ✨ Features

### 🤖 AI Civic Assistant
- Google Gemini-powered conversational assistant
- Understands natural language civic queries
- Personalized recommendations
- Government service guidance
- Multilingual support

---

### 📸 AI-Powered Issue Reporting
- Upload an image of a civic issue
- AI automatically detects:
  - Issue Category
  - Severity Level
  - Responsible Department
  - AI-generated Complaint Summary
- Citizen only reviews and submits

Examples:
- Road Damage
- Garbage
- Water Leakage
- Street Light Failure
- Drainage Issues
- Illegal Dumping
- Public Property Damage

---

### 🧠 AI Fraud Detection
Detects potentially fraudulent reports using AI.

Checks include:
- Screenshot detection
- Duplicate images
- Previously submitted reports
- Edited images
- Low-quality uploads

Returns a fraud confidence score.

---

### 📍 Smart Geo Intelligence
- GPS Location Detection
- Google Maps Integration
- Reverse Geocoding
- State
- District
- City Detection
- Nearby Government Offices
- Hospitals
- Police Stations
- Fire Stations
- Tourist Attractions

---

### 🗺 Intelligent Maps
Powered by Google Maps Platform.

Locate nearby:
- Government Offices
- Municipal Offices
- Hospitals
- Police Stations
- Fire Stations
- Tourist Attractions
- Public Services

---

### 🏛 Government Scheme Recommendation
AI recommends schemes based on:
- Location
- Age
- Occupation
- Gender
- Category
- User Profile

Categories include:
- Education
- Employment
- Women
- Healthcare
- Farmers
- Housing
- Startups
- MSME
- Senior Citizens
- Students

---

### 🎤 Voice Assistant
- Speech-to-Text
- Text-to-Speech
- Multilingual conversations
- Hands-free civic assistance

---

### 📄 AI Document Assistant
Upload a document and receive:
- AI Summary
- Required Documents
- Translation
- Government Guidance
- Next Steps

---

### 🔔 Complaint Tracking
Track complaints in real time.

Workflow:
Report Submitted
→ Assigned
→ In Progress
→ Completed
→ AI Verification

---

### 👷 Smart Workforce Assignment
AI recommends the best municipal worker based on:
- Specialization
- Distance
- Current Workload
- Priority

---

### 📊 Analytics Dashboard
Real-time insights including:
- Complaint Heatmaps
- Department Performance
- Resolution Time
- AI Daily Summaries
- Monthly Analytics

---

### 🚨 Emergency Services
Quick access to:
- Police
- Fire
- Ambulance
- Women's Helpline
- Child Helpline

---

### 🏙 District Dashboard
View district-level information:
- Weather
- AQI
- Population
- Budget
- News
- Government Updates
- Tourist Attractions

---

### 🎨 Dynamic State-Based UI
The interface adapts to the user's state with culturally inspired visuals, colors, and illustrations while maintaining a unified design system.

---

### 📱 Progressive Web App (PWA)
- Installable
- Mobile-first
- Responsive
- Offline-ready architecture

---

# 🏗 Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

- Firebase Authentication
- Firestore
- Firebase Storage
- Firebase Cloud Functions

## AI

- Google Gemini
- Gemini Vision

## Maps

- Google Maps Platform
- Places API
- Geocoding API
- Directions API

## State Management

- Zustand

## Forms

- React Hook Form
- Zod

## Deployment

- Vercel

---

# 🏛 System Architecture

```
Citizen
     │
     ▼
Next.js Frontend
     │
     ▼
Firebase Authentication
     │
     ▼
Firestore Database
     │
     ▼
Google Gemini AI
     │
     ├── AI Chat
     ├── Vision Analysis
     ├── Scheme Recommendation
     ├── Complaint Generation
     └── Document Assistance
     │
     ▼
Google Maps Platform
     │
     ▼
Location Intelligence
```

---

# 🔄 Core Workflows

## AI Complaint Workflow

```
Upload Image
      │
      ▼
Gemini Vision
      │
      ▼
Issue Detection
      │
      ▼
Severity Prediction
      │
      ▼
Department Assignment
      │
      ▼
Citizen Review
      │
      ▼
Submit Complaint
      │
      ▼
Track Progress
```

---

## AI Scheme Workflow

```
User Profile
      │
      ▼
Location
      │
      ▼
Gemini Analysis
      │
      ▼
Eligible Schemes
      │
      ▼
Application Guidance
```

---

## AI Assistant Workflow

```
Question
      │
      ▼
Gemini
      │
      ▼
Intent Detection
      │
      ▼
Reasoning
      │
      ▼
Government Guidance
```

---

# 🔐 Security

- Firebase Authentication
- Role-Based Access Control
- Firestore Security Rules
- Secure Storage Rules
- Input Validation using Zod
- Protected Routes
- Environment Variables
- Secure API Design

---

# 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/bharat-one-ai.git

cd bharat-one-ai

npm install

npm run dev
```

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

GEMINI_API_KEY=

GOOGLE_MAPS_API_KEY=
```

---

# 📦 Deployment

Deploy effortlessly with **Vercel**.

```bash
npm run build
```

---

# 🎯 Vision

Our vision is to create a single AI-powered gateway for Indian citizens that makes government services more accessible, transparent, and user-friendly. By combining Generative AI, intelligent automation, and intuitive design, Bharat One aims to reduce complexity and bridge the gap between citizens and public services.

---

# 👨‍💻 Team

**DEVENGERS PromptWars 2026**

Project: **Bharat One (Saarthi AI)**

---

# 📄 License

This project was developed for **DEVENGERS PromptWars 2026**.
