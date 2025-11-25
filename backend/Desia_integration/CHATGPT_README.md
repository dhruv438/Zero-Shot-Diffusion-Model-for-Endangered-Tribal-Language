# Desia Translation API - ChatGPT Integration

## Overview

This document describes the ChatGPT-powered translation endpoints for the Desia language. The system uses OpenAI's GPT models trained with your Desia dictionary and corpus data to provide accurate translations between English, Odia, and Desia languages.

## Features

- **Context-Aware Translation**: Uses your Desia dictionary (2,874 entries) and corpus examples for better accuracy
- **Multiple Language Pairs**: 
  - English ↔ Desia
  - Odia ↔ Desia
  - All combinations supported
- **Smart Dictionary Lookup**: Automatically finds relevant dictionary entries for the input text
- **Flexible Models**: Choose between gpt-4o-mini (fast, economical) or gpt-4o (highest quality)

## Setup

### 1. Configure API Key

Add your OpenAI API key to `backend/.env`:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini  # or gpt-4o for better quality
```

### 2. Install Dependencies

```bash
cd backend
.\.venv\Scripts\Activate.ps1  # Windows
pip install openai pandas
```

### 3. Start the Server

```bash
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 5002 --reload
```

## API Endpoints

### Universal Translation Endpoint

**POST** `/api/chatgpt/translate`

Translate between any supported language pair.

**Request Body:**
```json
{
  "text": "Thank you",
  "source_language": "english",
  "target_language": "desia",
  "model": "gpt-4o-mini",
  "use_context": true
}
```

**Response:**
```json
{
  "translated_text": "ଧନ୍ୟବାଦ",
  "model": "gpt-4o-mini",
  "source_language": "english",
  "target_language": "desia",
  "method": "chatgpt"
}
```

### Specific Language Pair Endpoints

#### English to Desia
**POST** `/api/chatgpt/english_to_desia`

```json
{
  "text": "Hello, how are you?",
  "model": "gpt-4o-mini"
}
```

#### Desia to English
**POST** `/api/chatgpt/desia_to_english`

```json
{
  "text": "ତୁଇ କେମିତି ଆଚୁ?",
  "model": "gpt-4o-mini"
}
```

#### Odia to Desia
**POST** `/api/chatgpt/odia_to_desia`

```json
{
  "text": "ଅଖ",
  "model": "gpt-4o-mini"
}
```

#### Desia to Odia
**POST** `/api/chatgpt/desia_to_odia`

```json
{
  "text": "ଇରଷୁ",
  "model": "gpt-4o-mini"
}
```

## Language Codes

| Language | Code Options |
|----------|-------------|
| English | `english`, `eng_Latn`, `en` |
| Odia | `odia`, `ory_Orya`, `or` |
| Desia | `desia` |

## Request Parameters

### Required Parameters:
- `text` (string): Text to translate (minimum 1 character)
- `source_language` (string): Source language code
- `target_language` (string): Target language code

### Optional Parameters:
- `model` (string, default: "gpt-4o-mini"): OpenAI model to use
  - `gpt-4o-mini`: Fast and economical (recommended)
  - `gpt-4o`: Highest quality, slower, more expensive
- `use_context` (boolean, default: true): Enable dictionary context lookup

## How It Works

### 1. Data Loading
The system automatically loads:
- **Dictionary**: 2,874 Odia-Desia word pairs from `train/data/dict.csv`
- **Corpus**: 2,881 example sentences from `train/data/merged_texts_corrected.csv`

### 2. Context Building
When translating, the system:
1. Samples relevant dictionary entries (up to 100)
2. Includes example sentences (up to 20)
3. Searches for specific words in the input text
4. Builds a comprehensive context for ChatGPT

### 3. Translation Process
```python
# Example: Translating "Thank you" to Desia
1. Load dictionary context (50 entries)
2. Load corpus examples (10 sentences)
3. Build system prompt with context
4. Call ChatGPT with optimized parameters
5. Return clean translation
```

## Testing the API

### Using PowerShell:

```powershell
# English to Desia
$headers = @{'Content-Type' = 'application/json'}
$body = @{
    text = "Thank you"
    source_language = "english"
    target_language = "desia"
    model = "gpt-4o-mini"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:5002/api/chatgpt/translate' -Headers $headers -Body $body
```

### Using cURL:

```bash
curl -X POST http://127.0.0.1:5002/api/chatgpt/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Thank you",
    "source_language": "english",
    "target_language": "desia",
    "model": "gpt-4o-mini"
  }'
