import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, User, Info, Tag, AlertCircle, Clock } from 'lucide-react';
import './TicketDetails.css';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    assunto: '',
    descricao: '',
    prioridade: '',
    status: '',
    categoria: '',
    usuario_id: ''
  });

  useEffect(() => {
    // Carrega dados do ticket e lista de usuários
    Promise.all([
      fetch(`/api/tickets/${id}`).then(res => res.json()),
      fetch('/api/users').then(res => res.json())
    ]).then(([ticketData, userData]) => {
      setFormData(ticketData);
      setUsers(userData);
      setLoading(false);
    }).catch(err => console.error("Erro ao carregar dados:", err));
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Alterações salvas com sucesso!");
        navigate('/');
      }
    } catch (err) {
      alert("Erro ao salvar alterações.");
    }
  };

  if (loading) return <div className="loading">Carregando informações...</div>;

  return (
    <div className="ticket-details-container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={20} /> Voltar
        </button>
        <div className="header-title">
          <h1>Chamado #{id}</h1>
          <span className={`badge-status-top ${formData.status}`}>{formData.status}</span>
        </div>
        <div className="header-actions">
          <button onClick={handleSave} className="btn-save">
            <Save size={20} /> Salvar Alterações
          </button>
        </div>
      </header>

      <div className="details-grid">
        {/* Lado Esquerdo: Conteúdo Fixo (Não editável) */}
        <div className="main-content">
          <div className="static-card">
            <label className="section-label"><Info size={16} /> Detalhes do Chamado</label>
            <h2 className="static-subject">{formData.assunto}</h2>
            <div className="static-description">
              {formData.descricao}
            </div>
          </div>
        </div>

        {/* Lado Direito: Atributos Editáveis */}
        <aside className="sidebar-info">
          <div className="info-group">
            <label><User size={16} /> Solicitante</label>
            <select 
              value={formData.usuario_id} 
              onChange={e => setFormData({...formData, usuario_id: e.target.value})}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </select>
          </div>

          <div className="info-group">
            <label><Clock size={16} /> Status</label>
            <select 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="aberto">Aberto</option>
              <option value="em atendimento">Em Atendimento</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>

          <div className="info-group">
            <label><AlertCircle size={16} /> Prioridade</label>
            <select 
              value={formData.prioridade} 
              onChange={e => setFormData({...formData, prioridade: e.target.value})}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="info-group">
            <label><Tag size={16} /> Categoria</label>
            <select 
              value={formData.categoria} 
              onChange={e => setFormData({...formData, categoria: e.target.value})}
            >
              <option value="suporte">Suporte Técnico</option>
              <option value="infra">Infraestrutura</option>
              <option value="financeiro">Financeiro</option>
              <option value="sistemas">Sistemas</option>
            </select>
          </div>

          <div className="info-footer">
            <div className="info-static-item">
              <Calendar size={14} />
              <span>Aberto em: {new Date(formData.data_criacao).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TicketDetails;