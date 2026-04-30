import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Info, Users } from 'lucide-react';
import './styles/NewTicket.css';

const NewTicket = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // Lista de usuários para o select
  
  const [formData, setFormData] = useState({
    assunto: '',
    descricao: '',
    prioridade: 'baixa',
    categoria: 'suporte',
    status: 'aberto',
    usuario_id: '' // ID do solicitante selecionado
  });

  useEffect(() => {
    // 1. Carregar lista de usuários do backend
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        
        // 2. Define o usuário logado como solicitante padrão inicial
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
          setFormData(prev => ({ ...prev, usuario_id: loggedUser.id }));
        }
      })
      .catch(err => console.error("Erro ao carregar usuários:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Chamado aberto com sucesso!");
        navigate('/');
      } else {
        const error = await response.json();
        alert("Erro: " + error.message);
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="new-ticket-container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={20} /> Voltar
        </button>
        <h1>Novo Chamado</h1>
      </header>

      <div className="form-card">
        <div className="form-info">
          <Info size={20} />
          <p>Selecione o solicitante e descreva o problema abaixo.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campo Solicitante agora como SELECT (Alterável) */}
          <div className="form-group">
            <label>Solicitante</label>
            <div className="input-with-icon">
              <Users size={18} />
              <select 
                value={formData.usuario_id}
                onChange={e => setFormData({...formData, usuario_id: e.target.value})}
                required
              >
                <option value="">Selecione um solicitante...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.nome} ({user.solicitante === 'sim' ? 'Comum' : 'Técnico'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Assunto</label>
            <input 
              type="text" 
              placeholder="Ex: Teclado não funciona"
              value={formData.assunto}
              onChange={e => setFormData({...formData, assunto: e.target.value})} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prioridade</label>
              <select 
                value={formData.prioridade}
                onChange={e => setFormData({...formData, prioridade: e.target.value})}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select 
                value={formData.categoria}
                onChange={e => setFormData({...formData, categoria: e.target.value})}
              >
                <option value="suporte">Suporte Técnico</option>
                <option value="infra">Infraestrutura</option>
                <option value="financeiro">Financeiro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea 
              rows="4"
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-submit">
            <Send size={18} /> Criar Chamado
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;