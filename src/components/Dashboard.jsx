import { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";

function Dashboard({ user, onLogout }) {

  const [transactions, setTransactions] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const API_BASE = "https://money-manager-backend-1-dw8w.onrender.com";

  // ✅ FETCH DATA
  const fetchExpenses = async () => {
    if (!user || !user.id) return;

    try {
      const res = await axios.get(
        `${API_BASE}/expenses/user/${user.id}`
      );
      setTransactions(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Error loading data");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  // ✅ ADD EXPENSE
  const addExpense = async () => {

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
      await axios.post(`${API_BASE}/expenses`, data);

      alert("Added successfully");

      setTitle("");
      setAmount("");
      setType("");
      setCategory("");
      setDate("");

      fetchExpenses();

    } catch (err) {
      console.log(err);
      alert("Error adding expense");
    }
  };

  // calculations
  const income = transactions
    .filter(t => t.type === "Income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter(t => t.type === "Expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>💰 Money Manager</h2>
        <p>{user.username}</p>

        <button className="active">Dashboard</button>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <h3>Balance</h3>
            <p>₹{balance}</p>
          </div>

          <div className="card">
            <h3>Income</h3>
            <p>₹{income}</p>
          </div>

          <div className="card red">
            <h3>Expense</h3>
            <p>₹{expense}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="form-box">
          <h3>Add Transaction</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Type</option>
            <option>Income</option>
            <option>Expense</option>
          </select>

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={addExpense}>Add</button>
        </div>

        {/* TRANSACTIONS */}
        <div className="transactions">
          <h3>Transactions</h3>

          {transactions.length === 0 ? (
            <p>No data</p>
          ) : (
            transactions.map((t) => (
              <div className="transaction" key={t.id}>
                <span>{t.title}</span>
                <span>{t.category}</span>
                <span>{t.date}</span>
                <span className={t.type === "Income" ? "green" : "red"}>
                  ₹{t.amount}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;