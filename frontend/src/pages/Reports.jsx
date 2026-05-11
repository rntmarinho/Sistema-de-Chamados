import { useEffect, useState } from 'react';
import { 
  BarChart3, PieChart, Users, Tag, AlertCircle, 
  CheckCircle2, Clock, Filter, ChevronRight 
} from 'lucide-react';
import './styles/Reports.css';

const Reports = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('geral');

  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar relatórios:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Carregando indicadores...</div>;

  // Lógica de extração dinâmica
  const total = tickets.length;
  const statusCounts = {
    aberto: tickets.filter(t => t.status === 'aberto').length,
    atendimento: tickets.filter(t => t.status === 'em atendimento').length,
    fechado: tickets.filter(t => t.status === 'fechado').length,
  };

  // Extrair Categorias e Usuários únicos do banco
  const categoriasUnicas = [...new Set(tickets.map(t => t.categoria || 'Sem Categoria'))];
  const usuariosUnicos = [...new Set(tickets.map(t => t.usuario_nome || 'Nesta Marinho'))]; // Ajuste conforme sua coluna de nome

  return (
    <div className="reports-container">
      <header className="reports-header">
        <div>
          <h1>Dashboard de Inteligência</h1>
          <p>Análise em tempo real do banco SQLite local</p>
        </div>
        <div className="tab-menu">
          <button className={activeTab === 'geral' ? 'active' : ''} onClick={() => setActiveTab('geral')}>Visão Geral</button>
          <button className={activeTab === 'categorias' ? 'active' : ''} onClick={() => setActiveTab('categorias')}>Departamentos</button>
          <button className={activeTab === 'equipe' ? 'active' : ''} onClick={() => setActiveTab('equipe')}>Desempenho da Equipe</button>
        </div>
      </header>

      {activeTab === 'geral' && (
        <div className="fade-in">
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon"><BarChart3 /></div>
              <div className="stat-data">
                <span>Total de Chamados</span>
                <strong>{total}</strong>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon"><Clock /></div>
              <div className="stat-data">
                <span>Pendentes</span>
                <strong>{statusCounts.aberto + statusCounts.atendimento}</strong>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon"><CheckCircle2 /></div>
              <div className="stat-data">
                <span>Resolvidos</span>
                <strong>{statusCounts.fechado}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categorias' && (
        <div className="section-card fade-in">
          <h2><Tag size={20} /> Distribuição por Categoria</h2>
          <div className="chart-container">
            {categoriasUnicas.map(cat => {
              const count = tickets.filter(t => t.categoria === cat).length;
              const perc = ((count / total) * 100).toFixed(1);
              return (
                <div key={cat} className="bar-row">
                  <span className="label">{cat}</span>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${perc}%` }}>
                      <span className="perc-text">{perc}%</span>
                    </div>
                  </div>
                  <span className="value">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'equipe' && (
        <div className="section-card fade-in">
          <h2><Users size={20} /> Produtividade por Usuário</h2>
          <div className="user-grid">
            {usuariosUnicos.map(user => {
              const userTickets = tickets.filter(t => t.usuario_nome === user);
              const resolvidos = userTickets.filter(t => t.status === 'fechado').length;
              return (
                <div key={user} className="user-stat-item">
                  <div className="user-info">
                    <strong>{user}</strong>
                    <span>{userTickets.length} chamados totais</span>
                  </div>
                  <div className="user-performance">
                    <small>Taxa de Resolução</small>
                    <div className="mini-progress">
                      <div className="fill" style={{ width: `${(resolvidos/userTickets.length)*100}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;