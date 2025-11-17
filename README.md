# Zero-Shot Translation Model for Desia Language

A full-stack translation application preserving the Desia tribal language from Koraput, Odisha using Meta's NLLB-200 (No Language Left Behind) model. This project provides English ↔ Odia translation as a foundation for future Desia language support.

![Translation Demo](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)

## 🌟 Features

- **English ↔ Odia Translation**: Baseline translation system using pretrained NLLB-200-distilled-600M
- **Auto Language Detection**: Automatic detection of input language
- **Modern UI**: React-based frontend with interactive animations
- **REST API**: FastAPI backend with comprehensive endpoints
- **Zero-Shot Capability**: No training data required for initial deployment
- **Extensible Architecture**: Ready for Desia language fine-tuning

## 🎯 Project Goals

1. ✅ **Phase 1 (Complete)**: Establish English ↔ Odia translation baseline
2. 🔄 **Phase 2 (Upcoming)**: Collect 350+ Desia-English-Odia sentence pairs
3. 📋 **Phase 3 (Planned)**: Fine-tune NLLB with LoRA adapters for Desia
4. 🚀 **Phase 4 (Future)**: Deploy production-ready Desia translation system

## 🏗️ Architecture

```
desia-translator/
├── backend/              # FastAPI translation service
│   ├── app/
│   │   ├── main.py      # FastAPI application & endpoints
│   │   ├── model.py     # NLLB model loading & translation
│   │   └── schemas.py   # Pydantic request/response models
│   ├── requirements.txt
│   └── README.md
├── frontend/            # React Vite application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Landing & Translate pages
│   │   └── services/    # API integration
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11
- Node.js 18+
- 4GB+ RAM (8GB recommended for model inference)
- ~1.5GB disk space for model weights

### Backend Setup

```powershell
# Navigate to project root
cd desia-translator

# Create virtual environment with Python 3.11
py -3.11 -m venv backend\.venv

# Activate virtual environment
.\backend\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r backend\requirements.txt

# Start the backend server
python -m uvicorn backend.app.main:get_app --host 127.0.0.1 --port 5002
```

The backend will be available at `http://127.0.0.1:5002`

**Note**: First translation request will download NLLB-200 model (~1.3GB). Subsequent requests use cached model.

### Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

### List Supported Languages
```http
GET /api/languages
```
Returns: `{ "supported": ["eng_Latn", "ory_Orya"], "model": "facebook/nllb-200-distilled-600M" }`

### Generic Translation
```http
POST /api/translate
Content-Type: application/json

{
  "text": "Hello world",
  "source_language": "eng_Latn",
  "target_language": "ory_Orya"
}
```

### Language Detection
```http
POST /api/detect
Content-Type: application/json

{
  "text": "ନମସ୍କାର"
}
```
Returns: `{ "language_code": "ory_Orya", "confidence": 0.95 }`

### Dedicated Endpoints
- `POST /api/translate_eng_to_odia` - English → Odia
- `POST /api/translate_odia_to_eng` - Odia → English

## 🧪 Testing the Backend

```powershell
# Test health endpoint
Invoke-RestMethod http://127.0.0.1:5002/api/health

# Test English to Odia translation
$headers = @{'Content-Type'='application/json'}
$body = '{"text":"Hello","source_language":"eng_Latn","target_language":"ory_Orya"}'
Invoke-WebRequest -Uri http://127.0.0.1:5002/api/translate -Method Post -Headers $headers -Body $body

# Test Odia to English translation
$body = '{"text":"ନମସ୍କାର","source_language":"ory_Orya","target_language":"eng_Latn"}'
Invoke-WebRequest -Uri http://127.0.0.1:5002/api/translate -Method Post -Headers $headers -Body $body
```

## 🎨 Frontend Usage

1. Open http://localhost:5173
2. Select source and target languages:
   - From: English/Odia/Desia/Auto
   - To: English/Odia
3. Enter text in the source field
4. Click "Translate" button
5. View translation in the preview area

**Auto-detect mode**: When "From" is set to "Auto" or "Desia", the system automatically detects the input language.

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env` (optional):
```env
NLLB_MODEL=facebook/nllb-200-distilled-600M
HF_HOME=/path/to/cache  # Custom HuggingFace cache location
```

### Frontend Environment Variables

`frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5002/api
```

## 🧠 Model Details

- **Base Model**: `facebook/nllb-200-distilled-600M`
- **Architecture**: Sequence-to-sequence transformer
- **Parameters**: 600M (distilled from 3.3B parameter model)
- **Language Codes**:
  - English: `eng_Latn`
  - Odia: `ory_Orya`
- **Inference**: CPU/CUDA auto-detection

## 📊 Performance

- **First Request**: 10-30 seconds (model download + inference)
- **Subsequent Requests**: 2-5 seconds (CPU) / <1 second (GPU)
- **Memory Usage**: ~2GB RAM for model + inference
- **Model Size**: 1.3GB on disk

## 🛣️ Roadmap

### Phase 2: Data Collection (Current)
- [ ] Collect 350+ Desia sentences with English and Odia translations
- [ ] Validate linguistic accuracy with native speakers
- [ ] Build training/validation/test splits

### Phase 3: Model Fine-Tuning
- [ ] Implement LoRA (Low-Rank Adaptation) for efficient fine-tuning
- [ ] Train Desia translation adapters
- [ ] Evaluate BLEU, chrF, and human evaluation metrics
- [ ] Add `/api/translate_desia` endpoint

### Phase 4: Production Deployment
- [ ] Optimize inference latency
- [ ] Add model versioning
- [ ] Implement caching layer
- [ ] Deploy to cloud infrastructure

## 🤝 Contributing

Contributions are welcome, especially for:
- Desia language data collection
- Linguistic validation
- UI/UX improvements
- Model optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Meta AI**: NLLB-200 model and research
- **HuggingFace**: Transformers library and model hub
- **Desia Community**: Linguistic guidance and cultural context

## 📞 Contact

For questions about the Desia language or collaboration opportunities, please open an issue or reach out through GitHub.

---

**Note**: This is an active research project aimed at preserving endangered tribal languages through AI technology. The current system provides a foundation for future Desia language support.
