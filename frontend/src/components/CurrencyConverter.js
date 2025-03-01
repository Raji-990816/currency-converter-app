import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, MenuItem, Select, TextField, Button, Box, Container, Snackbar } from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CurrencyConverter = () => {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("LKR");
  const [amount, setAmount] = useState(0);
  const [converted, setConverted] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null); 
  const [openSnackbar, setOpenSnackbar] = useState(false); 

  useEffect(() => {
    fetchHistory();
  }, []);

  // Fetch transfer history with error handling
  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/transfers`);
      setHistory(data);
    } catch (err) {
      setError("Failed to fetch history. Please try again later.");
      setOpenSnackbar(true); 
    }
  };

  // Handle conversion with error handling and validation 
  const handleConvert = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/transfers`, { from, to, amount });
      setConverted(data.convertedAmount); 
      fetchHistory();
    } catch (err) {
      setError("Failed to convert currency. Please check your input and try again.");
      setOpenSnackbar(true); 
    }
  };

  // Handle delete transfer 
  const handleRevoke = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/transfers/${id}`);
      fetchHistory();
    } catch (err) {
      setError("Failed to revoke transfer. Please try again.");
      setOpenSnackbar(true); 
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
        {/* Title */}
      <Typography variant="h2" color="darkblue" gutterBottom>
        Currency Converter
      </Typography>

        {/* drop downs */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginRight: "10px" }}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="LKR">LKR</MenuItem>
          <MenuItem value="AUD">AUD</MenuItem>
          <MenuItem value="INR">INR</MenuItem>
        </Select>

        <Select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="LKR">LKR</MenuItem>
          <MenuItem value="AUD">AUD</MenuItem>
          <MenuItem value="INR">INR</MenuItem>
        </Select>
      </Box>
        {/* Amount Field and Transfer Button*/}
      <TextField
        required={true}
        type="number"
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        variant="outlined"
        style={{ marginBottom: "20px" }}
        error={amount <= 0} 
        helperText={amount <= 0 ? "Amount must be greater than 0." : ""}
      />

      <Button
        variant="contained"
        sx={{
            backgroundColor: "#00008B",
            color: "white",
            "&:hover": {
              backgroundColor: "#030380", 
            },
          }}
        fullWidth
        onClick={handleConvert}
        style={{ marginBottom: "20px" }}
      >
        Transfer
      </Button>

        {/* Converted Amount */}
      {converted && (
        <Typography variant="h6" color="#07B150" style={{ marginBottom: "20px" }}>
          Converted: {converted} {to}
        </Typography>
      )}
        
        {/* Transfer History */}
      <Typography variant="h4" color="darkblue" gutterBottom>
        Transfer History
      </Typography>
      <Box>
        {history.map((item) => (
          <Box key={item._id} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body1" color="textSecondary" sx={{ flexGrow: 1 }}>
                {item.amount} {item.from} → {item.convertedAmount} {item.to}
            </Typography>
        
            <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2 }}>
                {new Date(item.createdAt).toLocaleString()}
            </Typography>
        
            <Button 
                size="small"  
                sx={{
                backgroundColor: "#de0404", 
                color: "white",
                "&:hover": {
                    backgroundColor: "#c40404", 
              } ,
                }}
                onClick={() => handleRevoke(item._id)}
            >
                Revoke
            </Button>
          </Box>
            ))}
      </Box>

      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Container>
  );
};

export default CurrencyConverter;
