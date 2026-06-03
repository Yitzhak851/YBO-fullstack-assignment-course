import { Button, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";


function User({ user }) {
  // variable navigate is used to programmatically navigate to different routes in the application when the user clicks the "See Posts" button.
  const navigate = useNavigate();

  return (
    <TableRow>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.id}</TableCell>
      <TableCell>
        <Button variant="contained" size="small" onClick={() => navigate(`/users/${user.id}`) }> View Profile </Button>
      </TableCell>
    </TableRow>
  );
}

export default User;