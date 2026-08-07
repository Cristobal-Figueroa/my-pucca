import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import AuthChoice from './pages/AuthChoice';
import RegisterWoman from './pages/RegisterWoman';
import RegisterWomanDetails from './pages/RegisterWomanDetails';
import RegisterMan from './pages/RegisterMan';
import RegisterManDetails from './pages/RegisterManDetails';
import Login from './pages/Login';
import ManHome from './pages/ManHome';
import ManCalendar from './pages/ManCalendar';
import ManTips from './pages/ManTips';
import ManSymptomsOwn from './pages/ManSymptomsOwn';
import ManSymptomsPartner from './pages/ManSymptomsPartner';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import El from './pages/El';
import Ella from './pages/Ella';
import Settings from './pages/Settings';
import Partner from './pages/Partner';
import Tips from './pages/Tips';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/auth-choice" element={<AuthChoice />} />
      <Route path="/register-woman" element={<RegisterWoman />} />
      <Route path="/register-woman-details" element={<RegisterWomanDetails />} />
      <Route path="/register-man" element={<RegisterMan />} />
      <Route path="/register-man-details" element={<RegisterManDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/man-home" element={<ManHome />} />
      <Route path="/man-calendar" element={<ManCalendar />} />
      <Route path="/man-tips" element={<ManTips />} />
      <Route path="/man-symptoms" element={<ManSymptomsOwn />} />
      <Route path="/man-symptoms-partner" element={<ManSymptomsPartner />} />
      <Route path="/home" element={<Home />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/el" element={<El />} />
      <Route path="/ella" element={<Ella />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/partner" element={<Partner />} />
      <Route path="/tips" element={<Tips />} />
    </Routes>
  );
}

export default App;
