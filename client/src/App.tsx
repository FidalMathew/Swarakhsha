import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import ReportDetail from "./pages/ReportDetail";
import Reports from "./pages/Reports";
import SearchLocation from "./pages/SearchLocation";
import Testify from "./pages/Testify";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/searchlocation" element={<SearchLocation />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/testify" element={<Testify />} />
          <Route path="/report-detail/:id" element={<ReportDetail />} />
          {/* Add other routes as needed */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
