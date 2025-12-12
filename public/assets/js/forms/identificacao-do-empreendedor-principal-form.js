// assets/js/forms/identificacao-do-empreendedor-principal-form.js
(function () {
  window.FormSchemas = window.FormSchemas || {};
  window.FormOptions = window.FormOptions || {};
  window.FormOptions.countriesPt = window.FormOptions.countriesPt || [];

  window.FormSchemas["2"] = {
    title: "",
    groups: [
      {
        // 2.1 — Nome
        titleHtml: "<span class='c-green f-number'>2.1</span> <br/> <h3 class='c-black t-title'>Nome</h3>",
        color: "success",
        fields: [
          {
            type: "text",
            name: "entrepreneurFullName",
            placeholder: "Digite seu nome completo",
            required: true
          }
        ]
      },
      {
        // 2.2 — Gênero
        titleHtml: "<span class='c-green f-number'>2.2</span> <br/> <h3 class='c-black t-title'>Gênero</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "entrepreneurGender",
            placeholder: "Selecione o gênero",
            required: true,
            options: [
              { value: "feminino",    label: "Feminino" },
              { value: "masculino",   label: "Masculino" },
              { value: "nao_binario", label: "Não Binário" }
            ]
          }
        ]
      },
      {
        // 2.3 — Data de nascimento
        titleHtml: "<span class='c-green f-number'>2.3</span> <br/> <h3 class='c-black t-title'>Data de nascimento</h3>",
        color: "success",
        fields: [
          {
            type: "text", // máscara no front: DD/MM/AAAA
            name: "entrepreneurBirthDate",
            placeholder: "DD/MM/AAAA",
            required: false
          }
        ]
      },
      {
        // 2.4 — Nacionalidade
        titleHtml: "<span class='c-green f-number'>2.4</span> <br/> <h3 class='c-black t-title'>Nacionalidade</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "entrepreneurNationality",
            placeholder: "Selecione a nacionalidade",
            required: true,
            options: window.FormOptions.countriesPt
          }
        ]
      },
      {
        // 2.5 — CPF
        titleHtml: "<span class='c-green f-number'>2.5</span> <br/> <h3 class='c-black t-title'>CPF</h3>",
        color: "success",
        fields: [
          {
            type: "text", // máscara no front: 000.000.000-00
            name: "entrepreneurCPF",
            placeholder: "Digite seu CPF",
            required: false
          }
        ]
      },
      {
        // 2.6 — E-mail
        titleHtml: "<span class='c-green f-number'>2.6</span> <br/> <h3 class='c-black t-title'>E-mail</h3>",
        color: "success",
        fields: [
          {
            type: "email",
            name: "entrepreneurEmail",
            placeholder: "Digite seu e-mail",
            required: false
          }
        ]
      },
      {
        // 2.7 — Celular/WhatsApp
        titleHtml: "<span class='c-green f-number'>2.7</span> <br/> <h3 class='c-black t-title'>Celular/WhatsApp</h3>",
        color: "success",
        fields: [
          {
            type: "text", // máscara no front: (00) 0000-0000 ou (00) 0 0000-0000
            name: "entrepreneurPhone",
            placeholder: "Digite seu celular/whatsapp",
            required: true
          }
        ]
      }
    ]
  };
})();
