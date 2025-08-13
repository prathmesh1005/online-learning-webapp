import axios from 'axios';

async function runFix() {
    try {
        const response = await axios.post('http://localhost:3000/api/temp-fix', {});
        console.log('Fix script executed successfully:', response.data);
    } catch (error) {
        console.error('Error executing fix script:', error.response ? error.response.data : error.message);
    }
}

runFix();
