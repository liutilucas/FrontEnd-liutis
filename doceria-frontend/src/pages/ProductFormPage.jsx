import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function ProductFormPage() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id)

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchProduto = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/produtos/${id}`, {
            headers: { 'Authorization': `Basic ${auth}` }
          });
          if (response.ok) {
            const data = await response.json();
            setNome(data.nome);
            setDescricao(data.descricao);
            setPreco(data.preco.toString());
            setImagemUrl(data.imagemUrl);
          } else {
            toast.error("Produto não encontrado.");
            navigate('/admin');
          }
        } catch (err) {
          toast.error("Erro ao buscar dados do produto.");
        } finally {
          setLoading(false);
        }
      };
      fetchProduto();
    }
  }, [id, isEditing, auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produtoData = { nome, descricao, preco: parseFloat(preco), imagemUrl };
    const url = isEditing ? `http://localhost:8080/api/produtos/${id}` : 'http://localhost:8080/api/produtos';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(produtoData)
      });

      if (response.ok) {
        toast.success(`Produto ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`);
        navigate('/admin');
      } else {
        toast.error(`Falha ao ${isEditing ? 'atualizar' : 'adicionar'} o produto.`);
      }
    } catch (err) {
      toast.error('Erro de comunicação com o servidor.');
    }
  };
  
  if (loading) return <p>A carregar dados do produto...</p>;

  return (
    <div className="form-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto</label>
          <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="preco">Preço (ex: 9.50)</label>
          <input type="number" step="0.01" id="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="imagemUrl">Caminho da Imagem (ex: /img/bolo.webp)</label>
          <input type="text" id="imagemUrl" value={imagemUrl} onChange={(e) => setImagemUrl(e.target.value)} required />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">{isEditing ? 'Atualizar Produto' : 'Salvar Produto'}</button>
          <button type="button" onClick={() => navigate('/admin')} className="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default ProductFormPage;
