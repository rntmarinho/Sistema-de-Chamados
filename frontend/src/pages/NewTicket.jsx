import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Info } from 'lucide-react';
import './NewTicket.css';

const NewTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  assunto: '',
  descricao: '',
  prioridade: 'baixa',
  categoria: 'suporte',
  status: 'aberto' // Adicione este campo com o valor padrão
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Chamado aberto com sucesso!');
        navigate('/'); // Redireciona para a Home após criar
      }
    } catch (err) {
      console.error("Erro ao enviar:", err);
    }
  };

  return (
    <div className="new-ticket-container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={20} /> Voltar
        </button>
        <h1>Abertura de Chamado</h1>
      </header>

      <div className="form-card">
        <div className="form-info">
          <Info size={20} />
          <p>Descreva detalhadamente o problema para um atendimento mais ágil.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Assunto</label>
            <input 
              type="text" 
              placeholder="Ex: Erro ao acessar o sistema"
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
                <option value="financeiro">Financeiro</option>
                <option value="infra">Infraestrutura</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descrição do Problema</label>
            <textarea 
              rows="5"
              placeholder="Explique o que está acontecendo..."
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-submit">
            <Send size={18} />
            Enviar Chamado
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;