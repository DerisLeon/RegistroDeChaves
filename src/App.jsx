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
  Autocomplete,
} from '@mui/material';



function App() {
  const [values, setValues] = useState({});


  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  function handleSave(){
    axios.post("http://localhost:8080/api/registro/", values).then(result => {
      alert("Registro Feito com Sucesso!")
    });
  }

  const handleClear = () => {
    setValues({});
  };

  const miniMax = () => {
    if (values.nome.length < 3 || values.nome.length > 80) {
      alert("Nome deve ter entre 3 e 80 caracteres")
    } else if (values.matricula.length < 6 || values.matricula.length > 12) {
      alert("Matrícula deve ter entre 6 e 12 caracteres")
    } else if (values.motivo.length < 3 || values.motivo.length > 80) {
      alert("Motivo deve ter entre 3 e 80 caracteres")
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
            <form onSubmit={
              (event) => {
                event.preventDefault();
                if (miniMax() === true) {
                  handleSave();
                }

              }
            }>

              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    variant="outlined"
                    label="Nome"
                    name="nome"
                    onChange={handleChange || ''}
                    value={values.nome || ''}
                    error={values.nome === ''}
                    inputProps={{ maxLength: 80, pattern: "[a-zA-ZÀ-ú ]*", title: "Nome deve ter entre 3 e 80 caracteres, não pode conter números"}}
                    required
                  />


                  <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    variant="outlined"
                    label="Matrícula"
                    name="matricula"
                    onChange={handleChange}
                    value={values.matricula || ''}
                    error={values.matricula === ''}
                    inputProps={{ maxLength: 12, pattern: "[0-9]*", title: "Matrícula deve ter entre 6 e 12 caracteres, contendo apenas números" }}
                    required
                  />

                  <TextField
                    sx={{ mt: 2 }}
                    variant="outlined"
                    fullWidth
                    label="Motivo da Solicitação"
                    name="motivo"
                    onChange={handleChange}
                    value={values.motivo || ''}
                    error={values.motivo === ''}
                    inputProps={{ maxLength: 80, title: "Motivo deve ter entre 3 e 80 caracteres"}}
                    required
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
                  <Button variant="contained" color="success" type='submit' sx={{ mr: 2 }}>Salvar</Button>
                  <Button variant="contained" color="error" onClick={handleClear}>Limpar</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          <Paper>
            <Box p={2}>
              <Typography variant="h4" sx={{ mt: 2, ml: -1 }}>Todos os Registros</Typography>
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
