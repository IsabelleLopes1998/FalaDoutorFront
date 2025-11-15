import { useEffect, useState } from "react";
import MedicoFormModal from "../../components/MedicoFormModal";


function formatarPlanosSaude(valor){
    if(!valor) return [];
    if(Array.isArray(valor)){
        return valor.join(', ')
    }

    if(typeof valor ==='string'){
        return valor
        .replace(/[{}]/g, "")
        .split(',')
        .map((plano) => plano.trim())
        .filter(Boolean)
        .join(', ');
    }

    return String(valor);
}

function Medicos() { 


    const [medicos, setMedicos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro,setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [modoModal, setModoModal] = useState('criar');
    const [medicoSelecionado, setMedicoSelecionado] = useState(null);

    useEffect(() => {

        async function buscarMedicos(){
            try {
                setCarregando(true);
                setErro(null);

                const resposta = await fetch('http://localhost:3000/medicos');

                if(!resposta.ok){
                    throw new Error(`Erro ao buscar médicos: ${resposta.status} ${resposta.statusText}`);
                }

                const dados = await resposta.json();
                setMedicos(dados);

            }catch (error) {
                setErro('Não foi possível carregar a lista de médicos.');
            }finally {
                setCarregando(false);
            }

        }
        buscarMedicos();
    }, []);

    async function abrirModalCriar(p) {
        setModoModal('criar');
        setMedicoSelecionado(null);
        setModalAberto(true);
        
    }

    async function abrirModalEditar(medico) { 
        setModoModal('editar');
        setMedicoSelecionado(medico);
        setModalAberto(true);
    }

    async function fecharModal() {
        setModalAberto(false);
    }

    async function excluirMedico(id){
        const confirmar = window.confirm('Tem certeza que deseja excluir este médico?');
        if(!confirmar) return;

        try {
            const reposta = await fetch(`http://localhost:3000/medicos/${id}`, {
                method: 'DELETE',
            });

            if(!reposta.ok){
                throw new Error("Erro ao excluir médico.");
            }

            setMedicos((medicosAnteriores) => 
                medicosAnteriores.filter((m) => m.id !== id)
        );
        
        }catch (error) {
            console.error(error);
            alert('Não foi possível excluir o médico.');
        }
    }


    async function handleSubmitMedico(dadosForm) {

        try{

            if(modoModal === 'criar'){
                const resposta = await fetch('http://localhost:3000/medicos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosForm),
                });

                if(!resposta.ok){
                    throw new Error("Erro ao criar médico.");
                }  
            const medicoCriado = await resposta.json();
            setMedicos((anteriores)=> [...anteriores, medicoCriado]);   

            }else if(modoModal==='editar' && medicoSelecionado){
                const resposta = await fetch(`http://localhost:3000/medicos/${medicoSelecionado.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosForm),
                });

                if(!resposta.ok){
                    throw new Error("Erro ao atualizar médico.");
                }
                const medicoAtualizado = await resposta.json();

                setMedicos((anteriores) => 
                    anteriores.map((medico) => 
                        medico.id === medicoAtualizado.id ? medicoAtualizado: medico
                    )
                );
            }

            fecharModal();

        }catch (error) {
            console.error(error);
            alert('Não foi possível salvar o médico.');   
        }


    }        
    


    return (

        <div className="page-container">
            <header>
                <h2>Médicos</h2>
                <button type="button" onClick={abrirModalCriar}>
                    Cadastrar Médico
                </button>
            </header>

            <section className="page-contente">
                {carregando && <p>Carregando médicos...</p>}
                {erro && <p style={{color: 'red'}}>{erro}</p>}

                {!carregando && !erro && (
                    <>
                        {medicos.length === 0 ? (
                                <p>Nenhum médico cadastrado.</p>
                            ) : (
                                <table className="tabela-medicos">
                                    <thead>
                                        <tr>
                                            <th>Nome Completo</th>
                                            <th>CPF</th>
                                            <th>CRM</th>
                                            <th>Data de Nascimento</th>
                                            <th>Planos de saúde</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicos.map((medico) => (

                                            <tr key={medico.id}>
                                                <td>{medico.nomeCompleto}</td>
                                                <td>{medico.cpf}</td>
                                                <td>{medico.crm}</td>
                                                <td>{medico.dataNascimento ? new Date(medico.dataNascimento).toLocaleDateString('pt-BR'): ''}</td>
                                                <td>{formatarPlanosSaude(medico.planosSaude)}</td>
                                                <td>
                                                    <button type="button" onClick={() => abrirModalEditar(medico)}>Editar</button>
                                                    <button type="button" onClick={()=> excluirMedico(medico.id)} style={{marginLeft:'8px'}}>Excluir</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        }
                                    
                    </>
                )}

            </section>

            <MedicoFormModal
                isOpen={modalAberto}
                mode={modoModal}
                initialData={medicoSelecionado}
                onClose={fecharModal}
                onSubmit={handleSubmitMedico}
            />

        </div>

    )

}

export default Medicos;