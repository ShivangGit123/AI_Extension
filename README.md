# 🚀 Reasoning AI Agent – Chrome Extension (Manifest V3)

A lightweight **local AI reasoning agent** implemented as a Chrome Extension using rule-based planning, semantic & keyword search, toy embeddings, hybrid mode, and fallback logic.  
Runs fully offline with no APIs or LLMs.

---

## 📌 Overview

This extension behaves like a **mini offline AI retrieval agent** inside your browser.

Flow:
1. User enters a query in popup  
2. Background service worker receives it  
3. Planner decides semantic/keyword/hybrid  
4. Local search tools compute similarity  
5. Fallback (Pinecone stub) triggers if score < 0.75  
6. UI displays structured JSON and trace  

Everything is computed *inside* the browser.

---

## 🧠 Features

- 🔹 Rule-based Planner
- 🔹 Bag-of-Words Toy Embedding
- 🔹 Cosine Similarity Semantic Search
- 🔹 Keyword Match Scoring
- 🔹 Hybrid Mode
- 🔹 Pinecone Fallback Stub
- 🔹 Structured JSON Output
- 🔹 Full Trace Panel
- 🔹 Clean Modular Architecture
- 🔹 100% Offline

---

## 🗂️ Project Structure

AI_Extension/
│
├── manifest.json
├── popup.html
├── popup.js
├── background.js
├── agent.js
├── data.js
├── local_agent_test.js # optional
└── README.md


---

## ⚙️ How It Works

### 1. Popup
- Takes user query
- Sends to background with:
```js``
chrome.runtime.sendMessage({ query, mode: "auto" });
Displays result + trace```

2. Background (Service Worker)

Listens for messages

Calls runAgent()

Returns async result using sendResponse()

3. Agent.js

Runs planner

Semantic / keyword / hybrid search

Combines scores

Applies confidence threshold

Fallback triggers if needed

Returns JSON response
