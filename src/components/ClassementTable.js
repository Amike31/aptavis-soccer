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

const ClassementTable = ({ clubs }) => {
  const [classement, setClassement] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, "matches"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const classementMap = {};

      for (let docSnap of querySnapshot.docs) {
        const match = docSnap.data();

        if (!classementMap[match.homeClubName]) {
          classementMap[match.homeClubName] = {
            club: match.homeClubName,
            matches: 0,
            wins: 0,
            ties: 0,
            losses: 0,
            winGoals: 0,
            loseGoals: 0,
            points: 0,
          };
        }

        if (!classementMap[match.awayClubName]) {
          classementMap[match.awayClubName] = {
            club: match.awayClubName,
            matches: 0,
            wins: 0,
            ties: 0,
            losses: 0,
            winGoals: 0,
            loseGoals: 0,
            points: 0,
          };
        }

        classementMap[match.homeClubName].matches += 1;
        classementMap[match.awayClubName].matches += 1;

        if (match.homeGoals > match.awayGoals) {
          classementMap[match.homeClubName].wins += 1;
          classementMap[match.awayClubName].losses += 1;
          classementMap[match.homeClubName].winGoals += match.homeGoals;
          classementMap[match.awayClubName].loseGoals += match.awayGoals;
          classementMap[match.homeClubName].points += 3;
        } else if (match.homeGoals < match.awayGoals) {
          classementMap[match.awayClubName].wins += 1;
          classementMap[match.homeClubName].losses += 1;
          classementMap[match.awayClubName].winGoals += match.awayGoals;
          classementMap[match.homeClubName].loseGoals += match.homeGoals;
          classementMap[match.awayClubName].points += 3;
        } else {
          classementMap[match.homeClubName].ties += 1;
          classementMap[match.awayClubName].ties += 1;
          classementMap[match.homeClubName].points += 1;
          classementMap[match.awayClubName].points += 1;
          classementMap[match.homeClubName].winGoals += match.homeGoals;
          classementMap[match.awayClubName].winGoals += match.awayGoals;
          classementMap[match.homeClubName].loseGoals += match.homeGoals;
          classementMap[match.awayClubName].loseGoals += match.awayGoals;
        }
      }

      // Convert the classementMap to an array and sort it by points
      const classementArray = Object.values(classementMap).sort(
        (a, b) => b.points - a.points
      );
      setClassement(classementArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ paddingX: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{ paddingTop: 2 }}
      >
        Classement
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">No</TableCell>
            <TableCell>Club</TableCell>
            <TableCell align="right">Matches</TableCell>
            <TableCell align="right">Wins</TableCell>
            <TableCell align="right">Ties</TableCell>
            <TableCell align="right">Losses</TableCell>
            <TableCell align="right">Win Goals</TableCell>
            <TableCell align="right">Lose Goals</TableCell>
            <TableCell align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classement.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="left">{index + 1}</TableCell>
              <TableCell>{row.club}</TableCell>
              <TableCell align="right">{row.matches}</TableCell>
              <TableCell align="right">{row.wins}</TableCell>
              <TableCell align="right">{row.ties}</TableCell>
              <TableCell align="right">{row.losses}</TableCell>
              <TableCell align="right">{row.winGoals}</TableCell>
              <TableCell align="right">{row.loseGoals}</TableCell>
              <TableCell align="right">{row.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClassementTable;
