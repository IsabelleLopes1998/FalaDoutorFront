import { useEffect, useState } from "react";
import { fetchPlanosSaude } from "../../services/api";
import './MedicoFormModal.css'


function normalizarPlanosSaude(valor){
    if(!valor) return [];
    if(Array.isArray(valor)){
        return valor
            .map((plano) => {
                if (typeof plano === 'object' && plano !== null) {
                    return plano.id || plano.nome || '';
                }
                return plano;
            })
            .map((plano) => String(plano).trim())
            .filter(Boolean);
    }
    if(typeof valor === 'string'){
        return valor
        .replace(/[{}]/g, "")
        .split(',')
        .map((plano) => plano.trim())
        .filter(Boolean)
    }

    return [];
}

function validarCPF(cpf){
    cpf = cpf.replace(/[^\d]/g, '');
    if(cpf.length !== 11) return false;
    if(/^(\d)\1{10}$/.test(cpf)) return false;

    let soma=0;
    for(let i=0; i<9; i++){
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digito = 11 - (soma % 11);
    if(digito >= 10) digito = 0;
    if(digito !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for(let i=0; i<10; i++){
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digito = 11 - (soma % 11);
    if(digito >= 10) digito = 0;
    if(digito !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function formatarCPF(valor) {
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros.length <= 3) return apenasNumeros;
    if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0,3)}.${apenasNumeros.slice(3)}`;
    if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0,3)}.${apenasNumeros.slice(3,6)}.${apenasNumeros.slice(6)}`;
    return `${apenasNumeros.slice(0,3)}.${apenasNumeros.slice(3,6)}.${apenasNumeros.slice(6,9)}-${apenasNumeros.slice(9,11)}`;
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

    const [erroCpf, setErroCpf] = useState(null);

    //const OPCOES_PLANOS = ['UNIMED', 'BRADESCO','HAPVIDA'];

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
            const cpfDoBackend = initialData.cpf || '';
            setCpf(formatarCPF(cpfDoBackend));
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
    

    function handleTogglePlano(planoId){
        const idComoString = String(planoId);
        setPlanosSaude((anteriores)=>{
            if(anteriores.includes(idComoString)){
                return anteriores.filter((p)=> p !== idComoString);
            }else{
                return [...anteriores, idComoString];
            }
        })
    }


    function handleSubmit(event){
        event.preventDefault();

        const cpfLimpo = cpf.replace(/\D/g, '');
        console.log(cpfLimpo)

        // Validação de CPF comentada para facilitar testes
        // if (!validarCPF(cpfLimpo)) {
        //     setErroCpf('CPF inválido');
        //     return;
        // }
        
        const dados ={
            nomeCompleto,
            cpf: cpfLimpo,  // Envia apenas números (sem pontos e hífen)
            crm,
            dataNascimento: dataNascimento ? new Date (dataNascimento).toISOString() : null,
            planosSaude: planosSaude.map((id) => Number(id) || id),
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
                        <input type="text" value={cpf} onChange={(e) => {
                            const valorFormatado = formatarCPF(e.target.value);
                            setCpf(valorFormatado);

                            
                            const cpfLimpo = valorFormatado.replace(/\D/g, '');

                            // Validação de CPF comentada para facilitar testes
                            // if (cpfLimpo.length === 11) {
                            //     if(validarCPF(cpfLimpo)){ 
                            //         setErroCpf(null);
                            //     }else{
                            //         setErroCpf('CPF inválido.');
                            //     }
                            // } else {
                            //     setErroCpf(null);  
                            // }
                            setErroCpf(null); // Sempre limpa erro para não bloquear
                        }} required/>
                        {/* Mensagem de erro de CPF comentada para facilitar testes */}
                        {/* {erroCpf && <span style={{color: 'red', fontSize: '0.85rem'}}>{erroCpf}</span>} */}
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
                                <label key={plano.id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        value={plano.id}
                                        checked={planosSaude.includes(String(plano.id))}
                                        onChange={() => handleTogglePlano(plano.id)}
                                    />
                                    {plano.nome}
                                </label>
                            ))}
                            
                        </div>
                    </div>

                    <footer className="modal-footer">
                    <button type="button" className="modal-button secondary" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="modal-button primary">{textoBotao}</button>
                    </footer>

                </form>
            </div>
        </div>
    )
}

export default medicoFormModal;
