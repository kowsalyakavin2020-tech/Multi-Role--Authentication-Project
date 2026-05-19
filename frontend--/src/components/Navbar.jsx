import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Role: {role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navbar;