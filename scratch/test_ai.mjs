

async function testAICopilot() {
  // Register first to get a token
  const registerRes = await fetch('http://localhost:5000/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName: 'Test', lastName: 'User', organizationName: 'Org', email: 'admin' + Date.now() + '@clustertwin.com', password: 'password123', role: 'Admin' })
  });
  
  const loginData = await registerRes.json();
  if (!loginData.token) {
    console.log("Login failed", loginData);
    return;
  }
  
  const token = loginData.token;
  
  const queries = [
    "How to increase production?",
    "Which machine needs maintenance?",
    "How can I reduce downtime?",
    "Why is energy consumption high?",
    "Give today's production summary.",
    "Show me random unknown data." // Should trigger fallback
  ];
  
  for (const q of queries) {
    console.log(`\nUser: ${q}`);
    const aiRes = await fetch('http://localhost:5000/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: q })
    });
    
    const aiData = await aiRes.json();
    console.log(`AI: ${aiData.data?.reply || aiData.error}`);
  }
}

testAICopilot();
