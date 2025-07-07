// Quick API test script
const testEndpoints = async () => {
  try {
    // Test products endpoint
    console.log('Testing products endpoint...');
    const response = await fetch('http://localhost:3001/api/products');
    const data = await response.json();
    console.log('Products:', data.success ? `Found ${data.data.length} products` : 'Failed');
    
    // Test registration endpoint
    console.log('\nTesting registration endpoint...');
    const regResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    const regData = await regResponse.json();
    console.log('Registration:', regData.success ? 'Success' : regData.message);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testEndpoints();
