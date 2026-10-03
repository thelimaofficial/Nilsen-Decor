# Arquitetura multipágina — Nilsen Decorações em Gesso

Data: 03/10/2026. Base: `383c524`, branch `main`.

## Resumo

Os quatro redirecionamentos foram convertidos em documentos HTML independentes. A Home continua completa e visualmente preservada. Nenhum asset, dependência ou framework foi adicionado; nenhum conteúdo comercial foi inventado.

A branch estava limpa antes da implementação. A limpeza estrutural anterior já estava commitada e foi mantida. `AUDITORIA.md` permanece como registro histórico daquela etapa. Não houve commit, publicação ou alteração do histórico nesta etapa.

## Arquitetura final

| Página | Responsabilidade |
| --- | --- |
| `index.html` | Apresentação geral; mantém todas as seções, animações e IDs anteriores |
| `sobre.html` | Conteúdo institucional, fotografia/quote-card existentes, missão, visão, valores e gestão de obra |
| `servicos.html` | Cinco serviços existentes com descrições permanentemente visíveis |
| `projetos.html` | Portfólio estático com quatro artigos, imagens e textos existentes |
| `contato.html` | Telefones, e-mail, Instagram, WhatsApp, região de atendimento e horário já informados no projeto |

Cada documento inclui header, main e footer diretamente no HTML. A navegação funciona em acesso direto e não depende de fetch, injeção de componentes ou navegação simulada.

## Arquivos alterados

| Arquivo | Alteração e motivo |
| --- | --- |
| `index.html` | Links reais no header/footer e CTAs de aprofundamento; headings de seção acessíveis; correção semântica do rodapé, sem mudar sua aparência |
| `sobre.html` | Substituição do meta refresh pelo conteúdo institucional existente |
| `servicos.html` | Substituição do meta refresh por catálogo sem interação obrigatória |
| `projetos.html` | Substituição do meta refresh por quatro artigos de portfólio |
| `contato.html` | Substituição do meta refresh por canais reais de contato |
| `css/shared.css` (novo) | Pequenos complementos compartilhados: headings de rodapé, agrupamento de contatos, texto visualmente oculto e navegação sem JavaScript |
| `css/pages.css` (novo) | Fundação exclusiva das páginas internas: afastamento do header, introdução e títulos |
| `css/sobre.css` | Ajustes locais de leitura e espaçamento do conteúdo institucional |
| `css/servicos.css` | Grade responsiva e apresentação dos cinco serviços |
| `css/projetos.css` | Grade estática responsiva e headings dos artigos |
| `css/contato.css` | Organização e legibilidade dos canais existentes |
| `js/menu.js` | Entrada de foco no menu, retorno por Shift+Tab/Escape, tratamento de foco durante resize e ativação progressiva |
| `MULTIPAGE.md` (novo) | Decisões arquiteturais, validação e pendências desta etapa |

## Navegação

- Header: `index.html`, `sobre.html`, `servicos.html`, `projetos.html`, `contato.html`.
- Exatamente um item principal por página contém `aria-current="page"` e a classe visual ativa já existente.
- Footer: navegação entre páginas; serviços apontam para `servicos.html#forros`, `#paredes`, `#boiserie`, `#gesso-liso` e `#fachadas`.
- CTAs “Ver projetos”, “Ver todos os projetos”, “Ver todos os serviços” e “Saiba mais sobre a Nilsen” levam às páginas correspondentes. CTAs de orçamento continuam levando ao WhatsApp existente.
- Desktop mantém a navegação exposta. Mobile mantém o botão e a composição atuais; ao abrir, o foco vai para o primeiro link. Tab percorre os links e pode sair naturalmente; não há focus trap.
- Shift+Tab no primeiro link fecha o menu e retorna ao botão. Escape também fecha e restaura foco. Clique externo, seleção de link e saída de foco mantêm o fechamento.
- Ao cruzar o breakpoint de 900px, o foco migra entre o botão e o item atual quando o controle focado fica oculto.
- Sem JavaScript, os links mobile ficam visíveis no fluxo do documento, e o botão inoperante é ocultado. Esse fallback é intencionalmente diferente do estado aprimorado por JavaScript.

## Home

