const API_BASE_URL = 'http://localhost:3000';

export async function fetchPlanosSaude() {
    const response = await fetch(`${API_BASE_URL}/planos-saude`);
    if (!response.ok) {
        throw new Error('Erro ao buscar planos de saúde');
    }
    return await response.json();
    
}