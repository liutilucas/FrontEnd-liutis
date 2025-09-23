import React from 'react';

function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">Cancelar</button>
          <button onClick={onConfirm} className="confirm-delete-button">Confirmar Exclusão</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;