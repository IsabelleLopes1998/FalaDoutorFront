const API_BASE_URL = 'http://localhost:3000';

export async function fetchPlanosSaude() {
    const resp = await fetch(`${API_BASE_URL}/planos-saude`);
    if (!resp.ok) throw new Error('Erro ao buscar planos');
  const data = await resp.json();
  
  return data.map((p) => ({
    id: p.id,
    nome: p.nome,
    valor: p.valor,
  }));
    
}

