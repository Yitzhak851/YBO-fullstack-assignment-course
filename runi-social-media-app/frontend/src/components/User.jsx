import { Button, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

function User({ user }) {
  const navigate = useNavigate();

  return (
    <TableRow>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.id}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/user-posts/${user.id}`)}
        >
          See Posts
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default User;