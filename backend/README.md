# English ↔ Odia Translation Backend (NLLB-200)

This FastAPI service provides English to Odia and Odia to English translation using Meta's `facebook/nllb-200-distilled-600M` model as a foundation for future Desia fine‑tuning.

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/languages` | List supported base language codes |
| POST | `/api/translate` | Generic translate with JSON body `{text, source_language, target_language}` |
| POST | `/api/translate_eng_to_odia` | Convenience English → Odia (source_language must be `eng_Latn`) |
| POST | `/api/translate_odia_to_eng` | Convenience Odia → English (source_language must be `ory_Orya`) |
| POST | `/api/detect` | Simple heuristic language detection |

## Language Codes
- English: `eng_Latn`
- Odia: `ory_Orya`

## Request Example
```bash
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","source_language":"eng_Latn","target_language":"ory_Orya"}'
```

Response:
```json
{
  "translated_text": "...",
  "model": "facebook/nllb-200-distilled-600M",
  "source_language": "eng_Latn",
  "target_language": "ory_Orya"
}
```

## Environment Variables
| Name | Default | Purpose |
|------|---------|---------|
| `NLLB_MODEL` | `facebook/nllb-200-distilled-600M` | Change to another NLLB checkpoint |
| `HF_HOME` | (unset) | Custom HuggingFace cache directory |

## Installation & Run
Important: Use Python 3.10 or 3.11. Python 3.14 currently lacks prebuilt wheels for `sentencepiece`, causing install failures.
```powershell
cd c:\Users\dhruv\desia-translator\backend
Remove-Item .venv -Recurse -Force -ErrorAction SilentlyContinue
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn backend.app.main:get_app --host 0.0.0.0 --port 5000 --reload
```

## Notes
- First request will download model weights (~1.3GB). Subsequent runs use cache.
- CPU translation will be slower; GPU (CUDA) is auto‑detected.
- For CUDA specific torch builds refer to https://pytorch.org/get-started/locally/

## Next (Desia Fine‑Tuning)
Later you can attach LoRA adapters and add a `/api/translate_desia` endpoint without changing existing routes.
