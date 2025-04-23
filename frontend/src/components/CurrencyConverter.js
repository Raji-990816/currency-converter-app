import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { Typography, MenuItem, Select, TextField, Button, Box, Container, Snackbar, List, ListItem} from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CurrencyConverter = () => {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("LKR");
  const [amount, setAmount] = useState(0);
  const [converted, setConverted] = useState(null);
  const [history, setHistory] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
   

  // Fetch transfer history with error handling
  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/transfers`);
      setHistory(data);
      setIsPending(false);
    } catch (err) {
      handleError("Failed to fetch history. Please try again later.");
      setIsPending(false);
    }
  },[]);

  useEffect(() => {
    fetchHistory();
  },[fetchHistory]);

  // Handle conversion with error handling and validation 
  const handleConvert = useCallback(async () => {
    if (!amount || Number(amount) <= 0) {
      handleError("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/transfers`, { from, to, amount:Number(amount) });
      setConverted(data.convertedAmount);
      fetchHistory();
    } catch (err) {
      handleError("Failed to convert currency. Please check your input and try again.");
    }
  },[from, to, amount, fetchHistory]);

  // Handle delete transfer 
  const handleRevoke = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/transfers/${id}`);
      fetchHistory();
    } catch (err) {
      handleError("Failed to revoke transfer. Please try again.");
    }
  };

  //handle error messages
  const handleError = (message) => {
    setError(message);
    setOpenSnackbar(true);
  }

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 6 }}>

    {/* Title */}
    <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
      Currency Converter
    </Typography>

    {/* Dropdowns */}
    <Box display="flex" gap={2} mb={2}>
    <Select value={from} onChange={(e) => setFrom(e.target.value)} fullWidth>
      {["USD", "LKR", "AUD", "INR"].map((currency) => (
        <MenuItem key={currency} value={currency}>{currency}</MenuItem>
      ))}
    </Select>
    <Select value={to} onChange={(e) => setTo(e.target.value)} fullWidth>
      {["USD", "LKR", "AUD", "INR"].map((currency) => (
        <MenuItem key={currency} value={currency}>{currency}</MenuItem>
      ))}
    </Select>
    </Box>

    {/* Amount Input */}
    <TextField
      label="Amount"
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      fullWidth
      variant="filled"
      error={amount <= 0}
      helperText={amount <= 0 ? "Amount must be greater than 0." : ""}
      sx={{ mb: 2 }}
    />

    {/* Convert Button */}
    <Button variant="contained" color="primary" fullWidth onClick={handleConvert}>
      Convert
    </Button>

    {/* Converted Amount */}
    {isPending ? (
      <Typography mt={2} color="text.secondary">Loading...</Typography>
      ) : converted !== null ? (
      <Typography variant="h6" color="success.main" mt={2}>
        Converted: {converted} {to}
      </Typography>
      ) : (
      <Typography variant="body2" color="text.secondary" mt={2}>
        No conversion data available
      </Typography>
    )}

    {/* Transfer History */}
    <Typography variant="h5" color="primary" mt={4} fontWeight="bold">
      Transfer History
    </Typography>

    {history.length > 0 ? (
    <List>
      {history.map((item) => (
        <ListItem key={item._id} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">
            {item.amount} {item.from} → {item.convertedAmount} {item.to}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(item.createdAt).toLocaleString()}
          </Typography>
          <Button
            size="small"
            color="error"
            startIcon={<img src="/delete.png" alt="Delete" style={{ width: '20px', height: '20px' }} />}
            onClick={() => handleRevoke(item._id)}
          >
            Delete
          </Button>
        </ListItem>
      ))}
    </List>
    ) : (
    <Typography variant="body2" color="text.secondary" mt={2}>
      No history available
    </Typography>
    )}

    {/* Snackbar for Errors */}
    <Snackbar open={openSnackbar} autoHideDuration={6500} onClose={handleCloseSnackbar} message={error} />

    </Container>

  );
};

export default memo(CurrencyConverter);
