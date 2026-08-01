import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import RegisterWoman from './pages/RegisterWoman';
import RegisterMan from './pages/RegisterMan';
import ManHome from './pages/ManHome';
import ManCalendar from './pages/ManCalendar';
import ManTips from './pages/ManTips';
import ManSymptoms from './pages/ManSymptoms';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Ovulation from './pages/Ovulation';
import Symptoms from './pages/Symptoms';
import Settings from './pages/Settings';
import Partner from './pages/Partner';
import Tips from './pages/Tips';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register-woman" element={<RegisterWoman />} />
      <Route path="/register-man" element={<RegisterMan />} />
      <Route path="/man-home" element={<ManHome />} />
      <Route path="/man-calendar" element={<ManCalendar />} />
      <Route path="/man-tips" element={<ManTips />} />
      <Route path="/man-symptoms" element={<ManSymptoms />} />
      <Route path="/home" element={<Home />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/ovulation" element={<Ovulation />} />
      <Route path="/symptoms" element={<Symptoms />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/partner" element={<Partner />} />
      <Route path="/tips" element={<Tips />} />
    </Routes>
  );
}

export default App;
