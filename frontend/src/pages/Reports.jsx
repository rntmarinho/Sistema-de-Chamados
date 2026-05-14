import { useEffect, useState, useMemo } from 'react';
import {
  BarChart3, PieChart, Users, Tag, AlertCircle,
  CheckCircle2, Clock, TrendingUp, TrendingDown,
  Calendar, Activity, Award, Zap, Filter,
  ChevronDown, Download, RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react';
import './styles/Reports.css';

/* ─────────────────────────────────────────────
   COMPONENTES AUXILIARES
───────────────────────────────────────────── */

// Mini Donut visual (SVG puro, sem lib)
const DonutChart = ({ percentage, color, size = 80 }) => {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="40" cy="40" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="40" y="44" textAnchor="middle" fontSize="13" fontWeight="700" fill={color}>
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};

// Barra horizontal animada
const HorizontalBar = ({ value, max, color, label, count }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="hbar-row">
      <span className="hbar-label">{label}</span>
      <div className="hbar-track">
        <div className="hbar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="hbar-count">{count}</span>
    </div>
  );
};

// Card de KPI com trend
const KpiCard = ({ title, value, subtitle, icon: Icon, color, trend, trendUp }) => (
  <div className="kpi-card" style={{ '--accent': color }}>
    <div className="kpi-icon"><Icon size={22} /></div>
    <div className="kpi-body">
      <span className="kpi-title">{title}</span>
      <strong className="kpi-value">{value}</strong>
      <span className="kpi-sub">{subtitle}</span>
    </div>
    {trend !== undefined && (
      <div className={`kpi-trend ${trendUp ? 'up' : 'down'}`}>
        {trendUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        <span>{trend}%</span>
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
const Reports = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('geral');
  const [periodoFiltro, setPeriodoFiltro] = useState('todos');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    setRefreshing(true);
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.error('Erro ao carregar relatórios:', err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  // ── Filtragem por período ──────────────────
  const ticketsFiltrados = useMemo(() => {
    const agora = new Date();
    return tickets.filter(t => {
      const criado = new Date(t.data_criacao);
      if (periodoFiltro === '7d') return (agora - criado) <= 7 * 86400000;
      if (periodoFiltro === '30d') return (agora - criado) <= 30 * 86400000;
      if (periodoFiltro === '90d') return (agora - criado) <= 90 * 86400000;
      return true;
    });
  }, [tickets, periodoFiltro]);

  // ── Métricas calculadas ────────────────────
  const metricas = useMemo(() => {
    const t = ticketsFiltrados;
    const total = t.length;
    const abertos = t.filter(x => x.status === 'aberto').length;
    const atendimento = t.filter(x => x.status === 'em atendimento').length;
    const fechados = t.filter(x => x.status === 'fechado').length;
    const alta = t.filter(x => x.prioridade === 'alta').length;
    const media = t.filter(x => x.prioridade === 'media').length;
    const baixa = t.filter(x => x.prioridade === 'baixa').length;
    const taxaResolucao = total > 0 ? ((fechados / total) * 100).toFixed(1) : 0;
    const pendentes = abertos + atendimento;

    // Categorias
    const catMap = {};
    t.forEach(x => {
      const k = x.categoria_nome || x.categoria || 'Sem Categoria';
      catMap[k] = (catMap[k] || 0) + 1;
    });
    const categorias = Object.entries(catMap)
      .map(([nome, qtd]) => ({ nome, qtd }))
      .sort((a, b) => b.qtd - a.qtd);

    // Usuários / Solicitantes
    const userMap = {};
    t.forEach(x => {
      const k = x.solicitante_nome || 'Desconhecido';
      if (!userMap[k]) userMap[k] = { total: 0, fechados: 0 };
      userMap[k].total++;
      if (x.status === 'fechado') userMap[k].fechados++;
    });
    const usuarios = Object.entries(userMap)
      .map(([nome, d]) => ({ nome, ...d, taxa: d.total > 0 ? ((d.fechados / d.total) * 100).toFixed(0) : 0 }))
      .sort((a, b) => b.total - a.total);

    // Tickets por dia (últimos 14 dias)
    const hoje = new Date();
    const dias14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(hoje);
      d.setDate(d.getDate() - (13 - i));
      return d;
    });
    const porDia = dias14.map(d => {
      const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const count = t.filter(x => {
        const c = new Date(x.data_criacao);
        return c.toDateString() === d.toDateString();
      }).length;
      return { label, count };
    });
    const maxDia = Math.max(...porDia.map(d => d.count), 1);

    return { total, abertos, atendimento, fechados, alta, media, baixa,
      taxaResolucao, pendentes, categorias, usuarios, porDia, maxDia };
  }, [ticketsFiltrados]);

  if (loading) return (
    <div className="reports-loading">
      <div className="spinner" />
      <p>Carregando indicadores...</p>
    </div>
  );

  const CORES_PRIORIDADE = { alta: '#ef4444', media: '#f59e0b', baixa: '#22c55e' };
  const CORES_STATUS = { abertos: '#3b82f6', atendimento: '#f59e0b', fechados: '#22c55e' };
  const CORES_CAT = ['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4'];

  const tabs = [
    { id: 'geral', label: 'Visão Geral', icon: BarChart3 },
    { id: 'tempo', label: 'Evolução Temporal', icon: Activity },
    { id: 'categorias', label: 'Categorias', icon: Tag },
    { id: 'equipe', label: 'Equipe', icon: Users },
  ];

  return (
    <div className="rp-container">

      {/* ── CABEÇALHO ─────────────────────────── */}
      <header className="rp-header">
        <div className="rp-title-block">
          <h1>Central de Relatórios</h1>
          <p>Análise em tempo real dos chamados do sistema</p>
        </div>

        <div className="rp-controls">
          <div className="rp-period-filter">
            <Filter size={16} />
            <select value={periodoFiltro} onChange={e => setPeriodoFiltro(e.target.value)}>
              <option value="todos">Todo período</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
            <ChevronDown size={14} />
          </div>

          <button className="rp-refresh-btn" onClick={fetchData} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
            Atualizar
          </button>
        </div>
      </header>

      {/* ── TABS ──────────────────────────────── */}
      <nav className="rp-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`rp-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════
          TAB: VISÃO GERAL
      ══════════════════════════════════════ */}
      {activeTab === 'geral' && (
        <div className="rp-fade">

          {/* KPIs */}
          <div className="kpi-grid">
            <KpiCard title="Total de Chamados" value={metricas.total}
              subtitle={`${periodoFiltro === 'todos' ? 'Todos os registros' : `Período selecionado`}`}
              icon={BarChart3} color="#6366f1" />
            <KpiCard title="Em Aberto" value={metricas.abertos}
              subtitle="Aguardando atendimento"
              icon={Clock} color="#3b82f6" />
            <KpiCard title="Em Atendimento" value={metricas.atendimento}
              subtitle="Em andamento"
              icon={Zap} color="#f59e0b" />
            <KpiCard title="Resolvidos" value={metricas.fechados}
              subtitle="Chamados encerrados"
              icon={CheckCircle2} color="#22c55e" />
          </div>

          {/* Segunda linha */}
          <div className="rp-row">

            {/* Taxa de resolução */}
            <div className="rp-card rp-card--sm">
              <h3 className="rp-card-title"><Award size={18} /> Taxa de Resolução</h3>
              <div className="donut-center">
                <DonutChart percentage={parseFloat(metricas.taxaResolucao)} color="#22c55e" size={120} />
              </div>
              <div className="donut-legend">
                <span style={{ color: '#22c55e' }}>● Fechados: {metricas.fechados}</span>
                <span style={{ color: '#f59e0b' }}>● Pendentes: {metricas.pendentes}</span>
              </div>
            </div>

            {/* Status detalhado */}
            <div className="rp-card rp-card--md">
              <h3 className="rp-card-title"><Activity size={18} /> Distribuição por Status</h3>
              <div className="status-bars">
                {[
                  { label: 'Abertos', val: metricas.abertos, cor: CORES_STATUS.abertos },
                  { label: 'Em Atendimento', val: metricas.atendimento, cor: CORES_STATUS.atendimento },
                  { label: 'Fechados', val: metricas.fechados, cor: CORES_STATUS.fechados },
                ].map(s => (
                  <div key={s.label} className="status-bar-item">
                    <div className="status-bar-header">
                      <span style={{ color: s.cor }}>● {s.label}</span>
                      <strong>{metricas.total > 0 ? ((s.val / metricas.total) * 100).toFixed(1) : 0}%</strong>
                    </div>
                    <div className="status-track">
                      <div className="status-fill" style={{
                        width: metricas.total > 0 ? `${(s.val / metricas.total) * 100}%` : '0%',
                        background: s.cor
                      }} />
                    </div>
                    <small>{s.val} chamados</small>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridades */}
            <div className="rp-card rp-card--sm">
              <h3 className="rp-card-title"><AlertCircle size={18} /> Por Prioridade</h3>
              <div className="priority-bubbles">
                {[
                  { label: 'Alta', val: metricas.alta, cor: CORES_PRIORIDADE.alta },
                  { label: 'Média', val: metricas.media, cor: CORES_PRIORIDADE.media },
                  { label: 'Baixa', val: metricas.baixa, cor: CORES_PRIORIDADE.baixa },
                ].map(p => (
                  <div key={p.label} className="priority-bubble" style={{ '--bc': p.cor }}>
                    <strong style={{ color: p.cor }}>{p.val}</strong>
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
              <div className="priority-bars">
                {[
                  { label: 'Alta', val: metricas.alta, cor: CORES_PRIORIDADE.alta },
                  { label: 'Média', val: metricas.media, cor: CORES_PRIORIDADE.media },
                  { label: 'Baixa', val: metricas.baixa, cor: CORES_PRIORIDADE.baixa },
                ].map(p => (
                  <HorizontalBar key={p.label} label={p.label} value={p.val}
                    max={metricas.total} color={p.cor} count={p.val} />
                ))}
              </div>
            </div>

          </div>

          {/* Tabela resumo das últimas entradas */}
          <div className="rp-card">
            <h3 className="rp-card-title"><Clock size={18} /> Chamados Mais Recentes</h3>
            <table className="rp-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Assunto</th>
                  <th>Solicitante</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {ticketsFiltrados.slice(0, 8).map(t => (
                  <tr key={t.id}>
                    <td className="td-id">#{t.id}</td>
                    <td className="td-subject">{t.assunto}</td>
                    <td>{t.solicitante_nome || '—'}</td>
                    <td>
                      <span className="pill" style={{
                        background: CORES_PRIORIDADE[t.prioridade] + '20',
                        color: CORES_PRIORIDADE[t.prioridade]
                      }}>{t.prioridade}</span>
                    </td>
                    <td>
                      <span className={`pill pill-status pill-${t.status?.replace(' ', '-')}`}>{t.status}</span>
                    </td>
                    <td className="td-date">
                      {new Date(t.data_criacao).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ticketsFiltrados.length === 0 && (
              <div className="rp-empty">Nenhum chamado encontrado no período selecionado.</div>
            )}
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: EVOLUÇÃO TEMPORAL
      ══════════════════════════════════════ */}
      {activeTab === 'tempo' && (
        <div className="rp-fade">

          <div className="rp-card">
            <h3 className="rp-card-title"><TrendingUp size={18} /> Chamados por Dia (últimos 14 dias)</h3>
            <div className="bar-chart-container">
              {metricas.porDia.map((d, i) => (
                <div key={i} className="bar-chart-col">
                  <div className="bar-chart-bar-wrap">
                    <div
                      className="bar-chart-bar"
                      style={{ height: `${(d.count / metricas.maxDia) * 100}%` }}
                      title={`${d.label}: ${d.count} chamados`}
                    >
                      {d.count > 0 && <span className="bar-chart-val">{d.count}</span>}
                    </div>
                  </div>
                  <span className="bar-chart-label">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rp-row">
            {/* Dia com mais chamados */}
            <div className="rp-card rp-card--sm">
              <h3 className="rp-card-title"><Zap size={18} /> Pico de Chamados</h3>
              {(() => {
                const pico = [...metricas.porDia].sort((a, b) => b.count - a.count)[0];
                return (
                  <div className="pico-box">
                    <strong>{pico?.count || 0}</strong>
                    <span>chamados em {pico?.label || '—'}</span>
                    <p>Dia com maior volume registrado nos últimos 14 dias</p>
                  </div>
                );
              })()}
            </div>

            {/* Média diária */}
            <div className="rp-card rp-card--sm">
              <h3 className="rp-card-title"><Activity size={18} /> Média Diária</h3>
              <div className="pico-box">
                <strong>
                  {(metricas.porDia.reduce((a, d) => a + d.count, 0) / 14).toFixed(1)}
                </strong>
                <span>chamados por dia</span>
                <p>Média calculada nos últimos 14 dias</p>
              </div>
            </div>

            {/* Dias sem chamado */}
            <div className="rp-card rp-card--sm">
              <h3 className="rp-card-title"><CheckCircle2 size={18} /> Dias sem Chamados</h3>
              <div className="pico-box">
                <strong>
                  {metricas.porDia.filter(d => d.count === 0).length}
                </strong>
                <span>dias sem registro</span>
                <p>Nos últimos 14 dias analisados</p>
              </div>
            </div>
          </div>

          {/* Heatmap fake por status */}
          <div className="rp-card">
            <h3 className="rp-card-title"><Calendar size={18} /> Detalhamento por Dia</h3>
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Distribuição visual</th>
                </tr>
              </thead>
              <tbody>
                {metricas.porDia.filter(d => d.count > 0).map((d, i) => (
                  <tr key={i}>
                    <td className="td-date">{d.label}</td>
                    <td><strong>{d.count}</strong></td>
                    <td>
                      <div className="inline-bar-track">
                        <div className="inline-bar-fill"
                          style={{ width: `${(d.count / metricas.maxDia) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
                {metricas.porDia.every(d => d.count === 0) && (
                  <tr><td colSpan={3} className="td-empty">Nenhum chamado no período</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: CATEGORIAS
      ══════════════════════════════════════ */}
      {activeTab === 'categorias' && (
        <div className="rp-fade">

          <div className="rp-row">

            {/* Gráfico de categorias */}
            <div className="rp-card rp-card--lg">
              <h3 className="rp-card-title"><Tag size={18} /> Chamados por Categoria</h3>
              {metricas.categorias.length === 0 ? (
                <div className="rp-empty">Nenhuma categoria encontrada.</div>
              ) : (
                <div className="cat-bars">
                  {metricas.categorias.map((c, i) => (
                    <div key={c.nome} className="cat-bar-row">
                      <div className="cat-bar-info">
                        <span className="cat-dot" style={{ background: CORES_CAT[i % CORES_CAT.length] }} />
                        <span className="cat-name">{c.nome}</span>
                        <span className="cat-pct">
                          {metricas.total > 0 ? ((c.qtd / metricas.total) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="cat-track">
                        <div className="cat-fill" style={{
                          width: metricas.total > 0 ? `${(c.qtd / metricas.total) * 100}%` : '0%',
                          background: CORES_CAT[i % CORES_CAT.length]
                        }} />
                      </div>
                      <span className="cat-count">{c.qtd} chamados</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumo de categorias */}
            <div className="rp-card rp-card--sm">
              <h3 className="rp-card-title"><PieChart size={18} /> Resumo</h3>
              <div className="cat-summary">
                <div className="cat-summary-item">
                  <strong>{metricas.categorias.length}</strong>
                  <span>Categorias ativas</span>
                </div>
                <div className="cat-summary-item">
                  <strong>{metricas.categorias[0]?.nome || '—'}</strong>
                  <span>Mais chamados</span>
                </div>
                <div className="cat-summary-item">
                  <strong>{metricas.categorias[metricas.categorias.length - 1]?.nome || '—'}</strong>
                  <span>Menos chamados</span>
                </div>
                <div className="cat-summary-item">
                  <strong>
                    {metricas.categorias.length > 0
                      ? (metricas.total / metricas.categorias.length).toFixed(1)
                      : 0}
                  </strong>
                  <span>Média por categoria</span>
                </div>
              </div>
            </div>

          </div>

          {/* Tabela detalhada por categoria */}
          <div className="rp-card">
            <h3 className="rp-card-title"><BarChart3 size={18} /> Tabela Detalhada por Categoria</h3>
            <table className="rp-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Categoria</th>
                  <th>Total</th>
                  <th>Abertos</th>
                  <th>Em Atendimento</th>
                  <th>Fechados</th>
                  <th>% do Total</th>
                </tr>
              </thead>
              <tbody>
                {metricas.categorias.map((c, i) => {
                  const catTickets = ticketsFiltrados.filter(t =>
                    (t.categoria_nome || t.categoria || 'Sem Categoria') === c.nome
                  );
                  const ab = catTickets.filter(t => t.status === 'aberto').length;
                  const at = catTickets.filter(t => t.status === 'em atendimento').length;
                  const fc = catTickets.filter(t => t.status === 'fechado').length;
                  const pct = metricas.total > 0 ? ((c.qtd / metricas.total) * 100).toFixed(1) : 0;
                  return (
                    <tr key={c.nome}>
                      <td className="td-id">
                        <span className="cat-rank" style={{ background: CORES_CAT[i % CORES_CAT.length] }}>
                          {i + 1}
                        </span>
                      </td>
                      <td><strong>{c.nome}</strong></td>
                      <td><strong>{c.qtd}</strong></td>
                      <td><span className="pill" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{ab}</span></td>
                      <td><span className="pill" style={{ background: '#fef3c7', color: '#b45309' }}>{at}</span></td>
                      <td><span className="pill" style={{ background: '#dcfce7', color: '#15803d' }}>{fc}</span></td>
                      <td>
                        <div className="pct-cell">
                          <div className="pct-track">
                            <div className="pct-fill" style={{
                              width: `${pct}%`,
                              background: CORES_CAT[i % CORES_CAT.length]
                            }} />
                          </div>
                          <span>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {metricas.categorias.length === 0 && (
              <div className="rp-empty">Sem dados de categorias.</div>
            )}
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: EQUIPE
      ══════════════════════════════════════ */}
      {activeTab === 'equipe' && (
        <div className="rp-fade">

          {/* Cards de destaque */}
          <div className="kpi-grid">
            <KpiCard
              title="Solicitantes Ativos"
              value={metricas.usuarios.length}
              subtitle="Com chamados no período"
              icon={Users} color="#8b5cf6"
            />
            <KpiCard
              title="Maior Volume"
              value={metricas.usuarios[0]?.nome?.split(' ')[0] || '—'}
              subtitle={`${metricas.usuarios[0]?.total || 0} chamados abertos`}
              icon={Award} color="#f59e0b"
            />
            <KpiCard
              title="Melhor Resolução"
              value={
                metricas.usuarios.sort((a, b) => b.taxa - a.taxa)[0]?.nome?.split(' ')[0] || '—'
              }
              subtitle={`${metricas.usuarios.sort((a, b) => b.taxa - a.taxa)[0]?.taxa || 0}% de taxa`}
              icon={TrendingUp} color="#22c55e"
            />
            <KpiCard
              title="Média por Usuário"
              value={metricas.usuarios.length > 0
                ? (metricas.total / metricas.usuarios.length).toFixed(1)
                : 0}
              subtitle="Chamados por solicitante"
              icon={BarChart3} color="#06b6d4"
            />
          </div>

          {/* Tabela de equipe */}
          <div className="rp-card">
            <h3 className="rp-card-title"><Users size={18} /> Desempenho por Solicitante</h3>
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Solicitante</th>
                  <th>Total</th>
                  <th>Abertos</th>
                  <th>Em Atend.</th>
                  <th>Fechados</th>
                  <th>Taxa de Resolução</th>
                  <th>Desempenho</th>
                </tr>
              </thead>
              <tbody>
                {metricas.usuarios.map((u, i) => {
                  const userTickets = ticketsFiltrados.filter(t => (t.solicitante_nome || 'Desconhecido') === u.nome);
                  const ab = userTickets.filter(t => t.status === 'aberto').length;
                  const at = userTickets.filter(t => t.status === 'em atendimento').length;
                  const taxaNum = parseFloat(u.taxa);
                  const cor = taxaNum >= 70 ? '#22c55e' : taxaNum >= 40 ? '#f59e0b' : '#ef4444';
                  return (
                    <tr key={u.nome}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar" style={{ background: CORES_CAT[i % CORES_CAT.length] }}>
                            {u.nome.charAt(0).toUpperCase()}
                          </div>
                          <strong>{u.nome}</strong>
                        </div>
                      </td>
                      <td><strong>{u.total}</strong></td>
                      <td><span className="pill" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{ab}</span></td>
                      <td><span className="pill" style={{ background: '#fef3c7', color: '#b45309' }}>{at}</span></td>
                      <td><span className="pill" style={{ background: '#dcfce7', color: '#15803d' }}>{u.fechados}</span></td>
                      <td>
                        <strong style={{ color: cor }}>{u.taxa}%</strong>
                      </td>
                      <td>
                        <div className="perf-track">
                          <div className="perf-fill" style={{
                            width: `${u.taxa}%`,
                            background: cor
                          }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {metricas.usuarios.length === 0 && (
              <div className="rp-empty">Nenhum dado de usuários no período.</div>
            )}
          </div>

          {/* Ranking visual */}
          <div className="rp-card">
            <h3 className="rp-card-title"><Award size={18} /> Ranking de Volume</h3>
            <div className="ranking-list">
              {metricas.usuarios.slice(0, 5).map((u, i) => (
                <div key={u.nome} className="ranking-item">
                  <div className="ranking-pos" style={{
                    background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#e5e7eb',
                    color: i < 3 ? '#fff' : '#6b7280'
                  }}>{i + 1}</div>
                  <div className="ranking-avatar" style={{ background: CORES_CAT[i % CORES_CAT.length] }}>
                    {u.nome.charAt(0)}
                  </div>
                  <div className="ranking-info">
                    <strong>{u.nome}</strong>
                    <span>{u.total} chamados • {u.taxa}% resolvidos</span>
                  </div>
                  <div className="ranking-bar-wrap">
                    <div className="ranking-bar" style={{
                      width: `${metricas.usuarios[0]?.total > 0 ? (u.total / metricas.usuarios[0].total) * 100 : 0}%`,
                      background: CORES_CAT[i % CORES_CAT.length]
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Reports;