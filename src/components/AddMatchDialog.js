import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const AddMatchDialog = ({ open, onClose }) => {
  const [homeClubName, setHomeClubName] = useState("");
  const [awayClubName, setAwayClubName] = useState("");
  const [homeGoals, setHomeGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");
  const [error, setError] = useState("");
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "clubs"),
      (snapshot) => {
        const clubsArray = snapshot.docs.map((doc) => doc.data());
        setClubs(clubsArray);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddMatch = async () => {
    if (homeClubName === awayClubName) {
      setError("Home club and away club must be different");
      return;
    }

    try {
      await addDoc(collection(firestore, "matches"), {
        homeClubName,
        awayClubName,
        homeGoals: parseInt(homeGoals),
        awayGoals: parseInt(awayGoals),
      });
      setHomeClubName("");
      setAwayClubName("");
      setHomeGoals("");
      setAwayGoals("");
      onClose();
    } catch (error) {
      console.error("Error adding match: ", error);
      setError(error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Match</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Home Club</InputLabel>
          <Select
            value={homeClubName}
            onChange={(e) => setHomeClubName(e.target.value)}
          >
            {clubs.map((club, index) => (
              <MenuItem key={index} value={club.name}>
                {club.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Away Club</InputLabel>
          <Select
            value={awayClubName}
            onChange={(e) => setAwayClubName(e.target.value)}
          >
            {clubs.map((club, index) => (
              <MenuItem key={index} value={club.name}>
                {club.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Home Goals"
          fullWidth
          margin="normal"
          value={homeGoals}
          onChange={(e) => setHomeGoals(e.target.value)}
          type="number"
          inputProps={{ step: 1, min: 0 }}
        />
        <TextField
          label="Away Goals"
          fullWidth
          margin="normal"
          value={awayGoals}
          onChange={(e) => setAwayGoals(e.target.value)}
          type="number"
          inputProps={{ step: 1, min: 0 }}
        />
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
        <Button onClick={handleAddMatch} color="primary">
          Add Match
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMatchDialog;
