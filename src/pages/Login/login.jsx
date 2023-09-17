import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormHelperText,
} from '@mui/material';
import {Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email | !senha) {
      setError("Preencha todos os campos");
      return;
    }

    const res = login(email, senha);

    if (res) {
      setError(res);
      return;
    }

    navigate("/home");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      
      <Paper elevation={3} sx={{ padding: '20px', maxWidth: '400px' }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
          Administrador
        </Typography>
        <TextField
          type="email"
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => [setEmail(e.target.value), setError("")]}
          sx={{ marginBottom: '20px' }}
        />
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => [setSenha(e.target.value), setError("")]}
          />
        </FormControl>
        {error && <FormHelperText error>{error}</FormHelperText>}
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleLogin}
        >
          Entrar
        </Button>
        <Typography variant="body2" align="right" sx={{ marginTop: '20px' }}>
          Voltar para o {" "}
          <Link to="/">
            <strong>Início</strong>
          </Link>
          </Typography>
      </Paper>
      
    </Box>
  );
};

export default Login;
