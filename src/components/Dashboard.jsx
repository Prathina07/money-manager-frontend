import { useState, useEffect } from "react";
import axios from "axios";
import { FaWallet, FaMoneyBillWave, FaChartPie } from "react-icons/fa";
import "./dashboard.css";

function Dashboard({ user, onLogout }) {

  const [transactions, setTransactions] = useState([]);

  const API = `https://money-manager-backend-1-dw8w.onrender.com/expenses/user/${user?.id}`;

  useEffect(() => {
    if (user?.id) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API);
      setTransactions(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // calculations
  const income = transactions
    .filter(t => t.type === "Income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "Expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>💰 Money Manager</h2>
        <p>{user.username}</p>

        <button className="active">Dashboard</button>
        <button>Income</button>
        <button>Expense</button>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* CARDS */}
        <div className="cards">

          <div className="card">
            <FaWallet />
            <h3>Total Balance</h3>
            <p>₹{balance}</p>
          </div>

          <div className="card">
            <FaMoneyBillWave />
            <h3>Total Income</h3>
            <p>₹{income}</p>
          </div>

          <div className="card red">
            <FaChartPie />
            <h3>Total Expense</h3>
            <p>₹{expense}</p>
          </div>

        </div>

        {/* TRANSACTIONS */}
        <div className="transactions">
          <h3>Recent Transactions</h3>

          {transactions.length === 0 ? (
            <p>No data</p>
          ) : (
            transactions.map(t => (
              <div className="transaction" key={t.id}>
                <span>{t.title}</span>
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