```

### Using Python:

```python
import requests

response = requests.post(
    'http://127.0.0.1:5002/api/chatgpt/translate',
    json={
        'text': 'Thank you',
        'source_language': 'english',
        'target_language': 'desia',
        'model': 'gpt-4o-mini'
    }
)

print(response.json())
```

## Cost Optimization

### Model Recommendations:

1. **Development/Testing**: Use `gpt-4o-mini`
   - Cost: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
   - Speed: Very fast
   - Quality: Excellent for most translations

2. **Production/High-Quality**: Use `gpt-4o`
   - Cost: ~$2.50 per 1M input tokens, $10 per 1M output tokens
   - Speed: Moderate
   - Quality: Best available

### Cost Estimates:
- Average translation (50 tokens): ~$0.0001 with gpt-4o-mini
- 1000 translations per day: ~$3/month with gpt-4o-mini

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `400`: Bad request (invalid parameters)
- `500`: Server error (OpenAI API error, etc.)

**Example Error Response:**
```json
{
  "detail": "ChatGPT translation error: Invalid API key"
}
```

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FastAPI       │
│   Main Router   │
└────────┬────────┘
         │
    ┌────┴─────┐
    ▼          ▼
┌─────────┐  ┌──────────────┐
│  NLLB   │  │   ChatGPT    │
│ Service │  │   Service    │
└─────────┘  └──────┬───────┘
                    │
                    ▼
         ┌──────────────────┐
         │ Desia Dictionary │
         │  & Corpus Data   │
         └──────────────────┘
```

## Advanced Usage

### Context-Aware Translation

For better accuracy with technical or domain-specific text:

```json
{
  "text": "ଅକଲ୍‌ ଗୁଢୁମ୍‌",
  "source_language": "odia",
  "target_language": "desia",
  "use_context": true  // Enables dictionary lookup
}
```

This will:
1. Search dictionary for words matching "ଅକଲ୍‌" and "ଗୁଢୁମ୍‌"
2. Include relevant entries in the prompt
3. Produce more accurate translation: "ବୁଦ୍ଧି ବାନା"

## Troubleshooting

### Issue: "ChatGPT service initialization failed"
**Solution**: Check that `OPENAI_API_KEY` is set in `.env` file

### Issue: "Translation takes too long"
**Solution**: Switch to `gpt-4o-mini` model for faster responses

### Issue: "Invalid API key error"
**Solution**: Verify your OpenAI API key is valid and has sufficient credits

### Issue: "Dictionary not loading"
**Solution**: Ensure `train/data/dict.csv` exists and is readable

## Performance Tips

1. **Batch Translations**: For multiple translations, make parallel requests
2. **Caching**: Implement client-side caching for repeated translations
3. **Model Selection**: Use gpt-4o-mini for real-time applications
4. **Context Optimization**: Set `use_context=false` for simple, common phrases

## Data Format

### Dictionary CSV Format:
```csv
cateegory,odia_word,desia_word
ଅ,ଅକଲ୍‌,ବୁଦ୍ଧି / ସୂରତା
```

### Corpus CSV Format:
```csv
odia_word,desia_word,desia_sentence
ଅକଲ୍‌,ବୁଦ୍ଧି / ସୂରତା,ତୋକେ ସୂର୍ତା ଆଚେ କି ?
```

## Next Steps

1. **Fine-tuning**: Consider fine-tuning GPT models with your Desia data for better performance
2. **Caching**: Implement Redis caching for frequently translated phrases
3. **Monitoring**: Add logging and analytics for translation quality
4. **Feedback Loop**: Collect user feedback to improve translations

## Support

For issues or questions:
- Check API logs: `backend/logs/`
- Review error messages in API responses
- Test with simple inputs first
- Verify API key and model availability

## License

This integration uses OpenAI's API and is subject to their terms of service.
