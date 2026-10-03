# Auditoria técnica — Nilsen Decorações em Gesso

Data: 03/10/2026. Base: commit `a4cd123`. Escopo: higiene estrutural, sem redesign.

## Resumo executivo

Site estático funcional, sem build, gerenciador de pacotes, frameworks ou fontes locais. Nenhum arquivo de produção foi alterado. Os 38 arquivos HTML/CSS/JS/assets mantiveram seus SHA-256; os oito pares de screenshots antes/depois são idênticos byte a byte.

O principal problema corrigido foi o versionamento de perfis temporários: 1.152 arquivos de `.tmp-edge/` (64.267.333 bytes no HEAD anterior) e `debug.log`. Foram retirados somente do índice, preservando arquivos locais e histórico.

Mapa completo da produção:

| Área | Arquivos e responsabilidade |
| --- | --- |
| HTML (5) | `index.html`: página única; `sobre.html`, `servicos.html`, `projetos.html`, `contato.html`: redirecionamentos para fragmentos da página principal, com link de fallback |
| CSS ativo (5) | `global.css`: tokens/reset/base; `home.css`: componentes; `static.css`: composição aprovada e overrides; `responsive.css`: breakpoints e ajustes finais; `motion.css`: estados interativos e movimento |
| CSS reservado (4) | `sobre.css`, `servicos.css`, `projetos.css`, `contato.css`: somente comentários de reserva, sem carregamento |
| JavaScript (4) | `menu.js`: menu; `services-scroll.js`: serviços; `animations.js`: reveals/contadores; `main.js`: inicialização e descarte |
| Assets (20) | 7 SVGs de ícones, 4 PNGs de ícones, 2 logos SVG, 6 JPEGs, 1 PNG de referência; total de 7.195.168 bytes |
| Configuração | `.gitignore`; não há configuração de build, deploy, dependências ou testes no projeto original |
| Artefatos locais | `.tmp-edge/`: perfis, caches, bancos de navegador, dumps e evidências; `debug.log`: log local |

## Problemas encontrados

### Críticos

Nenhum bloqueador funcional confirmado nos cenários testados. Isso não equivale a certificação completa de produção ou acessibilidade.

### Altos

- Perfis de navegador estavam rastreados, incluindo caminhos de Cookies, History e Login Data. Tracking corrigido; os objetos antigos continuam no histórico. Não foram lidos conteúdos de credenciais ou sessões. Uma eventual publicação anterior merece revisão separada de acesso ao repositório; nenhuma reescrita de histórico foi executada.
- `assets/images/layout-reference.png` é dependência efetiva da página: 5.451.757 bytes (5,20 MiB), 2097 × 5394 px. Dois recortes usam o arquivo inteiro, sem lazy loading de `<img>`. A representação RGBA de 4 bytes/pixel teria aproximadamente 45,2 MB; isso é estimativa de raster, não medição de memória do navegador. Reuso da URL não significa necessariamente dois downloads.
- A composição depende da ordem de cinco stylesheets e de overrides extensos. Uma limpeza indiscriminada poderia alterar praticamente todas as seções.

### Médios

