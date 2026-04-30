import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import CreateUser from './pages/CreateUser';
import Users from './pages/Users';
import TicketDetails from './pages/TicketDetails';
import './App.css'; // Certifique-se de importar o CSS aqui

function App() {
  return (
    <div className="app-layout"> 
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/novo-chamado" element={<NewTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/users/novo" element={<CreateUser />} /> 
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;