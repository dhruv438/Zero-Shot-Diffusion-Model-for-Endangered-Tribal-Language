"""Multi-turn conversation test using chatgpt_service without FastAPI.
Prints translations for several realistic inputs.
"""
import os
from pathlib import Path
from app.chatgpt_service import (
    translate_with_chatgpt,
    translate_with_context,
    initialize_client,
)

try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
except Exception:
    pass

MODEL = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')

initialize_client()

cases = [
    {"text": "Hello friend, how are you today? We will visit the market after lunch.", "source": "english", "target": "desia"},
    {"text": "We must preserve our forest and water for future children.", "source": "english", "target": "desia"},
    {"text": "Community cooperation brings strength and harmony.", "source": "english", "target": "desia"},
    {"text": "Traditional songs carry the memory of our elders.", "source": "english", "target": "desia"},
]

print("=== Multi-turn English -> Desia (context) ===")
for i, c in enumerate(cases, 1):
    try:
        out, model = translate_with_context(c['text'], c['source'], c['target'], model=MODEL, use_full_dictionary=False)
        print(f"{i}. EN->DESIA: {c['text']}\n   => {out}\n")
    except Exception as e:
        print(f"{i}. ERROR: {e}\n")

back_cases = [
    {"text": cases[0]['text'], "source": "english", "target": "odia"},
]
print("=== Pivot English -> Odia (context) ===")
for i, c in enumerate(back_cases, 1):
    try:
        out, model = translate_with_context(c['text'], c['source'], c['target'], model=MODEL, use_full_dictionary=False)
        print(f"{i}. EN->ODIA: {c['text']}\n   => {out}\n")
    except Exception as e:
        print(f"{i}. ERROR: {e}\n")

reverse_cases = [
    {"text": "(Desia translation from case 1 if needed for reverse test)", "source": "desia", "target": "english"},
]
print("=== Desia -> English (placeholder example) ===")
for i, c in enumerate(reverse_cases, 1):
    try:
        out, model = translate_with_context(c['text'], c['source'], c['target'], model=MODEL, use_full_dictionary=False)
        print(f"{i}. DESIA->EN: {c['text']}\n   => {out}\n")
    except Exception as e:
        print(f"{i}. ERROR: {e}\n")

print("Done.")
