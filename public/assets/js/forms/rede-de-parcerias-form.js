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
            options: [
            { value: "agencia_fomento", label: "Agência de Fomento" },
            { value: "associacoes_profissionais", label: "Associações Profissionais" },
            { value: "clientes_ex_clientes", label: "Clientes e Ex-Clientes" },
            { value: "comunidade_religiosa", label: "Comunidade Religiosa" },
            { value: "comunidades_foruns_online", label: "Comunidades e Fóruns Online" },
            { value: "conhecidos_rede_profissional", label: "Conhecidos e Rede Profissional" },
            { value: "consultorias", label: "Consultorias" },
            { value: "coworking_espacos_compartilhados", label: "Coworking e Espaços de trabalho compartilhado" },
            { value: "eventos_networking", label: "Eventos de Networking" },
            { value: "eventos_setor", label: "Eventos do Setor" },
            { value: "familia_amigos", label: "Família e Amigos" },
            { value: "feiras_exposicoes", label: "Feiras e Exposições" },
            { value: "fundos_investimento_capital_risco", label: "Fundos de Investimento e Capital de Risco" },
            { value: "grupos_associacoes_comunitaria", label: "Grupos e Associações Comunitária" },
            { value: "hackathons_competicoes", label: "Hackathons e Competições" },
            { value: "incubadoras_aceleradoras", label: "Incubadoras e Aceleradoras" },
            { value: "midias_sociais", label: "Mídias Sociais" },
            { value: "novos_parceiros", label: "Novos Parceiros" },
            { value: "programas_mentoria", label: "Programas de Mentoria" },
            { value: "programas_televisao", label: "Programas de Televisão" },
            { value: "redes_sociais", label: "Redes Sociais" },
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
            options: [
              { value: "colaboracao_ongs_comunidade", label: "Colaboração com ONGs e Organizações Comunitárias" },
              { value: "colaboracao_organizacoes_empreendedorismo", label: "Colaboração com Organizações de Empreendedorismo" },
              { value: "descontos_beneficios_vizinhos", label: "Descontos ou Benefícios para Vizinhos e Famílias do Bairro" },
              { value: "eventos_capacitacao_empoderamento", label: "Participação em Eventos de Capitalização e Empoderamento Comunitário" },
              { value: "parcerias_escolas_associacoes_igrejas", label: "Parcerias com Escolas, Associações de Moradores, Igrejas" },
              { value: "parcerias_influenciadores", label: "Parcerias com Influenciadores" },
              { value: "parcerias_outros_empreendimentos", label: "Parcerias com Outros Empreendimentos para Vendas Conjuntas" },
              { value: "promocoes_lancamento_parcerias", label: "Promoções de Lançamento de Produtos/Serviços (parcerias com organizações ou outros negócios)" },
              { value: "venda_grupos_compras_coletivas", label: "Venda em Grupos de Compras Coletivas e Redes Locais de Consumo" },
              { value: "outro", label: "Outro" }
            ]
          },
          {
            // Vendas para impulsionar oportunidades (até 5)
            type: "select",
            name: "salesBoostOpportunities1",
            label: "Vendas para impulsionar oportunidades (escolha até 5 em ordem de importância, sendo a primeira a mais importante):",
            placeholder: "Selecione uma opção",
            options: [
              { value: "abordagens_diretas", label: "Abordagens Diretas" },
              { value: "amostras_gratis", label: "Distribuição de Amostras Grátis" },
              { value: "anuncios_publicidade", label: "Anúncios" },
              { value: "boca_a_boca_indicacao", label: "Boca a Boca e Indicação de Clientes" },
              { value: "campanhas_marketing_digital", label: "Campanhas de Marketing Digital" },
              { value: "conteudo_digital", label: "Criação de Conteúdo Digital (Blog, Youtube, Podcasts)" },
              { value: "descontos_promocoes_sazonais", label: "Descontos e Promoções Sazonais" },
              { value: "equipe_vendas_ativa", label: "Equipe de Vendas Ativa" },
              { value: "email_whatsapp_marketing", label: "E-mail Marketing e Whatsapp Marketing" },
              { value: "eventos_setor", label: "Eventos do Setor" },
              { value: "feiras_exposicoes", label: "Feiras e Exposições" },
              { value: "grupos_comunidades_online", label: "Participação em Grupos e Comunidades Online" },
              { value: "hackathon_aceleracao", label: "Participação em Hackathon e Programas de Aceleração" },
              { value: "licitacoes_concorrencias_publicas", label: "Participação em Licitações e Concorrências Públicas" },
              { value: "panfletagem_alto_movimento", label: "Panfletagem em Locais de Alto Movimento" },
              { value: "programa_indicacao", label: "Programa de Indicação (Indique e Ganhe)" },
              { value: "promocoes_clientes_atuais", label: "Promoções junto aos clientes atuais" },
              { value: "promocoes_personalizadas", label: "Promoções Personalizadas (baseadas em dados de clientes)" },
              { value: "publicidade_redes_sociais", label: "Publicidade em Redes Sociais" },
              { value: "publicidade_revistas_jornais_radio", label: "Publicidade em Revistas, Jornais e Rádio (incluindo rádios comunitárias)" },
              { value: "testes_gratuitos_novos_clientes", label: "Testes Gratuitos para Novos Clientes" },
              { value: "webinares_lives", label: "Webinares e Lives" },
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
            options: [
              { value: "aceita_colaboracoes", label: "Aceita colaborações de potenciais parceiros" },
              { value: "aceita_sugestoes_limitacoes", label: "Aceita sugestões e parcerias, mas com limitações ou em áreas específicas do empreendimento" },
              { value: "avalia_interesse_planejamento_metas", label: "Avalia o interesse de novos parceiros com base na aderência ao planejamento e metas estabelecidas" },
              { value: "avalia_novos_desenvolvimentos", label: "Avalia e considera novos desenvolvimentos" },
              { value: "mais_resistente_foco", label: "Mais resistente por conta do foco" },
              { value: "prefere_atuar_sozinho_socios", label: "Prefere atuar sozinho ou somente com os sócios" },
              { value: "prefere_manter_foco_atuais", label: "Prefere manter o foco nas estratégias práticas atuais" },
              { value: "reune_incorpora_informacoes", label: "Reúne e incorpora Novas Informações" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      }
    ]
  };
})();