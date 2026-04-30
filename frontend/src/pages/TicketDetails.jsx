import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle, Tag } from 'lucide-react';
import './TicketDetails.css'; // Crie um CSS básico para esta página

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetch(`/api/tickets/${id}`)
      .then(res => res.json())
      .then(data => setTicket(data))
      .catch(err => console.error("Erro ao carregar chamado:", err));
  }, [id]);

  if (!ticket) return <div className="loading">Carregando detalhes...</div>;

  return (
    <div className="ticket-details-container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={20} /> Voltar
        </button>
        <h1>Chamado #{ticket.id}</h1>
      </header>

      <div className="details-grid">
        <div className="main-content">
          <div className="detail-card">
            <h2>{ticket.assunto}</h2>
            <p className="description">{ticket.descricao}</p>
          </div>
        </div>

        <aside className="sidebar-info">
          <div className="info-item">
            <AlertCircle size={18} />
            <span><strong>Prioridade:</strong> {ticket.prioridade}</span>
          </div>
          <div className="info-item">
            <Clock size={18} />
            <span><strong>Status:</strong> {ticket.status}</span>
          </div>
          <div className="info-item">
            <Tag size={18} />
            <span><strong>Categoria:</strong> {ticket.categoria}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TicketDetails;