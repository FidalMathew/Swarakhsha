import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { SwarProvider } from "./context/SwarProvider";
import ConnectWallet from "./pages/ConnectWallet";
import Home from "./pages/Home";
import ReportDetail from "./pages/ReportDetail";
import Reports from "./pages/Reports";
import SearchLocation from "./pages/SearchLocation";
import SelfLogin from "./pages/SelfLogin";
import Testify from "./pages/Testify";

function App() {
  // const swarContext = useContext(SwarContext);
  // const currentAccount = swarContext?.currentAccount;

  // const navigate = useNavigate();

  return (
    <>
      <BrowserRouter>
        <SwarProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connect" element={<ConnectWallet />} />
            <Route path="/searchlocation" element={<SearchLocation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/testify" element={<Testify />} />
            <Route path="/report-detail/:id" element={<ReportDetail />} />
            <Route path="/self-login" element={<SelfLogin />} />
            {/* Add other routes as needed */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </SwarProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
