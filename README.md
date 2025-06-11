# SolveBot 🤖

**AI-powered customer support assistant built with Next.js 15**

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)  
- **Library**: React 19  
- **Styling**: Tailwind CSS  
- **Authentication**: Clerk  
- **UI Components**: ShadCN UI (Button, Input)  
- **Avatars**: DiceBear Avatars  

---

## 🧠 Features

- **AI-Powered Support Bots** — Create and manage intelligent customer support bots.  
- **User Authentication** — Secure login & registration via Clerk.  
- **Admin Dashboard** — Clean layout with an admin sidebar for easy navigation.  
- **Responsive Design** — Fully mobile-first and responsive UI.  
- **Custom Avatars** — Unique user avatars powered by DiceBear.

---

## 📁 Project Structure
solvebot/
├── app/
│   └── (admin)/
│       └── edit-chatbot/[id]/page.tsx
├── components/
│   ├── Characteristic.tsx
│   └── ui/
│       └── sonner.tsx
├── graphQl/
│   ├── mutations/mutations.ts
│   └── queries/queries.ts
├── types/types.ts
├── public/
├── styles/
├── .gitignore
├── README.md
├── next.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json


---

## 🛠️ Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/abd-az1z/SolveBot.git
   cd SolveBot
2.	**Install dependencies**

3.	**Add environment variables**
Create a .env.local file

4 **Run locally**


🔐 Authentication with Clerk

Authentication is handled via Clerk. Create a Clerk account, configure your application, and paste your credentials in .env.local.

⸻

🎨 UI with ShadCN

Using ShadCN UI ensures consistent and accessible UI components like buttons and inputs throughout the app.


📦 Deployment

Deploy easily on platforms like Vercel or Netlify. Don’t forget to add your environment variables in their settings dashboards.

⸻

🤝 Contributing

Feel free to contribute:
	•	Fork the repo
	•	Create a feature branch (git checkout -b feature/YourFeature)
	•	Commit your changes (git commit -m 'feat: Add your feature')
	•	Push to the branch (git push origin feature/YourFeature)
	•	Open a Pull Request
