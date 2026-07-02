const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let openaiClient = null;

function getOpenAIClient(apiKey) {
  if (!openaiClient || apiKey) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY in .env or provide it via Settings.');
    }
    openaiClient = new OpenAI({ apiKey: key });
  }
  return openaiClient;
}

// Tone-specific instructions for richer prompt engineering
const toneInstructions = {
  formal: 'Use formal language with proper salutations and closings. Maintain a respectful and dignified tone throughout. Avoid contractions and colloquial expressions.',
  professional: 'Use clear, concise professional language. Be direct yet courteous. Include appropriate business etiquette.',
  friendly: 'Use a warm, approachable tone. Feel free to use contractions and a conversational style while remaining respectful.',
  apologetic: 'Express sincere regret and take responsibility. Be empathetic and offer a resolution or corrective action. Maintain humility throughout.',
  persuasive: 'Use compelling arguments and clear reasoning. Highlight benefits and value propositions. Include a strong call to action.',
  thankful: 'Express genuine gratitude and appreciation. Be specific about what you are thankful for. Keep the tone warm and heartfelt.',
  'follow-up': 'Reference the previous communication. Be polite but clear about the purpose of following up. Include any relevant deadlines or next steps.'
};

const systemPrompt = `You are an expert email writer. You craft clear, well-structured, and contextually appropriate emails. 
Always respond with ONLY the email content — no explanations, no markdown container (do NOT use \`\`\` or \`\`\`html or \`\`\`email), no metadata.
Format the response exactly as:
Subject: [subject line]

[email body]`;

function buildUserPrompt(topic, recipient, tone, additionalContext) {
  const toneGuide = toneInstructions[tone] || toneInstructions.professional;
  return `Write an email with the following details:

Topic: ${topic}
Recipient: ${recipient}
Tone: ${tone}

Tone Guidelines: ${toneGuide}

${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Requirements:
- Start with an appropriate greeting for the recipient
- Keep paragraphs short and scannable
- End with an appropriate sign-off
- Make it sound natural, not robotic
- Include a clear subject line`;
}

function parseEmailResponse(responseText) {
  const cleanResponse = responseText.replace(/```[a-z]*\n?/gi, '').replace(/```$/g, '').trim();
  let subject = '';
  let body = cleanResponse;

  const subjectMatch = cleanResponse.match(/^Subject:\s*(.+?)(?:\n\n|\r\n\r\n)/s);
  if (subjectMatch) {
    subject = subjectMatch[1].trim();
    body = cleanResponse.slice(subjectMatch[0].length).trim();
  }

  return { subject, body, fullText: cleanResponse };
}

async function generateWithOpenAI({ topic, recipient, tone, additionalContext, apiKey, model }) {
  const openai = getOpenAIClient(apiKey);
  const modelName = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const userPrompt = buildUserPrompt(topic, recipient, tone, additionalContext);

  const completion = await openai.chat.completions.create({
    model: modelName,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  return parseEmailResponse(completion.choices[0].message.content.trim());
}

async function generateWithGemini({ topic, recipient, tone, additionalContext, apiKey, model }) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in .env or provide it via Settings.');
  }

  const genAI = new GoogleGenerativeAI(key);
  const modelName = model || 'gemini-2.5-flash';
  const userPrompt = buildUserPrompt(topic, recipient, tone, additionalContext);

  const generativeModel = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt
  });

  const result = await generativeModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000
    }
  });

  const responseText = result.response.text().trim();
  return parseEmailResponse(responseText);
}

async function generateWithOllama({ topic, recipient, tone, additionalContext, model, localUrl }) {
  const modelName = model || 'llama3';
  const url = `${localUrl || 'http://localhost:11434'}/api/generate`;
  const userPrompt = buildUserPrompt(topic, recipient, tone, additionalContext);

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: fullPrompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama responded with status: ${response.status}`);
    }

    const data = await response.json();
    return parseEmailResponse(data.response.trim());
  } catch (error) {
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      throw new Error(`Failed to connect to local Ollama server. Make sure Ollama is running on ${localUrl || 'http://localhost:11434'}`);
    }
    throw error;
  }
}

async function generateEmail({ provider, topic, recipient, tone, additionalContext, apiKey, model, localUrl }) {
  const activeProvider = provider || 'openai';

  if (activeProvider === 'gemini') {
    return generateWithGemini({ topic, recipient, tone, additionalContext, apiKey, model });
  } else if (activeProvider === 'ollama') {
    return generateWithOllama({ topic, recipient, tone, additionalContext, model, localUrl });
  } else {
    return generateWithOpenAI({ topic, recipient, tone, additionalContext, apiKey, model });
  }
}


// Built-in email templates
const templates = [
  {
    id: 'leave-request',
    name: 'Leave Request',
    icon: '🏖️',
    topic: 'Request for leave/time off',
    recipient: 'Manager/Supervisor',
    tone: 'formal',
    context: 'Requesting personal/sick/vacation leave for specific dates.'
  },
  {
    id: 'apology',
    name: 'Apology Email',
    icon: '🙏',
    topic: 'Apology for a mistake or delay',
    recipient: '',
    tone: 'apologetic',
    context: 'Apologizing for a specific issue and explaining corrective steps.'
  },
  {
    id: 'business-proposal',
    name: 'Business Proposal',
    icon: '💼',
    topic: 'Business collaboration or proposal',
    recipient: 'Potential client/partner',
    tone: 'persuasive',
    context: 'Proposing a business deal, partnership, or service offering.'
  },
  {
    id: 'thank-you',
    name: 'Thank You Note',
    icon: '❤️',
    topic: 'Thank you for help/interview/opportunity',
    recipient: '',
    tone: 'thankful',
    context: 'Expressing gratitude for a specific action or opportunity.'
  },
  {
    id: 'follow-up',
    name: 'Follow-Up',
    icon: '🔄',
    topic: 'Following up on a previous conversation',
    recipient: '',
    tone: 'follow-up',
    context: 'Following up on a pending matter or previous discussion.'
  },
  {
    id: 'introduction',
    name: 'Self Introduction',
    icon: '👋',
    topic: 'Introducing yourself to a new team/contact',
    recipient: 'New colleague/contact',
    tone: 'friendly',
    context: 'Introducing yourself, your role, and expressing enthusiasm.'
  },
  {
    id: 'complaint',
    name: 'Complaint',
    icon: '📢',
    topic: 'Filing a formal complaint',
    recipient: 'Customer support/Management',
    tone: 'formal',
    context: 'Raising a concern about a product, service, or situation professionally.'
  }
];

module.exports = { generateEmail, templates };
