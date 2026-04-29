# Huong dan cai dat va chay

Repository gom 2 phan chinh:
- BackEnd-SpringBoot: Spring Boot API (Java 21, MySQL)
- Demo-FrontEnd-React: Frontend React + Vite

## 1) Yeu cau moi truong

- Java 21
- Maven (hoac dung Maven Wrapper `mvnw`)
- Node.js 20+ va npm
- MySQL 8+

## 2) Chay Backend (Spring Boot)

### Buoc 1: Tao database

Tao database MySQL (neu chua co):

```sql
CREATE DATABASE springbootrestfulapis;
```

Luu y:
- `application.properties` dang de `createDatabaseIfNotExist=true` nen backend co the tu tao DB neu user MySQL co quyen.

### Buoc 2: Cau hinh bien moi truong (khuyen nghi)

Co the de mac dinh, hoac set cac bien sau truoc khi chay:

- `MYSQL_HOST` (mac dinh: `localhost`)
- `MYSQL_PORT` (mac dinh: `3306`)
- `MYSQL_DATABASE` (mac dinh: `springbootrestfulapis`)
- `MYSQL_USER` (mac dinh: `root`)
- `MYSQL_PASSWORD`
- `APP_JWT_SECRET`
- `APP_JWT_EXPIRATION_MS`
- `SPRING_MAIL_USERNAME`
- `SPRING_MAIL_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Buoc 3: Chay backend

Tai thu muc `BackEnd-SpringBoot`:

```bash
./mvnw spring-boot:run
```

Windows CMD/PowerShell:

```bash
mvnw.cmd spring-boot:run
```

Backend mac dinh chay tai:
- `http://localhost:8080`

## 3) Chay Frontend (React)

Tai thu muc `Demo-FrontEnd-React`:

```bash
npm install
npm run dev
```

Frontend mac dinh chay tai:
- `http://localhost:5173`

Frontend goi API qua:
- `VITE_API_URL` (neu set trong env)
- neu khong set, se dung mac dinh: `http://localhost:8080`

## 4) Thu tu khoi dong de test nhanh

1. Chay MySQL
2. Chay Backend (`BackEnd-SpringBoot`)
3. Chay Frontend (`Demo-FrontEnd-React`)
4. Mo trinh duyet tai `http://localhost:5173`

## 5) Luu y ve dang nhap va quyen

- Cac API `/api/organizers/**` yeu cau JWT Bearer token.
- Cac trang attendee co the xem su kien ma khong can dang nhap.
- Cac chuc nang mua ve/thanh toan yeu cau dang nhap attendee.

## 6) Cac lenh hay dung

Backend:

```bash
mvnw.cmd test
mvnw.cmd clean package
```

Frontend:

```bash
npm run lint
npm run build
npm run preview
```