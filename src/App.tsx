import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import { useState } from "react";

function MainApp() {
  const { token, user, logout } = useAuth();
  const [page, setPage] = useState("dashboard");

  if (!token) return <AuthPage />;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* 🔹 Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between p-5">

        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-8">
            TaskFlow
          </h1>

          <div className="space-y-2">
            <button
              onClick={() => setPage("dashboard")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                page === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              📊 Dashboard
            </button>

            <button
              onClick={() => setPage("projects")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                page === "projects"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              📁 Projects
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm mb-2 text-gray-600">
            Role: <span className="font-semibold">{user?.role}</span>
          </p>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* 🔥 Top Navbar */}
        <div className="bg-white shadow-md rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold capitalize">
            {page}
          </h2>
        </div>

        {/* 🔥 Page Content */}
        <div className="bg-white shadow-md rounded-xl p-6">
          {page === "dashboard" && <DashboardPage />}
          {page === "projects" && <ProjectsPage />}
        </div>

      </div>

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;