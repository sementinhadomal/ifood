const fs = require('fs');
const files = [
  'checkout.html', 'dados.html', 'endereco.html', 'index.html',
  'orderbump.html', 'pix.html', 'processando.html', 'quiz.html',
  'sucesso.html', 'upsell-correios.html', 'upsell-iof.html',
  'upsell.html', 'verificacao.html'
];
const pixelScript = `    <script>
        window.pixelId = "697185be2058fdd08c7d7436";
        var a = document.createElement("script");
        a.setAttribute("async", "");
        a.setAttribute("defer", "");
        a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
        document.head.appendChild(a);
    </script>
`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('cdn.utmify.com.br/scripts/pixel/pixel.js')) {
    content = content.replace('</head>', pixelScript + '</head>');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Restored pixel to ${file}`);
  }
}
