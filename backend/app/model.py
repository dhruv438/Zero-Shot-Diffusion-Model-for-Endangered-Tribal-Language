import os
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from typing import Tuple

MODEL_NAME = os.getenv("NLLB_MODEL", "facebook/nllb-200-distilled-600M")
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
_tokenizer = None
_model = None
_lang_code_to_id = None

def load_model() -> Tuple[AutoTokenizer, AutoModelForSeq2SeqLM]:
    global _tokenizer, _model, _lang_code_to_id
    if _tokenizer is None or _model is None:
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
        _model.to(_device)
        # Get language code mapping from tokenizer's vocabulary
        if hasattr(_tokenizer, 'lang_code_to_id'):
            _lang_code_to_id = _tokenizer.lang_code_to_id
        else:
            # Build it from the tokenizer's vocabulary
            _lang_code_to_id = {
                code: _tokenizer.convert_tokens_to_ids(code)
                for code in [ENGLISH_CODE, ODIA_CODE]
            }
    return _tokenizer, _model

def get_forced_bos_id(lang_code: str) -> int:
    tokenizer, model = load_model()
    if _lang_code_to_id and lang_code in _lang_code_to_id:
        return _lang_code_to_id[lang_code]
    # Fallback: use tokenizer's convert method
    token_id = tokenizer.convert_tokens_to_ids(lang_code)
    if token_id == tokenizer.unk_token_id:
        raise ValueError(f"Unsupported language code: {lang_code}")
    return token_id

PROMPT_PREFIX = "Translate the following text, preserving proper names and punctuation. Output only the translation.\n"

@torch.inference_mode()
def translate(text: str, source_lang: str, target_lang: str, max_length: int = 256, num_beams: int = 5) -> str:
    tokenizer, model = load_model()
    # Ensure tokenizer encodes with correct source language
    try:
        tokenizer.src_lang = source_lang
    except Exception:
        pass
    try:
        tokenizer.tgt_lang = target_lang
    except Exception:
        pass
    forced_bos_token_id = get_forced_bos_id(target_lang)
    # Construct input text
    prompt = text.strip()
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=max_length)
    inputs = {k: v.to(model.device) for k, v in inputs.items()}
    generated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=forced_bos_token_id,
        num_beams=num_beams,
        max_length=max_length,
        no_repeat_ngram_size=3
    )
    translated = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
    return translated.strip()

ODIA_CODE = "ory_Orya"
ENGLISH_CODE = "eng_Latn"

SUPPORTED_CODES = [ENGLISH_CODE, ODIA_CODE]

def list_supported_language_codes():
    return SUPPORTED_CODES

# Simple heuristic detection: check Odia Unicode block
ODIA_START = 0x0B00
ODIA_END = 0x0B7F

def detect_language(text: str) -> Tuple[str, float]:
    odia_chars = sum(1 for ch in text if ODIA_START <= ord(ch) <= ODIA_END)
    total_chars = sum(1 for ch in text if ch.isalpha()) or 1
    ratio = odia_chars / total_chars
    if ratio > 0.2:  # threshold heuristic
        return ODIA_CODE, ratio
    else:
        return ENGLISH_CODE, 1 - ratio
