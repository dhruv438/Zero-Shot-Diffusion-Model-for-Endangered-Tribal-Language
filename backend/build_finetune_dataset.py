"""Build fine-tune JSONL datasets from dict.csv and merged_texts_corrected.csv.
Generates two files:
 - finetune_word_pairs.jsonl  (Odia→Desia and Desia→Odia)
 - finetune_sentences.jsonl   (Odia sentence fragment→Desia sentence)

Each JSONL line: {"messages":[{"role":"system","content":"You are a Desia↔Odia translator."},{"role":"user","content":"Translate Odia to Desia: <text>"},{"role":"assistant","content":"<translation>"}]}
Reverse direction uses prompt "Translate Desia to Odia: <text>".

You can later concatenate / sample these for OpenAI or open-source fine-tuning.
"""
import os
import json
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / 'train' / 'data'
OUT_WORD = Path(__file__).parent / 'finetune_word_pairs.jsonl'
OUT_SENT = Path(__file__).parent / 'finetune_sentences.jsonl'

MAX_WORD_ROWS = 4000  # safety cap
MAX_SENT_ROWS = 3000  # safety cap

def load_csv(name: str) -> pd.DataFrame:
    p = DATA_DIR / name
    if not p.exists():
        raise FileNotFoundError(f"Missing {p}")
    return pd.read_csv(p)

def sanitize(value) -> str:
    """Convert any cell value to a clean single-line string.
    Handles NaN/None and non-string types gracefully.
    """
    if value is None:
        return ''
    # pandas may give float('nan') for missing entries
    try:
        import math
        if isinstance(value, float) and math.isnan(value):
            return ''
    except Exception:
        pass
    if not isinstance(value, str):
        value = str(value)
    return value.replace('\n', ' ').strip()

def build_word_pairs(df: pd.DataFrame):
    lines = []
    count = 0
    for _, row in df.iterrows():
        odia = sanitize(row.get('odia_word',''))
        desia = sanitize(row.get('desia_word',''))
        if not odia or not desia:
            continue
        # Odia→Desia
        lines.append({
            "messages": [
                {"role":"system","content":"You are a Desia↔Odia translator."},
                {"role":"user","content":f"Translate Odia to Desia: {odia}"},
                {"role":"assistant","content":desia}
            ]
        })
        # Desia→Odia
        lines.append({
            "messages": [
                {"role":"system","content":"You are a Desia↔Odia translator."},
                {"role":"user","content":f"Translate Desia to Odia: {desia}"},
                {"role":"assistant","content":odia}
            ]
        })
        count += 1
        if count >= MAX_WORD_ROWS:
            break
    return lines

def build_sentence_pairs(df: pd.DataFrame):
    lines = []
    count = 0
    for _, row in df.iterrows():
        odia = sanitize(row.get('odia_word',''))
        desia_sent = sanitize(row.get('desia_sentence',''))
        desia_word = sanitize(row.get('desia_word',''))
        # Use sentence field if available; skip short ones
        if odia and desia_sent and len(desia_sent.split()) > 2:
            lines.append({
                "messages": [
                    {"role":"system","content":"You are a Desia↔Odia translator."},
                    {"role":"user","content":f"Translate Odia text to Desia: {odia}"},
                    {"role":"assistant","content":desia_sent}
                ]
            })
        # Optionally include word-level mapping from this file
        if odia and desia_word:
            lines.append({
                "messages": [
                    {"role":"system","content":"You are a Desia↔Odia translator."},
                    {"role":"user","content":f"Translate Odia to Desia: {odia}"},
                    {"role":"assistant","content":desia_word}
                ]
            })
        count += 1
        if count >= MAX_SENT_ROWS:
            break
    return lines

def write_jsonl(path: Path, records):
    with path.open('w', encoding='utf-8') as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')
    print(f"Wrote {path} ({len(records)} examples)")

def main():
    dict_df = load_csv('dict.csv')
    corpus_df = load_csv('merged_texts_corrected.csv')
    word_records = build_word_pairs(dict_df)
    sent_records = build_sentence_pairs(corpus_df)
    write_jsonl(OUT_WORD, word_records)
    write_jsonl(OUT_SENT, sent_records)
    print("Done. Next steps:\n - Inspect files for quality\n - Optionally merge & sample \n - Use OpenAI CLI or open-source fine-tune pipeline.")

if __name__ == '__main__':
    main()
