import { useEffect, useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import './styles/ManageCategories.css';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const fetchCategories = () => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  };

  useEffect(fetchCategories, []);

  const handleAdd = async () => {
    if (!newCategory) return;
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: newCategory })
    });
    setNewCategory('');
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Excluir esta categoria?")) {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    }
  };

  return (
    <div className="category-container">
      <h1><Tag /> Gerenciar Categorias</h1>
      
      <div className="add-category-form">
        <input 
          value={newCategory} 
          onChange={e => setNewCategory(e.target.value)}
          placeholder="Nome da nova categoria..."
        />
        <button onClick={handleAdd}><Plus size={18} /> Adicionar</button>
      </div>

      <div className="category-list">
        {categories.map(cat => (
          <div key={cat.id} className="category-item">
            <span>{cat.nome}</span>
            <button onClick={() => handleDelete(cat.id)} className="btn-del">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;