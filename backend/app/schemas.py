from pydantic import BaseModel, Field

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
