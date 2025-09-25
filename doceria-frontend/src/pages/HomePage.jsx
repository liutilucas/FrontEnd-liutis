import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ShoppingCart from '../components/ShoppingCart';

function HomePage() {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('https://backend-liutis-production.up.railway.app/api/produtos/');
        const data = await response.json();
        console.log("DADOS RECEBIDOS PELA API DENTRO DO REACT:", data);
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const handleAddToCart = (produto) => {
    handleIncreaseQuantity(produto);
  };

  const handleIncreaseQuantity = (produto) => {
    const productInCart = cart.find(item => item.id === produto.id);
    if (productInCart) {
      setCart(cart.map(item =>
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      ));
    } else {
      setCart([...cart, { ...produto, quantidade: 1 }]);
    }
  };

  const handleDecreaseQuantity = (produto) => {
    const productInCart = cart.find(item => item.id === produto.id);
    if (productInCart.quantidade === 1) {
      setCart(cart.filter(item => item.id !== produto.id));
    } else {
      setCart(cart.map(item =>
        item.id === produto.id ? { ...item, quantidade: item.quantidade - 1 } : item
      ));
    }
  };

  const handleFinalizeOrder = (endereco) => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    const numeroIrmao = "5511973277529";
    const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    let mensagem = "Olá! Gostaria de fazer um novo pedido:\n\n";
    cart.forEach(item => {
      mensagem += `*${item.nome}* - ${item.quantidade}x\n`;
    });
    mensagem += `\n*Total:* R$ ${total.toFixed(2)}\n\n`;
    mensagem += `*Endereço para entrega:*\n${endereco}`;
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${numeroIrmao}?text=${mensagemCodificada}`;
    window.open(urlWhatsApp, '_blank');
    setCart([]);
    setIsCartVisible(false);
  };
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <img src="/img/liutis-logo.png" alt="Logo Doces Liuti's" className="header-logo" />
          <div className="header-titles">
            <h1>Doces Liuti's</h1>
            <h2>CONHEÇA NOSSO CARDÁPIO</h2>
          </div>
        </div>
        <div className="cart-icon-wrapper" onClick={() => setIsCartVisible(true)}>
          <span className="cart-icon">🛒</span>
          {cartItemCount > 0 && <span className="cart-item-count">{cartItemCount}</span>}
        </div>
      </header>

      <main className="product-list">
        {loading ? (
          <p>Carregando cardápio...</p>
        ) : (
          produtos.map((produto) => (
            <ProductCard 
              key={produto.id} 
              produto={produto} 
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </main>

      {isCartVisible && (
        <ShoppingCart 
          cartItems={cart}
          onClose={() => setIsCartVisible(false)}
          onFinalize={handleFinalizeOrder}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
        />
      )}
    </div>
  );
}

export default HomePage;
