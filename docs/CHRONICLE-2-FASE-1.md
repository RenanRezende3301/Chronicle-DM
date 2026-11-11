# Chronicle 2.0 — Fase 1: núcleo modular do sistema

## Resultado desta fase

O domínio de **Vampiro: A Máscara 5ª Edição** foi separado da interface do Progeny e incorporado ao Chronicle como o primeiro módulo de sistema. A aplicação atual ainda não importa esse módulo nas telas; portanto, esta fundação não altera o fluxo publicado nem aumenta o bundle de produção enquanto a nova ficha não for conectada.

## Contrato entre Chronicle e sistemas de jogo

O contrato está em `src/systems/contracts.ts`. Cada sistema fornece:

- uma chave estável (`vtm-v5`);
- nome para apresentação;
- schema e versão da ficha;
- criação, leitura/migração e resumo de personagem;
- catálogos;
- regras de domínio.

O registro está em `src/systems/registry.ts`. Código de campanha e persistência deve guardar `systemKey` e `schemaVersion`, sem importar detalhes internos de VTM. Isso permite adicionar outro sistema no futuro sem misturá-lo às regras de Vampiro.

## Conteúdo incorporado

O módulo `src/systems/vtm-v5` contém:

- schema de ficha v8 e migrações de compatibilidade;
- clãs, disciplinas, poderes, tipos de predador, méritos, defeitos e loresheets;
- conteúdo essencial, avançado e São Paulo;
- poderes, amálgamas, rituais e cerimônias transcendentes até o nível 10;
- atributos, habilidades, gerações, potência de sangue e maldições variantes;
- regras de XP, fome profunda, Capital Líquido, resolução de méritos, disciplinas e progressão transcendente;
- nomes e dicionários em português;
- ícones necessários pelo domínio.

As dependências de interface do Progeny (Mantine, componentes React, roteamento e `localStorage`) não foram copiadas para essa camada. O Chronicle poderá construir a própria interface sobre a API do módulo.

## Compatibilidade

Os nomes persistidos de clãs continuam usando identificadores estáveis. Por exemplo, `Ministry` e `Thin-blood` são armazenados assim, enquanto o resumo visual apresenta “Ministério” e “Sangue-Ralo”. Méritos e defeitos antigos em inglês, como `Stunning` e `Resources`, são convertidos para os nomes atuais em português ao abrir a ficha.

A função de leitura clona a entrada antes de migrá-la. Assim, validar uma exportação antiga não modifica silenciosamente o arquivo ou objeto original.

## Validação

O comando `npm run test:systems` verifica:

- registro e descoberta do sistema;
- ficha vazia válida;
- migração de campos antigos e aliases em inglês;
- leitura de exportações reais do Progeny 1.0.0 e schema v3;
- validade estrutural dos catálogos;
- presença do conteúdo transcendente e de São Paulo;
- regras comuns e transcendentes de XP;
- acesso às demais regras pela API pública do módulo.

O TypeScript estrito é validado por `npm run typecheck` apenas sobre o novo núcleo modular. O projeto atual continua em JavaScript e pode migrar gradualmente.

## Próxima fase

O próximo passo é criar a base persistente do Chronicle 2.0 no Supabase: perfis com nome público único, crônicas, participantes, convites permanentes, personagens compartilháveis, slots por sessão, ocupação transitória e permissões de ficha. Depois disso, a primeira interface de ficha será conectada ao módulo `vtm-v5`.
