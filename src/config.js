// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://sharp-kissie-devtools-5e818c05.koyeb.app'
  : 'http://localhost:8010';

export { API_BASE_URL };