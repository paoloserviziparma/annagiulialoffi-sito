# Sito di Annagiulia Loffi

Sito statico in italiano e inglese, pubblicato su Netlify, con pannello di gestione su **/admin** (Decap CMS).

## Dove sono le cose
| Cartella / file | Contenuto |
| --- | --- |
| `content/impostazioni.json` | Foto, video, email, Instagram, partita IVA, crediti |
| `content/it.json`, `content/en.json` | Tutti i testi, per lingua |
| `static/` | Font, immagini, stile, pagine di ringraziamento, pannello `/admin` |
| `static/img/uploads/` | Immagini caricate dal pannello |
| `build.mjs` | Genera il sito in `dist/` (Node, nessuna dipendenza) |
| `netlify.toml` | Dice a Netlify come generare e pubblicare |

## Come si modifica
- **Dal pannello:** `https://annagiulialoffi.com/admin` → accedi con GitHub → modifica → **Pubblica**. Dopo circa un minuto il sito è aggiornato.
- **Nei titoli** la parola tra asterischi diventa corsivo malva: `Inizia *da qui*.`
- **Le parti tra parentesi quadre** `[...]` sono segnaposto da completare; finché ci sono, quelle risposte non vengono inviate a Google come dati strutturati.

## Prova in locale
```
node build.mjs
cd dist && python3 -m http.server 8000
```