Nenhuma alteração visual identificada nos estados estabilizados: os oito pares de PNGs antes/depois são idênticos byte a byte.

Os cinco CSSs originais, `main.js`, `animations.js`, `services-scroll.js` e `layout-reference.png` mantiveram seus hashes. As mudanças de comportamento autorizadas são os destinos dos links e a navegação de foco do menu. As animações e o percurso de serviços permanecem.

IDs anteriores, incluindo `sobre`, `servicos`, `projetos`, `contato`, `valores`, `lista-servicos` e `galeria-projetos`, continuam presentes. As URLs antigas da Home permanecem resolvíveis.

## Sobre

H1 “Sobre”, apresentação institucional com o texto já existente, composição fotográfica de Sobre, quote-card, missão, visão, valores, gestão de obra e CTA existente. Nenhuma história, data ou estatística nova.

## Serviços

H1 “Serviços” e cinco artigos com H2: Forros, Paredes, Boiserie, Gesso liso e Fachadas. As descrições vêm da Home e ficam legíveis sem JavaScript. Não há accordion, sticky ou GSAP nesta página.

## Projetos

H1 “Projetos” e quatro artigos com H2, mantendo “Local 1” a “Local 4”, as descrições e as imagens atuais, inclusive o recorte SVG do Local 3. Não há botões fictícios nem ARIA de expansão em artigos estáticos.

**A expansão futura NÃO foi implementada.** Também não foram implementados modal, lightbox, carrossel, filtros, galeria avançada ou manipulação dinâmica de URLs.

## Contato

H1 “Contato”, seção de informações e seção de orçamento. Usa somente os dois telefones existentes, e-mail, Instagram, WhatsApp, região e horário já disponíveis. Não há formulário, backend, endereço inventado ou simulação de envio.

## CSS

A cascata `global.css → home.css → static.css → responsive.css → motion.css` foi preservada integralmente. `shared.css` é carregado depois dela nas cinco páginas. As internas acrescentam `pages.css` e o CSS específico correspondente.

Reutilizam-se tokens, tipografia, botões, header, footer, cards, fotos e CTA existentes. Não houve movimentação de regras, consolidação de media queries ou retirada de `!important`.

Decisão conservadora: as páginas internas carregam a base visual existente, mesmo contendo algumas regras exclusivas da Home. Isso evita extrair componentes de uma cascata sensível nesta etapa. `pages.css` não é carregado na Home; os novos estilos locais não alteram suas seções.

## JavaScript

| Página | Scripts |
| --- | --- |
| Home | `menu.js`, GSAP 3.13.0, ScrollTrigger 3.13.0, `animations.js`, `services-scroll.js`, `main.js`, na ordem anterior e com defer |
| Quatro internas | Somente `menu.js`, com defer |

Não se executam inicializadores de animação da Home nas internas. Esse isolamento elimina chamadas GSAP, ScrollTriggers e ResizeObservers sem alvo nessas páginas, sem ampliar uma refatoração dos scripts existentes.

O guard de presença de menu, botão e header foi mantido. A classe `has-menu` é aplicada somente após registrar os handlers; sem o aprimoramento, a navegação permanece disponível. Existe uma única implementação do menu.

## Acessibilidade

- Um H1 por documento, headings sem saltos nos documentos testados e landmarks nativos.
- Headings de footer passaram a H2 com a mesma aparência. O heading de Informações está fora de `address`; os contatos mantêm agrupamento próprio.
- Valores e Depoimentos da Home receberam H2 visualmente ocultos usando os nomes de seção já existentes.
- Skip link direciona o foco a `main` em todas as páginas.
- `aria-current`, `aria-controls`, `aria-expanded`, nomes acessíveis e foco visível verificados.
- Enter/Espaço abrem o menu; Tab percorre a navegação; Shift+Tab/Escape retornam ao botão sem prender foco.
- Com redução de movimento, a Home mostra todas as descrições de serviços sem sticky e sem esconder texto. As internas permanecem estáticas e navegáveis.

## Testes executados

Ambiente: Chrome headless, HTTP local, viewports emulados e escala 1. Sem aparelhos físicos ou leitor de tela.

