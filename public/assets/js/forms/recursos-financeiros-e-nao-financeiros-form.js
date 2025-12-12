// assets/js/forms/recursos-financeiros-e-nao-financeiros-form.js
(function () {
    window.FormSchemas = window.FormSchemas || {};

    window.FormSchemas["4"] = {
        title: "",
        groups: [{
                // 4.1 — NÃO FINANCEIROS (cadeia de 5 selects; os 2..5 são injetados via JS)
                titleHtml: "<span class='c-green f-number'>4.1</span> <br/> <h3 class='c-black t-title'>Quais recursos <u>NÃO FINANCEIROS</u> você investiu ao criar seu empreendimento? (Selecione 5 opções principais)</h3>",
                color: "success",
                fields: [{
                    type: "select",
                    name: "nfSelect1",
                    placeholder: "Selecione uma opção",
                    options: [
                        { value: "conhecimento_experiencia", label: "Conhecimento ou experiência" },
                        { value: "conhecimento_territorio", label: "Conhecimento de território/mercado/setor" },
                        { value: "equipamentos", label: "Equipamentos" },
                        { value: "experiencia_pratica", label: "Experiência prática como empreendedor" },
                        { value: "infraestrutura", label: "Infraestrutura" },
                        { value: "parcerias_locais", label: "Parcerias com empresas locais e/ou outras" },
                        { value: "rede_contatos", label: "Rede de Contatos" },
                        { value: "tempo_integral", label: "Tempo de dedicação integral" },
                        { value: "tempo_parcial", label: "Tempo de dedicação parcial" },
                        { value: "trabalho_nao_remunerado_socios", label: "Trabalho não remunerado dos sócios" },
                        { value: "trabalho_voluntario_terceiros", label: "Trabalho voluntário de terceiros" },
                        { value: "outro", label: "Outro" }
                        ]
                }]
            },

            {
                // 4.2 — FINANCEIROS (cadeia de 3 selects; 2 e 3 via JS)
                titleHtml: "<span class='c-green f-number'>4.2</span> <br/> <h3 class='c-black t-title'>Quais recursos <u>FINANCEIROS</u> você investiu na fase de criação? (Marque até 3 opções)</h3>",
                color: "success",
                fields: [{
                    type: "select",
                    name: "fSelect1",
                    placeholder: "Selecione uma opção",
                    options: [
                    { value: "economias_pessoais", label: "Economias pessoais (poupança)" },
                    { value: "emprestimo_amigos", label: "Empréstimo com amigos" },
                    { value: "emprestimo_bancario", label: "Empréstimo bancário" },
                    { value: "emprestimo_familiares", label: "Empréstimo com familiares" },
                    { value: "equipamento", label: "Equipamento" },
                    { value: "fgts", label: "FGTS" },
                    { value: "infraestrutura", label: "Infraestrutura" },
                    { value: "investimento_informal", label: "Investimento Informal" },
                    { value: "investimento_proprios", label: "Investimento próprios" },
                    { value: "investimento_terceiros", label: "Investimento de terceiros" },
                    { value: "recursos_pessoais", label: "Recursos financeiros pessoais" },
                    { value: "seguro_desemprego", label: "Seguro desemprego" },
                    { value: "outro", label: "Outro" }
                    ]
                }]
            },

            {
                // 4.3 — Renunciou salários?
                titleHtml: "<span class='c-green f-number'>4.3</span> <br/> <h3 class='c-black t-title'>Para iniciar o empreendimento/projeto, você renunciou a salários ou empregos remunerados?</h3>",
                color: "success",
                fields: [{
                    type: "radio",
                    name: "renouncedSalaries",
                    options: [{
                            value: "sim",
                            label: "Sim"
                        },
                        {
                            value: "nao",
                            label: "Não"
                        }
                    ]
                }]
            },

            {
                // 4.4 — Dedicação (condicionais + seção “atualmente” sempre)
                titleHtml: "<span class='c-green f-number'>4.4</span> <br/> <h3 class='c-black t-title'>Qual a sua dedicação ao empreendimento em fase inicial (até 5 anos)?</h3>",
                color: "success",
                fields: [{
                    type: "radio",
                    name: "initialDedication",
                    options: [
                    { value: "divide_tempo", label: "Divide tempo com outro trabalho em paralelo com o empreendimento" },
                    { value: "integral", label: "Tempo dedicado integralmente" },
                    { value: "parcial", label: "Tempo parcialmente ao empreendimento" }
                    ]
                }]
            },

            {
                // 4.5 — Voluntários
                titleHtml: "<span class='c-green f-number'>4.5</span> <br/> <h3 class='c-black t-title'>Você tem pessoas trabalhando de forma voluntária no seu empreendimento?</h3>",
                color: "success",
                fields: [{
                    type: "select",
                    name: "volunteerType",
                    placeholder: "Selecione uma opção",
                    options: [{
                            value: "fixa",
                            label: "Sim de forma fixa"
                        },
                        {
                            value: "sob_demanda",
                            label: "Sim, sob demanda por projetos"
                        },
                        {
                            value: "nao",
                            label: "Não"
                        }
                    ]
                }]
            },
            {
                // 4.6 — Viabilidade econômica
                titleHtml: "<span class='c-green f-number'>4.6</span> <br/> <h3 class='c-black t-title'>Em quanto tempo o seu empreendimento se tornou viável economicamente?</h3>",
                color: "success",
                fields: [{
                    type: "radio",
                    name: "viabilityTime",
                    options: [{
                            value: "ate_6m",
                            label: "Até 6 meses"
                        },
                        {
                            value: "ano1",
                            label: "1° ano"
                        },
                        {
                            value: "ano2",
                            label: "2° ano"
                        },
                        {
                            value: "ano3",
                            label: "3° ano"
                        },
                        {
                            value: "ano4",
                            label: "4° ano"
                        },
                        {
                            value: "outro",
                            label: "Outro"
                        }
                    ]
                }]
            },
            {
                // 4.7 — Decisões sobre riscos e investimentos (cadeia de 3 selects)
                titleHtml: "<span class='c-green f-number'>4.7</span> <br/> <h3 class='c-black t-title'>Selecione 3 decisões que foram tomadas sobre riscos e investimentos financeiros na fase inicial (até 5 anos) do empreendimento.</h3>",
                color: "success",
                fields: [{
                    type: "select",
                    name: "riskInvSelect1",
                    placeholder: "Selecione uma opção",
                    options: [
                    { value: "buscou_amigos_familiares", label: "Buscou amigos e familiares" },
                    { value: "buscou_edital", label: "Buscou edital de fomento" },
                    { value: "buscou_investidor", label: "Buscou investidor profissional" },
                    { value: "buscou_parceiros", label: "Buscou parceiros" },
                    { value: "contratou_emprestimo", label: "Contratou emprestimo" },
                    { value: "investiu_capital_proprio", label: "Investiu capital próprio" },
                    { value: "investiu_apenas_que_poderia_perder", label: "Investiu somente o que vocêr poderia arriscar e perder" },
                    { value: "nao_investiu_dinheiro", label: "Não investiu dinheiro inicial" },
                    { value: "outro", label: "Outro" }
                    ]
                }]
            },

            ,
            {
                // 4.8 — Investidores (fase inicial)
                titleHtml: "<span class='c-green f-number'>4.8</span> <br/> <h3 class='c-black t-title'>Além de você, quem mais investiu no empreendimento na fase inicial (até 5 anos), detalhando ano/investimento?</h3>",
                color: "success",
                fields: [
                    // Campos do Investidor 01 (serão reorganizados/replicados via JS)
                    {
                        type: "number",
                        name: "invInitYear1",
                        placeholder: "Digite o ano"
                    },
                    {
                        type: "text",
                        name: "invInitName1",
                        placeholder: "Digite o nome do investidor"
                    }
                ]
            },
            {
                // 4.9 — Investidores (fase atual)
                titleHtml: "<span class='c-green f-number'>4.9</span> <br/> <h3 class='c-black t-title'>Além de você, quem mais investiu no empreendimento na fase atual (após 5 anos), detalhando ano/investimento?</h3>",
                color: "success",
                fields: [
                    // Campos do Investidor 01 (serão reorganizados/replicados via JS)
                    {
                        type: "number",
                        name: "invCurrYear1",
                        placeholder: "Digite o ano"
                    },
                    {
                        type: "text",
                        name: "invCurrName1",
                        placeholder: "Digite o nome do investidor"
                    }
                ]
            },
            {
                // 4.10 — Subsídios
                titleHtml: "<span class='c-green f-number'>4.10</span> <br/> <h3 class='c-black t-title'>Você conseguiu subsídios de instituições e/ou participou de bancas de planos de negócios?</h3>",
                color: "success",
                fields: [{
                    type: "radio",
                    name: "subsidies",
                    options: [{
                            value: "sim",
                            label: "Sim"
                        },
                        {
                            value: "nao",
                            label: "Não"
                        }
                    ]
                }]
            }

        ]
    };
})();