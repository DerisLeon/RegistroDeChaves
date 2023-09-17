import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';

const baseURLSetores = "http://localhost:8080/registro/setores";

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .matches(/^[a-zA-Z ]*$/, 'Nome deve conter apenas letras')
    .trim()
    .min(6, 'Nome deve ter no mínimo 6 caracteres')
    .max(80, 'Nome deve ter no máximo 80 caracteres')
    .notOneOf([' '], 'Nome não pode conter apenas espaços'),
  matricula: Yup.string()
    .required('Matrícula é obrigatória')
    .matches(/^\d+$/, 'Matrícula deve conter apenas números')
    .trim()
    .min(6, 'Matrícula deve ter no mínimo 6 caracteres')
    .max(12, 'Matrícula deve ter no máximo 12 caracteres'),
  motivo: Yup.string()
    .required('Motivo é obrigatório')
    .trim()
    .min(4, 'Motivo deve ter no mínimo 4 caracteres')
    .max(80, 'Motivo deve ter no máximo 80 caracteres'),
});

const SetoresList = () => {
  const [setores, setSetores] = useState([]);
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [motivo, setMotivo] = useState('');
  const [tipoSolicitante, setTipoSolicitante] = useState('Aluno');
  const [acao, setAcao] = useState('Requisição');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSetores();
  }, []);

  const fetchSetores = async () => {
    try {
      const response = await axios.get(baseURLSetores);
      setSetores(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const requisitarChave = async (id) => {
    try {
      await validationSchema.validate({ nome, matricula, motivo }, { abortEarly: false });
      const solicitante = { nome, matricula, tipoSolicitante };
      await axios.post(`${baseURLSetores}/${id}/requisitar`, solicitante);
      const updatedSetores = setores.map((setor) => {
        if (setor.id === id) {
          return { ...setor, disponivel: false };
        }
        return setor;
      });
      setSetores(updatedSetores);
      window.location.reload();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error(error);
      }
    }
  };

  const devolverChave = async (id) => {
    try {
      await validationSchema.validate({ nome, matricula, motivo }, { abortEarly: false });
      const solicitante = { nome, matricula, tipoSolicitante };
      await axios.post(`${baseURLSetores}/${id}/devolver`, solicitante);
      const updatedSetores = setores.map((setor) => {
        if (setor.id === id) {
          return { ...setor, disponivel: true };
        }
        return setor;
      });
      setSetores(updatedSetores);
      window.location.reload();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={7}>
        <Typography variant="h4">Registro de Chaves</Typography>
      </Grid>
      <Grid item xs={12} sm={7}>
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          fullWidth
          style={{ marginBottom: '10px' }}
          required
          error={!!errors.nome}
          helperText={errors.nome}
        />
        <TextField
          label="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Matrícula"
          fullWidth
          style={{ marginBottom: '10px' }}
          required
          error={!!errors.matricula}
          helperText={errors.matricula}
        />
        <TextField
          label="Motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo"
          fullWidth
          style={{ marginBottom: '10px' }}
          required
          error={!!errors.motivo}
          helperText={errors.motivo}
        />
        <Select
          value={tipoSolicitante}
          onChange={(e) => setTipoSolicitante(e.target.value)}
          fullWidth
          style={{ marginBottom: '10px' }}
          required
        >
          <MenuItem value="Aluno">Aluno</MenuItem>
          <MenuItem value="Servidor">Servidor</MenuItem>
          <MenuItem value="Outro">Outro</MenuItem>
        </Select>
        <Select
          value={acao}
          onChange={(e) => setAcao(e.target.value)}
          fullWidth
          style={{ marginBottom: '10px' }}
          required
        >
          <MenuItem value="Requisição">Requisição</MenuItem>
          <MenuItem value="Devolução">Devolução</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={12} sm={7}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Setor</TableCell>
                <TableCell>Disponibilidade</TableCell>
                <TableCell>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {setores.map((setor) => (
                <TableRow key={setor.id}>
                  <TableCell>{setor.nome}</TableCell>
                  <TableCell>{setor.disponivel ? 'Disponível' : 'Indisponível'}</TableCell>
                  <TableCell>
                    {setor.disponivel && acao === 'Requisição' ? (
                      <Button onClick={() => requisitarChave(setor.id)}>Pegar</Button>
                    ) : !setor.disponivel && acao === 'Devolução' ? (
                      <Button onClick={() => devolverChave(setor.id)}>Devolver</Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default SetoresList;
