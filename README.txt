
   ⭐ MomentumAI — Cognitive Memory Engine

A next-generation AI-powered thought companion that captures, analyzes, scores, and resurfaces your ideas.

🚀 Overview

MomentumAI helps you remember, organize, and grow your ideas using intelligent AI processing.
Most people capture ideas and forget them — MomentumAI makes sure your best thoughts come back when you need them.

🔥 Key Features

AI-Powered Note Analysis
Automatically generates:

Summary

Category

Keywords

AI reasoning

Recommended action

Momentum Scoring Engine
Every note gets a score based on:

Importance

Actionability

Novelty

Smart Resurfacing System
Forgotten ideas reappear when:

48+ hours have passed

Score is high

You haven't interacted recently

Beautiful, Modern UI
Inspired by Notion + Apple design principles:

Smooth animations

Glassmorphism

Minimalistic screens

Bottom navigation

Local & Private
All data is stored on-device (no cloud required).

📱 Screens & UX Flow
1. Splash + Onboarding

Animated logo

Intro slides to explain features

2. Home Dashboard

Shows:

Today’s insights

Recent notes

Weekly activity graph

High-momentum ideas

AI suggestions

Resurfaced (Forgotten Gold) ideas

3. Add Note

Rich text input

Smart prompts for inspiration

"Save & Analyze" → triggers AI pipeline

4. Insights List

All insights

Search

Sort (recent/momentum/category)

Filter by category

5. Insight Detail

Summary

Full text

Keywords

AI reasoning

Momentum bar

Recommended action

Favorite, share, delete

6. Resurfaced Ideas

Notes resurfaced by the cognitive engine

"Revive this idea" CTA

7. Settings

Export notes

Clear data

Reset onboarding

App info & analytics

🧠 AI Pipelines
1. Note Analysis

AI processes the text and returns:

{
  "category": "",
  "summary": "",
  "keywords": [],
  "reason": ""
}
2. Momentum Engine

Analyzes:

urgency

action verbs

novelty

complexity

Returns:

{
  "momentumScore": 0-10,
  "scoreReason": "",
  "importance": 0-5,
  "actionability": 0-5,
  "novelty": 0-5,
  "recommendedAction": ""
}
3. Resurfacing Engine

A note resurfaces if:

Age > 48 hours

High momentum

Not interacted recently

🛠️ Tech Stack
Frontend

React Native

Expo

Expo Router

React Query

Animated API

Lucide Icons

AI

LLM prompts (via backend or client)

Deterministic JSON parsing

Backend (if used)

Node.js / Express OR FastAPI

SQLite / MongoDB

REST API for:

/add_note

/notes

/analytics

/resurface

📊 Analytics Included

Total notes

Today’s notes

Weekly trends

Average momentum

Top categories

Streak count

📂 Project Structure (Example)
app/
  tabs/
    home/
    insights/
    resurface/
    add/
  insight/
  settings/

components/
  NoteCard.tsx
  SuggestionCard.tsx
  EmptyState.tsx
  MomentumBar.tsx

types/
  index.ts

constants/
  colors.ts
📦 Installation (If running locally)
npm install
npx expo start
