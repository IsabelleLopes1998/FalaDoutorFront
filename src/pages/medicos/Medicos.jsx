import { useEffect, useState } from "react";


function Medicos() { 


    const [medicos, setMedicos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro,setErro] = useState(null);

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


    return (

        <div className="page-container">
            <header>
                <h2>Médicos</h2>
                <button type="button">
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
                                                <td>{Array.isArray(medico.planosSaude)? medico.planosSaude.join(', '): medico.planosSaude}</td>
                                                <td>
                                                    <button type="button">Editar</button>
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
        </div>

    )

}

export default Medicos;