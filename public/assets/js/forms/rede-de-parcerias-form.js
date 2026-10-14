(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["15"] = {
    id: "card15-rede-de-parcerias",
    titleHtml:
      "<span class='c-green f-number'>15</span> <br/> <h2 class='c-black t-title'>Rede de Parcerias</h2>",
    groups: [
      {
        // 15.1 — Quantidade de parcerias
        titleHtml:
            "<span class='c-green f-number'>15.1</span> <br/>" +
            "<h3 class='c-black t-title'>Quantas parcerias o empreendimento tem atualmente?</h3>",
        color: "success",
        fields: [
            {
            type: "row",
            cols: [
                {
                col: 6,
                field: {
                    type: "number",
                    required: true,
                    name: "partnershipsFormal",
                    label: "Parcerias Formais",
                    placeholder: ""
                }
                },
                {
                col: 6,
                field: {
                    type: "number",
                    name: "partnershipsInformal",
                    required: true,
                    label: "Parcerias Informais",
                    placeholder: ""
                }
                }
            ]
            }
        ]
      },
      {
        // 15.2 — Por que busca parceiros
        titleHtml:
          "<span class='c-green f-number'>15.2</span> <br/>" +
          "<h3 class='c-black t-title'>Por que você busca parceiros para o empreendimento?</h3>",
        color: "success",
        fields: [
          {
            type: "text",
            name: "reasonSeekPartners",
            required: true,
            placeholder: "Especifique"
          }
        ]
      },
      {
        // 15.3 — Como busca parceiros (até 5 opções, com “Outro” fixo)
        titleHtml:
          "<span class='c-green f-number'>15.3</span> <br/>" +
          "<h3 class='c-black t-title'>Como você busca parceiros para o empreendimento?</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "howSeekPartners1",
            placeholder: "Selecione uma opção",
            required: true,
            options: [
            { value: "agencia_fomento", label: "Agência de fomento" },
            { value: "associacoes_profissionais", label: "Associações profissionais" },
            { value: "clientes_ex_clientes", label: "Clientes e ex-clientes" },
            { value: "comunidade_religiosa", label: "Comunidade religiosa" },
            { value: "comunidades_foruns_online", label: "Comunidades e fóruns online" },
            { value: "conhecidos_rede_profissional", label: "Conhecidos e rede profissional" },
            { value: "consultorias", label: "Consultorias" },
            { value: "coworking_espacos_compartilhados", label: "Coworking e espaços de trabalho compartilhado" },
            { value: "eventos_networking", label: "Eventos de networking" },
            { value: "eventos_setor", label: "Eventos do setor" },
            { value: "familia_amigos", label: "Família e amigos" },
            { value: "feiras_exposicoes", label: "Feiras e exposições" },
            { value: "fundos_investimento_capital_risco", label: "Fundos de investimento e capital de risco" },
            { value: "grupos_associacoes_comunitaria", label: "Grupos e associações comunitárias" },
            { value: "hackathons_competicoes", label: "Hackathons e competições" },
            { value: "incubadoras_aceleradoras", label: "Incubadoras e aceleradoras" },
            { value: "midias_sociais", label: "Mídias sociais (blog, YouTube, Vimeo etc.)" },
            { value: "novos_parceiros", label: "Novos parceiros" },
            { value: "programas_mentoria", label: "Programas de mentoria" },
            { value: "programas_televisao", label: "Programas de televisão" },
            { value: "redes_sociais", label: "Redes sociais (Facebook, LinkedIn, Instagram etc.)" },
            { value: "universidades_pesquisa", label: "Universidades e centros de pesquisa" },
            { value: "outro", label: "Outro" }
          ]
          }
        ]
      },
      {
        // 15.4 — O que faz para impulsionar novas oportunidades de vendas
        titleHtml:
          "<span class='c-green f-number'>15.4</span> <br/>" +
          "<h3 class='c-black t-title'>O que você faz para impulsionar novas oportunidades de vendas do seu produto/serviço?</h3>",
        color: "success",
        fields: [
          {
            // Parcerias para impulsionar vendas (até 5)
            type: "select",
            name: "partnershipsBoostSales1",
            label: "Parcerias para impulsionar vendas (escolha até 5 em ordem de importância, sendo a primeira a mais importante):",
            placeholder: "Selecione uma opção",
            required: true,
            options: [
              { value: "colaboracao_ongs_comunidade", label: "Colaboração com ONGs e organizações comunitárias" },
              { value: "colaboracao_organizacoes_empreendedorismo", label: "Colaboração com organizações de empreendedorismo" },
              { value: "descontos_beneficios_vizinhos", label: "Descontos ou benefícios para vizinhos e famílias do bairro" },
              { value: "parcerias_escolas_associacoes_igrejas", label: "Parcerias com escolas, associações de moradores, igrejas" },
              { value: "parcerias_influenciadores", label: "Parcerias com influenciadores" },
              { value: "parcerias_outros_empreendimentos", label: "Parcerias com outros empreendimentos para vendas conjuntas" },
              { value: "eventos_capacitacao_empoderamento", label: "Participação em eventos de capacitação e empoderamento comunitário" },
              { value: "promocoes_lancamento_parcerias", label: "Promoções de lançamento de produtos/serviços (parcerias com organizações ou outros negócios)" },
              { value: "venda_grupos_compras_coletivas", label: "Venda em grupos de compras coletivas e redes locais de consumo" },
              { value: "outro", label: "Outro" }
            ]
          },
          {
            // Vendas para impulsionar oportunidades (até 5)
            type: "select",
            name: "salesBoostOpportunities1",
            label: "Vendas para impulsionar oportunidades (escolha até 5 em ordem de importância, sendo a primeira a mais importante):",
            placeholder: "Selecione uma opção",
            required: true,
            options: [
              { value: "abordagens_diretas", label: "Abordagens diretas" },
              { value: "anuncios_publicidade", label: "Anúncios" },
              { value: "boca_a_boca_indicacao", label: "Boca a boca e indicação de clientes" },
              { value: "campanhas_marketing_digital", label: "Campanhas de marketing digital" },
              { value: "conteudo_digital", label: "Criação de conteúdo digital (blog, YouTube, podcasts)" },
              { value: "descontos_promocoes_sazonais", label: "Descontos e promoções sazonais" },
              { value: "amostras_gratis", label: "Distribuição de amostras grátis" },
              { value: "email_whatsapp_marketing", label: "E-mail marketing e WhatsApp marketing" },
              { value: "equipe_vendas_ativa", label: "Equipe de vendas ativa" },
              { value: "eventos_setor", label: "Eventos do setor" },
              { value: "feiras_exposicoes", label: "Feiras e exposições" },
              { value: "panfletagem_alto_movimento", label: "Panfletagem em locais de alto movimento" },
              { value: "conferencias_congressos", label: "Participação em conferências e congressos" },
              { value: "grupos_comunidades_online", label: "Participação em grupos e comunidades online" },
              { value: "hackathon_aceleracao", label: "Participação em hackathons e programas de aceleração" },
              { value: "licitacoes_concorrencias_publicas", label: "Participação em licitações e concorrências públicas" },
              { value: "programa_indicacao", label: "Programa de indicação (indique e ganhe)" },
              { value: "promocoes_clientes_atuais", label: "Promoções junto aos clientes atuais" },
              { value: "promocoes_personalizadas", label: "Promoções personalizadas (baseadas em dados de clientes)" },
              { value: "publicidade_redes_sociais", label: "Publicidade em redes sociais" },
              { value: "publicidade_revistas_jornais_radio", label: "Publicidade em revistas, jornais e rádio (incluindo rádios comunitárias)" },
              { value: "testes_gratuitos_novos_clientes", label: "Testes gratuitos para novos clientes" },
              { value: "webinares_lives", label: "Webinares e lives" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 15.5 — Receptividade para potenciais parceiros (3 selects encadeados)
        titleHtml:
          "<span class='c-green f-number'>15.5</span> <br/>" +
          "<h3 class='c-black t-title'>Como costuma ser a sua receptividade para potenciais parceiros? Escolha até 3 opções, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "receptivityPartners1",
            placeholder: "Selecione uma opção",
            required: true,
            options: [
              { value: "aceita_colaboracoes", label: "Aceita colaborações de potenciais parceiros" },
              { value: "aceita_sugestoes_limitacoes", label: "Aceita sugestões e parcerias, mas com limitações ou em áreas específicas do empreendimento" },
              { value: "avalia_novos_desenvolvimentos", label: "Avalia e considera novos desenvolvimentos" },
              { value: "avalia_interesse_planejamento_metas", label: "Avalia o interesse de novos parceiros com base na aderência ao planejamento e metas estabelecidas" },
              { value: "mais_resistente_foco", label: "Mais resistente por conta do foco" },
              { value: "prefere_atuar_sozinho_socios", label: "Prefere atuar sozinho ou somente com os sócios" },
              { value: "prefere_manter_foco_atuais", label: "Prefere manter o foco nas estratégias práticas atuais" },
              { value: "reune_incorpora_informacoes", label: "Reúne e incorpora novas informações" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      }
    ]
  };
})();
