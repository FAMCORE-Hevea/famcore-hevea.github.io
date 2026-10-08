# FAMCORE HEVEA — Site Institucional

## Objetivo

Desenvolver e publicar o site institucional oficial da **FAMCORE HEVEA LTDA**, empresa brasileira de tecnologia especializada em soluções digitais para a **heveicultura e a cadeia produtiva da borracha natural**.

**Slogan:** Tecnologia desenvolvida por quem entende de heveicultura.

Substituir a atual página temporária “Em breve” por um site institucional completo, responsivo e público, apresentando empresa, soluções, produtos e contato. O site também deve servir como presença institucional verificável para Apple Developer e Google Play.

## Repositórios e endereços

- **Este repositório (site):** https://github.com/FAMCORE-Hevea/famcore-hevea.github.io
- **Produto — FAMCORE Hevea App:** https://github.com/FAMCORE-Hevea/FAMCORE-hevea-app
- **GitHub Pages:** https://famcore-hevea.github.io/
- **Domínio institucional:** https://famcore.com.br/
- **Contato:** contato@famcore.com.br

O agente deve estudar o repositório do aplicativo antes de descrever funcionalidades, público-alvo ou disponibilidade nas lojas. Não inventar recursos nem alegar que o app já está publicado.

## Dados cadastrais e contatos da organização

Dados institucionais da **FAMCORE HEVEA LTDA** para apresentação no site:

| Campo | Informação |
| --- | --- |
| Nome fantasia | FAMCORE HEVEA |
| Razão social | **FAMCORE HEVEA LTDA** |
| CNPJ | **23.146.485/0001-21** |
| D-U-N-S | **937043988** |
| Endereço | **Rua Brigadeiro Faria Lima, 1140, Conj. 115, São Paulo/SP, CEP 01452-001** |
| Telefone | **+55 (11) 94584-3491** |
| E-mail institucional | **contato@famcore.com.br** |
| Site institucional | **https://famcore.com.br/** |
| GitHub | **https://github.com/FAMCORE-Hevea** |

O agente deve empregar **FAMCORE HEVEA LTDA** de forma consistente no título institucional, rodapé, contato, metadados e dados estruturados. Utilizar o endereço, telefone e CNPJ desta seção como referência cadastral do projeto. Não inserir no site narrativas sobre alterações cadastrais ou histórico de atendimento das plataformas.

## 1. Contexto e posicionamento

A FAMCORE HEVEA desenvolve tecnologias e softwares orientados às necessidades reais da heveicultura, unindo conhecimento prático da atividade e desenvolvimento tecnológico.

**Posicionamento:** tecnologia especializada para a heveicultura.

A comunicação deve transmitir especialização, utilidade prática, simplicidade, confiabilidade e inovação. Não apresentar a FAMCORE como indústria de transformação de borracha ou empresa agrícola genérica.

Não inventar certificações, clientes, números de produção, datas de fundação, parceiros, depoimentos ou resultados comerciais.

## 2. Estrutura do site

### Início

- Identidade visual oficial, nome e slogan.
- Explicação objetiva do que a empresa faz.
- Áreas de atuação e destaque para produtos.
- Navegação para Empresa, Soluções/Produtos, Contato e Privacidade.
- Remover a página provisória “Em breve”.

### Empresa

- Quem é a FAMCORE HEVEA.
- Atuação tecnológica especializada em heveicultura.
- Integração entre conhecimento prático e tecnologia.
- Proposta de valor, apenas com informações confirmadas.

### Soluções e produtos

Apresentar como primeiro produto o **FAMCORE Hevea App**:

https://github.com/FAMCORE-Hevea/FAMCORE-hevea-app

O agente deverá examinar a documentação e o código acessíveis para identificar:

1. Finalidade e público-alvo reais.
2. Funcionalidades efetivamente implementadas.
3. Plataformas suportadas e situação da distribuição.
4. Telas, imagens e materiais passíveis de divulgação.
5. Links reais de acesso, documentação ou download.

Apresentar nome, objetivo, público, principais recursos comprovados e links disponíveis. Não divulgar funcionalidades planejadas como prontas. Estruturar o site para permitir mais produtos futuramente.

Se o repositório do aplicativo estiver inacessível, registrar essa limitação e solicitar documentação; não preencher as lacunas com suposições.

### Contato

- Nome oficial: **FAMCORE HEVEA LTDA**.
- E-mail institucional: **contato@famcore.com.br**.
- Domínio: **famcore.com.br**.
- Exibir CNPJ, endereço e telefone conforme **Dados cadastrais e contatos da organização**.
- Exibir os contatos em formato legível e com links `mailto:` e `tel:`.

### Privacidade e termos

Disponibilizar Política de Privacidade compatível com o tratamento **real** de dados no site e Termos de Uso, se aplicáveis. Não inventar coleta de dados, cookies ou serviços de rastreamento. Políticas de aplicativos devem ser avaliadas separadamente.

