export default function TranslatorPanel({
  languages,
  fromLang,
  toLang,
  onChangeFrom,
  onChangeTo,
  sourceText,
  onChangeSource,
  translatedText,
  isTranslating,
  onTranslate,
}) {
  return (
    <div className="translator-grid">
      <div className="field">
        <label htmlFor="from-lang">From</label>
        <select
          id="from-lang"
          value={fromLang}
          onChange={(e) => onChangeFrom(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="to-lang">To</label>
        <select id="to-lang" value={toLang} onChange={(e) => onChangeTo(e.target.value)}>
          {languages
            .filter((lang) => lang.id !== "auto")
            .map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
        </select>
      </div>

      <div className="field field--textarea">
        <label htmlFor="source-text">Describe the message</label>
        <textarea
          id="source-text"
          rows={5}
          placeholder="Explain the context or paste copy that needs translation..."
          value={sourceText}
          onChange={(e) => onChangeSource(e.target.value)}
        />
        <button className="primary" onClick={onTranslate} disabled={isTranslating}>
          {isTranslating ? "Translating…" : "Translate"}
        </button>
      </div>

      <div className="field field--textarea">
        <label htmlFor="translated-text">Preview</label>
        <textarea
          id="translated-text"
          rows={5}
          readOnly
          value={translatedText}
          placeholder="Your translation preview will appear here."
        />
        <small className="hint">
          Wire this area up to your backend response. We keep the state ready.
        </small>
      </div>
    </div>
  );
}

