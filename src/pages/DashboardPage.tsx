import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { token, logout } = useAuth();

  // 🔹 ADD THIS
  const user = (() => {
  const stored = localStorage.getItem("user");
  try {
    return stored && stored !== "undefined" ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
})();

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
 const [assignedTo, setAssignedTo] = useState<string[]>([]);

  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");

  const [dueDate, setDueDate] = useState("");
const [priority, setPriority] = useState("Medium");

  // 🔹 Load users
  const loadUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setUsers(data);

    if (data.length > 0) {
      setAssignedTo([data[0]._id]);
    }
  };

  // 🔹 Load projects
  const loadProjects = async () => {
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setProjects(data);

    if (data.length > 0) {
      setSelectedProject(data[0]._id);
    }
  };

  // 🔹 Load tasks
  const loadTasks = async (projectId: string) => {
    const res = await fetch(
      `http://localhost:5000/api/tasks?projectId=${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (token) {
      loadProjects();
      loadUsers();
    }
  }, [token]);

  useEffect(() => {
    if (selectedProject) loadTasks(selectedProject);
  }, [selectedProject]);

  

  // 🔹 Add Task
  const handleAddTask = async () => {
    if (!title || !selectedProject) return;
 
    console.log("SENDING:", assignedTo);
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        status: "To Do",
        projectId: selectedProject,
        assignedTo: assignedTo,
        dueDate,
        priority
      }),
    });

    setTitle("");
    setDescription("");
    loadTasks(selectedProject);
  };

  // 🔹 Update Status
  const updateStatus = async (id: string, current: string) => {
    const next =
      current === "To Do"
        ? "In Progress"
        : current === "In Progress"
        ? "Done"
        : "To Do";

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: next }),
    });

    loadTasks(selectedProject);
  };

  // 🔹 Delete Task
  const deleteTask = async (id: string) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    loadTasks(selectedProject);
  };

  // 🔹 Total
const totalTasks = tasks.length;

// 🔹 By status
const todoCount = tasks.filter(t => t.status === "To Do").length;
const inProgressCount = tasks.filter(t => t.status === "In Progress").length;
const doneCount = tasks.filter(t => t.status === "Done").length;

// 🔹 Overdue
const today = new Date();
const overdueTasks = tasks.filter(
  (t) =>
    t.dueDate &&
    new Date(t.dueDate) < today &&
    t.status !== "Done"
);

// 🔹 Tasks per user
const tasksPerUser: Record<string, number> = {};

tasks.forEach((t) => {
  if (Array.isArray(t.assignedTo)) {
    t.assignedTo.forEach((u: any) => {
      const name = u.name || "Unknown";
      tasksPerUser[name] = (tasksPerUser[name] || 0) + 1;
    });
  } else if (t.assignedTo?.name) {
    const name = t.assignedTo.name;
    tasksPerUser[name] = (tasksPerUser[name] || 0) + 1;
  }
});

  return (
  <div className="flex min-h-screen bg-gray-100">

    {/* Sidebar */}
    
      
    {/* Main Content */}
    <div className="flex-1 p-6">

      {/* Stats Cards */}
     <div className="grid grid-cols-4 gap-4 mb-6">

  <div className="bg-white p-4 rounded-xl shadow">
    <p>Total Tasks</p>
    <h2 className="text-xl font-bold">{totalTasks}</h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p>To Do</p>
    <h2 className="text-xl font-bold">{todoCount}</h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p>In Progress</p>
    <h2 className="text-xl font-bold">{inProgressCount}</h2>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <p>Done</p>
    <h2 className="text-xl font-bold">{doneCount}</h2>
  </div>

</div>

<div className="bg-white p-4 rounded-xl shadow mb-6">
  <h3 className="font-semibold mb-2">Overdue Tasks</h3>

  {overdueTasks.length === 0 ? (
    <p className="text-gray-400 text-sm">No overdue tasks 🎉</p>
  ) : (
    overdueTasks.map((t) => (
      <div key={t._id} className="border-b py-2 text-sm">
        <span className="font-medium">{t.title}</span> — 
        <span className="text-red-500 ml-1">
          {new Date(t.dueDate).toLocaleDateString()}
        </span>
      </div>
    ))
  )}
</div>

<div className="bg-white p-4 rounded-xl shadow mb-6">
  <h3 className="font-semibold mb-2">Tasks per User</h3>

  {Object.keys(tasksPerUser).length === 0 ? (
    <p className="text-gray-400 text-sm">No data</p>
  ) : (
    Object.entries(tasksPerUser).map(([name, count]) => (
      <div key={name} className="flex justify-between text-sm border-b py-1">
        <span>{name}</span>
        <span className="font-semibold">{count}</span>
      </div>
    ))
  )}
</div>

<h3 className="font-semibold mb-2">Select Project</h3>
<select
  className="w-full border p-2 rounded mb-4"
  value={selectedProject}
  onChange={(e) => setSelectedProject(e.target.value)}
>
  {projects.map((p) => (
    <option key={p._id} value={p._id}>
      {p.name}
    </option>
  ))}
</select>

      {/* Add Task */}
      {user?.role === "Admin" && (
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h3 className="font-semibold mb-2">Add Task</h3>

          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
  type="date"
  className="w-full border p-2 rounded mb-2"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>

<select
  className="w-full border p-2 rounded mb-2"
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
>
  <option value="Low">Low Priority</option>
  <option value="Medium">Medium Priority</option>
  <option value="High">High Priority</option>
</select>

  <div className="border p-2 rounded max-h-24 overflow-y-auto">
  {users.map((u) => (
    <label key={u._id} className="block">
      <input
        type="checkbox"
        checked={assignedTo.includes(u._id)}
        onChange={(e) => {
          if (e.target.checked) {
            setAssignedTo((prev) => [...prev, u._id]);
          } else {
            setAssignedTo((prev) =>
              prev.filter((id) => id !== u._id)
            );
          }
        }}
      />
      {" "}{u.name}
    </label>
  ))}
</div>

          <button
            onClick={handleAddTask}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>
      )}

      {/* Tasks */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Tasks</h3>

        {tasks.map((t) => (
          <div
            key={t._id}
            className="border-b py-2 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{t.title}</p>
              <p className="text-sm text-gray-500">
                 Assigned to:{" "}
  {Array.isArray(t.assignedTo)
    ? t.assignedTo.map((u: any) => u.name).join(", ")
    : t.assignedTo?.name || "None"}
              </p>
               <p className="text-xs text-gray-400">
    Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"}
  </p>

  <span className={`px-2 py-1 rounded text-white text-xs ${
  t.priority === "High"
    ? "bg-red-500"
    : t.priority === "Medium"
    ? "bg-yellow-500"
    : "bg-green-500"
}`}>
  {t.priority}
</span>
            </div>

            <div className="flex gap-2">
              <span className="text-sm">{t.status}</span>

              {(user?.role === "Admin" ||
  t.assignedTo?.some((u: any) => u._id === user?.id)) && (
  <button
    onClick={() => updateStatus(t._id, t.status)}
    className="bg-yellow-400 px-2 py-1 rounded"
  >
    Update
  </button>
)}
              {user?.role === "Admin" && (
                <button
                  onClick={() => deleteTask(t._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);
}