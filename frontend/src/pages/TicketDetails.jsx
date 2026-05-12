import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, User, Info, Tag, AlertCircle, Clock, Trash2 } from 'lucide-react';
import './styles/TicketDetails.css';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    assunto: '',
    descricao: '',
    prioridade: '',
    status: '',
    id_categoria: '', // Chave utilizada para sincronização com o select
    usuario_id: ''
  });

  useEffect(() => {
    // Carregamento paralelo de dados para otimização de performance
    Promise.all([
      fetch(`/api/tickets/${id}`).then(res => res.json()),
      fetch('/api/users').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ]).then(([ticketData, userData, categoryData]) => {
      // Normalização dos dados: o banco retorna 'categoria', 
      // mas o estado do formulário consome 'id_categoria'
      setFormData({
        ...ticketData,
        id_categoria: ticketData.categoria 
      });
      setUsers(userData);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setLoading(false);
    }).catch(err => {
      console.error("Erro ao carregar dados:", err);
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Envia o objeto contendo 'id_categoria'
      });

      if (response.ok) {
        alert("Alterações salvas com sucesso!");
        navigate('/');
      } else {
        alert("Erro ao salvar no servidor.");
      }
    } catch (err) {
      alert("Erro de conexão ao salvar alterações.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este chamado permanentemente?")) {
      try {
        const response = await fetch(`/api/tickets/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert("Chamado excluído com sucesso!");
          navigate('/');
        } else {
          alert("Erro ao excluir o chamado.");
        }
      } catch (err) {
        alert("Erro de conexão com o servidor.");
      }
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
          <button 
            onClick={handleDelete} 
            className="btn-delete"
            title="Excluir permanentemente"
          >
            <Trash2 size={20} /> Excluir Chamado
          </button> 
        </div>
      </header>

      <div className="details-grid">      
        <main className="main-content">
          <div className="static-card">
            <label className="section-label"><Info size={16} /> Detalhes do Chamado</label>
            <h2 className="static-subject">{formData.assunto}</h2>
            <div className="static-description">
              {formData.descricao}
            </div>
          </div>
        </main>

        <aside className="sidebar-info">
          <div className="info-group">
            <button onClick={handleSave} className="btn-save">
              <Save size={20} /> Salvar Alterações
            </button> 
            
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
                  value={formData.id_categoria}
                  onChange={e => setFormData({...formData, id_categoria: e.target.value})}
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
          </div>

          <div className="info-footer">
            <div className="info-static-item">
              <Calendar size={14} />
              <span>Aberto em: {formData.data_criacao ? new Date(formData.data_criacao).toLocaleString('pt-BR') : 'N/A'}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TicketDetails;