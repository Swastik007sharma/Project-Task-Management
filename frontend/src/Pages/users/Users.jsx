import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/api.js";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data.users || []);
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="users-page">
      <header className="users-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Manage Users</h1>
        </div>
      </header>

      {status.message ? (
        <div className={`users-alert ${status.type}`}>{status.message}</div>
      ) : null}

      <section className="users-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Users;
