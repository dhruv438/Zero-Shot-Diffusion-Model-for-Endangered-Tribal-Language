/**
 * API service for Desia Translation
 * Supports both NLLB and ChatGPT-based translation endpoints
 */

const API_BASE = 'http://127.0.0.1:5002/api';

/**
 * Translate text using ChatGPT (recommended for Desia)
 */
export async function translateText(text, sourceLang, targetLang) {
  try {
    // Map language codes
    const langMap = {
      'en': 'english',
      'english': 'english',
      'odia': 'odia',
      'or': 'odia',
      'desia': 'desia'
    };

    const source = langMap[sourceLang.toLowerCase()] || sourceLang;
    const target = langMap[targetLang.toLowerCase()] || targetLang;

    // Use ChatGPT endpoint for Desia translations
    if (source === 'desia' || target === 'desia') {
      const response = await fetch(`${API_BASE}/chatgpt/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source_language: source,
          target_language: target,
          use_context: true,
          use_full_dictionary: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Translation failed: ${response.status}`);
      }

      return await response.json();
    }

    // Fall back to NLLB for English↔Odia
    const nllbLangMap = {
      'english': 'eng_Latn',
      'odia': 'ory_Orya'
    };

    const response = await fetch(`${API_BASE}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        source_language: nllbLangMap[source] || source,
        target_language: nllbLangMap[target] || target,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Translation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Translation API error:', error);
    throw error;
  }
}

/**
 * Detect language of input text
 */
export async function detectLanguage(text) {
  try {
    const response = await fetch(`${API_BASE}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Detection failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Map NLLB codes to our language IDs
    const langMap = {
      'eng_Latn': 'en',
      'ory_Orya': 'odia',
      'desia': 'desia'
    };

    return {
      detected_language: langMap[result.language_code] || result.language_code,
      confidence: result.confidence
    };
  } catch (error) {
    console.error('Language detection error:', error);
    // Default to desia if detection fails
    return { detected_language: 'desia', confidence: 0 };
  }
}

/**
 * Get list of supported languages
 */
export async function getSupportedLanguages() {
  try {
    const response = await fetch(`${API_BASE}/languages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch languages: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching languages:', error);
    return { supported: ['desia', 'english', 'odia'] };
  }
}

/**
 * Prime ChatGPT with full dictionary (optional, call once on app load)
 */
export async function primeTranslationModel() {
  try {
    const response = await fetch(`${API_BASE}/chatgpt/prime`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Priming failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Model priming error:', error);
    throw error;
  }
}

/**
 * Check API health
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error' };
  }
}
