import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { collection, query, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const ClubTable = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, "clubs"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clubsArray = querySnapshot.docs.map((doc) => doc.data());
      setClubs(clubsArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4, paddingX: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{ paddingTop: 2 }}
      >
        Club List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {/* no cell's width only 10% */}
            <TableCell>No</TableCell>
            <TableCell>Club Name</TableCell>
            <TableCell>City</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clubs.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} align="center" my={2}>
                No data
              </TableCell>
            </TableRow>
          )}
          {clubs.map((club, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{club.name}</TableCell>
              <TableCell>{club.city}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClubTable;
