from fastapi import FastAPI, HTTPException
import logging
import traceback
from fastapi.middleware.cors import CORSMiddleware
from .schemas import TranslateRequest, TranslateResponse, DetectRequest, DetectResponse
from .model import (
    translate,
    MODEL_NAME,
    ODIA_CODE,
    ENGLISH_CODE,
    detect_language,
    list_supported_language_codes,
)

app = FastAPI(title="NLLB English↔Odia Translation API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

API_PREFIX = "/api"

@app.get(f"{API_PREFIX}/health")
async def health():
    return {"status": "ok"}

@app.get(f"{API_PREFIX}/languages")
async def languages():
    return {"supported": list_supported_language_codes(), "model": MODEL_NAME}

@app.post(f"{API_PREFIX}/translate", response_model=TranslateResponse)
async def translate_generic(req: TranslateRequest):
    try:
        translated = translate(req.text, req.source_language, req.target_language)
        return TranslateResponse(
            translated_text=translated,
            model=MODEL_NAME,
            source_language=req.source_language,
            target_language=req.target_language
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logging.getLogger("uvicorn.error").exception("Translation error")
        raise HTTPException(status_code=500, detail=f"Translation error: {e}")

@app.post(f"{API_PREFIX}/translate_eng_to_odia", response_model=TranslateResponse)
async def translate_eng_to_odia(req: TranslateRequest):
    if req.source_language != ENGLISH_CODE:
        raise HTTPException(status_code=400, detail=f"source_language must be {ENGLISH_CODE}")
    try:
        translated = translate(req.text, ENGLISH_CODE, ODIA_CODE)
    except Exception as e:
        logging.getLogger("uvicorn.error").exception("Translation error (eng→odia)")
        raise HTTPException(status_code=500, detail=f"Translation error: {e}")
    return TranslateResponse(
        translated_text=translated,
        model=MODEL_NAME,
        source_language=ENGLISH_CODE,
        target_language=ODIA_CODE
    )

@app.post(f"{API_PREFIX}/translate_odia_to_eng", response_model=TranslateResponse)
async def translate_odia_to_eng(req: TranslateRequest):
    if req.source_language != ODIA_CODE:
        raise HTTPException(status_code=400, detail=f"source_language must be {ODIA_CODE}")
    try:
        translated = translate(req.text, ODIA_CODE, ENGLISH_CODE)
    except Exception as e:
        logging.getLogger("uvicorn.error").exception("Translation error (odia→eng)")
        raise HTTPException(status_code=500, detail=f"Translation error: {e}")
    return TranslateResponse(
        translated_text=translated,
        model=MODEL_NAME,
        source_language=ODIA_CODE,
        target_language=ENGLISH_CODE
    )

@app.post(f"{API_PREFIX}/detect", response_model=DetectResponse)
async def detect(req: DetectRequest):
    code, confidence = detect_language(req.text)
    return DetectResponse(language_code=code, confidence=confidence)

# Uvicorn entry function
def get_app():
    return app

# Allow running via `python -m backend.app.main`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:get_app", host="0.0.0.0", port=5000, reload=True)
