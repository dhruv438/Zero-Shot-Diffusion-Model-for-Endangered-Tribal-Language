"""
Comprehensive examples of using the Desia ChatGPT Translation API
"""

# ============================================================================
# Example 1: Basic Translation (English to Desia)
# ============================================================================

import requests

def example_1_basic():
    """Simple English to Desia translation"""
    print("Example 1: English → Desia")
    
    response = requests.post(
        'http://127.0.0.1:5002/api/chatgpt/translate',
        json={
            'text': 'Thank you very much',
            'source_language': 'english',
            'target_language': 'desia'
        }
    )
    
    result = response.json()
    print(f"  Input: Thank you very much")
    print(f"  Output: {result['translated_text']}")
    print(f"  Model: {result['model']}\n")


# ============================================================================
# Example 2: Using Dedicated Endpoints
# ============================================================================

def example_2_dedicated():
    """Using language-specific endpoints"""
    print("Example 2: Using Dedicated Endpoints")
    
    # Odia to Desia
    response = requests.post(
        'http://127.0.0.1:5002/api/chatgpt/odia_to_desia',
        json={'text': 'ଅକଲ୍‌'}
    )
    print(f"  Odia → Desia: {response.json()['translated_text']}")
    
    # Desia to English
    response = requests.post(
        'http://127.0.0.1:5002/api/chatgpt/desia_to_english',
        json={'text': 'ବୁଦ୍ଧି'}
    )
    print(f"  Desia → English: {response.json()['translated_text']}\n")


# ============================================================================
# Example 3: Batch Translation
# ============================================================================

def example_3_batch():
    """Translate multiple phrases"""
    print("Example 3: Batch Translation")
    
    phrases = [
        "Good morning",
        "How are you?",
        "Thank you"
    ]
    
    for phrase in phrases:
        response = requests.post(
            'http://127.0.0.1:5002/api/chatgpt/english_to_desia',
            json={'text': phrase}
        )
        print(f"  {phrase} → {response.json()['translated_text']}")
    print()


# ============================================================================
# Example 4: Context-Aware Translation
# ============================================================================

def example_4_context():
    """Compare with and without dictionary context"""
    print("Example 4: Context-Aware Translation")
    
    text = "ଅନେକ ଗୁଡ଼ିଏ"
    
    # With context
    response1 = requests.post(
        'http://127.0.0.1:5002/api/chatgpt/translate',
        json={
            'text': text,
            'source_language': 'odia',
            'target_language': 'desia',
            'use_context': True
        }
    )
    
    # Without context
    response2 = requests.post(
        'http://127.0.0.1:5002/api/chatgpt/translate',
        json={
            'text': text,
            'source_language': 'odia',
            'target_language': 'desia',
            'use_context': False
        }
    )
    
    print(f"  Input: {text}")
    print(f"  With context: {response1.json()['translated_text']}")
    print(f"  Without context: {response2.json()['translated_text']}\n")


# ============================================================================
# Example 5: Error Handling
# ============================================================================

def example_5_error_handling():
    """Proper error handling"""
    print("Example 5: Error Handling")
    
    try:
        response = requests.post(
            'http://127.0.0.1:5002/api/chatgpt/translate',
            json={
                'text': 'Test',
                'source_language': 'english',
                'target_language': 'desia'
            },
            timeout=30
        )
        
        if response.status_code == 200:
            print(f"  ✓ Success: {response.json()['translated_text']}")
        else:
            print(f"  ✗ Error {response.status_code}: {response.json()['detail']}")
            
    except requests.exceptions.Timeout:
        print("  ✗ Request timeout - try again")
    except requests.exceptions.ConnectionError:
        print("  ✗ Cannot connect - is the server running?")
    except Exception as e:
        print(f"  ✗ Unexpected error: {str(e)}")
    print()


# ============================================================================
# Example 6: Using Different Models
# ============================================================================

def example_6_models():
    """Compare different GPT models"""
    print("Example 6: Model Comparison")
    
    text = "Hello, how are you today?"
    
    for model in ['gpt-4o-mini', 'gpt-4o']:
        try:
            response = requests.post(
                'http://127.0.0.1:5002/api/chatgpt/translate',
                json={
                    'text': text,
                    'source_language': 'english',
                    'target_language': 'desia',
                    'model': model
                }
            )
            print(f"  {model}: {response.json()['translated_text']}")
        except:
            print(f"  {model}: Not available or API error")
    print()


# ============================================================================
# Example 7: Building a Translation Function
# ============================================================================

