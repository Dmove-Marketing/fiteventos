import { readFileSync, writeFileSync } from 'fs';

// Read original HTML as source of truth for content
const html = readFileSync('_html-originais/Casa Voss - Bio.html', 'utf8');
const htmlLines = html.split(/\r?\n/);

// Find key sections in original HTML
let styleStart = -1, styleEnd = -1;
let formStart = -1, formEnd = -1;
let wppFloatStart = -1, wppWrapEnd = -1;
let footerStart = -1, footerEnd = -1;
let scriptInlineStart = -1, scriptInlineEnd = -1;
let flatpickrScriptLine = -1;

for (let i = 0; i < htmlLines.length; i++) {
  const line = htmlLines[i].trim();
  if (line.includes('<style>') || line.includes('<style ')) styleStart = i;
  if (line.includes('</style>')) styleEnd = i;
  if (line.includes('class="bio-form-card"')) formStart = i;
  if (line.includes('</form>') && formStart > 0 && formEnd < 0) {
    // Find the closing div after </form>
    for (let j = i; j < htmlLines.length; j++) {
      if (htmlLines[j].trim() === '</div>' && j > i) { formEnd = j; break; }
    }
  }
  if (line.includes('id="wppFloatBtn"')) wppFloatStart = i;
  if (line.includes('id="wppWrap"')) {
    // Find closing of wpp-wrap
    let depth = 0;
    for (let j = i; j < htmlLines.length; j++) {
      const l = htmlLines[j];
      depth += (l.match(/<div/g) || []).length;
      depth -= (l.match(/<\/div>/g) || []).length;
      if (depth <= 0) { wppWrapEnd = j; break; }
    }
  }
  if (line.includes('class="bio-footer"')) footerStart = i;
  if (line.includes('</footer>')) footerEnd = i;
  if (line.includes('flatpickr.min.js')) flatpickrScriptLine = i;
  if (line.includes('<script>') && i > 100) scriptInlineStart = i;
}

// Find end of inline script
for (let i = scriptInlineStart + 1; i < htmlLines.length; i++) {
  if (htmlLines[i].trim() === '</script>') { scriptInlineEnd = i; break; }
}

console.log('Style:', styleStart, '-', styleEnd);
console.log('Form:', formStart, '-', formEnd);
console.log('WPP Float:', wppFloatStart, '- WPP Wrap End:', wppWrapEnd);
console.log('Footer:', footerStart, '-', footerEnd);
console.log('Flatpickr script:', flatpickrScriptLine);
console.log('Inline script:', scriptInlineStart, '-', scriptInlineEnd);

// Extract CSS content (between <style> and </style>)
const cssLines = [];
for (let i = styleStart + 1; i < styleEnd; i++) {
  cssLines.push(htmlLines[i]);
}
writeFileSync('src/styles/bio.css', '/* Bio page styles - extracted from bio.astro */\n' + cssLines.join('\n') + '\n', 'utf8');
console.log('CSS written:', cssLines.length, 'lines');

// Extract form HTML
const formLines = [];
for (let i = formStart; i <= formEnd; i++) formLines.push(htmlLines[i]);
const bioFormContent = `---\n// src/components/forms/BioForm.astro\n// Formulário de solicitação de reserva - página Bio\n---\n` + formLines.join('\n') + '\n';
writeFileSync('src/components/forms/BioForm.astro', bioFormContent, 'utf8');
console.log('BioForm written:', formLines.length, 'lines');

// Extract WhatsApp HTML (float button + overlay + wrap)
const wppLines = [];
for (let i = wppFloatStart; i <= wppWrapEnd; i++) wppLines.push(htmlLines[i]);
const bioWppContent = `---\n// src/components/ui/BioWhatsApp.astro\n// Botão flutuante e popup do WhatsApp - página Bio\n---\n` + wppLines.join('\n') + '\n';
writeFileSync('src/components/ui/BioWhatsApp.astro', bioWppContent, 'utf8');
console.log('BioWhatsApp written:', wppLines.length, 'lines');

// Build new bio.astro
const newBio = [];

// Frontmatter
newBio.push('---');
newBio.push("import '../styles/bio.css';");
newBio.push("import BioForm from '../components/forms/BioForm.astro';");
newBio.push("import BioWhatsApp from '../components/ui/BioWhatsApp.astro';");
newBio.push('---');

// DOCTYPE through links (head content without style)
for (let i = 0; i < styleStart; i++) newBio.push(htmlLines[i]);

// Close head, open body, hero section up to form
newBio.push('</head>');
// Find body and hero content between styleEnd and formStart
for (let i = styleEnd + 1; i < formStart; i++) {
  if (htmlLines[i].trim() === '</head>') continue; // skip original </head>
  newBio.push(htmlLines[i]);
}

// Insert BioForm component
newBio.push('      <BioForm />');

// Content between form end and WPP float start (closing divs for bio-content, bio-hero section)
for (let i = formEnd + 1; i < wppFloatStart; i++) newBio.push(htmlLines[i]);

// Insert BioWhatsApp component
newBio.push('  <BioWhatsApp />');
newBio.push('');

// Footer
for (let i = footerStart; i <= footerEnd; i++) newBio.push(htmlLines[i]);
newBio.push('');

// Scripts (flatpickr CDN + inline script) - convert <script> to <script is:inline>
newBio.push(htmlLines[flatpickrScriptLine].replace('<script ', '<script is:inline '));

// Inline script with is:inline
for (let i = scriptInlineStart; i <= scriptInlineEnd; i++) {
  let line = htmlLines[i];
  if (i === scriptInlineStart) line = line.replace('<script>', '<script is:inline>');
  newBio.push(line);
}

newBio.push('</body>');
newBio.push('</html>');

writeFileSync('src/pages/bio.astro', newBio.join('\n'), 'utf8');
console.log('bio.astro written:', newBio.length, 'lines');

// Verify encoding
const check = readFileSync('src/pages/bio.astro', 'utf8');
const titleMatch = check.match(/<title>(.*?)<\/title>/);
console.log('Encoding check - title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
