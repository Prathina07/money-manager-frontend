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

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);

  const API = "https://money-manager-backend-1-dw8w.onrender.com/expenses";

  // ✅ FETCH WITH ERROR HANDLING
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API);
      setTransactions(res.data || []);
    } catch (err) {
      console.log("FETCH ERROR:", err);

      if (err.response) {
        alert("ERROR: " + err.response.data);
      } else {
        alert("Server not reachable");
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ ADD / UPDATE
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
      userId: user?.id
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
      console.log("SAVE ERROR:", err);

      if (err.response) {
        alert("ERROR: " + err.response.data);
      } else {
        alert("Server error");
      }
    }
  };

  // ✅ DELETE SAFE
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchExpenses();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ EDIT
  const handleEdit = (t) => {
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setCategory(t.category);
    setDate(t.date);
    setEditId(t.id);
  };

  // ✅ SAFE FILTER
  const userData = user
    ? transactions.filter(t => t.userId && Number(t.userId) === Number(user.id))
    : [];

  // ✅ CALCULATIONS
  const income = userData
    .filter(t => t.type === "Income")
    .reduce((a, t) => a + t.amount, 0);

  const expense = userData
    .filter(t => t.type === "Expense")
    .reduce((a, t) => a + t.amount, 0);

  const balance = income - expense;

  // ✅ CHART
  const chartData = {
    labels: ["Expense", "Income"],
    datasets: [
      {
        data: [expense, income],
        backgroundColor: ["#dc2626", "#16a34a"]
      }
    ]
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>Welcome, {user.username}</h2>
      <button onClick={onLogout}>Logout</button>

      {/* FORM */}
      <div style={{ marginTop: "20px" }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Type</option>
          <option>Income</option>
          <option>Expense</option>
        </select>

        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />

        <button onClick={addOrUpdate}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* SUMMARY */}
      <div style={{ marginTop: "20px" }}>
        <h3>Balance: ₹{balance}</h3>
        <p>Income: ₹{income}</p>
        <p>Expense: ₹{expense}</p>
      </div>

      {/* CHART */}
      <div style={{ width: "300px", marginTop: "20px" }}>
        <Doughnut data={chartData} />
      </div>

      {/* TRANSACTIONS */}
      <div style={{ marginTop: "20px" }}>
        <h3>Transactions</h3>

        {userData.map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>

            <div>
              <strong>{t.title}</strong>
              <p>{t.date}</p>
            </div>

            <div>
              {t.type === "Income" ? "+" : "-"}₹{t.amount}
            </div>

            <div>
              <button onClick={() => handleEdit(t)}>
                <FaEdit />
              </button>
              <button onClick={() => deleteTransaction(t.id)}>
                <FaTrash />
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;