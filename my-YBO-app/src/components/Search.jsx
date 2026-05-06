import { TextField } from "@mui/material";

function Search({ search, setSearch }) {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search by email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default Search;