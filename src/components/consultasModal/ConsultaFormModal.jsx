import { useEffect, useState } from "react";
import { fetchPlanosSaude } from "../../services/api";
import './ConsultaFormModal.css'


function ConsultaFormModal({isOpen, mode ='criar', initialData, onClose, onSubmit}) {

    if(!isOpen) return null;

    const[pacienteId, setPacienteId] = useState('');
    const[medicoId, setMedicoId] = useState('');
    const[data, setData] = useState('');
    const[hora, setHora] = useState('');
    const[planoSaudeNome, setPlanoSaudeNome] = useState('');
    const[valor, setValor] = useState('');

    const [opcoesMedicos, setOpcoesMedicos] = useState([]);
    const [opcoesPacientes, setOpcoesPacientes] = useState([]);
    const [opcoesPlanos, setOpcoesPlanos] = useState([]);
    const [carregandoMedicos, setCarregandoMedicos] = useState(true);
    const [carregandoPacientes, setCarregandoPacientes] = useState(true);
    const [erroPlano, setErroPlano] = useState('');
    
    
    const [planoPaciente, setPlanoPaciente] = useState(null); 
    const [planosMedico, setPlanosMedico] = useState([]); 

    useEffect(()=>{
        if(!isOpen) return;

        async function carregarMedicos(){
            try{
                const resposta = await fetch('http://localhost:3000/medicos');
                if(resposta.ok){
                    const dados = await resposta.json();
                    setOpcoesMedicos(dados);
                }
            }catch(error){
                console.error('Erro ao carregar médicos:', error);
            }finally{
                setCarregandoMedicos(false);
            }
        }

        async function carregarPacientes(){
            try{
                const resposta = await fetch('http://localhost:3000/pacientes');
                if(resposta.ok){
                    const dados = await resposta.json();
                    setOpcoesPacientes(dados);
                }
            }catch(error){
                console.error('Erro ao carregar pacientes:', error);
            }finally{
                setCarregandoPacientes(false);
            }
        }

        async function carregarPlanos(){
            try{
                const planos = await fetchPlanosSaude();
                setOpcoesPlanos(planos);
            }catch(error){
                console.error('Erro ao carregar planos:', error);
            }
        }

        carregarMedicos();
        carregarPacientes();
        carregarPlanos();
    }, [isOpen]);

    
    function buscarPlanoPaciente(pacienteSelecionado) {
        if (!pacienteSelecionado || !pacienteSelecionado.planoSaude) {
            setPlanoPaciente(null);
            return;
        }
        if (typeof pacienteSelecionado.planoSaude === 'object' && pacienteSelecionado.planoSaude !== null) {
            setPlanoPaciente(pacienteSelecionado.planoSaude);
        } else {
            
            const planoEncontrado = opcoesPlanos.find(p => 
                p.id === pacienteSelecionado.planoSaude || 
                p.nome.toLowerCase() === String(pacienteSelecionado.planoSaude).toLowerCase()
            );
            setPlanoPaciente(planoEncontrado || null);
        }
    }


    function buscarPlanosMedico(medicoSelecionado) {
        if (!medicoSelecionado || !medicoSelecionado.planosSaude) {
            setPlanosMedico([]);
            return;
        }

        const planos = Array.isArray(medicoSelecionado.planosSaude) 
            ? medicoSelecionado.planosSaude.map(p => {
                if (typeof p === 'object' && p !== null && p.id && p.nome) {
                    return p;
                }
                const planoEncontrado = opcoesPlanos.find(plano => 
                    plano.id === p || 
                    plano.nome.toLowerCase() === String(p).toLowerCase()
                );
                return planoEncontrado || null;
            }).filter(Boolean)
            : [];

        setPlanosMedico(planos);
    }

    useEffect(() => {
        if (pacienteId && opcoesPacientes.length > 0 && opcoesPlanos.length > 0) {
            const pacienteSelecionado = opcoesPacientes.find(p => p.id === parseInt(pacienteId));
            if (pacienteSelecionado) {
                buscarPlanoPaciente(pacienteSelecionado);
            } else {
                setPlanoPaciente(null);
            }
        } else {
            setPlanoPaciente(null);
        }
    }, [pacienteId, opcoesPacientes, opcoesPlanos]);

    
    useEffect(() => {
        if (medicoId && opcoesMedicos.length > 0 && opcoesPlanos.length > 0) {
            const medicoSelecionado = opcoesMedicos.find(m => m.id === parseInt(medicoId));
            if (medicoSelecionado) {
                buscarPlanosMedico(medicoSelecionado);
            } else {
                setPlanosMedico([]);
            }
        } else {
            setPlanosMedico([]);
        }
    }, [medicoId, opcoesMedicos, opcoesPlanos]);

    
    useEffect(() => {
        if (planoPaciente && planosMedico.length > 0) {
            
            const planoComum = planosMedico.find(plano => 
                plano.nome.toLowerCase() === planoPaciente.nome.toLowerCase()
            );

            if (planoComum) {
                
                setPlanoSaudeNome(planoPaciente.nome);
                setValor(planoPaciente.valor ? planoPaciente.valor.toString() : '');
                setErroPlano('');
            } else {
                
                setPlanoSaudeNome('');
                setValor('');
                setErroPlano('O plano de saúde do paciente não é aceito pelo médico selecionado.');
            }
        } else {
            setPlanoSaudeNome('');
            setValor('');
            setErroPlano('');
        }
    }, [planoPaciente, planosMedico]);

    useEffect(()=>{
        if(initialData){    
            setPacienteId(initialData.pacienteId || '');
            setMedicoId(initialData.medicoId || '');
            setData(initialData.data ? new Date(initialData.data).toISOString().substring(0,10) : '');
            setHora(initialData.hora || '');
            setPlanoSaudeNome(initialData.planoSaudeNome || '');
            setValor(initialData.valor || '');
            setErroPlano('');
        }else{
            setPacienteId('');
            setMedicoId('');
            setData('');
            setHora('');
            setPlanoSaudeNome('');
            setValor('');
            setErroPlano('');
        }

    }, [initialData, isOpen])
    


    function handleSubmit(event){
        event.preventDefault();

        if(erroPlano){
            return;
        }

        if(!planoSaudeNome){
            setErroPlano('Selecione um médico e um paciente para verificar o plano de saúde.');
            return;
        }
        
        const dados ={
            pacienteId: parseInt(pacienteId),
            medicoId: parseInt(medicoId),
            data: data ? new Date(data).toISOString() : null,
            hora,
            planoSaudeNome,
            valor: valor ? parseFloat(valor) : null,
        };
        console.log('Submitting form with data:', dados);
        onSubmit(dados);
    }
    const titulo = mode === 'editar' ? 'Editar Consulta' : 'Cadastrar Consulta';
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
                        <label>Paciente</label>
                        {carregandoPacientes ? (
                            <p>Carregando pacientes...</p>
                        ) : (
                            <select 
                                value={pacienteId} 
                                onChange={(e) => setPacienteId(e.target.value)}
                                required
                                style={{
                                    padding: '6px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    fontSize: '0.95rem',
                                    width: '100%'
                                }}
                            >
                                <option value="">Selecione um paciente</option>
                                {opcoesPacientes.map((paciente) => (
                                    <option key={paciente.id} value={paciente.id}>
                                        {paciente.nomeCompleto}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="modal-field">
                        <label>Médico</label>
                        {carregandoMedicos ? (
                            <p>Carregando médicos...</p>
                        ) : (
                            <select 
                                value={medicoId} 
                                onChange={(e) => setMedicoId(e.target.value)}
                                required
                                style={{
                                    padding: '6px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    fontSize: '0.95rem',
                                    width: '100%'
                                }}
                            >
                                <option value="">Selecione um médico</option>
                                {opcoesMedicos.map((medico) => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.nomeCompleto}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="modal-field">
                        <label>Data</label>
                        <input type="date" value={data} onChange={(e)=> setData(e.target.value)} required/>
                    </div>
                    <div className="modal-field">
                        <label>Hora</label>
                        <input 
                            type="time" 
                            value={hora} 
                            onChange={(e)=> setHora(e.target.value)} 
                            required
                            style={{
                                padding: '6px 8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '0.95rem',
                                width: '100%'
                            }}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Plano de saúde para atendimento</label>
                        {planoSaudeNome ? (
                            <input 
                                type="text" 
                                value={planoSaudeNome} 
                                readOnly
                                style={{
                                    padding: '6px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    fontSize: '0.95rem',
                                    width: '100%',
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'not-allowed'
                                }}
                            />
                        ) : (
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                                {medicoId && pacienteId 
                                    ? 'Selecione um médico e um paciente para verificar o plano'
                                    : 'Selecione um médico e um paciente'}
                            </p>
                        )}
                        {erroPlano && (
                            <span style={{color: 'red', fontSize: '0.85rem', display: 'block', marginTop: '4px'}}>
                                {erroPlano}
                            </span>
                        )}
                    </div>
                    <div className="modal-field">
                        <label>Valor</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={valor} 
                            onChange={(e)=> setValor(e.target.value)} 
                            readOnly={!!planoSaudeNome}
                            required
                            style={planoSaudeNome ? {
                                padding: '6px 8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '0.95rem',
                                width: '100%',
                                backgroundColor: '#f5f5f5',
                                cursor: 'not-allowed'
                            } : {
                                padding: '6px 8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '0.95rem',
                                width: '100%'
                            }}
                        />
                        {planoSaudeNome && (
                            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                                Valor do plano de saúde
                            </p>
                        )}
                    </div>

                    <footer className="modal-footer">
                    <button type="button" className="modal-button secondary" onClick={onClose}>Cancelar</button>
                    <button 
                        type="submit" 
                        className="modal-button primary"
                        disabled={!!erroPlano || !planoSaudeNome}
                    >
                        {textoBotao}
                    </button>
                    </footer>

                </form>
            </div>
        </div>
    )
}

export default ConsultaFormModal;
