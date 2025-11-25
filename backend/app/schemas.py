from pydantic import BaseModel, Field
from typing import Optional

class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Input text to translate")
    source_language: str = Field(..., description="Source language code e.g. eng_Latn")
    target_language: str = Field(..., description="Target language code e.g. ory_Orya")

class TranslateResponse(BaseModel):
    translated_text: str
    model: str
    source_language: str
    target_language: str

class DetectRequest(BaseModel):
    text: str = Field(..., min_length=1)

class DetectResponse(BaseModel):
    language_code: str
    confidence: float

# ChatGPT-specific schemas
class ChatGPTTranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Input text to translate")
    source_language: str = Field(..., description="Source language: english, odia, or desia")
    target_language: str = Field(..., description="Target language: english, odia, or desia")
    model: Optional[str] = Field(default="gpt-4o-mini", description="OpenAI model to use")
    use_context: Optional[bool] = Field(default=True, description="Use dictionary context")
    use_full_dictionary: Optional[bool] = Field(default=False, description="If true and primed, inject summarized full dictionary guidelines")

class ChatGPTTranslateResponse(BaseModel):
    translated_text: str
    model: str
    source_language: str
    target_language: str
    method: str = "chatgpt"
