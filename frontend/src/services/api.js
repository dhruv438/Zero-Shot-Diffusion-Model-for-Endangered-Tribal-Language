// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// UI <-> NLLB language code mapping
// UI ids used in the app: 'auto' | 'desia' | 'en' | 'odia'
// NLLB codes needed by backend: 'eng_Latn' | 'ory_Orya'
const UI_TO_NLLB = {
  en: 'eng_Latn',
  odia: 'ory_Orya',
};

const NLLB_TO_UI = {
  eng_Latn: 'en',
  ory_Orya: 'odia',
};

const toNllb = (uiCode) => UI_TO_NLLB[uiCode] || uiCode;
const toUi = (nllbCode) => NLLB_TO_UI[nllbCode] || nllbCode;

// Translation API
export const translateText = async (text, fromLang, toLang) => {
  try {
    // Handle 'auto' and 'desia' by detecting language first
    let effectiveFrom = fromLang;
    if (fromLang === 'auto' || fromLang === 'desia') {
      try {
        const det = await detectLanguage(text);
        if (det?.detected_language === 'en' || det?.detected_language === 'odia') {
          effectiveFrom = det.detected_language;
        }
      } catch (e) {
        // Fallback: assume English
        effectiveFrom = 'en';
      }
    }

    // Map UI codes to NLLB codes expected by backend
    const source_language = toNllb(effectiveFrom);
    const target_language = toNllb(toLang);

    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        source_language,
        target_language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

// Language Detection API
export const detectLanguage = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Language detection failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Normalize to the shape the UI expects
    // Backend returns { language_code: 'eng_Latn'|'ory_Orya', confidence }
    const uiCode = toUi(data.language_code);
    return { detected_language: uiCode, confidence: data.confidence };
  } catch (error) {
    console.error('Language detection error:', error);
    throw error;
  }
};

// Health check
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
