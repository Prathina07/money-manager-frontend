import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard({ user, onLogout }) {

  const [transactions, setTransactions] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // ✅ USER-SPECIFIC API
  const API = `https://money-manager-backend-1-dw8w.onrender.com/expenses/user/${user?.id}`;

  // ✅ FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API);
      setTransactions(res.data || []);
    } catch (err) {
      console.log("FETCH ERROR:", err);

      if (err.response) {
        alert("Backend error: " + err.response.data);
      } else {
        alert("Server error: " + err.message);
      }

      setTransactions([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchExpenses();
    }
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
      userId: user?.id   // IMPORTANT
    };

    try {
      await axios.post(
        "https://money-manager-backend-1-dw8w.onrender.com/expenses",
        data
      );

      alert("Expense added");

      // reset form
      setTitle("");
      setAmount("");
      setType("");
      setCategory("");
      setDate("");

      fetchExpenses();

    } catch (err) {
      console.log("SAVE ERROR:", err);

      if (err.response) {
        alert("Backend error: " + err.response.data);
      } else {
        alert("Server error: " + err.message);
      }
    }
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>Welcome, {user.username}</h2>
      <button onClick={onLogout}>Logout</button>

      {/* FORM */}
      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Type</option>
          <option>Income</option>
          <option>Expense</option>
        </select>

        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <button onClick={addExpense}>
          Add Expense
        </button>
      </div>

      {/* TRANSACTIONS */}
      <div style={{ marginTop: "20px" }}>
        <h3>Your Expenses</h3>

        {transactions.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          transactions.map(t => (
            <div key={t.id}>
              {t.title} - ₹{t.amount} ({t.type})
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Dashboard;