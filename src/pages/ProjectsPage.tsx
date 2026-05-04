import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProjectsPage() {
  const { token, user } = useAuth();

  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
const [users, setUsers] = useState<any[]>([]);
const [selectedUser, setSelectedUser] = useState("");

const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Load projects
  const loadProjects = async () => {
    const res = await fetch(`${API_URL}/api/projects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setProjects(data);
  };

  const loadUsers = async () => {
  const res = await fetch(`${API_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  setUsers(data);
};

  
  // 🔹 CREATE PROJECT
 const handleCreate = async () => {
  if (!name.trim()) return;

  const res = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, admin: user.id })
  });

  const data = await res.json();
  console.log("Response:", data);   

  if (!res.ok) {
    alert(data.msg || "Error creating project");
    return;
  }

  setName("");
  loadProjects();
};

  const addMember = async (projectId: string) => {
  if (!selectedUser) return;

  await fetch(
    `${API_URL}/api/projects/${projectId}/add-member`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId: selectedUser })
    }
  );

  loadProjects();
};

const removeMember = async (projectId: string, userId: string) => {
  await fetch(
    `${API_URL}/api/projects/${projectId}/remove-member`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    }
  );

  loadProjects();
};

  useEffect(() => {
  if (token) {
    loadProjects();
    loadUsers();
  }
}, [token]);



  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Projects</h2>

      {/* Create Project */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3">Create Project</h3>

        <div className="flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {/* Project List */}
     <div className="bg-white p-4 rounded-xl shadow h-[400px] flex flex-col">
        <h3 className="font-semibold mb-3">Project List</h3>

        {projects.length === 0 && (
          <p className="text-gray-500">No projects yet</p>
        )}

        {projects.map((p) => (
  <div key={p._id} className="border-b py-3 flex flex-col gap-2">

    <div className="flex justify-between">
      <span className="font-medium">{p.name}</span>
      <span className="text-sm text-gray-400">
        {p.members?.length || 1} members
      </span>
    </div>

    {/* 🔹 MEMBERS LIST */}
<div className="flex flex-wrap gap-2 mt-2">
  {p.members?.map((m: any) => (
    <div
      key={m._id || m}
      className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded text-sm"
    >
      {m.name || m}

      {/*  REMOVE BUTTON (Admin only) */}
      {user?.role === "Admin" && (
        <button
          onClick={() => removeMember(p._id, m._id || m)}
          className="text-red-500 ml-1"
        >
          ✕
        </button>
      )}
    </div>
  ))}
</div>

    {/* 🔹 ADD MEMBER (ADMIN ONLY) */}
    {user?.role === "Admin" && (
      <div className="flex gap-2">
        <select
          className="border p-1 rounded"
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => addMember(p._id)}
          className="bg-green-500 text-white px-2 rounded"
        >
          Add
        </button>
      </div>
    )}
  </div>
))}
      </div>

    </div>
  );
}