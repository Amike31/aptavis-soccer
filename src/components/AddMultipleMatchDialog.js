import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  Box,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const AddMultipleMatchDialog = ({ open, onClose }) => {
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([
    { homeClubName: "", awayClubName: "", homeGoals: "", awayGoals: "" },
  ]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "clubs"),
      (snapshot) => {
        const clubsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setClubs(clubsArray);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddMatchRow = () => {
    setMatches([
      ...matches,
      { homeClubName: "", awayClubName: "", homeGoals: "", awayGoals: "" },
    ]);
  };

  const handleRemoveMatchRow = (index) => {
    const newMatches = [...matches];
    newMatches.splice(index, 1);
    setMatches(newMatches);
  };

  const handleMatchChange = (index, event) => {
    const { name, value } = event.target;
    const newMatches = [...matches];
    newMatches[index][name] = value;
    setMatches(newMatches);
  };

  const handleSaveMatches = async () => {
    const isAllMatchesFilled = matches.every(
      (match) =>
        match.homeClubName &&
        match.awayClubName &&
        match.homeGoals &&
        match.awayGoals
    );

    if (!isAllMatchesFilled) {
      setError("Please fill all the matches");
      return;
    }

    // home club and away club must be different
    const isAllMatchesValid = matches.every(
      (match) => match.homeClubName !== match.awayClubName
    );

    if (!isAllMatchesValid) {
      setError("Home club and away club must be different");
      return;
    }

    const matchesCollection = collection(firestore, "matches");

    await Promise.all(
      matches.map(async (match) => {
        await addDoc(matchesCollection, {
          homeClubName: match.homeClubName,
          awayClubName: match.awayClubName,
          homeGoals: parseInt(match.homeGoals),
          awayGoals: parseInt(match.awayGoals),
        });
      })
    );

    setMatches([
      { homeClubName: "", awayClubName: "", homeGoals: "", awayGoals: "" },
    ]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Multiple Matches</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          {matches.map((match, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Home Club</InputLabel>
                    <Select
                      name="homeClubName"
                      value={match.homeClubName}
                      onChange={(event) => handleMatchChange(index, event)}
                      fullWidth
                    >
                      {clubs.map((club) => (
                        <MenuItem key={club.id} value={club.name}>
                          {club.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Away Club</InputLabel>
                    <Select
                      name="awayClubName"
                      value={match.awayClubName}
                      onChange={(event) => handleMatchChange(index, event)}
                      fullWidth
                    >
                      {clubs.map((club) => (
                        <MenuItem key={club.id} value={club.name}>
                          {club.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2.5}>
                  <TextField
                    label="Home Goals"
                    name="homeGoals"
                    value={match.homeGoals}
                    onChange={(event) => handleMatchChange(index, event)}
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <TextField
                    label="Away Goals"
                    name="awayGoals"
                    value={match.awayGoals}
                    onChange={(event) => handleMatchChange(index, event)}
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    color="error"
                    disabled={matches.length === 1}
                    onClick={() => handleRemoveMatchRow(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <IconButton
            color="success"
            onClick={handleAddMatchRow}
            sx={{ alignSelf: "flex-end", mr: 2 }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setError("");
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button onClick={handleSaveMatches} color="primary" variant="contained">
          Save Matches
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMultipleMatchDialog;
