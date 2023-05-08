import Axios from 'axios';
import { useState, useEffect, useMemo } from "react";

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
    Button,
} from "@mui/material";

import PersonSearchIcon from '@mui/icons-material/PersonSearch';

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
            .then(json => setRegistro(json.data))
    }, [])

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

    const quantidadeRegistro = registro;


    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredPaciente = useMemo(() => {
        return registro.filter((registro) => {
            return (
                registro.solicitante.toLowerCase().includes(busca.toLowerCase()) ||
                registro.setor.toLowerCase().includes(busca.toLowerCase())
            )
        });
    }, [busca, registro]);
  
  
    return (
        <Box width="100%" overflow="auto">
        <form>
            
            <Input
                type="text"
                placeholder="Pesquisar por Nome ou Setor"
                value={busca}
                sx={{ width: 300, marginBottom: '20px', marginTop: '20px' }}
                onChange={(e) => setBusca(e.target.value)} 
            />
            <PersonSearchIcon/>
        </form>

        <StyledTable>
            <TableHead>
                <TableRow>
                    <TableCell align="left">Nome Completo</TableCell>
                    <TableCell align="left">Matrícula</TableCell>
                    <TableCell align="left">Tipo de Registro</TableCell>
                    <TableCell align="left">Setor</TableCell>
                    <TableCell align="left">Solicitante</TableCell>
                    <TableCell align="left">Data</TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filteredPaciente
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((registro, index) => (
                        <TableRow key={index.id} hover>
                            <TableCell align="left">{registro.nome}</TableCell>
                            <TableCell align="left">{registro.matricula}</TableCell>
                            <TableCell align="left">{registro.requisicao}</TableCell>
                            <TableCell align="left">{registro.setor}</TableCell>
                            <TableCell align="left">{registro.solicitante}</TableCell>
                            <TableCell align="left">{registro.data}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={handleDelete.bind(this, registro.id)}>
                                    <Button variant="contained" color="error">Excluir</Button>
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
            count={quantidadeRegistro.length}
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
