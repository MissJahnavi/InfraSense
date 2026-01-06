import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

export const predictSeverity = async (imagePath, description) => {
    try {
        const formData = new FormData();
        formData.append('text', description || '');

        if (imagePath) {
            formData.append('image', fs.createReadStream(imagePath));
        }

        const response = await axios.post(ML_SERVICE_URL, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        const result = response.data;

        if (result.status === 'success' && result.data) {
            const mlData = result.data;
            return {
                severity: (mlData.final_severity || mlData.image_analysis?.severity || 'medium').toLowerCase(),
                confidence: mlData.image_analysis?.confidence || 0,
                predicted_class: 'unknown', // Not explicitly provided in the new format
                raw: result
            };
        }

        return {
            severity: 'medium',
            confidence: 0,
            predicted_class: 'unknown',
            raw: result
        };
    } catch (error) {
        console.error('ML Service Error:', error.message);
        // Fallback in case ML service is down
        return {
            severity: 'medium',
            confidence: 0,
            predicted_class: 'unknown',
            error: 'ML service unreachable'
        };
    }
};
