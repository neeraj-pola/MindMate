# MindMate
1. Live Demo (Recommended)
  Visit our deployed app here: https://mind-mate-app.vercel.app/
  No installation required — works directly in browser.

2. Local Setup (Optional)
  If you want to run locally ->

  Frontend (Next.js + Tailwind) -> 
  git clone https://github.com/<your-repo>/mindmate.git
  cd mindmate/frontend
  npm install
  npm run dev
  Frontend runs at: http://localhost:3000

  Backend (FastAPI + TiDB) -> 
  cd ../backend
  pip install -r requirements.txt
  uvicorn main:app --reload
  Backend runs at: http://localhost:8000

3. Credentials / Config -> 

  Add your OpenAI API Key in .env as:
  OPENAI_API_KEY=your_api_key_here
  TIDB_HOST=your_tidb_host_conn
  TIDB_PORT= yout_tidb_port
  TIDB_USER= your_tidb_user_root_cred
  TIDB_PASSWORD= your_tidb_account_pass
  TIDB_DATABASE= 'test'


Features to Explore in Demo
  1. Take a Screening Test → PHQ-9 & GAD-7 questionnaires with instant results.
  2. Chat with the AI Companion → Ask questions & get empathetic, resource-backed advice.
  3. See Recommendations → Learn coping strategies and next steps.
