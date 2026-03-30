// API Configuration
const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://sharp-kissie-devtools-5e818c05.koyeb.app'
  : 'http://localhost:8010';

export { API_BASE_URL };
