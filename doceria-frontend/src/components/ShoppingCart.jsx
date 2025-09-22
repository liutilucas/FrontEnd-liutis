import React, { useState } from 'react';

function ShoppingCart({ cartItems, onClose, onFinalize, onIncrease, onDecrease }) {
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  const handleCepChange = async (event) => {
    const cepValue = event.target.value.replace(/\D/g, '');
    setCep(cepValue);

    if (cepValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          alert('CEP não encontrado. Por favor, verifique.');
          setRua('');
          setBairro('');
        } else {
          setRua(data.logradouro);
          setBairro(data.bairro);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert('Não foi possível buscar o CEP. Tente novamente.');
      }
    }
  };

  const handleFinalize = () => {
    if (!cep || !rua || !numero) {
      alert('Por favor, preencha o CEP, Rua e Número para a entrega.');
      return;
    }

    let fullAddress = `Rua: ${rua}, Nº: ${numero}\nBairro: ${bairro}`;
    if (complemento) {
      fullAddress += `\nComplemento: ${complemento}`;
    }
    fullAddress += `\nCEP: ${cep}`;
    
    onFinalize(fullAddress);
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Meu Carrinho</h2>
        <button className="close-button" onClick={onClose}>X</button>
        
        {cartItems.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="cart-item-list">
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <span className="item-name">{item.nome}</span>
                  <div className="item-controls">
                    <button onClick={() => onDecrease(item)}>-</button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => onIncrease(item)}>+</button>
                  </div>
                  <span className="item-price">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <strong>Total: R$ {total.toFixed(2)}</strong>
            </div>
            
            <div className="address-section">
              <h3>Endereço de Entrega</h3>
              <div className="address-form-grid">
                <input
                  type="text"
                  value={cep}
                  onChange={handleCepChange}
                  placeholder="CEP (só números)"
                  maxLength="8"
                  className="cep-input"
                />
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Rua / Logradouro"
                  className="rua-input"
                />
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Bairro"
                  className="bairro-input"
                />
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Número"
                  className="numero-input"
                />
                <input
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Complemento (opcional)"
                  className="complemento-input"
                />
              </div>
            </div>

            <button className="finalize-button" onClick={handleFinalize}>
              Finalizar Pedido via WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;