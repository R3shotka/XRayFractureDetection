import { AnalysisResponse } from '../types/analysis';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5015';

export async function analyzeImage(file: File): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/analysis/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Помилка аналізу');
    }

    return response.json();
}
