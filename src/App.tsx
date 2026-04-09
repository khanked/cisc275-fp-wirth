import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { ProjectOverview } from "./components/ProjectOverview";
import "./App.css";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectOverview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
