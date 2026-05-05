### Setup Instructions

**1. Backend (ASP.NET Core)**
*   **Database Setup**: You need a PostgreSQL instance running. Create a database named `image_overlay_db`.
*   **Connection String**: Open `backend/appsettings.json` and update the `DefaultConnection` string with your PostgreSQL username and password.
*   **Apply Migrations**: Open your terminal in the `backend/` folder and run `dotnet ef database update`. This creates the tables for image metadata and technical fields like `FileSize` and `Dimensions`.
*   **Run the API**: Execute `dotnet run`. The backend will start at `http://localhost:5000`. You can visit `http://localhost:5000/swagger` to see the API documentation.

**2. Frontend (Next.js)**
*   **Install Dependencies**: Navigate to the `frontend/` directory and run `npm install`. This installs React, Lucide-react for icons, and Next.js.
*   **Configuration**: Ensure the `API_BASE` in your `lib/api.ts` (or equivalent) is set to `http://localhost:5000/api/Images` so it can talk to the backend.
*   **Start the App**: Run `npm run dev`. The UI will be available at `http://localhost:3000`.

---

### Project Specification

This is a full-stack solution designed to handle secure image uploads and dynamic text-overlay processing.

**Backend Implementation**
*   **Architecture**: I followed a layered approach (Controllers, Services, Repositories) similar to Spring Boot patterns. This keeps business logic—like the image processing—completely separate from database access.
*   **Security**: The system doesn't trust user-provided filenames. It generates unique names using **GUIDs** and timestamps to prevent collisions. It also validates the "Magic Numbers" of files to ensure they are actually JPG or PNG images before saving.
*   **Image Processing**: Using the **ImageSharp** library, the service automatically applies text overlays. To ensure the text is readable on any background, I implemented a dual-drawing technique: a black shadow offset is drawn first, followed by the white main text.
*   **Persistence**: Data is stored in PostgreSQL via Entity Framework Core, while physical files are managed in the `wwwroot/uploads` directory.

**Frontend Implementation**
*   **Framework**: Built with **Next.js 14** using the App Router for clean navigation.
*   **State Management**: Uses React hooks to manage image previews and upload states. 
*   **Interface**: Styled with **Tailwind CSS** for a dark-mode aesthetic and **Lucide-react** for the iconography. The frontend communicates with the backend via a dedicated API service layer to keep components clean.

---

**Demo**: A video showing the upload, metadata editing, and processed overlay results is included in the repository root.
https://www.youtube.com/watch?v=0GJmp2A90oE
