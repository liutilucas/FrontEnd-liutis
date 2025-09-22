import React from 'react';
function ProductCard({ produto, onAddToCart }) {
  return (
    <div className="product-card">
      <img
        src={produto.imagemUrl}
        alt={`Foto do ${produto.nome}`}
        className="product-image"
      />
      <h3 className="product-name">{produto.nome}</h3>
      <p className="product-description">{produto.descricao}</p>
      <div className="product-footer">
        <p className="product-price">
          R$ {produto.preco.toFixed(2)}
        </p>
        <button 
          className="add-to-cart-button" 
          onClick={() => onAddToCart(produto)}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;