import { useState } from 'react';
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
  Autocomplete
} from '@mui/material';



function App() {
  const [values, setValues] = useState({});


  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  function handleSave() {
    axios.post("http://localhost:8080/api/registro/", values).then(result => {
      alert("Registro Feito com Sucesso!")
    });
  }

  const handleClear = () => {
    setValues({});
  };    

  return (

    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <Box p={2}>
              <Typography variant="h4">Registro de Chaves</Typography>
            </Box>

            <Grid container spacing={6}>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  required
                  label="Nome Completo"
                  name="nome"
                  onChange={handleChange}
                  value={values.nome || ''}
                  variant="outlined"
                  validators={["required", "minStringLength: 3", "maxStringLength: 80", "matchRegexp:^[a-zA-ZÀ-ú ]*$"]}
                  error={values.nome === ''}
                  sx={{ mt: 2 }}
                />


                <TextField
                  fullWidth
                  label="Matrícula"
                  name="matricula"
                  onChange={handleChange}
                  value={values.matricula || ''}
                  variant="outlined"
                  required
                  validators={["required", "minStringLength: 6", "maxStringLength: 12", "matchRegexp:^[0-9]*$"]}
                  error={values.matricula === ''}
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label="Motivo da Solicitação"
                  name="motivo"
                  onChange={handleChange}
                  value={values.motivo || ''}
                  variant="outlined"
                  required
                  sx={{ mt: 2 }}
                  validators={["required", "minStringLength: 3", "maxStringLength: 80", "matchRegexp:^[a-zA-ZÀ-ú ]*$"]}
                />


              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                <Autocomplete
                  disablePortal
                  options={sugestoesSolicitante}
                  getOptionLabel={(option) => option.nome}
                  renderInput={(params) => (
                    <TextField {...params} label="Solicitante" variant="outlined" required />
                  )}
                  onChange={(event, value) => setValues(values => ({ ...values, solicitante: value.nome }))}
                  sx={{ mt: 2 }}
                />

                <Autocomplete
                  options={sugestoesTipoRequisicao}
                  getOptionLabel={(option) => option.nome}
                  renderInput={(params) => (
                    <TextField {...params} label="Tipo de Requisição" variant="outlined" required />
                  )}
                  onChange={(event, value) => setValues(values => ({ ...values, requisicao: value.nome }))}
                  sx={{ mt: 2 }}
                />

                <Autocomplete
                  options={sugestoesSetor}
                  getOptionLabel={(option) => option.nome}
                  renderInput={(params) => (
                    <TextField {...params} label="Setor" variant="outlined" required />
                  )}
                  onChange={(event, value) => setValues(values => ({ ...values, setor: value.nome }))}
                  sx={{ mt: 2 }}
                />

              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <Button variant="contained" color="success" onClick={handleSave} sx={{ mr: 2 }}>Salvar</Button>
                <Button variant="contained" color="error" onClick={handleClear}>Limpar</Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper>
            <Box p={2}>
              <Typography variant="h4" sx={{ mt: 2, ml: -1 }}>Todos os Registros</Typography>
            </Box>
            <Box sx={{ mt: 2, ml: 1}}>
              <PaginationTable />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
