import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser'; // Adicionado
import Users from './pages/Users'; // Adicionado
import TicketDetails from './pages/TicketDetails';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  return (
    <Routes>
      {/* Rota de Login */}
      <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />

      {/* Rotas Protegidas */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? (
            <div className="app-layout">
              <Sidebar />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/novo-chamado" element={<NewTicket />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/novo" element={<CreateUser />} />
                  <Route path="/tickets/:id" element={<TicketDetails />} />
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