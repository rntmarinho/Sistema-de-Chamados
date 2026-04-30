import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import './Login.css';

const Login = ({ setAuth }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setErro('');

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(true);
      navigate('/');
    } else {
      // Exibe a mensagem de erro vinda do servidor (ex: "Acesso negado")
      setErro(data.message || 'Erro ao realizar login');
    }
  } catch (err) {
    setErro('Erro de conexão com o servidor');
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema de Chamados</h1>
          <p>Faça login para acessar o painel</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Usuário</label>
            <input 
              type="text" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
            />
          </div>
          {erro && <p className="error-message">{erro}</p>}
          <button type="submit" className="btn-login">
            <LogIn size={20} /> Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;