import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Ticket, Calendar, AlertCircle, User } from 'lucide-react';
import './styles/AllTickets.css';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        const sortedData = sortTickets(data);
        setTickets(sortedData);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao carregar chamados:", err));
  }, []);

  const priorityWeight = { 'alta': 3, 'media': 2, 'baixa': 1 };

  const sortTickets = (data) => {
    return [...data].sort((a, b) => {
      if (priorityWeight[b.prioridade] !== priorityWeight[a.prioridade]) {
        return priorityWeight[b.prioridade] - priorityWeight[a.prioridade];
      }
      return new Date(b.data_criacao) - new Date(a.data_criacao);
    });
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.solicitante_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toString().includes(searchTerm) ||
    ticket.categoria_nome?.toLowerCase().includes(searchTerm.toLowerCase()) // Adicionado filtro por nome de categoria
  );

  if (loading) return <div className="loading">Carregando lista de chamados...</div>;

  return (
    <div className="all-tickets-container">
      <header className="tickets-header">
        <div className="header-info">
          <h1><Ticket size={28} /> Todos os Chamados</h1>
          <p>Total de {filteredTickets.length} registros encontrados</p>
        </div>

        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Pesquisar por assunto, solicitante, ID ou categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="table-card">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Assunto / Categoria</th>
              <th>Solicitante</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="id-col">#{ticket.id}</td>
                <td className="subject-col">
                  <strong>{ticket.assunto}</strong>
                  {/* EXIBIÇÃO DO NOME DA CATEGORIA VINDO DO JOIN */}
                  <span className="category-tag">{ticket.categoria_nome || 'Geral'}</span>
                </td>
                <td>
                  <div className="user-info-cell">
                    <User size={14} /> {ticket.solicitante_nome || 'N/A'}
                  </div>
                </td>
                <td>
                  <span className={`priority-badge ${ticket.prioridade}`}>
                    <AlertCircle size={12} /> {ticket.prioridade}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${ticket.status.replace(/\s+/g, '-')}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} /> 
                    {new Date(ticket.data_criacao).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td>
                  <Link to={`/tickets/${ticket.id}`} className="btn-view">
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTickets.length === 0 && (
          <div className="no-results">
            Nenhum chamado encontrado para "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;