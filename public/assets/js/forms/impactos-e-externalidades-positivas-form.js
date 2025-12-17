(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["18"] = {
    id: "card18-impactos-externalidades-positivas",
    titleHtml:
      "<span class='c-green f-number'>18</span> <br/>" +
      "<h2 class='c-black t-title'>Impactos e Externalidades Positivas</h2>",
    groups: [
      {
        // 18.1 — Principal impacto / externalidade positiva
        titleHtml:
          "<span class='c-green f-number'>18.1</span> <br/>" +
          "<h3 class='c-black t-title'>Escolha o principal impacto ou externalidade positiva gerada pelo empreendimento.</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "mainImpact",
            options: [
              { value: "empoderamento_grupos_marginalizados", label: "Empoderamento de grupos marginalizados ou vulneráveis" },
              { value: "desenvolvimento_lideres_locais", label: "Desenvolvimento de líderes locais ou de novos empreendedores" },
              { value: "geracao_trabalho_renda", label: "Geração de trabalho e renda" },
              { value: "melhoria_qualidade_vida_local", label: "Melhoria na qualidade de vida local (saúde, segurança, educação)" },
              { value: "outro", label: "Outro" }
            ]
          },
          {
            type: "text",
            name: "mainImpactOther",
            label: "Especifique:",
            placeholder: "Descreva o impacto ou externalidade positiva"
          }
        ]
      },

      {
        // 18.2 — Avaliação de impactos (empreendimentos de impacto socioambiental)
        titleHtml:
          "<span class='c-green f-number'>18.2</span> <br/>" +
          "<h3 class='c-black t-title'>Para casos de empreendimentos de impacto socioambiental, é realizada alguma avaliação de impactos do empreendimento?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "impactEvaluationPerformed",
            options: [
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" }
            ]
          },
          {
            type: "radio",
            name: "impactEvaluationType",
            label: "Qual o tipo da avaliação?",
            options: [
              { value: "formal", label: "Formal" },
              { value: "informal", label: "Informal" }
            ]
          }
        ]
      }
    ]
  };
})();
