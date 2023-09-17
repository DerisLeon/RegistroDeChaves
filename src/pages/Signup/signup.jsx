import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Input   } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailConf, setEmailConf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { signup } = useAuth();

  const handleSignup = () => {
    if (!email || !emailConf || !senha) {
      setError("Preencha todos os campos");
      return;
    } else if (email !== emailConf) {
      setError("Os e-mails não são iguais");
      return;
    }

    const res = signup(email, senha);

    if (res) {
      setError(res);
      return;
    }

    alert("Usuário cadastrado com sucesso!");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Novo Administrador
      </Typography>
      <Box>
        <Input
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={(e) => [setEmail(e.target.value), setError("")]}
        />
        <Input
          type="email"
          placeholder="Confirme seu E-mail"
          value={emailConf}
          onChange={(e) => [setEmailConf(e.target.value), setError("")]}
        />
        <Input
          type="password"
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => [setSenha(e.target.value), setError("")]}
        />
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleSignup} fullWidth>
          Cadastrar
        </Button>
        <Typography variant="body2" align="center">
          Já tem uma conta?{" "}
          <Link to="/login">
            <strong>Entre</strong>
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
