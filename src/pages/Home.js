import React, { useState, useEffect } from "react";
import { Container, Button, Typography, Box } from "@mui/material";
import { collection, query, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import AddClubDialog from "../components/AddClubDialog";
import AddMatchDialog from "../components/AddMatchDialog";
import AddMultipleMatchDialog from "../components/AddMultipleMatchDialog";
import ClassementTable from "../components/ClassementTable";
import MatchTable from "../components/MatchTable";
import ClubTable from "../components/ClubTable";

const Home = () => {
  const [clubs, setClubs] = useState([]);
  const [openAddClubDialog, setOpenAddClubDialog] = useState(false);
  const [openAddMatchDialog, setOpenAddMatchDialog] = useState(false);
  const [openAddMultipleMatchDialog, setOpenAddMultipleMatchDialog] =
    useState(false);

  useEffect(() => {
    const q = query(collection(firestore, "clubs"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clubsArray = [];
      querySnapshot.forEach((doc) => {
        clubsArray.push({ id: doc.id, ...doc.data() });
      });
      setClubs(clubsArray);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAddClubDialog = () => {
    setOpenAddClubDialog(true);
  };

  const handleCloseAddClubDialog = () => {
    setOpenAddClubDialog(false);
  };

  const handleOpenAddMatchDialog = () => {
    setOpenAddMatchDialog(true);
  };

  const handleCloseAddMatchDialog = () => {
    setOpenAddMatchDialog(false);
  };

  const handleOpenAddMultipleMatchDialog = () => {
    setOpenAddMultipleMatchDialog(true);
  };

  const handleCloseAddMultipleMatchDialog = () => {
    setOpenAddMultipleMatchDialog(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }} display="flex" flexDirection="column">
        <Typography variant="h4" gutterBottom>
          Soccer Classement
        </Typography>
        <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="warning"
            onClick={handleOpenAddClubDialog}
          >
            Add Club
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddMatchDialog}
          >
            Add Match
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenAddMultipleMatchDialog}
          >
            Add Multiple Match
          </Button>
        </Box>
      </Box>
      <ClassementTable clubs={clubs} />
      <MatchTable />
      <ClubTable />
      <AddClubDialog
        open={openAddClubDialog}
        onClose={handleCloseAddClubDialog}
      />
      <AddMatchDialog
        open={openAddMatchDialog}
        onClose={handleCloseAddMatchDialog}
      />
      <AddMultipleMatchDialog
        open={openAddMultipleMatchDialog}
        onClose={handleCloseAddMultipleMatchDialog}
      />
    </Container>
  );
};

export default Home;
