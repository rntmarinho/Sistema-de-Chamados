import { LayoutDashboard, Ticket, Users, PlusCircle, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  // Função simples para verificar se a rota está ativa e aplicar a classe CSS
  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <div className="sidebar">
      <h2>Sistema de Chamados</h2>
      <nav>
        <Link to="/" className={isActive("/")}>
          <LayoutDashboard size={20} /> Painel Inicial
        </Link>
        
        <Link to="/novo-chamado" className={isActive("/novo-chamado")}>
          <PlusCircle size={20} /> Abrir Chamado
        </Link>

        {/* Rota padronizada para /tickets */}
        <Link to="/tickets" className={isActive("/tickets")}>
          <Ticket size={20} /> Todos os Chamados
        </Link>

        <Link to="/users" className={isActive("/users")}>
          <Users size={20} /> Usuários
        </Link>

        <Link to="/reports" className={isActive("/reports")}>
          <BarChart3 size={20} /> Relatórios
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;