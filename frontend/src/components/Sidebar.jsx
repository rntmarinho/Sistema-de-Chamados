import { LayoutDashboard, Ticket, Users, PlusCircle, BarChart3, CarrotIcon, BarChart, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  // Função simples para verificar se a rota está ativa e aplicar a classe CSS
  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    
    <div className="sidebar">
      <img src="/public/consominas.jpg" alt="Logo" className="logo" /> 

      <br/>      
      
      <div>
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

        <Link to="/relatorios" className={isActive("/relatorios")}>
          <BarChart size={20} /> Relatórios
        </Link>        

        <Link to="/categorias" className={isActive("/categorias")}>
          <Tag size={20} /> Cadastro de Categorias
        </Link>
      </nav>
      </div>
    </div>
  );
};

export default Sidebar;