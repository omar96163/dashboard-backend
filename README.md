🚀 Dashboard Backend
🧩 Overview
The Dashboard Backend is a RESTful API built with Node.js, Express, and MongoDB.
It provides a robust backend system for managing users, services, and bookings, with authentication, authorization, and full CRUD functionality.

🧠 Features

✅ User Management
Register / Login with JWT authentication
Role-based access control (Admin, Seller, Buyer)

✅ Service Management
Create, update, delete, and list services
Sellers can manage their own services
Buyers can browse active services

✅ Booking System
Buyers can book available services
Prevent duplicate bookings on the same date
Buyers can update or delete their bookings
Admin can view all bookings

✅ Security & Middleware
JWT authentication
Helmet for security headers
Morgan for request logging

✅ File Uploads
Multer integration for image uploads
Automatic upload directory creation (src/uploads/)

⚙️ Tech Stack :

Layer Technology
Runtime Node.js
Framework Express.js
Database MongoDB (Mongoose ORM)
Auth JWT (JSON Web Token)
Validation Express Validator
Security Helmet
Logging Morgan
File Handling Multer
Environment Variables dotenv

📁 Project Structure :

📦 DASHBOARD-BACKEND
┣ 📂 src
┃ ┣ 📂 config
┃ ┃ ┣ 📜 db.js
┃ ┃ ┣ 📜 roles.js
┃ ┃ ┗ 📜 upload_image.js
┃ ┣ 📂 controllers
┃ ┃ ┣ 📜 booking_controller.js
┃ ┃ ┣ 📜 service_controller.js
┃ ┃ ┗ 📜 users_controller.js
┃ ┣ 📂 Middlewares
┃ ┃ ┣ 📜 handlers.js
┃ ┃ ┗ 📜 jwt.js
┃ ┣ 📂 models
┃ ┃ ┣ 📜 Booking_model.js
┃ ┃ ┣ 📜 Service_model.js
┃ ┃ ┗ 📜 User_model.js
┃ ┣ 📂 routes
┃ ┃ ┣ 📜 booking_routes.js
┃ ┃ ┣ 📜 service_routes.js
┃ ┃ ┗ 📜 users_routes.js
┃ ┗ 📂 uploads
┃ ┃ ┗ (uploaded files)
┣ 📜 .env
┣ 📜 .gitignore
┣ 📜 package.json
┣ 📜 package-lock.json
┗ 📜 README.md

🧱 Installation & Setup
1️⃣ Clone the Repository
$ git clone https://github.com/omar96163/dashboard-backend.git
cd DASHBOARD-BACKEND

2️⃣ Install Dependencies
npm install

4️⃣ Run the Server
npm start

The server will run at:
👉 http://localhost:5000

🧪 API Endpoints Overview
👤 Users
Method Endpoint Description
POST /api/users/register Register new user
POST /api/users/login Login user
GET /api/users Get all users (admin only)
🛠️ Services
Method Endpoint Description
POST /api/services Create service (seller only)
GET /api/services Get all active services
PATCH /api/services/:id Update service (seller only)
DELETE /api/services/:id Delete service (seller only)
📅 Bookings
Method Endpoint Description
POST /api/bookings/:id Create booking (buyer only)
GET /api/bookings Get all bookings (role-based)
GET /api/bookings/:id Get booking by ID (authorized only)
PATCH /api/bookings/:id Update booking (buyer only)
DELETE /api/bookings/:id Delete booking (buyer only)
🔐 Roles & Permissions
Role Permissions
Admin Full access to all data
Seller Manage their own services and bookings
Buyer Book services and manage personal bookings
⚡ Developer Notes

Ensure MongoDB is running locally or via a cloud service (like MongoDB Atlas).

Always use .env for sensitive data.

Uploaded images are stored inside src/uploads/.

👨‍💻 Author

Omar Albaz
Full Stack Developer & Lawyer
📧 E-mail : omaralbaz635@gmail.com
💼 Portfolio : https://personal-page-azure-sigma.vercel.app
