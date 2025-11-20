import { useEffect, useState } from "react";
import { fetchPlanosSaude } from "../../services/api";
import './PacienteFormModal.css'



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

function pacienteFormModal({isOpen, mode ='criar', initialData, onClose, onSubmit}) {

    if(!isOpen) return null;

    const[nomeCompleto, setNomeCompleto] = useState('');
    const[cpf, setCpf] = useState('');
    const[dataNascimento, setDataNascimento] = useState('');
    

    const [opcoesPlanos, setOpcoesPlanos] = useState([]);
    const [carregandoPlanos, setCarregandoPlanos] = useState(true);
    const [erroPlanos, setErroPlanos] = useState(null);
    const [planoSaudeId, setPlanoSaudeId] = useState('');

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
            const dataISO = initialData.dataNascimento ? new Date(initialData.dataNascimento).toISOString().substring(0,10) : '';
            setDataNascimento(dataISO);
            setPlanoSaudeId(initialData.planoSaude?.id || '');
        }else{
            setNomeCompleto('');
            setCpf('');
            setDataNascimento('');
            setPlanoSaudeId('');
        }

    }, [initialData, isOpen])
    

    function handleSelecionarPlano(id){
        setPlanoSaudeId(id);
    }


    function handleSubmit(event){
        event.preventDefault();

        const cpfLimpo = cpf.replace(/\D/g, '');
        console.log(cpfLimpo)

        if (!validarCPF(cpfLimpo)) {
            setErroCpf('CPF inválido');
            return;
        }
        
        const dados ={
            nomeCompleto,
            cpf: cpfLimpo,
            dataNascimento: dataNascimento ? new Date (dataNascimento).toISOString() : null,
            planoSaudeId,
        };
        console.log('Submitting form with data:', dados);
        onSubmit(dados);
    }
    const titulo = mode === 'editar' ? 'Editar Paciente' : 'Cadastrar Paciente';
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

                            if (cpfLimpo.length === 11) {
                                if(validarCPF(cpfLimpo)){ 
                                    setErroCpf(null);
                                }else{
                                    setErroCpf('CPF inválido.');
                                }
                            } else {
                                
                                setErroCpf(null);  
                            }
                        }} required/>
                        {erroCpf && <span style={{color: 'red', fontSize: '0.85rem'}}>{erroCpf}</span>}
                    </div>
                    <div className="modal-field">
                        <label>Data de Nascimento</label>
                        <input type="date" value={dataNascimento} onChange={(e)=> setDataNascimento(e.target.value)} required/>
                    </div>
                    <div className="modal-field">
                        <label>Plano de saúde</label>
                        {carregandoPlanos && <p>Carregando planos de saúde...</p>}

                        {erroPlanos && (<p className="erro-planos" style={{color:'red'}}>
                            {erroPlanos}</p>)}

                        {!carregandoPlanos && !erroPlanos && (
                            <select 
                                value={planoSaudeId} 
                                onChange={(e) => handleSelecionarPlano(e.target.value)}
                                required
                                style={{
                                    padding: '6px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    fontSize: '0.95rem',
                                    width: '100%'
                                }}
                            >
                                <option value="">Selecione um plano</option>
                                {opcoesPlanos.map((plano) => (
                                    <option key={plano.id} value={plano.id}>
                                        {plano.nome}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <footer className="modal-footer">
                    <button type="button" className="modal-button secondary" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="modal-button primary" disabled={!!erroCpf} >{textoBotao}</button>
                    </footer>

                </form>
            </div>
        </div>
    )
}

export default pacienteFormModal;