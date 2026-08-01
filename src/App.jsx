import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Ovulation from './pages/Ovulation';
import Symptoms from './pages/Symptoms';
import Settings from './pages/Settings';
import Partner from './pages/Partner';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/ovulation" element={<Ovulation />} />
      <Route path="/symptoms" element={<Symptoms />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/partner" element={<Partner />} />
    </Routes>
  );
}

export default App;
