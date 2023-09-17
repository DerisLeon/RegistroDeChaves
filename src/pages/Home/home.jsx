import React, { useState, useEffect } from "react";
import Axios from 'axios';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Input,
  IconButton,
  Typography
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const Home = () => {
  const { signout, admin } = useAuth();
  const navigate = useNavigate();

  const baseURLRegistro = "http://localhost:8080/setores/registros";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [registros, setRegistros] = useState([]);
  const [busca, setBusca] = useState('');
  const [filteredRegistros, setFilteredRegistros] = useState([]);

  useEffect(() => {
    Axios.get(baseURLRegistro)
      .then(response => {
        setRegistros(response.data);
        setFilteredRegistros(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    const filteredData = registros.filter((registro) => {
      return (
        registro.nomeSolicitante.toLowerCase().includes(busca.toLowerCase()) ||
        registro.nomeSetor.toLowerCase().includes(busca.toLowerCase())
      );
    });
    setFilteredRegistros(filteredData);
  }, [busca, registros]);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      Axios.delete(`${baseURLRegistro}/${id}`)
        .then((response) => {
          if (response.status === 200) {
            const updatedRegistros = registros.filter(registro => registro.id !== id);
            setRegistros(updatedRegistros);
            setFilteredRegistros(updatedRegistros);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSignout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      signout();
      navigate("/");
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formatarDataHora = (data, hora) => {
    const dataHoraBrasil = new Date(data + "T" + hora);
    return dataHoraBrasil.toLocaleString("pt-BR", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
  };

  useEffect(() => {
    if (!admin) {
      navigate('/login');
    }
  }, [admin, navigate]);

  if (!admin) {
    return null;
  }

  return (
    <Box width="100%" overflow="auto">
      <form>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
          <Input
            type="text"
            placeholder="Digite Nome ou Setor"
            value={busca}
            sx={{ width: 200 }}
            onChange={(e) => setBusca(e.target.value)}
          />
          <PersonSearchIcon sx={{ marginLeft: '10px' }} />
        </Box>
      </form>

      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">Nome Completo</TableCell>
            <TableCell align="left">Matrícula</TableCell>
            <TableCell align="left">Motivo</TableCell>
            <TableCell align="left">Solicitante</TableCell>
            <TableCell align="left">Setor</TableCell>
            <TableCell align="left">Tipo do Registro</TableCell>
            <TableCell align="left">Data e Hora</TableCell>
            
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRegistros
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((registro) => (
              <TableRow key={registro.id} hover>
                <TableCell align="left">{registro.nomeSolicitante}</TableCell>
                <TableCell align="left">{registro.matriculaSolicitante}</TableCell>
                <TableCell align="left">{registro.motivo}</TableCell>
                <TableCell align="left">{registro.tipoSolicitante}</TableCell>
                <TableCell align="left">{registro.nomeSetor}</TableCell>
                <TableCell align="left">{registro.tipoAcao}</TableCell>
                <TableCell align="left">
                  {formatarDataHora(registro.data, registro.hora)}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(registro.id)}>
                    <DeleteIcon color="error"/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={filteredRegistros.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />

      <Typography variant="body2">
          Quer cadastrar um novo administrador?&nbsp;
          <Typography variant="body2" component="span" color="primary">
              <Link to="/signup">Cadastrar</Link>
          </Typography>
      </Typography>
      <Grid item xs={12} sm={6} sx={{ marginTop: '50px' }}>
        <Button variant="contained" color="error" onClick={handleSignout} fullWidth>
          Sair
        </Button>
      </Grid>
    </Box>
  );
};

export default Home;
