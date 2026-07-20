import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.error(e);
  }
}
run();
