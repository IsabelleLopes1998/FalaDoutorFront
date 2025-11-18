import { useEffect, useState } from 'react';
import PacienteFormModal from '../../components/pacienteModal/PacienteFormModal.jsx';
import ConfirmExcluir from '../../components/ModalExcluir/ConfirmExcluir.jsx';
import './Pacientes.css'



function formatarPlanosSaude(valor){
    
    if(!valor) return '';
    if(typeof valor === 'string'){
        return valor.trim();
    }
    return String(valor);
}

function Pacientes() { 

    const [pacientes, setPacientes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro,setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [modoModal, setModoModal] = useState('criar');
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
    const [pacienteParaExcluir, setPacienteParaExcluir] = useState(null);
    
    
    useEffect(() => {

        async function buscarPacientes(){
            try {
                setCarregando(true);
                setErro(null);

                const resposta = await fetch('http://localhost:3000/pacientes');

                if(!resposta.ok){
                    throw new Error(`Erro ao buscar pacientes: ${resposta.status} ${resposta.statusText}`);
                }

                const dados = await resposta.json();
                setPacientes(dados);

            }catch (error) {
                setErro('Não foi possível carregar a lista de pacientes.');
            }finally {
                setCarregando(false);
            }

        }
        buscarPacientes();
    }, []);

    async function abrirModalCriar(p) {
        setModoModal('criar');
        setPacienteSelecionado(null);
        setModalAberto(true);
        
    }

    async function abrirModalEditar(paciente) { 
        setModoModal('editar');
        setPacienteSelecionado(paciente);
        setModalAberto(true);
    }

    async function fecharModal() {
        setModalAberto(false);
    }
    async function abrirConfirmacaoExclusao(paciente){
        setConfirmacaoExclusao(true);
        setPacienteParaExcluir(paciente);
    }
    function cancelarExclusao(){
        setConfirmacaoExclusao(false);
        setPacienteParaExcluir(null);
    }

    async function excluirPaciente(){
        if(!pacienteParaExcluir || !pacienteParaExcluir.id) return;

        try {
            
            const resposta = await fetch(`http://localhost:3000/pacientes/${pacienteParaExcluir.id}`, {
                method: 'DELETE',
            });

            if(!resposta.ok){
                throw new Error("Erro ao excluir paciente.");
            }

            setPacientes((pacientesAnteriores) => 
                pacientesAnteriores.filter((m) => m.id !== pacienteParaExcluir.id)
            );

            setConfirmacaoExclusao(false);
            setPacienteParaExcluir(null);
        
        }catch (error) {
            console.error(error);
            alert('Não foi possível excluir o paciente.');
        }
    }


    async function handleSubmitPaciente(dadosForm) {

        try{

            if(modoModal === 'criar'){
                const resposta = await fetch('http://localhost:3000/pacientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosForm),
                });

                if(!resposta.ok){
                    throw new Error("Erro ao criar paciente.");
                }  
            const pacienteCriado = await resposta.json();
            setPacientes((anteriores)=> [...anteriores, pacienteCriado]);   

            }else if(modoModal==='editar' && pacienteSelecionado){
                const resposta = await fetch(`http://localhost:3000/pacientes/${pacienteSelecionado.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosForm),
                });

                if(!resposta.ok){
                    throw new Error("Erro ao atualizar paciente.");
                }
                const pacienteAtualizado = await resposta.json();

                setPacientes((anteriores) => 
                    anteriores.map((paciente) => 
                        paciente.id === pacienteAtualizado.id ? pacienteAtualizado: paciente
                    )
                );
            }

            fecharModal();

        }catch (error) {
            console.error(error);
            alert('Não foi possível salvar o paciente.');   
        }


    }        
    


    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pacientes</h1>

                </div>

                <button
                    type="button"
                    className="button button-primary"
                    onClick={abrirModalCriar}
                > Cadastrar paciente
                </button>
            </div>

                {carregando && <p>Carregando pacientes...</p>}
                {erro && (<p style={{color:'red', marginBottom: '1rem'}}>{erro}</p>)}

                {!carregando && !erro && (
                    <div className="table-wrapper">
                        <table className="pacientes-table">
                            <thead>
                                <tr>
                                    <th>Nome Completo</th>
                                    <th>CPF</th>
                                    <th>Data de Nascimento</th>
                                    <th>Plano de Saúde</th>
                                    <th style={{ width: '150px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.map((paciente) => (
                                    <tr key={paciente.id}>
                                        <td>{paciente.nomeCompleto}</td>
                                        <td>{paciente.cpf}</td>
                                        <td>{paciente.dataNascimento? new Date( paciente.dataNascimento,).toLocaleDateString('pt-BR'): ''}</td>
                                        <td>{formatarPlanosSaude(paciente.planoSaude)}</td>
                                        <td>
                                            <div className="pacientes-actions">
                                                <button
                                                    type="button"
                                                    className="button button-secondary"
                                                    onClick={() => abrirModalEditar(paciente)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="button button-danger"
                                                    onClick={() => abrirConfirmacaoExclusao(paciente)}
                                                >
                                                    Excluir
                                                </button>
                                                </div>
                                            </td>
                                    </tr>
                                ))}


                                {pacientes.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            Nenhum paciente encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <PacienteFormModal
                    isOpen={modalAberto}
                    mode={modoModal}
                    initialData={pacienteSelecionado}
                    onClose={fecharModal}
                    onSubmit={handleSubmitPaciente}
                />
                <ConfirmExcluir
                    isOpen={confirmacaoExclusao}
                    title="Confirmar exclusão"
                    message={pacienteParaExcluir ? `Tem certeza que deseja excluir o(a) paciente ${pacienteParaExcluir.nomeCompleto}?` : 'Tem certeza que deseja excluir este paciente?'}
                    confirmText="Excluir"
                    cancelText="Cancelar"
                    onClose={cancelarExclusao}
                    onConfirm={() => excluirPaciente()}
                    onCancel={cancelarExclusao}
                />
        </> 
    )

}

export default Pacientes;