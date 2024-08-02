import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";

import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
