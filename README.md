### Setup Instructions

**1. Backend (ASP.NET Core Web API)**
*   **Database**: Ensure PostgreSQL is running and create a database (e.g., `task1_db`).
*   **Configuration**: Update the `DefaultConnection` string in `backend/appsettings.json` with your PostgreSQL credentials.
*   **Migrations**: Run `dotnet ef database update` in the `backend/` directory to build the schema, including technical fields like `FileSize` and `Dimensions`.
*   **Execution**: Run `dotnet run`. The API will start at `http://localhost:5000`. You can access the Swagger UI at `/swagger` to test the endpoints.

**2. Frontend (Next.js)**
*   **Dependencies**: Run `npm install` in the `frontend/` directory.
*   **API Connection**: Verify that the API base URL in your frontend services points to `http://localhost:5000/api/Images`.
*   **Execution**: Run `npm run dev`. The application will be accessible at `http://localhost:3000`.

---

### Project Specification

This project is a decoupled full-stack application centered around secure image management and automated processing.

**Backend Implementation (ASP.NET Core Web API)**
The backend is built as a dedicated **Web API**, focusing on a strictly layered architecture to keep the logic clean and maintainable. I organized the project into the following structure:
*   **Controllers**: Handle HTTP requests and route them to the appropriate services.
*   **Services**: Contain the core business logic, including the **ImageSharp** implementation for processing text overlays.
*   **Repositories**: Manage data persistence and queries using Entity Framework Core and PostgreSQL.
*   **Entities**: Define the database schema.
*   **DTOs**: Create clear contracts for data exchange, ensuring internal models aren't exposed to the frontend.
*   **Mappers**: Handle the conversion between Entities and DTOs.
*   **Middleware**: Includes a global exception handler to return clean JSON errors instead of raw stack traces.
*   **Exceptions**: Contains custom exception classes for specific scenarios like "Image Not Found."

**Technical Highlights**:
*   **Security**: The system renames files using **GUIDs** and timestamps to prevent collisions and directory traversal. It also performs **Magic Number** validation to verify file headers (JPG/PNG) before storage.
*   **Processing**: Text overlays are rendered with a dual-layer technique (black shadow offset under white text) to ensure readability across different image backgrounds.

**Frontend Implementation (Next.js)**
*   The frontend uses **Next.js 14** with the App Router.
*   **UI/UX**: Styled with **Tailwind CSS** for a dark-mode look, utilizing **Lucide-react** for icons.
*   **State**: Handles real-time image previews and dynamic upload states using React hooks.

---

### Demo
A full demonstration of the application's functionality, including the upload process and the processed image results, can be found in this **YouTube video**: https://www.youtube.com/watch?v=0GJmp2A90oE
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/8d24f418-717d-4e26-be59-5b4287ce7697" />
