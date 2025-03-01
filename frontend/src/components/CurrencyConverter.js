import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("LKR");
  const [amount, setAmount] = useState(0);
  const [converted, setConverted] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data } = await axios.get("http://localhost:5000/transfers");
    setHistory(data);
  };

  const handleConvert = async () => {
    const { data } = await axios.post("http://localhost:5000/transfers", { from, to, amount });
    setConverted(data.convertedAmount);
    fetchHistory();
  };

  const handleRevoke = async (id) => {
    await axios.delete(`http://localhost:5000/transfers/${id}`);
    fetchHistory();
  };

  return (
    <div>
      <h2>Currency Converter</h2>
      <select value={from} onChange={(e) => setFrom(e.target.value)}>
        <option value="USD">USD</option>
        <option value="LKR">LKR</option>
        <option value="AUD">AUD</option>
        <option value="INR">INR</option>
      </select>
      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="USD">USD</option>
        <option value="LKR">LKR</option>
        <option value="AUD">AUD</option>
        <option value="INR">INR</option>
      </select>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleConvert}>Convert</button>
      {converted && <h3>Converted: {converted}</h3>}
      <h3>Transfer History</h3>
      <ul>
        {history.map((item) => (
          <li key={item._id}>
            {item.amount} {item.from} → {item.convertedAmount} {item.to}
            <button onClick={() => handleRevoke(item._id)}>Revoke</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrencyConverter;
