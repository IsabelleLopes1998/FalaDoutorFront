import { useEffect, useState } from "react";
import ConsultaFormModal from '../../components/consultasModal/ConsultaFormModal.jsx';
import ConfirmExcluir from '../../components/ModalExcluir/ConfirmExcluir.jsx';
import './Consultas.css';




function Consultas() { 


    const [consultas, setConsultas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro,setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [modoModal, setModoModal] = useState('criar');
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);

    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
    const [consultaParaExcluir, setConsultaParaExcluir] = useState(null);

    useEffect(() => {

        async function buscarConsultas(){
            try {
                setCarregando(true);
                setErro(null);

                const resposta = await fetch('http://localhost:3000/consultas');

                if(!resposta.ok){
                    throw new Error(`Erro ao buscar consulta: ${resposta.status} ${resposta.statusText}`);
                }

                const dados = await resposta.json();
                console.log('Dados recebidos do backend:', dados);
                setConsultas(dados);

            }catch (error) {
                setErro('Não foi possível carregar a lista de consultas.');
            }finally {
                setCarregando(false);
            }

        }
        buscarConsultas();
    }, []);

    async function abrirModalCriar(p) {
        setModoModal('criar');
        setConsultaSelecionada(null);
        setModalAberto(true);
        
    }

    async function abrirModalEditar(consulta) { 
        setModoModal('editar');
        setConsultaSelecionada(consulta);
        setModalAberto(true);
    }

    async function fecharModal() {
        setModalAberto(false);
    }

    async function abrirConfirmacaoExclusao(consulta){
        setConfirmacaoExclusao(true);
        setConsultaParaExcluir(consulta);
    }
    function cancelarExclusao(){
        setConfirmacaoExclusao(false);
        setConsultaParaExcluir(null);
    }

    async function excluirConsulta(){
        if(!consultaParaExcluir || !consultaParaExcluir.id) return;

        try {
            const resposta = await fetch(`http://localhost:3000/consultas/${consultaParaExcluir.id}`, {
                method: 'DELETE',
            });

            if(!resposta.ok){
                throw new Error("Erro ao excluir consulta.");
            }

            setConsultas((consultasAnteriores) => 
                consultasAnteriores.filter((c) => c.id !== consultaParaExcluir.id)
            );

            setConfirmacaoExclusao(false);
            setConsultaParaExcluir(null);
        
        }catch (error) {
            console.error(error);
            alert('Não foi possível excluir a consulta.');
        }
    }


    async function handleSubmitConsulta(dadosForm) {

        try{

            if(modoModal === 'criar'){
                console.log('dadosForm', dadosForm);
                const resposta = await fetch('http://localhost:3000/consultas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosForm),
                });

                if(!resposta.ok){
                            throw new Error("Erro ao criar consulta.");
                }  

            }else if(modoModal==='editar' && consultaSelecionada){
                const resposta = await fetch(`http://localhost:3000/consultas/${consultaSelecionada.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosForm),
                });

                if(!resposta.ok){
                    throw new Error("Erro ao atualizar consulta.");
                }
            }

            // Recarrega a lista completa após criar/editar para garantir que os nomes venham do backend
            const respostaLista = await fetch('http://localhost:3000/consultas');
            if(respostaLista.ok){
                const dadosAtualizados = await respostaLista.json();
                setConsultas(dadosAtualizados);
            }

            fecharModal();

        }catch (error) {
            console.error(error);
            alert('Não foi possível salvar a consulta.');   
        }


    }        
    


    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Consultas</h1>

                </div>

                <button
                    type="button"
                    className="button button-primary"
                    onClick={abrirModalCriar}
                > Adicionar
                </button>
            </div>

                {carregando && <p>Carregando consultas...</p>}
                {erro && (<p style={{color:'red', marginBottom: '1rem'}}>{erro}</p>)}

                {!carregando && !erro && (
                    <div className="table-wrapper">
                        <table className="consultas-table">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Médico</th>
                                    <th>Data</th>
                                    <th>Hora</th>
                                    <th>Plano de Saúde para atendimento</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                    <th style={{ width: '150px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consultas.map((consulta) => (
                                    <tr key={consulta.id}>
                                        <td>{consulta.pacienteNome}</td>
                                        <td>{consulta.medicoNome}</td>
                                        <td>{consulta.data? new Date( consulta.data,).toLocaleDateString('pt-BR'): ''}</td>
                                        <td>{consulta.hora}</td>
                                        <td>{consulta.planoSaudeNome}</td>
                                        <td>
                                            {consulta.valor 
                                                ? `R$ ${parseFloat(consulta.valor).toFixed(2).replace('.', ',')}` 
                                                : '-'}
                                        </td>
                                        <td>
                                            <span 
                                                className={`status-badge ${consulta.status === 'valida' ? 'status-valida' : 'status-invalida'}`}
                                            >
                                                {consulta.status === 'valida' ? 'Válida' : (consulta.status === 'invalida' ? 'Inválida' : '-')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="consultas-actions">
                                                <button
                                                    type="button"
                                                    className="button button-secondary"
                                                    onClick={() => abrirModalEditar(consulta)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="button button-danger"
                                                    onClick={() => abrirConfirmacaoExclusao(consulta)}
                                                >
                                                    Excluir
                                                </button>
                                                </div>
                                            </td>
                                    </tr>
                                ))}


                                {consultas.length === 0 && (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center' }}>
                                            Nenhuma consulta encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <ConsultaFormModal
                    isOpen={modalAberto}
                    mode={modoModal}
                    initialData={consultaSelecionada}
                    onClose={fecharModal}
                    onSubmit={handleSubmitConsulta}
                />
                <ConfirmExcluir
                    isOpen={confirmacaoExclusao}
                    title="Confirmar exclusão"
                    message={consultaParaExcluir ? `Tem certeza que deseja excluir a consulta ${consultaParaExcluir.id}?` : 'Tem certeza que deseja excluir esta consulta?'}
                    confirmText="Excluir"
                    cancelText="Cancelar"
                    onClose={cancelarExclusao}
                    onConfirm={() => excluirConsulta()}
                    onCancel={cancelarExclusao}
                />
        </> 
    )

}

export default Consultas;