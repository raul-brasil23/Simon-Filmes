const API_URL = '';

export const getMovies = async (queryString = '') => {
    try {
        const url = `${API_URL}/movies${queryString}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }

        const data = await response.json();
        return data;
    }
    
    catch (error) {
        console.error("Erro na requisição:", error);
        return [];
    }
};