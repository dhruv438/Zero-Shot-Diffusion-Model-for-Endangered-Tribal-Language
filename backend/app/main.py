from fastapi import FastAPI, HTTPException
import logging
import traceback
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    TranslateRequest, 
    TranslateResponse, 
    DetectRequest, 
    DetectResponse,
    ChatGPTTranslateRequest,
    ChatGPTTranslateResponse
)
from .model import (
    translate,
    MODEL_NAME,
    ODIA_CODE,
    ENGLISH_CODE,
    detect_language,
    list_supported_language_codes,
)
from .chatgpt_service import (
    translate_with_chatgpt,
    translate_with_context,
    translate_odia_to_desia_chatgpt,
    translate_desia_to_odia_chatgpt,
    translate_english_to_desia_chatgpt,
    translate_desia_to_english_chatgpt,
    initialize_client,
    prime_dictionary_guidelines,
    get_dictionary_guidelines
)

app = FastAPI(
    title="Desia Translation API", 
    version="0.2.0",
    description="Translation API with NLLB and ChatGPT support for Odia-Desia-English"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:5174", 
        "http://127.0.0.1:5174"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

API_PREFIX = "/api"

# Initialize ChatGPT client on startup
@app.on_event("startup")
async def startup_event():
    try:
        initialize_client()
        logging.info("ChatGPT service initialized successfully")
    except Exception as e:
        logging.warning(f"ChatGPT initialization failed: {e}. ChatGPT endpoints will not work.")

@app.get(f"{API_PREFIX}/health")
async def health():
    return {"status": "ok", "services": ["nllb", "chatgpt"]}

@app.get(f"{API_PREFIX}/languages")
async def languages():
    return {
        "supported": list_supported_language_codes() + ["desia"],
        "model": MODEL_NAME,
        "chatgpt_enabled": True
    }

# NLLB-based translation endpoints (existing)
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


# ============ ChatGPT-based translation endpoints ============

@app.post(f"{API_PREFIX}/chatgpt/translate", response_model=ChatGPTTranslateResponse)
async def chatgpt_translate(req: ChatGPTTranslateRequest):
    """
    Universal ChatGPT translation endpoint supporting English, Odia, and Desia
    """
    try:
        if req.use_context:
            translated, model = translate_with_context(
                req.text, 
                req.source_language, 
                req.target_language,
                model=req.model,
                use_full_dictionary=req.use_full_dictionary
            )
        else:
            translated, model = translate_with_chatgpt(
                req.text,
                req.source_language,
                req.target_language,
                model=req.model,
                use_full_dictionary=req.use_full_dictionary
            )
        
        return ChatGPTTranslateResponse(
            translated_text=translated,
            model=model,
            source_language=req.source_language,
            target_language=req.target_language,
            method="chatgpt"
        )
    except Exception as e:
        logging.getLogger("uvicorn.error").exception("ChatGPT translation error")
        raise HTTPException(status_code=500, detail=f"ChatGPT translation error: {str(e)}")

@app.post(f"{API_PREFIX}/chatgpt/prime")
async def chatgpt_prime(model: str = "gpt-4o-mini"):
    """Prime ChatGPT by summarizing full dictionary into guideline block."""
    try:
        guidelines = prime_dictionary_guidelines(model=model)
        return {"status":"ok","model":model,"guidelines_tokens_estimate":len(guidelines.split()),"guidelines_preview":guidelines[:500]}
    except Exception as e:
        logging.getLogger("uvicorn.error").exception("Priming error")
        raise HTTPException(status_code=500, detail=f"Priming error: {e}")

@app.get(f"{API_PREFIX}/chatgpt/guidelines")
async def chatgpt_guidelines():
    g = get_dictionary_guidelines()
    if not g:
        return {"primed": False, "guidelines": None}
    return {"primed": True, "guidelines_length": len(g), "guidelines": g[:800]}  # truncate for safety


@app.post(f"{API_PREFIX}/chatgpt/odia_to_desia")
async def chatgpt_odia_to_desia(req: ChatGPTTranslateRequest):
    """Translate Odia to Desia using ChatGPT"""
    try:
        translated = translate_odia_to_desia_chatgpt(req.text, model=req.model)
        return ChatGPTTranslateResponse(
            translated_text=translated,
            model=req.model,
            source_language="odia",
            target_language="desia",
            method="chatgpt"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(f"{API_PREFIX}/chatgpt/desia_to_odia")
async def chatgpt_desia_to_odia(req: ChatGPTTranslateRequest):
    """Translate Desia to Odia using ChatGPT"""
    try:
        translated = translate_desia_to_odia_chatgpt(req.text, model=req.model)
        return ChatGPTTranslateResponse(
            translated_text=translated,
            model=req.model,
            source_language="desia",
            target_language="odia",
            method="chatgpt"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(f"{API_PREFIX}/chatgpt/english_to_desia")
async def chatgpt_english_to_desia(req: ChatGPTTranslateRequest):
    """Translate English to Desia using ChatGPT"""
    try:
        translated = translate_english_to_desia_chatgpt(req.text, model=req.model)
        return ChatGPTTranslateResponse(
            translated_text=translated,
            model=req.model,
            source_language="english",
            target_language="desia",
            method="chatgpt"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(f"{API_PREFIX}/chatgpt/desia_to_english")
async def chatgpt_desia_to_english(req: ChatGPTTranslateRequest):
    """Translate Desia to English using ChatGPT"""
    try:
        translated = translate_desia_to_english_chatgpt(req.text, model=req.model)
        return ChatGPTTranslateResponse(
            translated_text=translated,
            model=req.model,
            source_language="desia",
            target_language="english",
            method="chatgpt"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Uvicorn entry function
def get_app():
    return app

# Allow running via `python -m backend.app.main`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=5002, reload=True)
