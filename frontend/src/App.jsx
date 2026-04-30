import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import './App.css'; // Certifique-se de importar o CSS aqui

function App() {
  return (
    <div className="app-layout"> 
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/novo-chamado" element={<NewTicket />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;