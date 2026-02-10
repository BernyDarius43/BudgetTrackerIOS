# 🧠 BudgetTracker API

The backend for **BudgetTracker**, a full-stack budgeting app built using **Node.js**, **Express**, **Firebase Auth**, and **MongoDB**. It supports secure user management and CRUD operations for **income** and **expenses**.

> 🔒 Built with security and performance in mind — JWT auth, Firebase verification, and clean API routing.

---

## 📦 Tech Stack

- **Node.js** with **Express**
- **MongoDB** via **Mongoose**
- **Firebase Admin SDK** for verifying user sessions
- **JWT** authentication for secure API access
- **RESTful API architecture**

---

## 🔧 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/your-username/budget-tracker-backend.git
cd budget-tracker-backend

# Install dependencies
npm install

# Create a .env file (see below)
cp .env.example .env

# Start the server
npm run dev
```

---

## 📁 Folder Structure

```
Backend/
├── app.js                     # Entry point
├── config/                    # Firebase config
├── controllers/              # Business logic for auth, income, expense
├── middleware/               # JWT/Firebase verification
├── models/                   # Mongoose schemas
├── routes/                   # Auth / Income / Expense routers
├── helpers/ utils/           # Data validation & utility functions
├── .env                      # Environment variables
├── package.json
```

---

## 🔐 .env Example

```env
PORT=1738
MONGO_URI=mongodb+srv://your-db-url
FIREBASE_PROJECT_ID=your-project-id
DEV_API_URL=/api/dev
AUTH_API_URL=/api/v1/auth
```

⚠️ Never commit `.env` or Firebase private keys — keep them safe.

---

## 🧪 API Routes

| Endpoint                    | Method | Description             |
|-----------------------------|--------|-------------------------|
| `/api/v1/auth/login`        | POST   | Login with Firebase     |
| `/api/v1/auth/register`     | POST   | Create a new user       |
| `/api/dev/addIncome`        | POST   | Add income (auth req'd) |
| `/api/dev/fetchAllIncomes`  | GET    | Fetch all incomes       |
| `/api/dev/delete-income/:id`| DELETE | Delete income           |
| `/api/dev/update-income/:id`| PUT    | Update income           |

> Full route definitions are in `/routes` and controlled via middleware.

---

## 📷 Screenshots

> You can add Postman or Insomnia examples here.

---

## 👨‍💻 Author & Contributors

Built by Berny Darius.  
Contributions welcome — please open a PR or issue.

---

## 📜 License

MIT — open for use and modification.

---

## 🔗 Frontend Repo

[📱 BudgetTracker Mobile (React Native)](https://github.com/your-username/budget-tracker-mobile)
