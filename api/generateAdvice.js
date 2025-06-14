export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage } = req.body;

  if (!userMessage || userMessage.trim() === '') {
    return res.status(400).json({ error: 'Missing input' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an English family law solicitor. You provide neutral, reliable guidance... (etc – full prompt as discussed)`
          },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: 'No response from OpenAI' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Request failed', details: error.message });
  }
}
