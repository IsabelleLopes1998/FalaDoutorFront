import { use, useEffect, useState } from "react";
import { fetchPlanosSaude } from "../services/api";
import './MedicoFormModal.css'


function normalizarPlanosSaude(valor){
    if(!valor) return [];
    if(Array.isArray(valor)) return valor;
    if(typeof valor === 'string'){
        return valor
        .replace(/[{}]/g, "")
        .split(',')
        .map((plano) => plano.trim())
        .filter(Boolean)
    }

    return [];
}

function medicoFormModal({isOpen, mode ='criar', initialData, onClose, onSubmit}) {

    if(!isOpen) return null;

    const[nomeCompleto, setNomeCompleto] = useState('');
    const[cpf, setCpf] = useState('');
    const[crm, setCrm] = useState('');
    const[dataNascimento, setDataNascimento] = useState('');
    const[planosSaude, setPlanosSaude] = useState([]);

    const [opcoesPlanos, setOpcoesPlanos] = useState([]);
    const [carregandoPlanos, setCarregandoPlanos] = useState(true);
    const [erroPlanos, setErroPlanos] = useState(null);

    const OPCOES_PLANOS = ['UNIMED', 'BRADESCO','HAPVIDA'];

    useEffect(()=>{

        if(!isOpen) return;

        async function carregarPlanosSaude(){
            try{
                setCarregandoPlanos(true);
                setErroPlanos(null);

                const planos = await fetchPlanosSaude();
                setOpcoesPlanos(planos);
            }catch (error){
                setErroPlanos('Não foi possível carregar os planos de saúde.');
            }finally {
                setCarregandoPlanos(false);
            }
        }

        carregarPlanosSaude();
    }, [isOpen]);

    useEffect(()=>{
        
        if(initialData){
            setNomeCompleto(initialData.nomeCompleto || '');
            setCpf(initialData.cpf || '');
            setCrm(initialData.crm || '');
            const dataISO = initialData.dataNascimento ? new Date(initialData.dataNascimento).toISOString().substring(0,10) : '';
            setDataNascimento(dataISO);
            setPlanosSaude(normalizarPlanosSaude(initialData.planosSaude));
        }else{
            setNomeCompleto('');
            setCpf('');
            setCrm('');
            setDataNascimento('');
            setPlanosSaude([]);
        }

    }, [initialData, isOpen])
    

    function handleTogglePlano(plano){
        console.log('Toggling plano:', plano);
        setPlanosSaude((anteriores)=>{
            if(anteriores.includes(plano)){
                return anteriores.filter((p)=> p !== plano);
            }else{
                return [...anteriores, plano];
            }
        })
    }


    function handleSubmit(event){
        event.preventDefault();
        const dados ={
            nomeCompleto,
            cpf,
            crm,
            dataNascimento: dataNascimento ? new Date (dataNascimento).toISOString() : null,
            planosSaude,
        };
        console.log('Submitting form with data:', dados);
        onSubmit(dados);
    }
    const titulo = mode === 'editar' ? 'Editar Médico' : 'Cadastrar Médico';
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
                        <label>Nome Completo</label>
                        <input type="text" value={nomeCompleto} onChange={(e)=> setNomeCompleto(e.target.value)} required/>
                    </div>
                    <div className="modal-field">
                        <label>CPF</label>
                        <input type="text" value={cpf} onChange={(e)=> setCpf(e.target.value)} required/>
                    </div>
                    <div className="modal-field">
                        <label>CRM</label>
                        <input type="text" value={crm} onChange={(e)=> setCrm(e.target.value)} required/>
                    </div>
                    <div className="modal-field">
                        <label>Data de Nascimento</label>
                        <input type="date" value={dataNascimento} onChange={(e)=> setDataNascimento(e.target.value)} required/>
                    </div>
                    <div className="modal-field">
                        <label>Planos de saúde</label>
                        <div className="modal-checkbox-group">
                            {carregandoPlanos && <p>Carregando planos de saúde...</p>}

                            {erroPlanos && (<p className="erro-planos" style={{color:'red'}}>
                                {erroPlanos}</p>)}

                            {!carregandoPlanos && !erroPlanos && opcoesPlanos.map((plano) => (
                                <label key={plano} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        value={plano}
                                        checked={planosSaude.includes(plano)}
                                        onChange={() => handleTogglePlano(plano)}
                                    />
                                    {plano}
                                </label>
                            ))}
                            
                        </div>
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

export default medicoFormModal;