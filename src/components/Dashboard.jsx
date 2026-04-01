import { useState, useEffect } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { FaEdit, FaTrash } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard({ user, onLogout }) {

  const [transactions, setTransactions] = useState([]);
  const [insight, setInsight] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ UPDATED BACKEND URL
  const API = "https://money-manager-backend-1-dw8w.onrender.com/expenses";

  // FETCH
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // AI FUNCTION
  const getAIInsights = async () => {
    try {
      const res = await axios.post(
        "https://money-manager-backend-1-dw8w.onrender.com/ai/insights",
        userData
      );
      setInsight(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ADD / UPDATE
  const addOrUpdate = async () => {

    if (!title || !amount || !type || !category || !date) {
      alert("Fill all fields");
      return;
    }

    const data = {
      title,
      amount: Number(amount),
      type,
      category,
      date,
      userId: user?.id || 1
    };

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, data);
      } else {
        await axios.post(API, data);
      }

      setTitle("");
      setAmount("");
      setType("");
      setCategory("");
      setDate("");
      setEditId(null);

      fetchExpenses();

    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const deleteTransaction = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchExpenses();
  };

  // EDIT
  const handleEdit = (t) => {
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setCategory(t.category);
    setDate(t.date);
    setEditId(t.id);
  };

  // FILTER USER
  const userData = transactions.filter(
    t => user?.id ? Number(t.userId) === Number(user.id) : true
  );

  // CALCULATIONS
  const income = userData
    .filter(t => t.type === "Income")
    .reduce((a, t) => a + t.amount, 0);

  const expense = userData
    .filter(t => t.type === "Expense")
    .reduce((a, t) => a + t.amount, 0);

  const balance = income - expense;

  // CHART
  const chartData = {
    labels: ["Expense", "Income"],
    datasets: [
      {
        data: [expense, income],
        backgroundColor: ["#dc2626", "#16a34a"]
      }
    ]
  };

  return (
    <div style={container}>

      {/* SIDEBAR */}
      <div style={sidebar}>
        <h2 style={logo}>Money Manager</h2>

        <div style={{ marginTop: "20px" }}>
          <p><b>{user?.username || "User"}</b></p>
        </div>

        <div style={menu}>
          <p style={active}>Dashboard</p>
          <p>Category</p>
          <p>Income</p>
          <p>Expense</p>
        </div>

        <button style={logoutBtn} onClick={onLogout}>Logout</button>
      </div>

      {/* MAIN */}
      <div style={main}>

        {/* FORM */}
        <div style={form}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />

          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="">Type</option>
            <option>Income</option>
            <option>Expense</option>
          </select>

          <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />

          <button style={addBtn} onClick={addOrUpdate}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* CARDS */}
        <div style={cards}>
          <Card title="Total Balance" value={balance} color="#7c3aed" />
          <Card title="Total Income" value={income} color="#16a34a" />
          <Card title="Total Expense" value={expense} color="#dc2626" />
        </div>

        {/* AI BUTTON */}
        <button style={aiBtn} onClick={getAIInsights}>
          Generate AI Insights
        </button>

        {/* AI OUTPUT */}
        {insight && (
          <div style={aiBox}>
            {insight}
          </div>
        )}

        {/* BODY */}
        <div style={body}>

          {/* TRANSACTIONS */}
          <div style={box}>
            <h3>Recent Transactions</h3>

            {userData.slice(-5).reverse().map(t => (
              <div key={t.id} style={row}>

                <div>
                  <strong>{t.title}</strong>
                  <p style={dateText}>{t.date}</p>
                </div>

                <div style={{
                  color: t.type === "Income" ? "#16a34a" : "#dc2626",
                  fontWeight: "bold"
                }}>
                  {t.type === "Income" ? "+" : "-"}₹{t.amount}
                </div>

                <div style={actions}>
                  <button style={editBtn} onClick={() => handleEdit(t)}>
                    <FaEdit />
                  </button>
                  <button style={deleteBtn} onClick={() => deleteTransaction(t.id)}>
                    <FaTrash />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* CHART */}
          <div style={box}>
            <h3>Financial Overview</h3>

            <div style={{ position: "relative", width: "250px", margin: "auto" }}>
              <Doughnut data={chartData} />

              <div style={centerText}>
                <p style={{ fontSize: "12px" }}>Total Balance</p>
                <h2>₹{balance}</h2>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// CARD COMPONENT
const Card = ({ title, value, color }) => (
  <div style={{
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  }}>
    <p style={{ color }}>{title}</p>
    <h2>₹{value}</h2>
  </div>
);

// STYLES
const container = { display: "flex", height: "100vh", background: "#f3f4f6" };

const sidebar = {
  width: "220px",
  background: "#fff",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "0 0 10px rgba(0,0,0,0.05)"
};

const logo = { color: "#7c3aed" };

const menu = { marginTop: "30px", lineHeight: "35px" };

const active = {
  background: "#7c3aed",
  color: "#fff",
  padding: "5px",
  borderRadius: "5px"
};

const logoutBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "5px"
};

const main = { flex: 1, padding: "20px" };

const form = { display: "flex", gap: "10px", marginBottom: "20px" };

const addBtn = {
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "5px"
};

const aiBtn = {
  background: "#111827",
  color: "#fff",
  padding: "10px",
  borderRadius: "5px",
  marginBottom: "10px"
};

const aiBox = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const cards = { display: "flex", gap: "20px", marginBottom: "20px" };

const body = { display: "flex", gap: "20px" };

const box = {
  flex: 1,
  background: "#fff",
  padding: "20px",
  borderRadius: "12px"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0"
};

const actions = { display: "flex", gap: "8px" };

const editBtn = { background: "#3b82f6", color: "#fff", border: "none", padding: "5px" };
const deleteBtn = { background: "#dc2626", color: "#fff", border: "none", padding: "5px" };

const dateText = { fontSize: "12px", color: "gray" };

const centerText = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};

export default Dashboard;