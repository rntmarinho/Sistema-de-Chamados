import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react'; // Ícone para o botão sair

// Componentes e Páginas
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import Users from './pages/Users';
import AllTickets from './pages/AllTickets';
import TicketDetails from './pages/TicketDetails';

import './App.css';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  // Função para encerrar a sessão
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <Routes>
      {/* Rota Pública de Login */}
      <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />

      {/* Rotas Protegidas e Layout Principal */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? (
            <div className="app-layout">
              <Sidebar />
              <main className="content">
                
                {/* Barra Superior com o Botão Sair à direita */}
                <div className="top-bar">
                  <button className="logout-btn-top" onClick={handleLogout}>
                    <LogOut size={18} /> Sair
                  </button>
                </div>

                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/novo-chamado" element={<NewTicket />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/novo" element={<CreateUser />} />
                  <Route path="/tickets" element={<AllTickets />} />
                  <Route path="/tickets/:id" element={<TicketDetails />} />
                  {/* Fallback para o Dashboard */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
    </Routes>
  );
}

export default App;