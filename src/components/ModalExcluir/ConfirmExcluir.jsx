import './ConfirmExcluir.css';
import React from 'react';

function ConfirmExcluir({
    isOpen,
    title = 'Confirmar ação', 
    message = 'Tem certeza que deseja excluir?',
    confirmText = 'Excluir',
    cancelText = 'Cancelar',
    onClose, 
    onConfirm,
    onCancel,
    }) {
    if(!isOpen) return null;

    return(
        <div className="confirm-backdrop">
            <div className="confirm-dialog">
                <h2 className="confirm-title">{title}</h2>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="confirm-btn cancel" onClick={onCancel}>{cancelText}</button>
                    <button className="confirm-btn confirm" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmExcluir;