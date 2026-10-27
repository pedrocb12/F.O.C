# F.O.C — Financial Operational Control

<!-- PAM-CI-NOTA-INICIO -->
### Nota atual (automática) — F.O.C (controle financeiro)

[![CI](https://github.com/pedrocb12/F.O.C/actions/workflows/pam-ci.yml/badge.svg)](https://github.com/pedrocb12/F.O.C/actions/workflows/pam-ci.yml) [![Nota](https://img.shields.io/badge/Nota%20PAM%20I-MB-green)](https://github.com/pedrocb12/F.O.C/actions/workflows/pam-ci.yml)

**MB** — Muito bom · **80%** (44/55 pontos) · atualizado em 2026-10-26 16:03

| Fase | Pontos |
|------|--------|
| Fase 1 — Estrutura | 8/10 |
| Fase 2 — AsyncStorage | 14/15 |
| Fase 3 — SQLite | 22/30 |

Checklist item a item em [NOTA.md](NOTA.md) · [ver a rodada mais recente no Actions](https://github.com/pedrocb12/F.O.C/actions/workflows/pam-ci.yml)
<!-- PAM-CI-NOTA-FIM -->

Aplicativo de gestão financeira desenvolvido em grupo para a disciplina de Programação de Aplicativos Mobile I (PAM I). O F.O.C ajuda a registrar entradas e gastos, consultar o saldo e acompanhar contas em um painel simples.

## Integrantes

- Pedro Correia Borges
- Lucas Daniel Alves de Aguiar

## Recursos

- Lista de lançamentos com saldo atualizado
- Cadastro e edição de entradas e gastos
- Tela de detalhe com opção de exclusão confirmada
- Persistência local em SQLite, com importação dos dados antigos do AsyncStorage
- Dados de exemplo inseridos automaticamente no primeiro uso

## Como executar

```bash
npm install
npx expo start
```

Abra o QR Code no Expo Go ou pressione `w` no terminal para iniciar a versão web. A persistência do SQLite é destinada ao aplicativo nativo; o suporte web do `expo-sqlite` no SDK 57 ainda é experimental.

## Fichas de entrega

| Fase | Descrição | Prazo |
| --- | --- | --- |
| Fase 1 | Proposta do projeto e aplicativo com telas | Aula 20 + início do Bimestre 3 |
| Fase 2 | Formulário e persistência com AsyncStorage | 14/09/2026 |
| Fase 3 | SQLite e operações CRUD | 19/10/2026 |
| Fase 4 | Versão final e apresentação | 16/11/2026 |


---

## Colaboração por integrante

> *Excluídos: commits do professor Jackson Sá (wendelmax), `github-actions[bot]` e `dependabot[bot]`. Contagem com base em `git log --no-merges`.*

| # | Integrante | Commits | Participação |
|---|------------|---------|--------------|
| 1 | pedrocb12 | 10 | 90.9% ██████████████████░░ |
| 2 | lucasdDanielAlvesDeAguiar | 1 | 9.1% █░░░░░░░░░░░░░░░░░░░ |

**Total de commits considerados:** 11