| Viewport | Cinco páginas: acesso/layout | Home: PNG antes/depois | Cinco páginas: reduced motion |
| --- | --- | --- | --- |
| 1920 × 1080 | OK | Idêntico | OK |
| 1440 × 900 | OK | Idêntico | OK |
| 1366 × 768 | OK | Idêntico | OK |
| 1024 × 768 | OK | Idêntico | OK |
| 768 × 1024 | OK | Idêntico | OK |
| 430 × 932 | OK | Idêntico | OK |
| 390 × 844 | OK | Idêntico | OK |
| 360 × 800 | OK | Idêntico | OK |

- 40 combinações normais e 40 com redução de movimento; nenhum overflow horizontal da página, imagem quebrada, ID duplicado ou heading dentro de address.
- Zero exceções, console.error ou avisos da aplicação nos 40 acessos diretos. Internas sem GSAP/ScrollTrigger e sem scripts da Home.
- Header/footer comparados entre os documentos: equivalentes, exceto estado ativo do header. Todos os links locais e fragmentos resolvem para arquivos/IDs existentes.
- Menu testado nas quatro larguras até 900px em todas as páginas; verificação final repetida após ajuste de resize. Skip links e transferência de foco no breakpoint passaram nas cinco páginas.
- Ciclo real de navegação via Enter entre as cinco páginas em 1440px e 390px. Os quatro fragmentos antigos da Home foram acessados em desktop e mobile.
- Navegação exposta com JavaScript desativado nas cinco páginas, em 390px; sem overflow, com conteúdo e links disponíveis. O catálogo de serviços continua completo.
- Um listener click no toggle, um keydown/click no menu e um focusout no header por documento: sem multiplicação observada.
- Home: progressão de serviços 0 → 1 → 2 → 3 → 4 → 0; três reinicializações simuladas mantiveram dez ScrollTriggers e um track. Isso não representa um teste real de BFCache nem um perfil prolongado de memória.
- Capturas integrais das quatro internas nas oito resoluções; revisão visual desktop/mobile de cada uma. Comparação da Home em estados estabilizados, sem promessa de equivalência de cada frame de animação.
- `git diff --check` e análise sintática dos quatro scripts passaram.

Evidências locais, ignoradas pelo Git: `.tmp-edge/multipage-evidence/`. Incluem `before-*.png`, `after-*.png`, capturas de cada página, `home-comparison.json`, `pages.json`, `static-audit.json`, `keyboard*.json`, `navigation.json`, `no-js.json`, `reduced-motion.json`, `legacy-anchors.json`, `accessibility-final.json`, `home-motion.json` e `preserved-hashes.json`.

## Conteúdo ainda necessário do cliente

- Fotografias originais aprovadas para substituir futuramente os recortes da referência e completar os projetos.
- Nomes reais dos quatro projetos, localizações autorizadas, descrições e serviços executados em cada obra.
- Depoimentos reais autorizados e identificação permitida de seus autores; “Pessoa 1” permanece na Home.
- Material institucional adicional aprovado para aprofundar Sobre, sem inventar histórico, equipe ou certificações.

## Riscos restantes

- `layout-reference.png` continua pesado e agora também é reutilizado nas páginas Sobre e Projetos. O texto do Local 3 está incorporado ao recorte e escala com a imagem.
- Conteúdo provisório de projetos/depoimentos e textos pequenos de componentes herdados permanecem.
- A cascata visual ainda depende de overrides e da ordem de carregamento. Header/footer são repetidos deliberadamente; futuras mudanças precisam ser sincronizadas nos cinco documentos.
- Fontes externas e bibliotecas da Home dependem de rede. Sem JS, a prévia de serviços da Home mantém o comportamento anterior, enquanto a página Serviços oferece todas as descrições.
- O favicon implícito continua ausente. Perfis antigos continuam no histórico Git, conforme a auditoria anterior; nada foi reescrito.
- Validação realizada em Chrome; não houve teste em Safari/Firefox, leitor de tela ou aparelho físico. Os contatos externos foram preservados, sem envio de mensagens ou validação de titularidade.

## Próxima etapa recomendada

Reunir e validar o material real do cliente para aprofundar as páginas internas e planejar a substituição dos dois recortes de referência. A expansão animada dos projetos deve permanecer em etapa própria, após definição do conteúdo. Nenhuma dessas etapas foi iniciada.
