# 🚀 Dashboard Backend

## 📋 نظرة عامة

Dashboard Backend هو API RESTful مبني باستخدام Node.js و Express و MongoDB. يوفر نظام backend قوي لإدارة المستخدمين والخدمات والحجوزات، مع المصادقة والتفويض ووظائف CRUD كاملة.

## ✨ المميزات

### 👤 إدارة المستخدمين

- ✅ التسجيل / تسجيل الدخول مع المصادقة باستخدام JWT
- ✅ التحكم في الوصول بناءً على الأدوار (Admin, Freelancer, Client)
- ✅ إدارة الحسابات الشخصية
- ✅ رفع الصور الشخصية (Avatar)

### 🛠️ إدارة الخدمات

- ✅ إنشاء وتحديث وحذف وعرض الخدمات
- ✅ يمكن للـ Freelancers إدارة خدماتهم الخاصة
- ✅ يمكن للـ Clients تصفح الخدمات النشطة

### 📅 نظام الحجوزات

- ✅ يمكن للـ Clients حجز الخدمات المتاحة
- ✅ منع الحجوزات المكررة في نفس التاريخ
- ✅ يمكن للـ Clients تحديث أو حذف حجوزاتهم
- ✅ يمكن للـ Admin عرض جميع الحجوزات

### 🔒 الأمان والوسائط (Middlewares)

- ✅ مصادقة JWT
- ✅ Helmet لأمان الرؤوس
- ✅ Morgan لتسجيل الطلبات
- ✅ Rate Limiting للحماية من الهجمات
- ✅ CORS للسماح بالطلبات من الواجهة الأمامية

### 📤 رفع الملفات

- ✅ تكامل Multer لرفع الصور
- ✅ إنشاء تلقائي لمجلد الرفع (src/uploads/)
- ✅ خدمة الملفات الثابتة

## 🛠️ التقنيات المستخدمة

| الطبقة                | التقنية                |
| --------------------- | ---------------------- |
| Runtime               | Node.js                |
| Framework             | Express.js             |
| Database              | MongoDB (Mongoose ORM) |
| Authentication        | JWT (JSON Web Token)   |
| Validation            | Express Validator      |
| Security              | Helmet                 |
| Logging               | Morgan                 |
| File Handling         | Multer                 |
| Rate Limiting         | Express Rate Limit     |
| Environment Variables | dotenv                 |

## 📁 هيكل المشروع

```
📦 DASHBOARD-BACKEND
┣ 📂 src
┃ ┣ 📂 config
┃ ┃ ┣ 📜 db.js              # إعدادات الاتصال بقاعدة البيانات
┃ ┃ ┣ 📜 roles.js            # تعريف الأدوار
┃ ┃ ┣ 📜 paths.js            # مسارات الملفات
┃ ┃ ┗ 📜 upload_image.js     # إعدادات رفع الصور
┃ ┣ 📂 controllers
┃ ┃ ┣ 📜 booking_controller.js   # منطق الحجوزات
┃ ┃ ┣ 📜 service_controller.js   # منطق الخدمات
┃ ┃ ┗ 📜 users_controller.js     # منطق المستخدمين
┃ ┣ 📂 Middlewares
┃ ┃ ┣ 📜 handlers.js         # معالجات مخصصة
┃ ┃ ┣ 📜 jwt.js              # معالجة JWT
┃ ┃ ┗ 📜 upload_image.js     # معالجة رفع الصور
┃ ┣ 📂 models
┃ ┃ ┣ 📜 Booking_model.js    # نموذج الحجوزات
┃ ┃ ┣ 📜 Service_model.js    # نموذج الخدمات
┃ ┃ ┗ 📜 User_model.js       # نموذج المستخدمين
┃ ┣ 📂 routes
┃ ┃ ┣ 📜 booking_routes.js   # مسارات الحجوزات
┃ ┃ ┣ 📜 service_routes.js   # مسارات الخدمات
┃ ┃ ┗ 📜 users_routes.js     # مسارات المستخدمين
┃ ┣ 📂 uploads
┃ ┃ ┗ (الملفات المرفوعة)
┃ ┗ 📜 index.js              # نقطة البداية
┣ 📜 .env                    # متغيرات البيئة
┣ 📜 .gitignore
┣ 📜 package.json
┣ 📜 package-lock.json
┗ 📜 README.md
```

## 🚀 التثبيت والإعداد

### 1️⃣ استنساخ المستودع

```bash
git clone https://github.com/omar96163/dashboard-backend.git
cd dashboard-backend
```

### 2️⃣ تثبيت الحزم

```bash
npm install
```

### 3️⃣ إعداد متغيرات البيئة

قم بإنشاء ملف `.env` في المجلد الرئيسي وأضف المتغيرات التالية:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key_minimum_64_characters

# Server
PORT=2000

# Frontend
FRONTEND_URL=http://localhost:3000
```

**ملاحظة مهمة:** يجب أن يكون `JWT_SECRET` على الأقل 64 حرفاً.

### 4️⃣ تشغيل الخادم

**وضع التطوير:**

```bash
npm run dev
```

**وضع الإنتاج:**

```bash
npm start
```

سيتم تشغيل الخادم على:
👉 `http://localhost:2000` (أو المنفذ المحدد في `.env`)

