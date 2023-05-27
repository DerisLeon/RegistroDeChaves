import React, { useState, useEffect, useMemo } from "react";
import Axios from 'axios';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Input,
  IconButton,
} from "@mui/material";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const PaginationTable = () => {
  const baseURLRegistro = "http://localhost:8080/api/registro/";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [registro, setRegistro] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    Axios.get(baseURLRegistro)
      .then(json => setRegistro(json.data));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      Axios.delete(baseURLRegistro + id)
        .then((response) => {
          if (response.status === 200) {
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRegistro = useMemo(() => {
    return registro.filter((registro) => {
      return (
        registro.nome.toLowerCase().includes(busca.toLowerCase()) ||
        registro.setor.toLowerCase().includes(busca.toLowerCase())
      )
    });
  }, [busca, registro]);

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
            <TableCell align="left">Tipo de Registro</TableCell>
            <TableCell align="left">Setor</TableCell>
            <TableCell align="left">Solicitante</TableCell>
            <TableCell align="left">Motivo</TableCell>
            <TableCell align="left">Data e Hora</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRegistro
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((registro, index) => (
              <TableRow key={index.id} hover>
                <TableCell align="left">{registro.nome}</TableCell>
                <TableCell align="left">{registro.matricula}</TableCell>
                <TableCell align="left">{registro.requisicao}</TableCell>
                <TableCell align="left">{registro.setor}</TableCell>
                <TableCell align="left">{registro.solicitante}</TableCell>
                <TableCell align="left">{registro.motivo}</TableCell>
                <TableCell align="left">
                  {formatarDataHora(registro.data, registro.hora)}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={handleDelete.bind(this, registro.id)}>
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
        count={registro.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
};

export default PaginationTable;
