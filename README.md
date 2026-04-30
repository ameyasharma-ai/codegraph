# CodeGraph — AI-Powered Codebase Visualization

CodeGraph is a production-grade web application designed to help developers and architects understand complex repositories by visualizing their structure and dependencies. Built with a high-performance stack, it provides an interactive experience for mapping code modules and gaining AI-powered insights.

## 🚀 Features

- **Interactive Dependency Graphs**: Visualize your JS/TS codebase using React Flow with zoom, pan, and interactive node selection.
- **Deep Code Analysis**: Automatically fetches repository trees and extracts ES imports to map the relationship between files.
- **AI Module Explanations**: Leveraging OpenRouter (GPT/DeepSeek), CodeGraph provides architectural summaries for any selected file.
- **Flow Tracing**: Highlight and animate dependency paths to see exactly how data and logic flow through your system.
- **High-Performance Caching**: Full Supabase integration to store and serve analyzed graphs and AI insights instantly.
- **Premium UI**: A sleek, glassmorphic dark theme designed for modern engineering workflows.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, TailwindCSS (v4)
- **Visualization**: React Flow
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenRouter API

## 🏁 Getting Started

### 1. Prerequisites
- A **Supabase** account and project.
- An **OpenRouter** API key.
- (Optional) A **GitHub Personal Access Token** to increase API rate limits.

### 2. Environment Setup
Create a `.env.local` file in the root directory (refer to `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
GITHUB_TOKEN=your_github_token
```

### 3. Database Schema
Run the SQL script provided in [`SCHEMA.md`](./SCHEMA.md) in your Supabase SQL Editor to create the necessary `graphs` and `explanations` tables.

### 4. Installation
```bash
npm install
```

### 5. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 How to Test

1. **Basic Visualization**: Enter a public repository URL like `facebook/react` or `vercel/next.js` into the search bar and press Enter.
2. **Interact with Nodes**: Click any file node in the graph. The side panel will appear with file details.
3. **AI Explanation**: Click the "Explain" button in the side panel. CodeGraph will analyze the file content and provide a summary of its role in the system.
4. **Flow Tracing**: Click a node to automatically highlight its dependencies and animate the connection paths.
5. **Caching**: Refresh the page or search for the same repo again; it should load instantly from the Supabase cache.

## 📁 Project Structure

- `app/`: Next.js App Router (Pages and API routes)
- `components/`: React components (Graph, Header, SidePanel)
- `lib/`: Core logic (GitHub fetcher, Regex parser, Graph builder, AI client)
- `types/`: TypeScript interfaces and types

## ⚠️ Constraints
- Supports `.js`, `.ts`, `.jsx`, and `.tsx` files.
- Optimized for repositories with up to 150-200 files for maximum performance.
- Currently supports ES Modules (`import/export`) only.
