import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import * as Yup from 'yup';
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
    const validationSchema = Yup.object().shape({
      nome: Yup.string().required('Nome é obrigatório').matches(/^[A-Za-zÀ-ú ]*$/, 'Nome deve conter apenas letras').matches(/.*\S.*$/, 'Nome não pode conter apenas espaços').min(6, 'Nome deve ter no mínimo 6 caracteres').max(80, 'Nome deve ter no máximo 80 caracteres'),
      matricula: Yup.string().required('Matrícula é obrigatória').matches(/^[0-9]*$/, 'Matrícula deve conter apenas números').min(6, 'Matrícula deve ter no mínimo 6 caracteres').max(12, 'Matrícula deve ter no máximo 12 caracteres'),
      solicitante: Yup.string().required('Solicitante é obrigatório').min(6, 'Solicitante deve ter no mínimo 6 caracteres').max(80, 'Solicitante deve ter no máximo 80 caracteres'),
      requisicao: Yup.string().required('Tipo de Requisição é obrigatório'),
      motivo: Yup.string().required('Motivo é obrigatório').min(4, 'Motivo deve ter no mínimo 4 caracteres').max(80, 'Motivo deve ter no máximo 80 caracteres'),
      setor: Yup.string().required('Setor é obrigatório'),
    });


    validationSchema.validate(values).then(() => {
      axios.post('http://localhost:3001/registros', values).then(() => {
        setRegistrationSuccess(true);
      });
    }).catch((err) => {
      alert(err.errors);
    });
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
