// frontend/src/pages/Users.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User } from 'lucide-react';
import './styles/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Erro ao carregar usuários:", err));
  }, []);

  return (
    <div className="users-container">
      <header className="page-header">
        <h1>Gestão de Usuários</h1>
        <Link to="/users/novo" className="btn-create">
          <UserPlus size={20} /> Novo Usuário
        </Link>
      </header>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Usuário</th>
              <th>Perfil</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.usuario}</td>
                <td>
                  <span className={`badge ${user.solicitante === 'sim' ? 'comum' : 'tecnico'}`}>
                    {user.solicitante === 'sim' ? 'Comum' : 'Técnico'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;