def translate(text: str, from_lang: str = 'english', to_lang: str = 'desia', 
              model: str = 'gpt-4o-mini') -> str:
    """
    Reusable translation function
    
    Args:
        text: Text to translate
        from_lang: Source language (english, odia, desia)
        to_lang: Target language (english, odia, desia)
        model: GPT model to use
    
    Returns:
        Translated text
    """
    try:
        response = requests.post(
            'http://127.0.0.1:5002/api/chatgpt/translate',
            json={
                'text': text,
                'source_language': from_lang,
                'target_language': to_lang,
                'model': model
            },
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()['translated_text']
        else:
            return f"Error: {response.json()['detail']}"
            
    except Exception as e:
        return f"Error: {str(e)}"


def example_7_reusable():
    """Using the reusable translation function"""
    print("Example 7: Reusable Function")
    
    print(f"  English → Desia: {translate('Good morning')}")
    print(f"  Desia → English: {translate('ବୁଦ୍ଧି', 'desia', 'english')}")
    print(f"  Odia → Desia: {translate('ଅଖ', 'odia', 'desia')}")
    print()


# ============================================================================
# Example 8: Interactive Translation
# ============================================================================

def example_8_interactive():
    """Simple interactive translator"""
    print("Example 8: Interactive Translator")
    print("  (Type 'quit' to exit)")
    
    lang_pairs = {
        '1': ('english', 'desia', 'English → Desia'),
        '2': ('desia', 'english', 'Desia → English'),
        '3': ('odia', 'desia', 'Odia → Desia'),
        '4': ('desia', 'odia', 'Desia → Odia')
    }
    
    while True:
        print("\n  Choose translation direction:")
        for key, (_, _, desc) in lang_pairs.items():
            print(f"    {key}. {desc}")
        
        choice = input("  Enter choice (or 'quit'): ").strip()
        
        if choice.lower() == 'quit':
            break
            
        if choice not in lang_pairs:
            print("  Invalid choice!")
            continue
        
        text = input("  Enter text to translate: ").strip()
        if not text:
            continue
        
        from_lang, to_lang, _ = lang_pairs[choice]
        result = translate(text, from_lang, to_lang)
        print(f"  → {result}")


# ============================================================================
# Example 9: Async Translation (for speed)
# ============================================================================

import asyncio
import aiohttp

async def translate_async(session, text: str, from_lang: str, to_lang: str):
    """Async translation for parallel requests"""
    async with session.post(
        'http://127.0.0.1:5002/api/chatgpt/translate',
        json={
            'text': text,
            'source_language': from_lang,
            'target_language': to_lang
        }
    ) as response:
        result = await response.json()
        return result['translated_text']


async def example_9_async():
    """Translate multiple texts in parallel"""
    print("Example 9: Async Batch Translation")
    
    texts = [
        "Hello",
        "Thank you",
        "Good morning",
        "How are you?",
        "Goodbye"
    ]
    
    async with aiohttp.ClientSession() as session:
        tasks = [
            translate_async(session, text, 'english', 'desia')
            for text in texts
        ]
        results = await asyncio.gather(*tasks)
    
    for original, translated in zip(texts, results):
        print(f"  {original} → {translated}")
    print()


# ============================================================================
# Example 10: Building a CLI Tool
# ============================================================================

def example_10_cli():
    """Simple command-line translator"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python examples.py <text> [from_lang] [to_lang]")
        print("Example: python examples.py 'Hello' english desia")
        return
    
    text = sys.argv[1]
    from_lang = sys.argv[2] if len(sys.argv) > 2 else 'english'
    to_lang = sys.argv[3] if len(sys.argv) > 3 else 'desia'
    
    result = translate(text, from_lang, to_lang)
    print(result)


# ============================================================================
# Run All Examples
# ============================================================================

def run_all_examples():
    """Run all examples"""
    print("="*70)
    print("  Desia ChatGPT Translation API - Examples")
    print("="*70)
    print()
    
    try:
        # Check if server is running
        response = requests.get('http://127.0.0.1:5002/api/health', timeout=5)
        if response.status_code != 200:
            print("❌ Server is not responding properly")
            return
    except:
        print("❌ Cannot connect to server at http://127.0.0.1:5002")
        print("\nPlease start the server first:")
        print("  cd backend")
        print("  .venv\\Scripts\\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 5002 --reload")
        return
    
    print("✓ Server is running!\n")
    
    # Run examples
    example_1_basic()
    example_2_dedicated()
    example_3_batch()
    example_4_context()
    example_5_error_handling()
    example_6_models()
    example_7_reusable()
    
    # Uncomment to run interactive or async examples
    # example_8_interactive()
    # asyncio.run(example_9_async())
    
    print("="*70)
    print("  All examples completed!")
    print("="*70)


if __name__ == "__main__":
    # If command line arguments provided, run CLI example
    import sys
    if len(sys.argv) > 1:
        example_10_cli()
    else:
        run_all_examples()
