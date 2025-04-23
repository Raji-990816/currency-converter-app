# Currency Converter App

## 🌍 Overview

This is a **full-stack MERN application** that allows users to convert currencies, track transfer history, and delete transactions. The backend is built with **Express.js & MongoDB Atlas**, while the frontend is developed using **React & Material UI (MUI)**.

## 🚀 Live Demo

- [View Live Demo](https://currency-converter-app-frontend-theta.vercel.app/)

---

## 📌 Features

✅ Convert currency using real-time exchange rates  
✅ Store transaction history in MongoDB Atlas  
✅ View and Delete past transactions  
✅ Fully responsive UI with Material UI (MUI)

---

## 🛠️ Tech Stack

### **Frontend:**
- React.js
- Axios (for API calls)
- Material UI (for UI design)

### **Backend:**
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- Axios (to fetch exchange rates)

### **Database:**
- MongoDB Atlas (cloud database)

---

## 🏗️ Setup Instructions

### **1️⃣ Clone the Repository**

Clone the repository to your local machine:

```sh
git clone https://github.com/your-username/currency-converter.git
cd currency-converter
```

### **2️⃣ Backend Setup**

Navigate to the backend directory and install dependencies:

```sh
cd backend
npm install
```

#### **Create a `.env` File in the Backend Directory**

In the `backend` folder, create a `.env` file with the following content:

```
MONGO_URI=your-mongodb-atlas-uri
EXCHANGE_RATE_API_KEY=your-api-key
```

- Replace `your-mongodb-atlas-uri` with your MongoDB Atlas connection URI.  
  - **Create a MongoDB Atlas cluster** if you don’t already have one, and get the connection URI from the Atlas dashboard.
  
- Replace `your-api-key` with an API key from a currency exchange rates provider, such as [ExchangeRate-API](https://www.exchangerate-api.com/) or [Open Exchange Rates](https://openexchangerates.org/).

Start the backend server:

```sh
npm run dev
```

### **3️⃣ Frontend Setup**

Navigate to the frontend directory and install dependencies:

```sh
cd frontend
npm install
```

#### **Create a `.env` File in the Frontend Directory**

In the `frontend` folder, create a `.env` file with the following content:

```
REACT_APP_API_BASE_URL=your-backend-url
```
This URL should match the backend server URL from step 2.

Start the frontend server:

```sh
npm start
```
---

## ✅ Deployment

- **Frontend (React):** Deployed on **Vercel**
- **Backend (Express):** Hosted on **Render**
- **Database:** MongoDB Atlas

---

## 🤝 Contributing

Pull requests are welcome! If you find any bugs or have suggestions, feel free to **open an issue**.

---

## 📜 License

This project is licensed under the MIT License.

---

## 📞 Contact

- **Author:** Rajitha Anuruddha
- **GitHub:** [https://github.com/Raji-990816](https://github.com/Raji-990816)
- **Email:** [pgranuruddha@gmail.com](mailto\:pgranuruddha@gmail.com)