- Menu mobile: ao abrir pelo botão e pressionar Tab, o foco segue para o CTA da hero e o menu fecha. A navegação fica antes do botão no DOM e é acessível com Shift+Tab. Preservado por exigir decisão específica de comportamento/foco.
- `index.html`: há um `h3` dentro de `address` no rodapé. O modelo de conteúdo de `address` não permite headings; revisar a composição sem alterar seu estilo. Referência: [HTML Standard — address](https://html.spec.whatwg.org/multipage/sections.html#the-address-element).
- Os títulos dos serviços são spans, enquanto os artigos ganham `role="button"`; valores não têm heading próprio de nível 2. A estrutura funciona, mas merece revisão com leitor de tela e anúncio das descrições.
- `services-scroll.js` pressupõe a presença de descrição, título, ponto e eixo. Esses nós existem hoje; uma alteração futura incompleta no markup pode causar exceção. O descarte também remove IDs/atributos em vez de restaurar valores arbitrários anteriores. Não houve erro com o DOM atual.
- Sem JavaScript, o CSS conserva apenas a descrição do serviço ativo. O fallback sem JS não foi ampliado nesta etapa.
- Textos como “Local 1” e depoimentos repetidos de “Pessoa 1” parecem provisórios. Conteúdo comercial mantido integralmente.

### Baixos

- Dois pares de JPEGs idênticos, sete SVGs sem referência externa e quatro CSSs reservados.
- Seletores legados e media queries repetidas; detalhes na seção CSS.
- Requisição automática do navegador a `/favicon.ico` retorna 404 no servidor local. Não há referência explícita a favicon no HTML; não foi criado um novo asset visual.

## Alterações realizadas

| Arquivo/área | Alteração | Motivo | Risco | Resultado |
| --- | --- | --- | --- | --- |
| `.gitignore` | Regras para perfis `.tmp-edge/` e `.tmp-chrome/`, caches, temporários, logs, dumps, metadados do SO e estado local de editores | Evitar novos artefatos locais no Git | Baixo: padrões podem ocultar futuros arquivos temporários intencionais; configurações compartilhadas de VS Code continuam rastreáveis | Verificado com `git check-ignore` |
| Índice: `.tmp-edge/**` | `git rm -r --cached` em 1.152 caminhos | Retirar perfis do versionamento | Baixo; não remove cópias locais | Zero caminhos da pasta no índice atual |
| Índice: `debug.log` | `git rm --cached` | Retirar log de desenvolvimento | Baixo; arquivo local preservado | Log ignorado e não rastreado |
| `AUDITORIA.md` | Relatório e inventário | Registrar evidências e limites para a próxima etapa | Sem impacto no site | Documento não referenciado pela página |

## Arquivos removidos

Nenhum arquivo foi apagado fisicamente. As 1.153 exclusões staged correspondem apenas à retirada do tracking dos perfis e do log. Nenhum asset foi removido.

## Arquivos preservados propositalmente

- Todos os cinco HTMLs, nove CSSs, quatro scripts e vinte assets.
- Os quatro HTMLs de redirecionamento preservam URLs de entrada existentes.
- CSSs reservados: seus comentários explicitam uso futuro de desenvolvimento.
- `assets/images/home/about.jpg` e `assets/images/projects/project-04.jpg`: não referenciados, mas conservados como acervo/referência até definição de inventário canônico.
- `assets/icons/{clock,email,instagram,maps,phone,seta,whatsapp}.svg`: não carregados por referência de arquivo; ícones visíveis usam SVG inline. Conservados como originais de desenvolvimento.
- Logos claro/escuro têm hashes diferentes e ambos são utilizados.
- `layout-reference.png`: essencial aos recortes de Sobre e Local 3. Em `index.html`, os viewBoxes são `895 1952 825 625` e `733 3778 543 385`. `static.css` estiliza os contêineres e oculta o texto HTML do Local 3 visualmente; `responsive.css` dimensiona os SVGs e os recortes. `motion.css` mantém efeitos associados ao cartão. Futuramente serão necessárias fotografias independentes para esses dois elementos e tratamento do texto embutido no recorte, preservando composição e enquadramento. Nenhuma substituição foi feita.

## Assets duplicados encontrados

| Arquivos | Tamanho por arquivo | SHA-256 idêntico |
| --- | --- | --- |
| `assets/images/home/about.jpg` ↔ `assets/images/projects/project-02.jpg` | 191.248 bytes | `f193b4ebaa7f97c0fc64a932edd8fe71f344ed35fd6da5ab7374f18494371046` |
| `assets/images/home/hero.jpg` ↔ `assets/images/projects/project-04.jpg` | 383.008 bytes | `4b321e0b83ec4a1ba83b04d2057df161f16c57884ce7c5138037b222a7c564cc` |

`project-02.jpg` e `hero.jpg` são usados. As outras duas cópias não têm referência em HTML/CSS/JS/SVG. Recomenda-se decidir nomes canônicos e destino do acervo antes de removê-las. A duplicação ocupa 574.256 bytes extras em disco; as cópias não referenciadas não adicionam download à página atual.

## CSS

- Ordem efetiva: `global → home → static → responsive → motion`; mantida.
- `static.css` redefine tokens, fonte/tamanhos, dimensões, margens, cores e layout de `global.css`/`home.css` para reproduzir a referência. Não são duplicações seguramente removíveis em bloco.
- O reset universal `animation:none!important; transition:none!important` em `static.css` é parcialmente revertido por `motion.css`. Foram encontradas 20 ocorrências textuais de `!important`: 4 global, 4 static, 12 motion. Preservadas, inclusive as de redução de movimento.
- `responsive.css` contém cinco blocos `max-width:900px` e dois `601–900px`, com ajustes progressivos de botões, quote-card, textos e cartões. Consolidar exigiria preservar ordem e especificidade.
- Repetições pontuais: `html {scroll-behavior:smooth}`, fonte do body, `height:auto` do logo, posicionamento da quote-card e alturas do cartão recortado.
- Seletores sem correspondente no HTML/JS atual: `body.menu-open`, `.site-header.is-scrolled`, `.about__media > img`, `.about__photo img`, `.project-card__reference img`. O estado de cabeçalho utilizado é `.header--scrolled`; os recortes atuais são SVG. Conservados para limpeza controlada futura.
- Ausência de correspondência num único snapshot não comprova código morto: hover, foco, menu aberto, classes GSAP e estados de movimento foram tratados como dinâmicos.
- O grande espaço na captura integral desktop decorre do percurso reservado ao sticky de serviços; a progressão real por scroll foi testada separadamente.

## JavaScript

- Quatro arquivos passaram na análise sintática com `vm.Script`; nenhuma exceção nem `console.error` da aplicação nos cenários executados.
- Nenhuma correção de produção foi necessária. Mantidos os guards de GSAP, inicialização com DOM disponível, `AbortController`, `ResizeObserver`, descarte por `pagehide`, reinicialização e `matchMedia`.
- Três reinicializações sucessivas produziram sempre 10 ScrollTriggers e um único track: sem acumulação observada. Isso não substitui um perfil de memória prolongado; eventos `pageshow` persistidos foram simulados, não um teste real de BFCache entre navegadores.
- O menu é inicializado uma vez por script `defer`; seus listeners têm duração do documento. As três APIs globais fazem a ligação entre scripts e não foram eliminadas.
- Dependências carregadas uma vez: GSAP 3.13.0 e ScrollTrigger 3.13.0 via jsDelivr; ambos têm uso confirmado. Google Fonts fornece Inter 400/500/600/700/800, carregada nos testes. Scripts usam `defer` e a ordem é adequada. Não houve alteração de versão, CDN ou dependência.
- Pontos para futura manutenção: pressupostos de DOM em serviços, comportamento de foco do menu e acesso ao conteúdo com JS indisponível.

## Git

- Estado inicial limpo, com 1.191 arquivos rastreados: 38 de produção, `.gitignore`, 1.152 arquivos de perfil e `debug.log`.
- O `.gitignore` inicial continha somente `.tmp-edge/`; ignorar não retirava os arquivos já rastreados.
- Estado após a limpeza: 39 arquivos no índice (38 de produção e `.gitignore`), 1.153 exclusões staged, `.gitignore` modificado e este relatório novo. Nenhum commit foi criado.
- `git diff --check` e `git diff --cached --check` passaram. As pastas locais e o log continuam presentes.
- Evidências desta auditoria estão em `.tmp-edge/audit-evidence/`, ignoradas. O histórico anterior permanece intacto.
- `.gitignore` controla Git, não uploads por cópia de diretório. Uma futura publicação deve selecionar os arquivos públicos e excluir perfis, logs e documentos locais.

## Testes realizados

Chrome headless local, HTTP em loopback, escala de dispositivo 1. As dimensões abaixo são viewports emulados; não houve teste em aparelhos físicos.

| Viewport | PNG antes/depois | Overflow da página | Redução de movimento |
| --- | --- | --- | --- |
| 1920 × 1080 | Idêntico | Ausente | OK |
| 1440 × 900 | Idêntico | Ausente | OK |
| 1366 × 768 | Idêntico | Ausente | OK |
| 1024 × 768 | Idêntico | Ausente | OK |
| 768 × 1024 | Idêntico | Ausente | OK |
| 430 × 932 | Idêntico | Ausente | OK |
| 390 × 844 | Idêntico | Ausente | OK |
| 360 × 800 | Idêntico | Ausente | OK |

- Capturas integrais após percorrer a página, carregar imagens lazy e estabilizar animações; comparação byte a byte. Isso cobre estados estabilizados, não cada frame de transição. Inspeção visual adicional das capturas desktop, mobile e mobile com redução de movimento.
- 38 hashes de produção intactos; nenhuma alteração de texto, fonte, espaçamento, imagem ou estilo servidos.
- IDs únicos, âncoras existentes, arquivos locais existentes; todas as dez tags `img` têm `alt`, `width` e `height`. Proporções declaradas consistentes com as imagens; recortes intencionais mantidos. Os dois SVGs fotográficos têm nome acessível.
- Links `_blank` têm `noopener noreferrer`; nenhum carregamento duplicado de biblioteca. Sem falhas de carregamento de recursos declarados; somente favicon implícito 404.
- Menu nas quatro larguras até 900px: Enter abre; Escape fecha e restaura foco; clique externo, saída de foco e seleção de link fecham; ARIA sincronizada. Limitação de Tab documentada.
- Serviços nas quatro larguras até 900px: Enter/Espaço selecionam; setas deslocam foco. Em 1440px, scroll selecionou 0 → 1 → 2 → 3 → 4 e voltou a 0; resize não duplicou tracks.
- Âncoras internas e quatro páginas de redirecionamento testadas. A âncora `#valores` foi reavaliada individualmente após estabilização do scroll suave; posição correta, cerca de 100px abaixo do topo mobile.
- Redução de movimento nas oito resoluções: nenhum track sticky, cinco descrições visíveis, sem `aria-hidden`, sem papéis de botão inativos e `scroll-behavior:auto`.
- Destinos Instagram e Alwer não puderam ser confirmados pelo serviço externo de consulta; falha da consulta não comprova link quebrado. Não foi enviada mensagem, feita chamada ou validada titularidade de WhatsApp/e-mail/telefone.
- Evidências: `before-*.png`, `after-*.png`, `comparison.json`, `production-hashes.json`, `assets.json`, `dom-audit.json`, `css-audit.json`, `interactions.json`, `services-scroll.json`, `anchors.json`, `redirects.json`, `reduced-motion.json`, `reduced-390x844.png`, `lifecycle.json`.

## Riscos restantes

Dependência da imagem de referência, histórico com perfis de navegador, fragilidade da cascata e do contrato DOM dos serviços, foco mobile e semântica pendentes. Dependências externas exigem rede; indisponibilidade de fontes pode mudar a tipografia. Não houve teste em Firefox/Safari, leitor de tela, dispositivos físicos, auditoria de contraste completa ou medição de performance de produção. Nenhuma dessas limitações foi ocultada por mudanças cosméticas.

## Próxima etapa recomendada

Preparar a substituição controlada dos dois recortes de `layout-reference.png` por fotografias independentes, com aprovação dos assets e comparação visual nas mesmas resoluções. Planejar em seguida uma correção específica de foco/semântica. Não executado nesta etapa.
