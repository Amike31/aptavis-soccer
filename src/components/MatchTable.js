import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const MatchTable = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, "matches"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const matchesArray = querySnapshot.docs.map((doc) => doc.data());
      setMatches(matchesArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4, paddingX: 2 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ paddingTop: 2 }}>
        Match List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Home Club</TableCell>
            <TableCell>Away Club</TableCell>
            <TableCell align="right">Home Goals</TableCell>
            <TableCell align="right">Away Goals</TableCell>
            <TableCell align="right">Home Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map((match, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{match.homeClubName}</TableCell>
              <TableCell>{match.awayClubName}</TableCell>
              <TableCell align="right">{match.homeGoals}</TableCell>
              <TableCell align="right">{match.awayGoals}</TableCell>
              <TableCell align="right">{match.homeGoals > match.awayGoals ? 'Win' : match.homeGoals < match.awayGoals ? 'Lose' : 'Tie'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MatchTable;
