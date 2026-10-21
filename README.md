# 🎊 Festivo AI — GenAI Celebration & Event Planner Assistant

> **Mission Brief**: Create a GenAI-powered planning assistant that helps users organize **weddings**, **birthdays**, and **community events** with **budgets**, **timelines**, **vendor checklists**, and **personalized ideas**.

Festivo AI is an intelligent celebration planning suite engineered to turn event stress into an effortless, joyful experience. Built with **React 19**, **Vite**, **Tailwind CSS**, and powered by **Google Gemini (1.5 Flash / 2.0 Flash)** with a resilient built-in zero-latency fallback engine.

---

## 🌟 Key Pillars & Features

### 1. 💍 Multi-Celebration Engine
- **Weddings**: Receptions, ceremonies, floral canopies, farm-to-table menus, first dances, acoustic music, and golden hour portrait itineraries.
- **Birthdays**: Milestone jubilees (21st, 30th, 50th), kids themed spectacles, retro synthwave arcade nights, signature punch, and party games.
- **Community Events**: Autumn harvest festivals, 5K charity fun runs, local food truck coordination, pie baking championships, stage sound, and volunteer teams.
- **Pre-Loaded Demonstrations**:
  1. *Luna & Oliver’s Enchanted Garden Wedding* ($32,000, 120 guests)
  2. *Leo’s Neon Arcade & Synthwave 30th Gala* ($4,800, 50 guests)
  3. *Oakridge Annual Charity Fall Harvest Fest & 5K* ($18,500, 450 guests)
- **1-Click AI Event Wizard**: Type a brief concept (or pick a preset), and GenAI synthesizes an entire customized event plan within seconds.

---

### 2. 🎨 Personalized GenAI Ideas & Themes
- **Interactive Color Palettes**: Handpicked 5-tone palettes with 1-click HEX code copying.
- **Signature Cocktails & Mocktails**: Custom drinks with recipe specs matching the event vibe.
- **Decor & Lighting Highlights**: Creative experiential elements (e.g. fairy light canopies, calligraphy stone placecards).
- **Guest Engagement & Entertainment**: Unique icebreakers, tournaments, and memory recording stations.
- **Social Media Hashtag Generator**: Catchy, memorable hashtags for attendees and couples.

---

### 3. 💰 Smart Budget Manager & AI Allocator
- **Financial Status at a Glance**: Total Target, Estimated Allocation, Actual Contracted, and Paid So Far.
- **Absorption & Variance Alerts**: Instant indicators whether you are on track or exceeding budget.
- **Category Breakdown**: Dynamic categorization (Venue, Catering, Photo, Decor, Music, Contingency).
- **Interactive Expense Tracker**: Inline editing of quotes, actual costs, payments, and receipt statuses.
- **AI Smart Budget Optimizer**:
  - Target Savings slider (5% to 30%).
  - Actionable negotiation scripts for venues and vendors.
  - Smart alternatives (e.g., signature drinks vs. open bar, floral repurposing).
  - Hidden fee alerts (corkage, overtime fees, cake cutting).

---

### 4. ⏳ Master Timeline & Day-Of Run of Show
- **Milestone Roadmap**: Long-term timeline broken down from 12 months to the day before, with confetti celebrations when tasks are completed.
- **Day-of Run of Show**: Minute-by-minute itinerary with activity, lead person in charge, and location station.
- **AI Weather & Delay Contingency Generator**:
  - 1-click rapid tactical response for sudden rainstorms, catering delays, VIP traffic delays, or audio failures.
  - Provides a 15-minute immediate action protocol, schedule shift, and guest-charming pivot.
- **Printable Master Dossier**: 1-click printable PDF view formatted cleanly for coordinators and clients.

---

### 5. 📋 Vendor Directory & AI RFP Inquiries
- **Vendor Partner Profiles**: Track category, contact info, contract status, and action checklists.
- **✨ 1-Click AI Vendor RFP Drafter**: Generates tailored, polite, and comprehensive quote request emails ready to copy and send.
- **Vendor Interview Cheat Sheet**: Crucial questions to ask caterers, photographers, venues, and florists before signing contracts.

---

### 6. 👥 Guest List & RSVP Tracker
- **Real-Time Attendance Counts**: Attending, Pending, Declined, and plus-ones.
- **Dietary Restriction Aggregator**: Live counts of vegan, gluten-free, nut-free, and halal meals for catering orders.
- **Table Seating Assignments**: Visual organization by table number or VIP tent.
- **AI RSVP Reminder Drafter**: Generates friendly text message reminders for non-respondents.

---

### 7. 🤖 Festivo Copilot (AI Event Specialist)
- Context-aware chatbot floating on the bottom right.
- Aware of current event's type, budget, date, guest count, and theme.
- Quick prompt chips for instant assistance: games, weather contingency, invite wording, drink recipes, and negotiation tips.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Running Locally
```bash
# Navigate to project directory
cd "C:\Users\Dheepak\.gemini\antigravity\scratch\festivo-ai"

# Install dependencies (already completed)
npm install

# Start local development server
npm run dev
```

### Google Gemini API Setup (Optional)
Festivo AI features a built-in intelligent offline fallback engine that works 100% out of the box with zero setup.
To enable live Google Gemini 1.5/2.0 API features:
1. Click the **"Offline AI (Add Key)"** pill in the top navigation bar.
2. Enter your Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey)).
3. Click **"Test Connection"** and **"Save Key"**. The key remains stored privately in your browser's local storage.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Confetti**: Canvas-Confetti
- **AI Engine**: Google Gemini API (REST) + Heuristic Fallback Engine
