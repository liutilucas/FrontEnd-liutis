import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';

function AdminPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();

  const [modalState, setModalState] = useState({ isOpen: false, productId: null });

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!auth) return;
      try {
        const response = await fetch('https://backend-liutis-production.up.railway.app/api/produtos/', {
          headers: { 'Authorization': `Basic ${auth}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProdutos(data);
        } else {
          toast.error("Falha ao carregar produtos.");
        }
      } catch (error) {
        toast.error("Erro de comunicação ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [auth]);

  const handleDeleteClick = (productId) => {
    setModalState({ isOpen: true, productId: productId });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, productId: null });
  };

  const handleConfirmDelete = async () => {
    const productId = modalState.productId;
    if (!productId) return;

    try {
      const response = await fetch(`https://backend-liutis-production.up.railway.app/api/produtos/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${auth}` }
      });

      if (response.ok) {
        setProdutos(produtos.filter(produto => produto.id !== productId));
        toast.success('Produto excluído com sucesso!');
      } else {
        toast.error('Falha ao excluir o produto.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro de comunicação ao tentar excluir.');
    } finally {
      handleCloseModal();
    }
  };

  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  return (
    <>
      <div className="admin-container">
        <header className="admin-header">
          <h1>Painel Administrativo</h1>
          <Link to="/admin/produtos/novo" className="add-button">
            Adicionar Novo Produto
          </Link>
        </header>

        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.id}>
                <td>{produto.id}</td>
                <td>{produto.nome}</td>
                <td>R$ {produto.preco.toFixed(2)}</td>
                <td className="actions-cell">
                  <Link to={`/admin/produtos/editar/${produto.id}`} className="edit-button">
                    Editar
                  </Link>
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteClick(produto.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ConfirmModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message={`Tem a certeza que deseja excluir o produto com ID ${modalState.productId}?`}
      />
    </>
  );
}

export default AdminPage;

