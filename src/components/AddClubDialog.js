import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const AddClubDialog = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleAddClub = async () => {
    try {
      const clubsRef = collection(firestore, "clubs");
      const q = query(clubsRef, where("name", "==", name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Club name already exists. Please choose a different name.");
        return;
      }

      await addDoc(clubsRef, { name, city });
      setName("");
      setCity("");
      onClose();
    } catch (error) {
      console.error("Error adding club: ", error);
      setError(error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Club</DialogTitle>
      <DialogContent>
        <TextField
          label="Club Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="City"
          fullWidth
          margin="normal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {/* onclose and setError("") */}
        <Button
          onClick={() => {
            onClose();
            setError("");
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button onClick={handleAddClub} color="primary">
          Add Club
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClubDialog;
