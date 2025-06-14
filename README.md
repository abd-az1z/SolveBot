# SolveBot 🤖

**AI-powered customer support assistant built with Next.js 15 and OpenAI GPT**

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.dev/)
- **UI Kit**: [ShadCN UI](https://ui.shadcn.com/) — Button, Input, Accordion, Dialog, Form, Label
- **Avatars**: [DiceBear Avatars](https://avatars.dicebear.com/)
- **Markdown**: `react-markdown`, `remark-gfm`
- **Time Display**: `react-timeago`
- **AI Integration**: [OpenAI GPT](https://platform.openai.com/)

---

## 🧠 Features

- 🤖 **Create AI-powered chatbots** for automated customer support  
- 🔐 **User login and registration** with Clerk  
- 🧑‍💼 **Admin dashboard** to manage bots and review sessions  
- 💬 **Chat UI** with GPT-powered responses  
- 🕒 **Human-readable timestamps** via `react-timeago`  
- 📝 **Rich text formatting** with markdown support  
- 📱 **Responsive layout** built mobile-first  
- 🧩 **Modular UI components** using ShadCN  
- 🧠 **OpenAI GPT integration** for intelligent message handling

---

## 📁 Project Structure

solvebot/
├── app/
│   ├── (admin)/
│   │   ├── edit-chatbot/[id]/page.tsx
│   │   ├── view-chatbots/page.tsx
│   │   └── review-sessions/[id]/page.tsx
│   ├── (guest)/
│   │   ├── login/page.tsx
│   │   └── chatbot/[id]/page.tsx
│   ├── api/
│   │   └── send-message/route.ts
│   └── loading.tsx
├── components/
│   ├── ChatBotSessions.tsx
│   ├── Messages.tsx
│   ├── Characteristic.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── form.tsx
│       ├── label.tsx
│       ├── dialog.tsx
│       └── accordion.tsx
├── lib/
│   └── startNewChat.ts
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

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/abd-az1z/SolveBot.git
cd SolveBot```


### 2. Install Dependencies
npm install

### 3. Configure Environment Variables


🔐 Clerk Authentication

This app uses Clerk for login/signup. Make sure you set up your app on Clerk and update the environment keys.

⸻

🤖 GPT Integration

The /api/send-message/route.ts connects with OpenAI’s GPT to generate AI responses. You can customize behavior by editing the startNewChat.ts utility and chat session logic.


⸻

🤝 Contributing
	1.	Fork the project
	2.	Create your feature branch: git checkout -b feature/name
	3.	Commit changes: git commit -m 'feat: description'
	4.	Push to GitHub: git push origin feature/name
	5.	Submit a Pull Request ✅
