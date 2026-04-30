import fs from 'fs';
import path from 'path';

const sourceDir = '_html-originais';

// Caminhos de destino
const destPagesDir = path.join('src', 'pages');
const destStylesDir = path.join('src', 'styles');
const destScriptsDir = path.join('src', 'scripts');

// Cria diretórios se não existirem
[destPagesDir, destStylesDir, destScriptsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Função para criar o nome base seguro (ex: "Minha Página.html" -> "minha-pagina")
function slugify(text) {
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, '-')           // Substitui espaços por -
    .replace(/[^\w\-]+/g, '')       // Remove caracteres especiais
    .replace(/\-\-+/g, '-')         // Substitui múltiplos - por um só
    .replace(/^-+/, '')             // Remove - do início
    .replace(/-+$/, '');            // Remove - do fim
}

if (!fs.existsSync(sourceDir)) {
  console.error(`\n❌ Erro: Diretório de origem "${sourceDir}" não encontrado.\n`);
  process.exit(1);
}

// Pega todos os arquivos HTML da pasta
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.html'));

if (files.length === 0) {
  console.log(`\n⚠️ Nenhum arquivo .html encontrado na pasta "${sourceDir}".\n`);
  process.exit(0);
}

console.log(`\n🚀 Iniciando conversão em lote de ${files.length} arquivo(s)...\n`);

let successCount = 0;

files.forEach(filename => {
  const sourceFile = path.join(sourceDir, filename);
  // O nome base será o nome do arquivo sem extensão, "slugificado"
  const rawName = filename.replace('.html', '');
  const slugSource = rawName.includes(' - ') ? rawName.split(' - ').slice(1).join(' - ') : rawName;
  const baseName = slugify(slugSource);

  const destAstroFile = path.join(destPagesDir, `${baseName}.astro`);
  const destCssFile = path.join(destStylesDir, `${baseName}.css`);
  const destJsFile = path.join(destScriptsDir, `${baseName}.js`);

  try {
    const htmlContent = fs.readFileSync(sourceFile, 'utf8');

    // Regex para extrair blocos de estilo global
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let cssBlocks = [];
    let match;
    while ((match = styleRegex.exec(htmlContent)) !== null) {
      cssBlocks.push(match[1].trim());
    }

    // Regex para extrair blocos de script inline (ignorando src)
    const scriptInlineRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
    let jsBlocks = [];
    while ((match = scriptInlineRegex.exec(htmlContent)) !== null) {
      if (match[1].trim().length > 0) { // Evita blocos vazios
          jsBlocks.push(match[1].trim());
      }
    }

    // Remove os blocos de style e script inline do HTML inteiro
    let astroBody = htmlContent;
    astroBody = astroBody.replace(styleRegex, '');
    astroBody = astroBody.replace(scriptInlineRegex, '');

    // Substitui scripts com src que precisam de is:inline
    astroBody = astroBody.replace(/<script\s+src/gi, '<script is:inline src');

    // Monta o CSS final
    let hasCss = cssBlocks.length > 0;
    if (hasCss) {
      const finalCss = `/* Estilos extraídos automaticamente de ${filename} */\n\n${cssBlocks.join('\n\n')}`;
      fs.writeFileSync(destCssFile, finalCss, 'utf8');
    }

    // Monta o JS final
    let hasJs = jsBlocks.length > 0;
    if (hasJs) {
      const finalJs = `/* Scripts extraídos automaticamente de ${filename} */\n\n${jsBlocks.join('\n\n')}`;
      fs.writeFileSync(destJsFile, finalJs, 'utf8');
    }

    // Monta o arquivo Astro final com os imports
    let astroFrontmatter = '---\n';
    astroFrontmatter += `// Componente gerado a partir de: ${filename}\n`;
    if (hasCss) {
      astroFrontmatter += `import '../styles/${baseName}.css';\n`;
    }
    astroFrontmatter += '---\n\n';

    let finalAstro = astroFrontmatter + astroBody;

    // Se houver JS extraído, injeta o import antes do </body>
    if (hasJs) {
      const jsImportBlock = `\n  <script>\n    import '../scripts/${baseName}.js';\n  </script>\n`;
      if (finalAstro.includes('</body>')) {
        finalAstro = finalAstro.replace('</body>', `${jsImportBlock}</body>`);
      } else {
        finalAstro += jsImportBlock;
      }
    }

    fs.writeFileSync(destAstroFile, finalAstro, 'utf8');
    
    console.log(`✅ [${filename}] -> Convertido para ${baseName}.astro`);
    successCount++;

  } catch (error) {
    console.error(`\n❌ Erro ao processar [${filename}]:`);
    console.error(error.message);
  }
});

console.log(`\n🎉 Processo em lote concluído! ${successCount} arquivo(s) convertido(s) com sucesso.`);
console.log('👉 Agora você pode pedir ao Claude para ajustar os formulários e detalhes em cada arquivo .astro limpo.\n');
