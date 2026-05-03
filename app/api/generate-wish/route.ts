import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting map (in-memory, resets on server restart)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 20; // Max requests per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Filter requests within the time window
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, tone, language = 'english', customPrompt } = await request.json();

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!tone || !['funny', 'emotional', 'professional', 'romantic'].includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone. Must be: funny, emotional, professional, or romantic' },
        { status: 400 }
      );
    }

    const validLanguages = ['english', 'urdu', 'hindi'];
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language. Must be: english, urdu, or hindi' },
        { status: 400 }
      );
    }

    const aiProvider = process.env.AI_PROVIDER || 'openai';
    const forceTemplate = process.env.FORCE_TEMPLATE_MODE === 'true';
    let generatedWish: string;

    const systemPrompt = buildSystemPrompt(tone, language, name, customPrompt);

    if (forceTemplate) {
      console.log('Template mode forced - skipping AI');
      generatedWish = generateTemplateWish(name, tone, language);
    } else if (aiProvider === 'gemini' && process.env.GEMINI_API_KEY) {
      try {
        generatedWish = await generateWithGemini(systemPrompt);
      } catch (error) {
        console.log('Gemini failed, falling back to templates');
        generatedWish = generateTemplateWish(name, tone, language);
      }
    } else if (process.env.OPENAI_API_KEY) {
      try {
        generatedWish = await generateWithOpenAI(systemPrompt);
      } catch (error) {
        console.log('OpenAI failed, falling back to templates');
        generatedWish = generateTemplateWish(name, tone, language);
      }
    } else {
      // Fallback to template-based generation if no API keys
      generatedWish = generateTemplateWish(name, tone, language);
    }

    return NextResponse.json({ 
      wish: generatedWish,
      tone,
      language,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error generating wish:', error);
    console.error('Error details:', error?.message || 'Unknown error');
    
    // Try to use templates as last resort
    try {
      const { name, tone, language = 'english' } = await request.json();
      const fallbackWish = generateTemplateWish(name, tone, language);
      console.log('Used template fallback due to error');
      return NextResponse.json({ 
        wish: fallbackWish,
        tone,
        language,
        timestamp: new Date().toISOString(),
        note: 'Used template fallback'
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to generate wish. Please try again.', details: error?.message },
        { status: 500 }
      );
    }
  }
}

function buildSystemPrompt(tone: string, language: string, name: string, customPrompt?: string): string {
  const toneInstructions: Record<string, string> = {
    funny: 'Write a humorous, light-hearted birthday wish that will make the person smile and laugh. Include a playful joke or witty remark.',
    emotional: 'Write a heartfelt, touching birthday wish that expresses deep care, appreciation, and warm emotions. Make it sincere and meaningful.',
    professional: 'Write a respectful, professional birthday wish suitable for a colleague or business relationship. Keep it warm but maintain professional boundaries.',
    romantic: 'Write a romantic, loving birthday wish that expresses affection and admiration. Make it sweet and intimate.',
  };

  const languageInstructions: Record<string, string> = {
    english: 'Write in English.',
    urdu: 'Write in Urdu (اردو). Use beautiful, poetic expressions suitable for birthday wishes.',
    hindi: 'Write in Hindi (हिंदी). Use warm, affectionate language suitable for birthday wishes.',
  };

  let prompt = `${toneInstructions[tone]} ${languageInstructions[language]}\n\n`;
  prompt += `The birthday wish is for: ${name}\n\n`;
  prompt += 'Requirements:\n';
  prompt += '- Keep it between 2-4 sentences\n';
  prompt += '- Make it personal and engaging\n';
  prompt += '- Include birthday emojis where appropriate\n';
  prompt += '- Ensure it flows naturally and feels genuine\n';
  
  if (customPrompt) {
    prompt += `\nAdditional context: ${customPrompt}\n`;
  }
  
  prompt += '\nGenerate only the birthday wish text, nothing else.';

  return prompt;
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  try {
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('OpenAI API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 10));
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a creative writer specializing in personalized birthday wishes.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    console.log('OpenAI response received');
    return response.choices[0]?.message?.content?.trim() || 'Happy Birthday! 🎉🎂';
  } catch (error: any) {
    console.error('OpenAI API Error:', error.message);
    console.error('OpenAI Error details:', error);
    throw error;
  }
}

async function generateWithGemini(prompt: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim() || 'Happy Birthday! 🎉🎂';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

function generateTemplateWish(name: string, tone: string, language: string): string {
  const templates: Record<string, Record<string, string[]>> = {
    english: {
      funny: [
        `Happy Birthday ${name}! 🎉 Don't count the candles on your cake... you might run out of fingers! Hope your day is as amazing as you pretend to be on social media! 😄🎂`,
        `Hey ${name}! 🎈 Another year older, but hey, at least you're not as old as you'll be next year! Enjoy your special day and eat all the cake! 🍰😂`,
        `Happy Birthday ${name}! 🎊 Remember, age is just a number... a really high one in your case! Just kidding! Have a fantastic day! 🎁😄`,
      ],
      emotional: [
        `Dear ${name}, on your special day, I want you to know how much you mean to me. Your kindness, warmth, and beautiful soul make the world a better place. Wishing you a birthday filled with love and joy. 💕🎂`,
        `Happy Birthday ${name}! 🎉 Today we celebrate the amazing person you are. Your presence in our lives is a precious gift. May this year bring you endless happiness and beautiful memories. 🌟💖`,
        `${name}, on your birthday, I'm reminded of how blessed I am to know you. Your friendship is a treasure I hold dear. May your day be as wonderful as your heart. Happy Birthday! 🎈💝`,
      ],
      professional: [
        `Happy Birthday ${name}! 🎉 Wishing you continued success, good health, and prosperity in the coming year. It's a pleasure working with you. Enjoy your special day! 🎂`,
        `Warm birthday wishes to you, ${name}! 🎈 May this year bring new opportunities and achievements in your professional and personal life. Have a wonderful celebration! 🎊`,
        `Happy Birthday ${name}! 🎂 Wishing you a year ahead filled with growth, success, and meaningful accomplishments. Thank you for your dedication and hard work. 🌟`,
      ],
      romantic: [
        `Happy Birthday to the love of my life, ${name}! 💕 Every moment with you is magical. You make my heart skip a beat. Here's to celebrating you today and always! 🎂💖`,
        `My dearest ${name}, on your birthday, I fall in love with you all over again. You're my everything. Wishing you a day as beautiful as your smile. Happy Birthday! 🌹🎉`,
        `Happy Birthday ${name}! 💝 Being with you is my favorite place to be. You complete me in every way. May your day be filled with all the love you deserve! 🎈💕`,
      ],
    },
    urdu: {
      funny: [
        `جناب ${name}! سالگرہ مبارک ہو! 🎉 کیک پر موم بتیاں مت گنیں... انگلیاں کم پڑ جائیں گی! امید ہے آپ کا دن اتنا ہی شاندار ہو جتنا آپ سوشل میڈیا پر نظر آتے ہیں! 😄🎂`,
        `ارے ${name}! 🎈 ایک اور سال بڑھا، لیکن کم از کم آپ اتنے بوڑھے نہیں جتنے اگلے سال ہوں گے! اپنے خاص دن سے لطف اندوز ہوں اور سارا کیک کھا جائیں! 🍰😂`,
      ],
      emotional: [
        `پیارے ${name}، آپ کے خاص دن پر، میں چاہتا ہوں کہ آپ جانیں آپ میرے لیے کتنے اہم ہیں۔ آپ کی مہربانی، گرمجوشی اور خوبصورت روح دنیا کو بہتر جگہ بناتی ہے۔ محبت اور خوشی سے بھرا سالگرہ مبارک ہو۔ 💕🎂`,
        `سالگرہ مبارک ${name}! 🎉 آج ہم اس حیرت انگیز انسان کا جشن مناتے ہیں جو آپ ہیں۔ آپ کی موجودگی ہمارے لیے ایک قیمتی تحفہ ہے۔ اللہ کرے یہ سال آپ کے لیے بے پناہ خوشیوں لے کر آئے۔ 🌟💖`,
      ],
      professional: [
        `سالگرہ مبارک ${name}! 🎉 آئندہ سال کے لیے مسلسل کامیابی، اچھی صحت اور خوشحالی کی دعا ہے۔ آپ کے ساتھ کام کرنے میں خوشی ہوتی ہے۔ اپنے خاص دن سے لطف اندوز ہوں! 🎂`,
      ],
      romantic: [
        `میری زندگی کی محبت ${name} کو سالگرہ مبارک ہو! 💕 آپ کے ساتھ ہر لمحہ جادوئی ہے۔ آپ میرے دل کی دھڑکن ہیں۔ آج اور ہمیشہ آپ کے جشن کا یہاں سے آغاز! 🎂💖`,
      ],
    },
    hindi: {
      funny: [
        `जनाब ${name}! जन्मदिन मुबारक हो! 🎉 केक पर मोमबत्तियाँ मत गिनिए... उंगलियाँ कम पड़ जाएँगी! उम्मीद है आपका दिन वैसा ही शानदार हो जैसा आप सोशल मीडिया पर दिखते हैं! 😄🎂`,
        `अरे ${name}! 🎈 एक और साल बढ़ा, लेकिन कम से कम आप उतने बूढ़े नहीं जितने अगले साल होंगे! अपने खास दिन का आनंद लें और सारा केक खा जाएं! 🍰😂`,
      ],
      emotional: [
        `प्यारे ${name}, आपके खास दिन पर, मैं चाहता हूँ कि आप जानें आप मेरे लिए कितने महत्वपूर्ण हैं। आपकी दयालुता, गर्मजोशी और खूबसूरत आत्मा दुनिया को बेहतर जगह बनाती है। प्यार और खुशियों से भरा जन्मदिन मुबारक हो। 💕🎂`,
        `जन्मदिन मुबारक ${name}! 🎉 आज हम इस अद्भुत इंसान का जश्न मनाते हैं जो आप हैं। आपकी मौजूदगी हमारे लिए एक अनमोल तोहफा है। भगवान करे यह साल आपके लिए बेशुमार खुशियाँ लेकर आए। 🌟💖`,
      ],
      professional: [
        `जन्मदिन मुबारक ${name}! 🎉 आने वाले साल के लिए लगातार सफलता, अच्छी सेहत और समृद्धि की कामना है। आपके साथ काम करने में खुशी होती है। अपने खास दिन का आनंद लें! 🎂`,
      ],
      romantic: [
        `मेरी जिंदगी की मोहब्बत ${name} को जन्मदिन मुबारक हो! 💕 आपके साथ हर पल जादुई है। आप मेरे दिल की धड़कन हैं। आज और हमेशा आपके जश्न का यहाँ से आगाज़! 🎂💖`,
      ],
    },
  };

  const toneTemplates = templates[language][tone];
  return toneTemplates[Math.floor(Math.random() * toneTemplates.length)];
}
