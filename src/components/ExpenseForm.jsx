import { useState } from "react";

function ExpenseForm({ refreshExpenses }) {

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const addExpense = async () => {

    const expense = {
      title,
      amount,
      category,
      date
    };

    try {
      const response = await fetch("https://money-manager-backend-1-dw8w.onrender.com/expenses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(expense)
});

      if (response.ok) {
        alert("Expense added");
        refreshExpenses();
      } else {
        alert("Failed to add expense");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div>

      <input
        placeholder="Title"
        onChange={(e)=>setTitle(e.target.value)}
      />

      <input
        placeholder="Amount"
        onChange={(e)=>setAmount(e.target.value)}
      />

      <input
        placeholder="Category"
        onChange={(e)=>setCategory(e.target.value)}
      />

      <input
        type="date"
        onChange={(e)=>setDate(e.target.value)}
      />

      <button onClick={addExpense}>
        Add Expense
      </button>

    </div>
  );
}

export default ExpenseForm;