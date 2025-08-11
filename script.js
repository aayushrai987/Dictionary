const form = document.getElementById('dictForm');
const wordInput = document.getElementById('wordInput');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = wordInput.value.trim();
  if (!word) return;

  resultDiv.innerHTML = '';
  errorDiv.textContent = '';

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error('Word not found');
    const data = await response.json();

    // Get first entry (most relevant)
    const entry = data[0];

    // Word and phonetic
    let html = `<div class="word">${entry.word}</div>`;
    if (entry.phonetic) {
      html += `<div class="phonetic">/${entry.phonetic}/</div>`;
    } else if (entry.phonetics && entry.phonetics.length > 0) {
      const phon = entry.phonetics.find(p => p.text);
      if (phon) html += `<div class="phonetic">/${phon.text}/</div>`;
    }

    // Loop through all meanings
    entry.meanings.forEach(meaning => {
      html += `<div class="meaning"><div class="partOfSpeech">${meaning.partOfSpeech}</div>`;
      meaning.definitions.forEach(def => {
        html += `<div class="definition">• ${def.definition}`;
        if (def.example) {
          html += `<div class="example">"${def.example}"</div>`;
        }
        html += `</div>`;
      });
      html += `</div>`;
    });

    resultDiv.innerHTML = html;

  } catch (error) {
    errorDiv.textContent = 'Sorry, this word was not found. Please check the spelling or try another word.';
  }
});