# FMS - Financial Management System - API

FMS is a system designed to facilitate personal or family financial management. It allows you to record your expenses, manage credit card bills, fixed bills, shared expenses and more.

---

## 📦 Tecnologias Utilizadas

### Backend (API):
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/) (relacional)
- [MongoDB](https://www.mongodb.com/) (não relacional)
- [Knex.js](https://knexjs.org/) ou [Prisma](https://www.prisma.io/) (ORM/Query Builder)
- [Mongoose](https://mongoosejs.com/) (ODM para MongoDB)

### Frontend (Web):
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/) ou [Create React App](https://create-react-app.dev/)
- [Tailwind CSS](https://tailwindcss.com/) ou outro framework CSS
- [Axios](https://axios-http.com/) (requisições HTTP)

---

## 🧱 Estrutura do Projeto

```bash
/
├── backend/            # API Node.js
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/           # Aplicação React
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore