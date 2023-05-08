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


    function handleChange(event){
      setValues({...values, [event.target.name]:event.target.value});
    }
  
    function handleSave(){
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
                inputProps={{ maxLength: 80, minLength: 20 }}
              />
              

              <TextField
                fullWidth
                label="Matrícula"
                name="matricula"
                onChange={handleChange}
                value={values.matricula || ''}
                variant="outlined" 
                required
                inputProps={{ maxLength: 12, minLength: 6 }}
              />

              <TextField
                fullWidth
                label="Motivo da Solicitação"
                name="motivo"
                onChange={handleChange}
                value={values.motivo || ''}
                variant="outlined" 
                required
              />    
              

            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

              <Autocomplete
                disablePortal
                options={sugestoesSolicitante}
                getOptionLabel={(option) => option.nome}
                renderInput={(params) => (
                  <TextField {...params} label="Solicitante" variant="outlined" required/>
                )}
                onChange={(event, value) => setValues(values => ({ ...values, solicitante: value.nome }))} 
              />  

              <Autocomplete
                options={sugestoesTipoRequisicao}
                getOptionLabel={(option) => option.nome}
                renderInput={(params) => (
                  <TextField {...params} label="Tipo de Requisição" variant="outlined" required/>
                )}
                onChange={(event, value) => setValues(values => ({ ...values, requisicao: value.nome }))} 
              />

              <Autocomplete
                options={sugestoesSetor}
                getOptionLabel={(option) => option.nome}
                renderInput={(params) => (
                  <TextField {...params} label="Setor" variant="outlined" required />
                )}
                onChange={(event, value) => setValues(values => ({ ...values, setor: value.nome }))} 
              />
            
            </Grid>
            
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>              
              <Button variant="contained" color="success" onClick={handleSave}>Salvar</Button>
              <Button variant="contained" color="error" onClick={handleClear}>Limpar</Button>
            </Grid>
          </Grid>
        </Paper>
        <Paper>
          <Box p={2}>
            <Typography variant="h4">Todos os Registros</Typography>
          </Box>
          <PaginationTable />
        </Paper>
      </Grid>
    </Grid>
  </Container>
  );
}

export default App;
