import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import JDAnalysisPage from "./pages/JDAnalysisPage.jsx";
import ATSAnalysisPage from "./pages/ATSAnalysisPage.jsx";
import SkillGapPage from "./pages/SkillGapPage.jsx";
import MockInterviewPage from "./pages/MockInterviewPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jd-analysis" element={<JDAnalysisPage />} />
        <Route path="/ats-analysis" element={<ATSAnalysisPage />} />
        <Route path="/skill-gap" element={<SkillGapPage />} />
        <Route path="/mock-interview" element={<MockInterviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
