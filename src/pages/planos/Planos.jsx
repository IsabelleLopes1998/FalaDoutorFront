import { useEffect, useState } from 'react';
import ConfirmExcluir from '../../components/ModalExcluir/ConfirmExcluir.jsx';
import PlanoFormModal from '../../components/planosModal/PlanoFormModal.jsx';
import './Planos.css'



function formatarPlanosSaude(valor){
    
    if(!valor) return '';
    if(typeof valor === 'string'){
        return valor.trim();
    }
    return String(valor);
}

function Planos() { 

    const [planos, setPlanos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro,setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [modoModal, setModoModal] = useState('criar');
    const [planoSelecionado, setPlanoSelecionado] = useState(null);

    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
    const [planoParaExcluir, setPlanoParaExcluir] = useState(null);
    
    
    useEffect(() => {

        async function buscarPlanos(){
            try {
                setCarregando(true);
                setErro(null);

                const resposta = await fetch('http://localhost:3000/planos-saude');

                if(!resposta.ok){
                    throw new Error(`Erro ao buscar planos de saúde: ${resposta.status} ${resposta.statusText}`);
                }

                const dados = await resposta.json();
                setPlanos(dados);

            }catch (error) {
                setErro('Não foi possível carregar a lista de planos de saúde.');
            }finally {
                setCarregando(false);
            }

        }
        buscarPlanos();
    }, []);

    async function abrirModalCriar(p) {
        setModoModal('criar');
        setPlanoSelecionado(null);
        setModalAberto(true);
        
    }

    async function abrirModalEditar(plano) { 
        setModoModal('editar');
        setPlanoSelecionado(plano);
        setModalAberto(true);
    }

    async function fecharModal() {
        setModalAberto(false);
    }
    async function abrirConfirmacaoExclusao(plano){
        setConfirmacaoExclusao(true);
        setPlanoParaExcluir(plano);
    }
    function cancelarExclusao(){
        setConfirmacaoExclusao(false);
        setPlanoParaExcluir(null);
    }

    async function excluirPlano(){
        if(!planoParaExcluir || !planoParaExcluir.id) return;

        try {
            
            const resposta = await fetch(`http://localhost:3000/planos-saude/${planoParaExcluir.id}`, {
                method: 'DELETE',
            });

            if(!resposta.ok){
                throw new Error("Erro ao excluir plano de saúde.");
            }

            setPlanos((planosAnteriores) => 
                planosAnteriores.filter((m) => m.id !== planoParaExcluir.id)
            );

            setConfirmacaoExclusao(false);
            setPlanoParaExcluir(null);
        
        }catch (error) {
            console.error(error);
            alert('Não foi possível excluir o plano de saúde.');
        }
    }


    async function handleSubmitPlano(dadosForm) {

        try{

            if(modoModal === 'criar'){
                const resposta = await fetch('http://localhost:3000/planos-saude', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosForm),
                });

                if(!resposta.ok){
                    throw new Error("Erro ao criar plano de saúde.");
                }  
            const planoCriado = await resposta.json();
            setPlanos((anteriores)=> [...anteriores, planoCriado]);   

            }else if(modoModal==='editar' && planoSelecionado){
                const resposta = await fetch(`http://localhost:3000/planos-saude/${planoSelecionado.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosForm),
                });

                if(!resposta.ok){
                    throw new Error("Erro ao atualizar plano de saúde.");
                }
                const planoAtualizado = await resposta.json();

                setPlanos((anteriores) => 
                    anteriores.map((plano) => 
                        plano.id === planoAtualizado.id ? planoAtualizado: plano
                    )
                );
            }

            fecharModal();

        }catch (error) {
            console.error(error);
            alert('Não foi possível salvar o plano de saúde.');   
        }


    }        
    


    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Planos de Saúde</h1>

                </div>

                <button
                    type="button"
                    className="button button-primary"
                    onClick={abrirModalCriar}
                > Adicionar
                </button>
            </div>

                {carregando && <p>Carregando planos...</p>}
                {erro && (<p style={{color:'red', marginBottom: '1rem'}}>{erro}</p>)}

                {!carregando && !erro && (
                    <div className="table-wrapper">
                        <table className="planos-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Valor</th>
                                    <th style={{ width: '150px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {planos.map((plano) => (
                                    <tr key={plano.id}>
                                        <td>{plano.nome}</td>
                                        <td>{plano.valor}</td>
                                        <td>
                                            <div className="planos-actions">
                                                <button
                                                    type="button"
                                                    className="button button-secondary"
                                                    onClick={() => abrirModalEditar(plano)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="button button-danger"
                                                    onClick={() => abrirConfirmacaoExclusao(plano)}
                                                >
                                                    Excluir
                                                </button>
                                                </div>
                                            </td>
                                    </tr>
                                ))}


                                {planos.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            Nenhum plano de saúde encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <PlanoFormModal
                    isOpen={modalAberto}
                    mode={modoModal}
                    initialData={planoSelecionado}
                    onClose={fecharModal}
                    onSubmit={handleSubmitPlano}
                />
                <ConfirmExcluir
                    isOpen={confirmacaoExclusao}
                    title="Confirmar exclusão"
                    message={planoParaExcluir ? `Tem certeza que deseja excluir o plano de saúde ${planoParaExcluir.nome}?` : 'Tem certeza que deseja excluir este plano?'}
                    confirmText="Excluir"
                    cancelText="Cancelar"
                    onClose={cancelarExclusao}
                    onConfirm={() => excluirPlano()}
                    onCancel={cancelarExclusao}
                />
        </> 
    )

}

export default Planos;