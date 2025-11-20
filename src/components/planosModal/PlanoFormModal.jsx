import { useEffect, useState } from "react";
import './PlanoFormModal.css'




function planoFormModal({isOpen, mode ='criar', initialData, onClose, onSubmit}) {

    if(!isOpen) return null;

    const[nome, setNome] = useState('');
    const[valor, setValor] = useState('');

    useEffect(()=>{
        
        if(initialData){
            setNome(initialData.nome || '');
            setValor(initialData.valor || '');
        }else{
            setNome('');
            setValor('');
        }

    }, [initialData, isOpen])
    


    function handleSubmit(event){
        event.preventDefault();
        
        const dados ={
            nome,
            valor,
        };
        console.log('Submitting form with data:', dados);
        onSubmit(dados);
    }
    const titulo = mode === 'editar' ? 'Editar Plano de Saúde' : 'Cadastrar PLano de Saúde';
    const textoBotao = mode ==='editar' ? 'Salvar Alterações' : 'Cadastrar';


    return(
        <div className="modal-overlay " onClick={onClose}>
            <div className="modal-container" onClick={(e)=> e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{titulo}</h2>
                    <button type="button" className="modal-close-button" onClick={onClose}>
                        X
                    </button>
                </header>
                
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-field">
                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e)=> setNome(e.target.value)} required/>
                    </div>
                    <div className="modal-field">
                        <label>Valor</label>
                        <input type="text" value={valor} onChange={(e)=> setValor(e.target.value)} required/>
                    </div>

                    <footer className="modal-footer">
                    <button type="button" className="modal-button secondary" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="modal-button primary" >{textoBotao}</button>
                    </footer>

                </form>
            </div>
        </div>
    )
}

export default planoFormModal;