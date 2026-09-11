# KITTAB — Multimodal Agentic RAG Learning Assistant

KITTAB is a multimodal AI knowledge and learning assistant that transforms real-world learning materials (PDFs, handwritten notes, lecture audio, video, web articles) into structured knowledge, grounded RAG conversation, active recall flashcards, and diagnostic practice tests.

---

## 🚨 Root Cause Analysis: Why Deployed GitHub Sites Show a Blank Page

If you attempted to deploy KITTAB through GitHub onto **GitHub Pages**, the resulting URL displayed a blank or empty screen. Here is why:

1. **GitHub Pages is purely static hosting (HTML/CSS/JS)**:
   - GitHub Pages serves static files from a CDN.
   - It **does not run a Python 3.11 runtime**, does not execute `streamlit run app.py`, and cannot host WebSocket connections (`_stcore/stream`).
   - GitHub Pages cannot execute native C-extensions or Python AI packages like `chromadb`, `openai`, `whisper`, or `PyPDF2`.

2. **Streamlit Architecture**:
   - Streamlit is a client-server application. The browser connects via WebSocket to an active Python process.
   - Without an active Python server running in the cloud, loading an HTML file on GitHub Pages results in an empty `404`, an unhydrated root `<div id="root"></div>`, or connection failure.

---

## 🚀 Recommended Deployment Architectures

### Option 1: Streamlit Community Cloud (Recommended — Free, Instant, 1-Click)
Streamlit Community Cloud is specifically built for Streamlit applications, provides a native Python 3.11 runtime, and integrates directly with your GitHub repository.

1. Push this repository to GitHub (`git push origin main`).
2. Go to [share.streamlit.io](https://share.streamlit.io) and sign in with your GitHub account.
3. Click **"New app"**.
4. Select your repository: `<your-username>/kittab`.
5. Set the **Main file path** to: `app.py`.
6. Click **Advanced settings** -> **Secrets**, and paste your API key:
   ```toml
   OPENAI_API_KEY = "sk-your-openai-api-key"
   ```
7. Click **Deploy!** Your app will be live with a public URL in ~60 seconds.

---

### Option 2: Docker / Google Cloud Run / Render
For enterprise or self-hosted deployment:

1. Build and run locally with Docker:
   ```bash
   docker build -t kittab .
   docker run -p 8501:8501 -e OPENAI_API_KEY="your-key" kittab
   ```
2. Or use Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Deploy to **Google Cloud Run**:
   ```bash
   gcloud run deploy kittab --source . --port 8501 --allow-unauthenticated
   ```

---

## 💻 Local Development Setup

1. Clone repository:
   ```bash
   git clone https://github.com/<your-username>/kittab.git
   cd kittab
   ```

2. Create virtual environment (Python 3.11 recommended):
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and insert your OPENAI_API_KEY
   ```

5. Launch application:
   ```bash
   streamlit run app.py
   ```
   Open `http://localhost:8501` in your browser.

---

## 🔒 Security Best Practices
- **API Keys**: Stored exclusively via server environment variables or `st.secrets`. Never committed to version control.
- **Data Isolation**: ChromaDB and uploaded files are saved into `.gitignore`-protected directories (`data/uploads`, `data/chroma`).
