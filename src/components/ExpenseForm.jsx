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

    await fetch("http://localhost:8080/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(expense)
    });

    alert("Expense added");

    refreshExpenses();
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