## 3. Identidade visual e experiência

- Visual moderno, minimalista, profissional e apropriado a uma empresa de tecnologia.
- Boa tipografia, hierarquia, legibilidade, contraste e espaçamento.
- Layout responsivo em desktop, tablet e smartphone.
- Navegação simples e acessibilidade básica.
- Evitar visual agrícola genérico e marketing exagerado.
- Usar os logotipos e ativos **oficiais** disponíveis; não redesenhar o símbolo sem autorização.
- Idioma principal: **português brasileiro (pt-BR)**; preparar possibilidade de internacionalização futura, sem traduções não validadas.

## 4. Tecnologia e desenvolvimento

Preservar a stack existente: **Vite, TypeScript, Tailwind CSS, Node.js 22 e npm**. Não migrar para outro framework sem justificativa técnica concreta.

### Preparar o ambiente

```bash
nvm install
nvm use
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build e prévia

```bash
npm run build
npm run preview
```

Preferir um site estático, sem dependência de backend para exibir conteúdo. Utilizar estruturas reutilizáveis, HTML semântico, acessibilidade e boa performance. Evitar dependências desnecessárias.

## 5. SEO

Implementar:

- Título, meta descrição e idioma.
- Open Graph e favicon.
- URL canônica.
- `sitemap.xml` e `robots.txt`.
- HTML semântico e hierarquia de títulos.
- Dados estruturados `Organization` (JSON-LD) apenas com informações verificadas.

A organização deve ser identificável como **FAMCORE HEVEA LTDA — empresa brasileira de tecnologia especializada em heveicultura**.

## 6. Publicação e domínio

**Repositório:** https://github.com/FAMCORE-Hevea/famcore-hevea.github.io

**Branch principal:** `main`

**GitHub Pages:** https://famcore-hevea.github.io/

**Domínio principal:** https://famcore.com.br/

O agente deverá:

1. Conferir a configuração existente do GitHub Pages e eventuais workflows.
2. Configurar ou ajustar GitHub Actions para build e publicação do Vite.
3. Garantir publicação reproduzível após commits autorizados.
4. Verificar HTTPS, navegação, CSS, imagens, scripts e links na URL pública.
5. Confirmar que o domínio personalizado `famcore.com.br` resolve corretamente para o site.
6. Preservar registros DNS utilizados por e-mail e outros serviços; **não sobrescrever a zona DNS indiscriminadamente**.
7. Respeitar o fluxo de contribuições e revisão estabelecido no repositório.

Preferir o domínio `famcore.com.br` como endereço público canônico quando estiver corretamente configurado.

## 7. Verificação empresarial

O site também deve servir como fonte institucional pública para processos de verificação da empresa junto a plataformas de aplicativos.

Exibir claramente:

- **FAMCORE HEVEA LTDA**, com CNPJ, telefone e endereço da seção cadastral.
- Descrição objetiva da atuação.
- Produtos e soluções reais.
- Contato institucional.
- Domínio próprio e conteúdo público coerente com o cadastro oficial.

O site não deve ser somente uma página “Em breve”, uma página vazia, a página de um registrador ou um redirecionamento para redes sociais. Isso não garante aprovação na Apple ou Google, que seguem seus próprios critérios.

## 8. Critérios de aceite

- Conteúdo institucional factual, sem textos fictícios ou provisórios.
- Produto descrito com base na documentação real.
- Design responsivo e acessibilidade básica.
- Navegação e links funcionando.
- Metadados corretos e privacidade adequada.
- `npm run build` concluído sem erros.
- Site efetivamente publicado e acessível por HTTPS.
- Domínio personalizado funcionando ou pendência exata documentada.
- Relatório final das alterações e verificações.

## 9. Instruções ao agente executor

1. Inspecionar código, documentação, ativos e configuração deste repositório.
2. Estudar o aplicativo no outro repositório sem modificá-lo.
3. Utilizar os dados cadastrais da FAMCORE nesta documentação e conferir os materiais oficiais de marca.
4. Planejar e implementar páginas e navegação, preservando a stack.
5. Testar build, responsividade, acessibilidade, links e SEO.
6. Publicar com as permissões e autorizações disponíveis.
7. Verificar os endereços públicos e o domínio personalizado.
8. Relatar alterações, testes, URL final e pendências.

**Restrições:** não inventar fatos ou funcionalidades; não modificar o aplicativo; não alterar DNS sem avaliação; não criar outra aplicação desnecessária; não considerar a tarefa concluída apenas porque o build passou.

## Entrega esperada

Um **site institucional completo, público, acessível por HTTPS**, publicado com GitHub Pages e preferencialmente disponível em **https://famcore.com.br/**, apresentando a FAMCORE HEVEA LTDA, seus produtos, o FAMCORE Hevea App (conforme fatos comprovados) e os canais oficiais de contato.
