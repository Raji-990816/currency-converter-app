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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const LIMIT = 8; 

  useEffect(() => {
    fetchHistory(currentPage, LIMIT);
  }, [currentPage]);

  // Fetch transfer history with error handling
  const fetchHistory = async (page, limit) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/transfers?page=${page}&limit=${limit}`);
      // Defensive check
      if (data && Array.isArray(data.items)) {
        setHistory(data.items);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
      } else {
        setHistory([]);
      }
      console.log(`Fetching: ${API_BASE_URL}/transfers?page=${page}&limit=${limit}`);
      
    } catch (err) {
      setError("Failed to fetch history. Please try again later.");
      setOpenSnackbar(true);
    }
  };

  //handle page changings
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
      fetchHistory(currentPage, LIMIT);
    } catch (err) {
      setError("Failed to convert currency. Please check your input and try again.");
      setOpenSnackbar(true); 
    }
  };

  // Handle delete transfer 
  const handleRevoke = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/transfers/${id}`);
      fetchHistory(currentPage, LIMIT);
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
      <Typography variant="h4" color="primary" gutterBottom>
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
        onChange={(e) => setAmount(Number(e.target.value))}
        fullWidth
        variant="outlined"
        style={{ marginBottom: "20px" }}
        error={amount <= 0} 
        helperText={amount <= 0 ? "Amount must be greater than 0." : ""}
      />

      <Button
        variant="contained"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": {
            bgcolor: "primary.dark"
          }
        }}
        fullWidth
        onClick={handleConvert}
        style={{ marginBottom: "20px" }}
      >
        Convert
      </Button>

        {/* Converted Amount */}
      {converted && (
        <Typography variant="subtitle1" color="success" style={{ marginBottom: "20px" }}>
          Converted: {converted} {to}
        </Typography>
      )}
        
        {/* Transfer History */}
      <Typography variant="h6" color="info.main" gutterBottom>
        Transfer History
      </Typography>

      <Box>
        {history.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No transfers found.
          </Typography>
        ) : (
          history.map((item) => (
            <Box
              key={item._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              mb={1}
              border="1px solid #e0e0e0"
              borderRadius="6px"
            >
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {item.amount} {item.from} → {item.convertedAmount} {item.to}
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2 }}>
                {new Date(item.createdAt).toLocaleString()}
              </Typography>

              <Button
                size="small"
                variant="outlined"
                sx={{
                  color: "red",
                  borderColor: "red",
                  "&:hover": {
                    backgroundColor: "red",
                    color: "white",
                    borderColor: "red",
                  },
                }}
                onClick={() => handleRevoke(item._id)}
              >
                Revoke
              </Button>
            </Box>
          ))
        )}
      </Box>

    {/* Pagination Controls */}
    <Box mt={3} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" gap={1}>
      <Button
        variant="outlined"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "contained" : "outlined"}
          color={page === currentPage ? "primary" : "inherit"}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outlined"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </Box>


      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6500}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Container>
  );
};

export default CurrencyConverter;
