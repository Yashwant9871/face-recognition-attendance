import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function App() {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const fetchData = async () => {
    try {
      const [u, a] = await Promise.all([
        axios.get(`${API_URL}/users/`),
        axios.get(`${API_URL}/attendance/`),
      ]);
      setUsers(u.data || []);
      setAttendance(a.data || []);
    } catch (e) {
      console.error(e);
      setStatus("Could not fetch data. Is the backend running?");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !file) {
      setStatus("⚠️ Enter a name and choose an image.");
      return;
    }
    const form = new FormData();
    form.append("name", name);
    form.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/register/`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(res.data.message || "Registered.");
      setName("");
      setFile(null);
      fetchData();
    } catch {
      setStatus("❌ Registration failed.");
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("⚠️ Choose an image first.");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/mark_attendance/`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(res.data.message || res.data.error || "Done.");
      setFile(null);
      fetchData();
    } catch {
      setStatus("❌ Attendance marking failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <header className="max-w-6xl mx-auto mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Face Recognition Attendance</h1>

           <p className="text-gray-600 mt-2">AI-powered attendance system with FastAPI + React</p>

      </header>

      <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Register */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Register User</h2>
          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="w-full text-gray-700"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>
        </section>

        {/* Mark Attendance */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mark Attendance</h2>
          <form className="space-y-4" onSubmit={handleMarkAttendance}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="w-full text-gray-700"
            />
            <button
              type="submit"
              className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition"
            >
              Mark
            </button>
          </form>
        </section>
      </main>

      {status && (
        <div className="max-w-6xl mx-auto mt-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
            {status}
          </div>
        </div>
      )}

      {/* Tables */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mt-8">
        <section className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Registered Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{u.id}</td>
                    <td className="px-4 py-2 border">{u.name}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 border text-gray-500" colSpan="2">
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Attendance Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{a.id}</td>
                    <td className="px-4 py-2 border">{a.user}</td>
                    <td className="px-4 py-2 border">
                      {new Date(a.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {attendance.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 border text-gray-500" colSpan="3">
                      No attendance yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
