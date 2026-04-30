import { LayoutDashboard, Ticket, Users, LogOut, PlusCircle } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Sistema de Chamados</h2>
      <nav>
        <a href="/" className="nav-item active">
          <LayoutDashboard size={20} /> Painel Inicial
        </a>
        <a href="/novo-chamado" className="nav-item">
          <PlusCircle size={20} /> Abrir Chamado
        </a>
        <a href="/tickets" className="nav-item">
          <Ticket size={20} /> Todos os Chamados
        </a>
        <a href="/users" className="nav-item">
          <Users size={20} /> Usuários
        </a>
        <a href="/reports" className="nav-item">
          <Users size={20} /> Relatorios
        </a>
      </nav>
      
    </div>
  );
};

export default Sidebar;