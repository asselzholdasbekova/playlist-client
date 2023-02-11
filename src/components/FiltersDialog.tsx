import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, {
  SelectChangeEvent,
} from "@mui/material/Select";
import { Genre } from "../interfaces/genre";
import { Author } from "../interfaces/author";

interface Props {
  handleClickOpen: () => void;
  open: boolean;
  handleClose: (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => void;
  handleCloseReloadData: () => void;
  filterAuthor: string | undefined;
  filterGenre: string | undefined;
  filterReleaseYear: string | number;
  handleFilterAuthor: (
    event: SelectChangeEvent<string>
  ) => void;
  handleFilterGenre: (
    event: SelectChangeEvent<string>
  ) => void;
  handleFilterReleaseYear: (
    event: SelectChangeEvent<string | number>
  ) => void;
  genres: Genre[] | undefined;
  authors: Author[] | undefined;
}

export const FilterDialog = ({
  handleClickOpen,
  open,
  handleClose,
  handleCloseReloadData,
  filterAuthor,
  filterGenre,
  filterReleaseYear,
  handleFilterAuthor,
  handleFilterGenre,
  handleFilterReleaseYear,
  genres,
  authors,
}: Props) => {
  return (
    <div>
      <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}>
        <DialogTitle>Choose Filters</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="author">Author</InputLabel>
              <Select
                labelId="demo-dialog-select-labelsad"
                id="author"
                value={filterAuthor}
                onChange={handleFilterAuthor}
                input={<OutlinedInput label="Author" />}>
                <MenuItem value="all">
                  <em>All</em>
                </MenuItem>
                {authors?.map((a) => (
                  <MenuItem value={a.id}>
                    {a.fullname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="filter-genre">
                Genre
              </InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="filter-genre"
                value={filterGenre}
                onChange={handleFilterGenre}
                input={<OutlinedInput label="Genre" />}>
                <MenuItem value="all">
                  <em>All</em>
                </MenuItem>
                {genres?.map((g) => (
                  <MenuItem value={g.id}>{g.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="filter-release">
                Release year
              </InputLabel>
              <Select
                labelId="demo-dialog-select-labelsad"
                id="filter-release"
                value={filterReleaseYear}
                onChange={handleFilterReleaseYear}
                input={<OutlinedInput label="Year" />}>
                <MenuItem value="all">
                  <em>All</em>
                </MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReloadData}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
