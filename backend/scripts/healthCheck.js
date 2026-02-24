// scripts/healthCheck.js
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function runHealthChecks() {
  console.log('🏥 Running health checks...\n');
  
  const checks = [
    { name: 'Server Health', endpoint: '/api/health' },
    { name: 'Now Playing', endpoint: '/api/now-playing' },
    { name: 'Programs', endpoint: '/api/programs?limit=1' }
  ];
  
  for (const check of checks) {
    try {
      const { data } = await axios.get(`${API_URL}${check.endpoint}`);
      console.log(`✅ ${check.name}: OK`);
    } catch (error) {
      console.log(`❌ ${check.name}: FAILED`);
      console.error(`   Error: ${error.message}`);
    }
  }
}

runHealthChecks();