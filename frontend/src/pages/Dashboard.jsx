import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ aberto: 0, atendimento: 0, fechado: 0 });

  useEffect(() => {
    // Busca os tickets do backend (Flask)
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        // Calcula estatísticas básicas
        const summary = data.reduce((acc, t) => {
          const status = t.status?.toLowerCase();
          if (acc[status] !== undefined) acc[status]++;
          return acc;
        }, { aberto: 0, atendimento: 0, fechado: 0 });
        setStats(summary);
      })
      .catch(err => console.error("Erro ao carregar chamados:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <header>
        <div>
          <h1>Bem-vindo ao Sistema de Chamados</h1>
          <p>Olá! Aqui está o resumo das atividades de hoje.</p>
        </div>       
      </header>

      <div>
        <Link to="/novo-chamado" className="btn-primary">
          <Plus size={18} /> Abrir Novo Chamado
        </Link>
      </div>
      

      <section className="stats-cards">
        <div className="card"><h3>{stats.aberto}</h3><p>Em Aberto</p></div>
        <div className="card warning"><h3>{stats.atendimento}</h3><p>Em Atendimento</p></div>
        <div className="card success"><h3>{stats.fechado}</h3><p>Fechados</p></div>
      </section>

      <section className="tickets-table-section">
        <h2>Chamados Recentes (Em Aberto)</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Assunto</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Data de Criação</th>
            </tr>
          </thead>
          <tbody>
            {tickets.filter(t => t.status === 'aberto').map(ticket => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>
                   <Link to={`/tickets/${ticket.id}`} className="ticket-link">
                    {ticket.assunto}
                   </Link>
                 </td>
                <td><span className="badge">{ticket.status}</span></td>
                <td>{ticket.prioridade}</td>
                <td>{new Date(ticket.data_criacao).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;