## 📡 API Endpoints

### 👤 المستخدمين (`/api/users`)

| الطريقة | المسار                 | الوصف                      | الصلاحيات              |
| ------- | ---------------------- | -------------------------- | ---------------------- |
| POST    | `/api/users/register`  | تسجيل مستخدم جديد          | عام                    |
| POST    | `/api/users/login`     | تسجيل الدخول               | عام                    |
| GET     | `/api/users`           | الحصول على جميع المستخدمين | Admin فقط              |
| GET     | `/api/users/myAccount` | الحصول على حسابي الشخصي    | مصادق                  |
| PATCH   | `/api/users/:id`       | تحديث مستخدم               | المستخدم نفسه أو Admin |
| DELETE  | `/api/users/:id`       | حذف مستخدم                 | المستخدم نفسه أو Admin |

### 🛠️ الخدمات (`/api/services`)

| الطريقة | المسار              | الوصف                   | الصلاحيات      |
| ------- | ------------------- | ----------------------- | -------------- |
| GET     | `/api/services`     | الحصول على جميع الخدمات | مصادق          |
| GET     | `/api/services/:id` | الحصول على خدمة محددة   | مصادق          |
| POST    | `/api/services`     | إنشاء خدمة جديدة        | Freelancer فقط |
| PATCH   | `/api/services/:id` | تحديث خدمة              | Freelancer فقط |
| DELETE  | `/api/services/:id` | حذف خدمة                | Freelancer فقط |

### 📅 الحجوزات (`/api/bookings`)

| الطريقة | المسار              | الوصف                    | الصلاحيات         |
| ------- | ------------------- | ------------------------ | ----------------- |
| GET     | `/api/bookings`     | الحصول على جميع الحجوزات | مصادق (حسب الدور) |
| GET     | `/api/bookings/:id` | الحصول على حجز محدد      | مصادق             |
| POST    | `/api/bookings`     | إنشاء حجز جديد           | Client فقط        |
| PATCH   | `/api/bookings/:id` | تحديث حجز                | Client فقط        |
| DELETE  | `/api/bookings/:id` | حذف حجز                  | Client فقط        |

### 📁 الملفات الثابتة

| الطريقة | المسار               | الوصف                       |
| ------- | -------------------- | --------------------------- |
| GET     | `/uploads/:filename` | الوصول إلى الملفات المرفوعة |

## 🔐 الأدوار والصلاحيات

| الدور          | الصلاحيات                           |
| -------------- | ----------------------------------- |
| **Admin**      | وصول كامل لجميع البيانات            |
| **Freelancer** | إدارة خدماتهم الخاصة وحجوزاتهم      |
| **Client**     | حجز الخدمات وإدارة حجوزاتهم الشخصية |

## 🔒 الأمان

- ✅ **Rate Limiting**: حد أقصى 5 محاولات تسجيل دخول/تسجيل في 15 دقيقة
- ✅ **Helmet**: حماية من هجمات XSS و CSRF
- ✅ **CORS**: تكوين آمن للسماح بالطلبات من الواجهة الأمامية
- ✅ **JWT**: مصادقة آمنة باستخدام JSON Web Tokens
- ✅ **Bcrypt**: تشفير كلمات المرور
- ✅ **Validation**: التحقق من صحة البيانات المدخلة

## 📝 أمثلة على الطلبات

### تسجيل مستخدم جديد

```bash
POST /api/users/register
Content-Type: multipart/form-data

{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123",
  "role": "client",
  "avatar": [file]
}
```

### تسجيل الدخول

```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

### إنشاء خدمة (يتطلب مصادقة)

```bash
POST /api/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "تصميم موقع ويب",
  "description": "تصميم موقع ويب احترافي",
  "price": 500,
  "category": "design"
}
```

## ⚡ ملاحظات للمطورين

- ✅ تأكد من تشغيل MongoDB محلياً أو عبر خدمة سحابية (مثل MongoDB Atlas)
- ✅ استخدم دائماً `.env` للبيانات الحساسة
- ✅ الصور المرفوعة تُخزن داخل `src/uploads/`
- ✅ الحد الأقصى لحجم JSON هو 10MB
- ✅ يجب أن يكون `JWT_SECRET` على الأقل 64 حرفاً
- ✅ يمكن تكوين `FRONTEND_URL` لقبول طلبات من عدة نطاقات (مفصولة بفواصل)

## 🧪 الاختبار

يمكنك استخدام أدوات مثل Postman أو Thunder Client لاختبار الـ API.

## 📄 الترخيص

MIT License

## 👨‍💻 المؤلف

**Omar Albaz**  
مطور Full Stack

- 📧 البريد الإلكتروني: omaralbaz635@gmail.com
- 💼 الملف الشخصي: https://personal-page-azure-sigma.vercel.app

---

⭐ إذا أعجبك المشروع، لا تنسى إعطائه نجمة!
