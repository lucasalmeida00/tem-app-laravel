// assets/js/forms/identificacao-do-empreendimento-form.js
(function () {
  window.FormSchemas = window.FormSchemas || {};
  window.FormSchemas["1"] = {
        title: "",
        groups: [{
                title: "",
                color: "success",
                blocks: [{
                        titleHtml: "<span class='c-green f-number'>1.1</span> <br/> <h3 class='c-black t-title'>Qual o status do empreendimento?</h3>",
                        fields: [{
                            type: "radio",
                            name: "formalizedCompany",
                            options: [{
                                    value: "true",
                                    label: "Formal"
                                },
                                {
                                    value: "false",
                                    label: "Informal"
                                }
                            ]
                        }]
                    },
                    {
                        titleHtml: "<span class='c-green f-number'>1.2</span> <br/> <h3 class='c-black t-title'>CNPJ</h3>",
                        fields: [{
                            type: "text",
                            name: "cnpj",
                            placeholder: "00.000.000/0001-00"
                        }]
                    },
                    {
                        titleHtml: "<span class='c-green f-number'>1.3</span> <br/> <h3 class='c-black t-title'>Razão Social</h3>",
                        fields: [{
                            type: "text",
                            name: "corporateName",
                            placeholder: "Digite a Razão Social de sua empresa"
                        }]
                    }
                ]
            },
            {
                titleHtml: "<span class='c-green f-number'>1.4</span> <br/> <h3 class='c-black t-title'>Nome fantasia do seu empreendimento</h3>",
                color: "success",
                requiredMark: true,
                fields: [{
                    type: "text",
                    name: "companyNameOrTradeName",
                    placeholder: "Digite o nome da empresa ou nome fantasia"
                }]
            },
            {
                titleHtml: "<span class='c-green f-number'>1.5</span> <br/> <h3 class='c-black t-title'>Ano de criação (formal e/ou informal)</h3>",
                color: "success",
                requiredMark: true,
                fields: [{
                    type: "number",
                    name: "yearOfEstablishment",
                    placeholder: "Ex: 2024"
                }]
            },
            {
                titleHtml: "<span class='c-green f-number'>1.6</span> <br/> <h3 class='c-black t-title'>Natureza</h3>",
                color: "success",
                requiredMark: true,
                fields: [{
                    type: "select",
                    name: "companyNature",
                    placeholder: "Selecione a natureza da empresa",
                    options: [
                            { value: "fundacao", label: "FUNDAÇÃO" },
                            { value: "instituto", label: "INSTITUTO" },
                            { value: "ltda", label: "LTDA" },
                            { value: "mei", label: "MEI" },
                            { value: "ocip", label: "OCIP" },
                            { value: "os", label: "OS" },
                            { value: "outro", label: "Outro" }
                            ]
                }]
            },
            {
                titleHtml: "<span class='c-green f-number'>1.7</span> <br/> <h3 class='c-black t-title'>Setor</h3>",
                color: "success",
                requiredMark: true,
                fields: [{
                    type: "select",
                    name: "companySector",
                    placeholder: "Selecione o setor da empresa",
                    options: [
                    { value: "agro", label: "Agro" },
                    { value: "industria", label: "Indústria" },
                    { value: "internet", label: "Internet" },
                    { value: "servico", label: "Serviço" },
                    { value: "tecnologia", label: "Tecnologia" },
                    { value: "outro", label: "Outro" }
                    ]
                }]
            },
            {
                titleHtml: "<span class='c-green f-number'>1.8</span> <br/> <h3 class='c-black t-title'>Localização do empreendimento</h3>",
                color: "success",
                requiredMark: true,
                fields: [{
                    type: "select",
                    name: "companyLocation",
                    placeholder: "Selecione a localização",
                    options: [
                    { value: "", label: "" },
                    { value: "dentro_favela", label: "Dentro de favela/comunidade" },
                    { value: "fora_favela", label: "Fora de favela, mas com atuação direta em favelas/comunidades" },
                    { value: "fora_favela_sem_atuacao", label: "Fora de favela e sem atuação" },
                    { value: "outro", label: "Outro" }
                    ]
                }]
            },
            {
                titleHtml: "<span class='c-green f-number'>1.9</span> <br/> <h3 class='c-black t-title'>Endereço completo</h3>",
                color: "success",
                fields: [{
                        type: "row",
                        cols: [{
                                col: 3,
                                field: {
                                    type: "text",
                                    name: "zipCode",
                                    label: "CEP",
                                    placeholder: "00.000-000"
                                }
                            },
                            {
                                col: 9,
                                field: {
                                    type: "text",
                                    name: "street",
                                    label: "Endereço",
                                    placeholder: "Digite o endereço",
                                    required: true
                                }
                            }
                        ]
                    },
                    {
                        type: "row",
                        cols: [{
                                col: 6,
                                field: {
                                    type: "text",
                                    name: "complement",
                                    label: "Complemento",
                                    placeholder: "Complemente seu endereço"
                                }
                            },
                            {
                                col: 3,
                                field: {
                                    type: "text",
                                    name: "district",
                                    label: "Bairro",
                                    placeholder: "Informe o bairro",
                                    required: true
                                }
                            },
                            {
                                col: 3,
                                field: {
                                    type: "text",
                                    name: "city",
                                    label: "Cidade",
                                    placeholder: "Informe a cidade",
                                    required: true
                                }
                            }
                        ]
                    },
                    {
                        type: "row",
                        cols: [{
                                col: 3,
                                field: {
                                    type: "select",
                                    name: "state",
                                    label: "UF",
                                    placeholder: "Selecione a UF",
                                    required: true,
                                    options: [{
                                            value: "AC",
                                            label: "AC"
                                        }, {
                                            value: "AL",
                                            label: "AL"
                                        },
                                        {
                                            value: "AP",
                                            label: "AP"
                                        }, {
                                            value: "AM",
                                            label: "AM"
                                        },
                                        {
                                            value: "BA",
                                            label: "BA"
                                        }, {
                                            value: "CE",
                                            label: "CE"
                                        },
                                        {
                                            value: "DF",
                                            label: "DF"
                                        }, {
                                            value: "ES",
                                            label: "ES"
                                        },
                                        {
                                            value: "GO",
                                            label: "GO"
                                        }, {
                                            value: "MA",
                                            label: "MA"
                                        },
                                        {
                                            value: "MT",
                                            label: "MT"
                                        }, {
                                            value: "MS",
                                            label: "MS"
                                        },
                                        {
                                            value: "MG",
                                            label: "MG"
                                        }, {
                                            value: "PA",
                                            label: "PA"
                                        },
                                        {
                                            value: "PB",
                                            label: "PB"
                                        }, {
                                            value: "PR",
                                            label: "PR"
                                        },
                                        {
                                            value: "PE",
                                            label: "PE"
                                        }, {
                                            value: "PI",
                                            label: "PI"
                                        },
                                        {
                                            value: "RJ",
                                            label: "RJ"
                                        }, {
                                            value: "RN",
                                            label: "RN"
                                        },
                                        {
                                            value: "RS",
                                            label: "RS"
                                        }, {
                                            value: "RO",
                                            label: "RO"
                                        },
                                        {
                                            value: "RR",
                                            label: "RR"
                                        }, {
                                            value: "SC",
                                            label: "SC"
                                        },
                                        {
                                            value: "SP",
                                            label: "SP"
                                        }, {
                                            value: "SE",
                                            label: "SE"
                                        },
                                        {
                                            value: "TO",
                                            label: "TO"
                                        }
                                    ]
                                }
                            }
                            /*{
                                col: 9,
                                field: {
                                    type: "text",
                                    name: "reference",
                                    label: "Ponto de referência",
                                    placeholder: "Opcional"
                                }
                            }*/
                        ]
                    }

                ]
            },
            {
                "titleHtml": "<span class='c-green f-number'>1.10</span> <br/> <h3 class='c-black t-title'>Idade do empreendimento (em anos)</h3>",
                "color": "success",
                "fields": [{
                    "type": "number",
                    "name": "companyAgeYears",
                    "placeholder": "informe a idade em anos",
                    "required": true
                }]
            },
            {
                "titleHtml": "<span class='c-green f-number'>1.11</span> <br/> <h3 class='c-black t-title'>Área de atuação</h3>",
                "color": "success",
                "fields": [{
                    "type": "select",
                    "name": "operatingArea",
                    "placeholder": "Escolha a área de atuação",
                    "required": true,
                    "options": [
                        { "value": "ambiental", "label": "Ambiental" },
                        { "value": "social", "label": "Social" },
                        { "value": "tecnologia", "label": "Tecnologia" },
                        { "value": "outro", "label": "Outro" }
                        ]
                }]
            },
            {
                title: "",
                color: "success",
                blocks: [{
                        titleHtml: "<span class='c-green f-number'>1.12</span> <br/> <h3 class='c-black t-title'>Número de sócios</h3>",
                        fields: [{
                            type: "number",
                            name: "partnersCount",
                            placeholder: "",
                            required: true
                        }]
                    },
                    {
                        titleHtml: "<span class='c-green f-number'>1.13</span> <br/> <h3 class='c-black t-title'>Número de funcionários diretos</h3>",
                        fields: [{
                            type: "select",
                            name: "directEmployeesRange",
                            placeholder: "Selecione a faixa",
                            required: true,
                            options: [{
                                    value: "0-4",
                                    label: "0 a 4"
                                },
                                {
                                    value: "5-9",
                                    label: "5 a 9"
                                },
                                {
                                    value: "10-19",
                                    label: "10 a 19"
                                },
                                {
                                    value: "20-29",
                                    label: "20 a 29"
                                },
                                {
                                    value: "30-49",
                                    label: "30 a 49"
                                },
                                {
                                    value: "50-99",
                                    label: "50 a 99"
                                },
                                {
                                    value: "100plus",
                                    label: "A partir de 100"
                                }
                            ]
                        }]
                    }
                ]
            },

            {
                "titleHtml": "<span class='c-green f-number'>1.14</span> <br/> <h3 class='c-black t-title'>Número de faturamento Anual</h3>",
                "color": "success",
                "fields": [{
                    "type": "select",
                    "name": "annualRevenueLevel",
                    "placeholder": "Selecione o nível",
                    "required": true,
                    "options": [{
                            "value": "ate_360k",
                            "label": "Até 360,000.00 mil reais"
                        },
                        {
                            "value": "acima_360k",
                            "label": "Acima de 360,000.00 mil reais"
                        }
                    ]
                }]
            },
            {
                "titleHtml": "<span class='c-green f-number'>1.15</span> <br/> <h3 class='c-black t-title'>O empreendimento é de natureza Online, Presencial ou Híbrido?</h3>",
                "color": "success",
                "fields": [{
                    "type": "select",
                    "name": "operationMode",
                    "placeholder": "Selecione entre online, presencial ou híbrido",
                    "required": true,
                    "options": [{
                            "value": "online",
                            "label": "Online"
                        },
                        {
                            "value": "presencial",
                            "label": "Presencial"
                        },
                        {
                            "value": "hibrido",
                            "label": "Híbrido"
                        }
                    ]
                }]
            },
            {
                "titleHtml": "<span class='c-green f-number'>1.16</span> <br/> <h3 class='c-black t-title'>Redes Sociais</h3>",
                "color": "success",
                "fields": [{
                        "type": "row",
                        "cols": [{
                                "col": 4,
                                "field": {
                                    "type": "text",
                                    "name": "website",
                                    "label": "Site",
                                    "placeholder": "Digite o site"
                                }
                            },
                            {
                                "col": 4,
                                "field": {
                                    "type": "text",
                                    "name": "linkedin",
                                    "label": "Linkedin",
                                    "placeholder": "Digite o Linkedin"
                                }
                            },
                            {
                                "col": 4,
                                "field": {
                                    "type": "text",
                                    "name": "instagram",
                                    "label": "Instagram",
                                    "placeholder": "Digite o Instagram"
                                }
                            }
                        ]
                    },
                    {
                        "type": "row",
                        "cols": [{
                                "col": 4,
                                "field": {
                                    "type": "text",
                                    "name": "facebook",
                                    "label": "Facebook",
                                    "placeholder": "Digite o Facebook"
                                }
                            },
                            {
                                "col": 4,
                                "field": {
                                    "type": "text",
                                    "name": "email",
                                    "label": "E-mail",
                                    "placeholder": "Digite o E-mail"
                                }
                            },
                            {
                                "col": 4,
                                "field": {
                                    "type": "text",
                                    "name": "phone",
                                    "label": "Telefone",
                                    "placeholder": "Digite o Telefone"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
};
})();
