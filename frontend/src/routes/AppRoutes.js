import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReportPage from "../pages/ReportPage"; // Placeholder for the Report Page
import MainLayout from "../layout/main";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              {" "}
              <HomePage />{" "}
            </MainLayout>
          }
        />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
