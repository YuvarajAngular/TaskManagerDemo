# Simple Task Manager App

A technical assignment built with **React Native** (Frontend) and **Core PHP** (Backend).

## 🚀 Setup Instructions

### 1. Database Setup (MySQL)
1.  Create a database named `task_manager`.
2.  Import the following Schema:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Default User (Password: 123456)
INSERT INTO users (name, email, password) VALUES ('Test User', 'test@example.com', '$2y$10$YourHashedPasswordHereOrJustUse123456IfBackdoorEnabled');
```

### 2. Backend Setup (PHP)
1.  Place the `Backend` folder in your server's root directory (e.g., `htdocs` for XAMPP).
2.  Update `Backend/.env` with your MySQL credentials.
3.  **Base URL**: `http://localhost/TaskManager/Backend/public`

### 3. Frontend Setup (React Native)
1.  Navigate to the `Frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure API**:
    *   Open `Frontend/src/api/axiosClient.tsx`.
    *   Set `BASE_URL` to your local IP (e.g., `http://10.0.2.2/TaskManager/Backend/public`).
4.  Run the app:
    ```bash
    npx react-native start
    npx react-native run-android
    ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Body / Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | User Login | `{ "email": "...", "password": "..." }` |
| `GET` | `/tasks` | Fetch All Tasks | Header: `Authorization: Bearer <token>` |
| `POST` | `/tasks` | Create Task | `{ "title": "...", "description": "...", "status": "..." }` |
| `PUT` | `/tasks` | Update Task | `{ "id": 1, "title": "...", "status": "..." }` |
| `DELETE` | `/tasks` | Delete Task | `{ "id": 1 }` |



# Future Improvements: Code Structure

With more time, I would focus on the following structural improvements:

### 1. Unified Architecture (Monorepo)
*   Restructure the project into a Monorepo to enable code sharing between Web and Mobile.
*   Centralize shared logic, constants, and TypeScript interfaces.

### 2. Standardization & Type Safety
*   Implement backend-driven type generation to ensure synchronization between API and Client.

### 3. Refactoring
*   Break down large components into smaller, reusable units.
*   Centralize services (like Notifications) to improve maintainability.


