# Student Management Backend

## Description

This backend application is built with NestJS and TypeScript, designed to manage a list of students with comprehensive CRUD operations. The application features user authentication, including registration and login, with secure password storage using hashing and JWT for maintaining authentication state. Additionally, it includes pagination and advanced search capabilities, allowing searches by name, country, age, email, gender, age range, etc.

The project uses a PostgreSQL database hosted on Supabase, managed through TypeORM. It adheres to RESTful API design principles, ensuring robust data validation and error handling. The application is thoroughly tested with unit tests for all services, controllers, and guards using Jest.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Endpoints](#endpoints)
- [License](#license)

## Deployment

The application is deployed on Heroku. You can access the base URL here:

- [Student Manager Backend Deployment](https://student-manager-backend-940f11b85bff.herokuapp.com)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/student-management-backend.git
   cd student-management-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Environment Variables

Create a .env file in the root directory and add the following environment variables:

   ```bash
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
SECRET_KEY=your_jwt_secret_key
   ```

## Running the Application

1. **Run the application:**

```bash
npm run start
```

2. **Run the application in development mode:**

```bash
npm run start:dev
```

3. **Run the application in production mode:**

```bash
npm run start:prod
```

## Running Tests

**Run all tests:**

```bash
npm run test
```

## Project Structure

```bash
src/
|-- auth/
|   |-- controllers/
|   |   |-- auth.controller.ts
|   |-- services/
|   |   |-- auth.service.ts
|   |-- auth.module.ts
|
|-- common/
|   |-- dtos/
|   |   |-- registerUser.dto.ts
|   |   |-- signInUser.dto.ts
|   |-- guards/
|   |   |-- auth.guard.ts
|
|-- database/
|   |-- database.module.ts
|
|-- student/
|   |-- controllers/
|   |   |-- student.controller.ts
|   |-- dtos/
|   |   |-- createStudent.dto.ts
|   |   |-- student.dto.ts
|   |-- entities/
|   |   |-- student.entity.ts
|   |-- services/
|   |   |-- student.service.ts
|   |-- student.module.ts
|
|-- user/
|   |-- entities/
|   |   |-- user.entity.ts
|   |-- services/
|   |   |-- user.service.ts
|   |-- user.module.ts
|
|-- app.module.ts
```

## Endpoints

### Authentication

- **POST /auth/login:** User login
  - Request Body: 
    ```json
    { 
      "email": "user@example.com", 
      "password": "password" 
    }
    ```
  - Response: 
    ```json
    { 
      "access_token": "jwt_token" 
    }
    ```

- **POST /auth/register:** User registration
  - Request Body: 
    ```json
    { 
      "email": "user@example.com", 
      "password": "password", 
      "confirmPassword": "password", 
      "firstName": "First", 
      "lastName": "Last" 
    }
    ```
  - Response: 
    ```json
    { 
      "access_token": "jwt_token" 
    }
    ```

### Students

- **GET /students:** Get all students
  - Response: 
    ```json
    [
      { 
        "id": 1, 
        "firstName": "John", 
        "lastName": "Doe", 
        "email": "john@example.com", 
        "birthDate": "1990-01-01", 
        "gender": "Male", 
        "country": "Country" 
      }, 
      ...
    ]
    ```

- **POST /students:** Add a new student
  - Request Body: 
    ```json
    { 
      "firstName": "John", 
      "lastName": "Doe", 
      "email": "john@example.com", 
      "birthDate": "1990-01-01", 
      "gender": "Male", 
      "country": "Country" 
    }
    ```
  - Response: 
    ```json
    { 
      "id": 1, 
      "firstName": "John", 
      "lastName": "Doe", 
      "email": "john@example.com", 
      "birthDate": "1990-01-01", 
      "gender": "Male", 
      "country": "Country" 
    }
    ```

- **PUT /students:** Update an existing student
  - Request Body: 
    ```json
    { 
      "id": 1, 
      "firstName": "John", 
      "lastName": "Doe", 
      "email": "john@example.com", 
      "birthDate": "1990-01-01", 
      "gender": "Male", 
      "country": "Country" 
    }
    ```
  - Response: 
    ```json
    { 
      "id": 1, 
      "firstName": "John", 
      "lastName": "Doe", 
      "email": "john@example.com", 
      "birthDate": "1990-01-01", 
      "gender": "Male", 
      "country": "Country" 
      }
      ```

- **DELETE /students/:id:** Delete a student
  - Response: `204 No Content`

- **GET /students/search:** Search for students with pagination and filters
  - Query Params: `page`, `limit`, `name`, `country`, `gender`, `agefrom`, `ageto`
  - Response: 
    ```json
    { 
      "data": [...], 
      "currentPage": 1, 
      "totalPages": 10, 
      "totalItems": 100 
    }
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](https://www.mit.edu/~amini/LICENSE.md) file for details.
