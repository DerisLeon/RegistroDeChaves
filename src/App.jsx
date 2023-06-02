import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

import sugestoesSetor from './sugestoesSetor';
import sugestoesTipoRequisicao from './sugestoesTipoRequisicao';
import sugestoesSolicitante from './sugestoesSolicitante';
import PaginationTable from './PaginationTable';

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function App() {
  const [values, setValues] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (registrationSuccess) {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [registrationSuccess]);

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  const handleClear = () => {
    setValues({});
  };

  const handleSave = () => {
    if (values.nome.length < 6 || values.nome.length > 80) {
      alert("Nome deve ter entre 6 e 80 caracteres")
    } else if (values.matricula.length < 6 || values.matricula.length > 12) {
      alert("Matrícula deve ter entre 6 e 12 caracteres")
    } else if (values.motivo.length < 4 || values.motivo.length > 80) {
      alert("Motivo deve ter entre 4 e 80 caracteres")
    } else {
      axios.post("http://localhost:8080/api/registro/", values).then(result => {
        alert("Registro Feito com Sucesso!");
        setRegistrationSuccess(true);
      });
    }
  };

 
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <Box p={2}>
              <Typography variant="h4">Registro de Chaves</Typography>
            </Box>
            <form onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Nome Completo"
                    name="nome"
                    onChange={handleChange}
                    value={values.nome || ''}
                    error={values.nome === ''}
                    inputProps={{
                      maxLength: 80,
                      pattern: "[a-zA-ZÀ-ú ]*",
                      title: "Nome deve ter entre 6 e 80 caracteres, não pode conter números"
                    }}
                    required
                    sx={{ marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Matrícula"
                    name="matricula"
                    onChange={handleChange}
                    value={values.matricula || ''}
                    error={values.matricula === ''}
                    inputProps={{
                      maxLength: 12,
                      pattern: "[0-9]*",
                      title: "Matrícula deve ter entre 6 e 12 caracteres, contendo apenas números"
                    }}
                    required
                    sx={{ marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginBottom: '10px' }}>
                    <InputLabel id="solicitante-label">Solicitante</InputLabel>
                    <Select
                      labelId="solicitante-label"
                      id="solicitante"
                      value={values.solicitante || ''}
                      onChange={(event) => setValues((prevValues) => ({ ...prevValues, solicitante: event.target.value }))}
                    >
                      {sugestoesSolicitante.map((option) => (
                        <MenuItem key={option.nome} value={option.nome}>
                          {option.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginBottom: '10px' }}>
                    <InputLabel id="requisicao-label">Tipo de Requisição</InputLabel>
                    <Select
                      labelId="requisicao-label"
                      id="requisicao"
                      value={values.requisicao || ''}
                      onChange={(event) => setValues((prevValues) => ({ ...prevValues, requisicao: event.target.value }))}
                    >
                      {sugestoesTipoRequisicao.map((option) => (
                        <MenuItem key={option.nome} value={option.nome}>
                          {option.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Motivo da Solicitação"
                    name="motivo"
                    onChange={handleChange}
                    value={values.motivo || ''}
                    error={values.motivo === ''}
                    inputProps={{ maxLength: 80, title: "Motivo deve ter entre 4 e 80 caracteres" }}
                    required
                    sx={{ marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginBottom: '10px' }}>
                    <InputLabel id="setor-label">Setor</InputLabel>
                    <Select
                      labelId="setor-label"
                      id="setor"
                      value={values.setor || ''}
                      onChange={(event) => setValues((prevValues) => ({ ...prevValues, setor: event.target.value }))}
                    >
                      {sugestoesSetor.map((option) => (
                        <MenuItem key={option.nome} value={option.nome}>
                          {option.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ marginTop: '50px'}}>
                  <Button variant="contained" color="success" type='submit' fullWidth >
                    Enviar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ marginTop: '50px'}}>
                  <Button variant="contained" color="error" onClick={handleClear} fullWidth>
                    Limpar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          <Paper>
            <Box p={2}>
              <Typography variant="h4" sx={{ mt: 2, ml: -1 }}>
                Todos os Registros
              </Typography>
            </Box>
            <Box sx={{ mt: 2, ml: 1 }}>
              <PaginationTable />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
