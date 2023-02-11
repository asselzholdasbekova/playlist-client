import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { FilterDialog } from "./FiltersDialog";
import { SelectChangeEvent } from "@mui/material/Select";
import { Genre } from "../interfaces/genre";
import { Author } from "../interfaces/author";
import {
  getAllAuthors,
  getAllGenres,
  getAllSongs,
  getFilteredSongs,
} from "../helpers/api";

interface SongInfo {
  id: number;
  author: string;
  title: string;
  genre: string;
  yearOfRelease: string;
  duration: number;
}

const songsRowsInitial: SongInfo[] = [];

function descendingComparator<T>(
  a: T,
  b: T,
  orderBy: keyof T
) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [T, number]
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof SongInfo;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "author",
    numeric: false,
    disablePadding: false,
    label: "Author",
  },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Song",
  },
  {
    id: "genre",
    numeric: false,
    disablePadding: false,
    label: "Genre",
  },
  {
    id: "yearOfRelease",
    numeric: false,
    disablePadding: false,
    label: "Release Year",
  },
  {
    id: "duration",
    numeric: true,
    disablePadding: false,
    label: "Duration",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof SongInfo
  ) => void;
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof SongInfo) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={
              numSelected > 0 && numSelected < rowCount
            }
            checked={
              rowCount > 0 && numSelected === rowCount
            }
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={
              headCell.disablePadding ? "none" : "normal"
            }
            sortDirection={
              orderBy === headCell.id ? order : false
            }>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={
                orderBy === headCell.id ? order : "asc"
              }
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc"
                    ? "sorted descending"
                    : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleClickOpen: () => void;
}

function EnhancedTableToolbar(
  props: EnhancedTableToolbarProps
) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}>
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div">
          Songs
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon
              onClick={props.handleClickOpen}
            />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export const SuperTable = () => {
  const [songsRows, setSongsRows] = React.useState<
    SongInfo[]
  >(songsRowsInitial);
  const [filterDialogOpen, setFilterDialogOpen] =
    React.useState(false);

  // all genres
  const [allGenres, setAllGenres] =
    React.useState<Genre[]>();
  const [allAuthors, setAllAuthors] =
    React.useState<Author[]>();

  const handleClickOpen = () => {
    setFilterDialogOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== "backdropClick") {
      setFilterDialogOpen(false);
    }
  };

  const handleCloseReloadData = () => {
    setFilterDialogOpen(false);
  };

  // Filter Data //
  const [filterAuthor, setFilterAuthor] =
    React.useState<string>();
  const [filterGenre, setFilterGenre] =
    React.useState<string>();
  const [yearOfReleaseFilter, setReleaseYear] =
    React.useState<number | string>("");

  const handleFilterAuthor = (
    event: SelectChangeEvent<typeof filterAuthor>
  ) => {
    setFilterAuthor(event.target.value || "");
  };
  const handleFilterGenre = (
    event: SelectChangeEvent<typeof filterGenre>
  ) => {
    setFilterGenre(event.target.value || "");
  };
  const handleFilterReleaseYear = (
    event: SelectChangeEvent<typeof yearOfReleaseFilter>
  ) => {
    setReleaseYear(Number(event.target.value) || "");
  };

  React.useEffect(() => {
    getAllSongs.then((response) => {
      setSongsRows(
        response.data?.map((obj: any) => {
          return {
            ...obj,
            author: obj.author.fullname,
            genre: obj.genre.name,
          };
        })
      );
    });
    getAllGenres.then((response) => {
      setAllGenres(response.data);
    });

    getAllAuthors.then((response) => {
      setAllAuthors(response.data);
    });
  }, []);

  React.useEffect(() => {
    if (filterAuthor) {
      getFilteredSongs(
        filterAuthor,
        filterGenre,
        yearOfReleaseFilter
      ).then((response) => {
        setSongsRows(response.data);
      });
    }
    if (filterGenre) {
      getFilteredSongs(
        filterAuthor,
        filterGenre,
        yearOfReleaseFilter
      ).then((response) => {
        setSongsRows(response.data);
      });
    }
    if (yearOfReleaseFilter) {
      getFilteredSongs(
        filterAuthor,
        filterGenre,
        yearOfReleaseFilter
      ).then((response) => {
        console.log(response.data);
        setSongsRows(response.data);
      });
    }
  }, [filterGenre, filterAuthor, yearOfReleaseFilter]);

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof SongInfo>("author");
  const [selected, setSelected] = React.useState<
    readonly string[]
  >([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof SongInfo
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const newSelected = songsRows.map((n) => n.author);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(
        selected.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (
    event: unknown,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) =>
    selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - songsRows.length
        )
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <FilterDialog
        open={filterDialogOpen}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        handleCloseReloadData={handleCloseReloadData}
        filterAuthor={filterAuthor}
        filterGenre={filterGenre}
        filterReleaseYear={yearOfReleaseFilter}
        handleFilterAuthor={handleFilterAuthor}
        handleFilterGenre={handleFilterGenre}
        handleFilterReleaseYear={handleFilterReleaseYear}
        genres={allGenres}
        authors={allAuthors}
      />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleClickOpen={handleClickOpen}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={songsRows.length}
            />
            <TableBody>
              {stableSort(
                songsRows,
                getComparator(order, orderBy)
              )
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((row, index) => {
                  const isItemSelected = isSelected(
                    row.author
                  );
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, row.author)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none">
                        {row.author}
                      </TableCell>
                      <TableCell align="left">
                        {row.title}
                      </TableCell>
                      <TableCell align="left">
                        {row.genre}
                      </TableCell>
                      <TableCell align="left">
                        {row.yearOfRelease}
                      </TableCell>
                      <TableCell align="right">
                        {row.duration}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[
            5,
            10,
            25,
            50,
            100,
            { value: 10000000000, label: "All" },
          ]}
          component="div"
          count={songsRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={
          <Switch
            checked={dense}
            onChange={handleChangeDense}
          />
        }
        label="Dense padding"
      />
    </Box>
  );
};
