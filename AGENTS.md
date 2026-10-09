# Diretrizes para Agentes de Desenvolvimento — TEM App

Este documento estabelece as normas e procedimentos obrigatórios que todos os agentes de IA e desenvolvedores devem seguir ao implementar e validar alterações no projeto **TEM (Territorial Effectuation Monitoring)**.

---

## 1. Testes Automatizados e Evidências com Playwright (Obrigatório)

> [!IMPORTANT]
> Toda entrega que envolva alterações de interface (UI/UX), formulários, fluxo de questionário ou telas de relatório **deve obrigatoriamente** possuir testes automatizados ponta a ponta (E2E) rodando com **Playwright** e gerar **screenshots de evidência** antes da abertura ou atualização de Pull Requests.

### 🎯 Diretrizes:
1. **Framework de Teste E2E**: Usar `@playwright/test` configurado no repositório (`tests/e2e/`).
2. **Evidências Visuais (Screenshots)**:
   - Os testes devem salvar capturas de tela dos estados modificados (ex: cards de formulário ativos, carrossel de navegação, rodapé dinâmico e tela de resumo).
   - As evidências de teste devem ser devidamente documentadas na descrição do Pull Request para facilitar a revisão por pares e aprovação do PO.
3. **Não Regressão**:
   - Validar persistência de dados (autosave), fluxo de preenchimento dos 20 blocos e transição para o status "Concluído".
   - Testar o comportamento responsivo e integridade dos layouts.

---

## 2. Como Executar os Testes E2E

### Pré-requisitos:
- Ambiente de desenvolvimento ativo (via Docker / Laravel Sail na porta 8090 ou servidor local).
- Dependências Node instaladas (`npm install`).

### Comandos:
```bash
# Executar toda a suite de testes Playwright
npx playwright test

# Executar teste específico do questionário com geração de screenshots
npx playwright test tests/e2e/questionnaire.spec.js

# Executar com interface gráfica interativa (UI Mode)
npx playwright test --ui
```

---

## 3. Padrão para Pull Requests (PRs)
- **Alvo**: Sempre verificar a branch correta de integração solicitada (ex: `main` ou `develop`).
- **Conteúdo da Descrição**:
  - Resumo claro das alterações.
  - Tabela/Matriz de especificações e tokens aplicados (ex: paleta de cores por bloco).
  - Tabela de cenários de teste validados com seus respectivos status.
  - Screenshots e evidências de execução anexadas.
