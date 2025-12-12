<!DOCTYPE html>
<html>

<head>
    <title>TEM - Territorial Effectuation Monitoring</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/img/favicon.ico') }}">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="{{ asset('assets/vendor/bootstrap-5.3.8/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/fontawesome-free-5.15.4/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/resume.css') }}">
</head>

<body>
    <!-- Start Section Header -->
    <section class="section-header">
        <div class="container">
            <header class="d-flex flex-wrap justify-content-center">
                <a href="/dashboard" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                    <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" />
                </a>
                <ul class="nav nav-pills">
                    <li class="nav-item"><a href="/dashboard" class="nav-link" aria-current="page">Início</a></li>
                    <li class="nav-item"><a href="/logout" class="nav-link">Sair</a></li>
                </ul>
            </header>
        </div>
    </section>
    <!-- End Section Header -->

    <!-- Start Section App -->
    <section class="tem-wrap">
        <div class="container">
            @if (!empty($isReviewer) && $isReviewer && !empty($businessResume))
                <h1 class="tem-title text-center">Relatório Descritivo</h1>
            @endif

            <h1 class="tem-title">{{ $business->business_name }}</h1>

            @php
                $card1 = $businessData['1'] ?? [];
            @endphp

            <div class="d-flex flex-column gap-3">

                {{-- Website --}}
                @if (!empty($card1['website']))
                    @php
                        $website = $card1['website'];
                        $websiteUrl = \Illuminate\Support\Str::startsWith($website, ['http://', 'https://'])
                            ? $website
                            : 'https://' . $website;
                    @endphp

                    <div class="d-flex align-items-center gap-2">
                        <i class="fas fa-globe fa-lg"></i>
                        <a target="_blank" href="{{ $websiteUrl }}">{{ $website }}</a>
                    </div>
                @endif

                {{-- Instagram --}}
                @if (!empty($card1['instagram']))
                    @php
                        $instagram = $card1['instagram'];
                        // Se o usuário só colocar o @ ou o user, montamos a URL padrão
                        $instagramHandle = ltrim($instagram, '@');
                        $instagramUrl = \Illuminate\Support\Str::startsWith($instagram, ['http://', 'https://'])
                            ? $instagram
                            : 'https://www.instagram.com/' . $instagramHandle;
                    @endphp

                    <div class="d-flex align-items-center gap-2">
                        <i class="fab fa-instagram fa-lg"></i>
                        <a target="_blank" href="{{ $instagramUrl }}">{{ $instagram }}</a>
                    </div>
                @endif

            </div>

            <div class="tem-actions">
                <button class="btn btn-brand">
                    <i class="fas fa-file-pdf"></i>
                    Baixar Relatório
                </button>
            </div>
        </div>
    </section>
    <!-- End Section App -->

   
    @if (!empty($isReviewer) && $isReviewer && !empty($businessResume))
        <section class="tem-wrap">
            <div class="container">
                <h2 class="tem-title mb-3">Resumo do Empreendimento</h2>

                <p>{{ $businessResume }}</p>
            </div>
        </section>
    @endif

    <!-- Start TimeLine Section App -->
    <section class="tem-wrap">
        <div class="container">
            <h2 class="tem-title mb-3">Linha do tempo</h2>

            @php
                $milestones = $businessData['19']['milestones'] ?? [];

                // remove entradas sem ano ou descrição
                $milestones = array_filter($milestones, function ($item) {
                    return !empty($item['year']) && !empty($item['description']);
                });

                // ordenar do ano menor para o maior (anos menores primeiro)
                usort($milestones, function ($a, $b) {
                    return intval($a['year']) <=> intval($b['year']);
                });
            @endphp

            <div class="timeline-wrapper">
                <div class="timeline-scroll">
                    <div class="timeline-track">

                        <div class="timeline-line"></div>

                        @foreach ($milestones as $index => $milestone)
                            @php
                                $year = $milestone['year'] ?? '';
                                $fullDesc = $milestone['description'] ?? '';

                                // texto curto com "..." (AGORA 60 chars)
                                $shortDesc = \Illuminate\Support\Str::limit($fullDesc, 60, '...');

                                // alternar cima/baixo:
                                $isBottom = $index % 2 === 1;
                            @endphp

                            <div class="timeline-item {{ $isBottom ? 'timeline-item--bottom' : '' }}"
                                data-descbig="{{ e($fullDesc) }}"
                                data-full-text="{{ e($fullDesc) }}"
                                data-modal-title="Linha do tempo - {{ $year }}">
                                <div class="timeline-card">
                                    <span>{{ $year }}</span>
                                </div>
                                <p class="timeline-text">
                                    {{ $shortDesc }}
                                </p>
                            </div>
                        @endforeach

                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- End TimeLine Section App -->

    <!-- Start Business Model Section App -->
    <section class="tem-wrap">
        <div class="container">
            <h2 class="tem-title mb-3">Modelo de Negócios</h2>

            @php
                $card1  = $businessData['1']  ?? [];
                $card7  = $businessData['7']  ?? [];
                $card8  = $businessData['8']  ?? [];
                $card9  = $businessData['9']  ?? [];
                $card10 = $businessData['10'] ?? [];
                $card11 = $businessData['11'] ?? [];
                $card12 = $businessData['12'] ?? [];
                $card13 = $businessData['13'] ?? [];
                $card14 = $businessData['14'] ?? [];
                $card16 = $businessData['16'] ?? [];

                // Mapeamento de códigos -> labels legíveis
                $labels = [
                    // 14.x - Parcerias-chave
                    'centros_pesquisa_pdu'               => 'Centros de pesquisa e desenvolvimento (P&D) ou universidades',
                    'distribuidores_revendedores'        => 'Distribuidores e revendedores',
                    'entrada_novos_investidores'         => 'Entrada de novos investidores',
                    'entrada_socios'                     => 'Entrada de sócios',
                    'fornecedores'                       => 'Fornecedores',
                    'instituicoes_financeiras'           => 'Instituições financeiras',
                    'investidores_privados'              => 'Investidores privados',
                    'investidores_publicos'              => 'Investidores públicos',
                    'logistica'                          => 'Logística',
                    'mkt_publicidade'                    => 'Empreendimentos de marketing e publicidade',
                    'ongs_nao_governamentais'            => 'Organizações não governamentais (ONGs)',
                    'lideres_influenciadores'            => 'Líderes ou influenciadores comunitários',
                    'parceiros_tecnologia'               => 'Parceiros de tecnologia (infraestrutura tecnológica, aplicativos ou plataformas online)',
                    'pequenos_comerciantes_locais'       => 'Pequenos comerciantes locais',

                    // 13.x - Atividades-chave
                    'acoes_vendas_locais'                   => 'Ações de vendas locais',
                    'capacitacao_treinamento_moradores'     => 'Capacitação ou treinamento de moradores de favela/comunidade',
                    'desenvolvimento_novos_produtos_servicos' => 'Desenvolvimento de novos produtos ou serviços',
                    'engajamento_comunitario'               => 'Engajamento comunitário',
                    'eventos_parcerias_locais'              => 'Eventos e parcerias locais',
                    'logistica_distribuicao'                => 'Logistica e distribuição',
                    'marketing_vendas'                      => 'Marketing e Vendas',
                    'prestacao_servicos'                    => 'Prestação de Serviços',
                    'servicos_educacao_saude'               => 'Prestação de serviços como educação ou saúde',
                    'producao_fornecimento_produtos_essenciais' => 'Produção ou fornecimento de produtos essenciais',
                    'producao_produtos'                     => 'Produção de produtos',

                    // 7.x — Proposta de Valor (valueDiff)
                    'qualidade_superior'     => 'Qualidade Superior',
                    'facilidade_uso'         => 'Facilidade de Uso',
                    'eficiencia_rapidez'     => 'Maior eficiência ou rapidez',
                    'nicho_especifico'       => 'Atende a um nicho específico',
                    'preco_acessivel'        => 'Preço mais acessível',
                    'facilidade_acesso'      => 'Facilidade de acesso (presença local, sem necessidade de deslocamento)',
                    'nao_ofertado_favela'    => 'Produto não ofertado na favela',
                    'melhor_qualidade'       => 'Produto/Serviço de melhor qualidade',
                    'solucao_mais_rapida'    => 'Solução mais rápida ou eficiente',

                    // 10.x - Relacionamento com clientes
                    'atendimento_personalizado'   => 'Atendimento personalizado',
                    'programas_fidelidade'        => 'Programas de fidelidade',
                    'suporte_24_7'                => 'Suporte 24/7',
                    'boca_a_boca'                 => 'Incentivando o boca a boca e indicações',
                    'comunidades_grupos'          => 'Comunidades ou grupos online',
                    'automacao_autoatendimento'   => 'Automação e autoatendimento',
                    'publicidade_marketing_digital' => 'Através de publicidade e marketing digital',
                    'redes_sociais_comunicacao'     => 'Através de redes sociais e comunicação digital',
                    'parcerias_locais'              => 'Parcerias com outros empreendimentos locais',
                    'parcerias_indicacoes'          => 'Parcerias e indicações',
                    'por_meio_atendimento'          => 'Por meio de atendimento',
                    'promocoes_descontos'           => 'Oferecendo promoções e descontos',
                    'promocoes_novos_clientes'      => 'Promoções e descontos para novos clientes',

                    // 8.x - Segmento de clientes
                    'amigo_familiar'          => 'Amigo ou familiar',
                    'moradores_favela'        => 'Moradores da favela (pessoas físicas)',
                    'mercado_local'           => 'Cliente de mercado local',
                    'empreendimentos_locais'  => 'Empreendimentos locais (comércio, pequenos empreendimentos)',
                    'ongs'                    => 'ONGs ou organizações comunitárias',
                    'pessoas_fisicas'         => 'Pessoas físicas',
                    'pessoas_juridicas'       => 'Pessoas jurídicas',
                    'publico_fora_favela'     => 'Público fora da favela que se beneficia dos produtos/serviços',
                    'faixa_etaria'       => 'Consumidor final na faixa etária (jovens, adultos, idosos)',
                    'tipo_renda'         => 'Consumidor final por tipo de renda (baixa, média, alta)',
                    'ocupacao'           => 'Consumidor final por ocupação (trabalhadores informais, pequenos empresários, etc.)',
                    'pequenas_empresas'  => 'Pequenas Empresas',
                    'grandes_empresas'   => 'Grandes Empresas',

                    // 12.x - Recursos-chave
                    'capital_financeiro'                  => 'Capital financeiro (próprio ou de investidores)',
                    'conhecimento_comunidade'             => 'Conhecimento sobre a comunidade e seus desafios',
                    'doadores'                            => 'Doadores',
                    'financiamento_coletivo'              => 'Financiamento coletivo',
                    'infraestrutura'                      => 'Infraestrutura (prédio, lojas, espaço físico, equipamentos)',
                    'mao_de_obra_local'                   => 'Mão de obra local (moradores da favela/comunidade)',
                    'parcerias_comercios_organizacoes'    => 'Parcerias com comércios ou organizações locais',
                    'patrocinadores_diretos'              => 'Patrocinadores diretos',
                    'patrocinadores_lei_incentivo'        => 'Patrocinadores via lei de incentivo',
                    'pessoas_assalariadas'                => 'Pessoas assalariadas (equipe, expertise)',
                    'pessoas_equipe'                      => 'Pessoas (Equipe, expertise)',
                    'propriedade_intelectual'             => 'Propriedade intelectual (patentes, marcas)',
                    'tecnologia'                          => 'Tecnologia (aplicativos, sites)',
                    'voluntarios'                         => 'Voluntários',

                    // 9.1 - Canais
                    'internet'                 => 'Internet',
                    'anuncios'                 => 'Anúncios',
                    'lojas_franquias_marketing'        => 'Lojas físicas, franquias ou por meio de canais de marketing como redes sociais',
                    'redes_sociais'                    => 'Redes sociais',
                    'vendas_diretas_feiras_parcerias' => 'Vendas diretas de porta em porta, feiras locais ou parcerias com lideranças comunitárias',

                    // 16.x — Estrutura de Custos (costChallenging1/2/3)
                    'producao'                            => 'Produção',
                    'marketing_publicidade'              => 'Marketing e Publicidade',
                    'tecnologia_infraestrutura'          => 'Tecnologia e Infraestrutura',
                    'salarios_beneficios'                => 'Salários e Benefícios',
                    'manutencao_precos_acessiveis'       => 'Manutenção de preços acessíveis',
                    'investimento_logistica'             => 'Investimento em Logística (entrega, transporte)',
                    'contratacao_retencao_colaboradores' => 'Contratação e retenção de colaboradores qualificados',
                    'custos_regulamentacoes_burocracia'  => 'Custos com regulamentações e burocracia',

                    // 11.x - Fontes de receita
                    'venda_direta_produtos'        => 'Venda direta de produtos',
                    'prestacao_servicos'           => 'Prestação de serviços',
                    'assinatura_adesao'            => 'Modelos de assinatura ou adesão',
                    'taxas_transacao_comissoes'    => 'Taxas de transação ou comissões',
                    'publicidade'                  => 'Publicidade',
                    'licensiamento'                => 'Licensiamento',
                    'patrocinio_direto'            => 'Patrocínio direto',
                    'patrocinio_lei_incentivo'     => 'Patrocínio via lei de incentivo',
                    'doacao'                       => 'Doação',
                    'venda_unica'          => 'Venda única',
                    'assinatura_recorrente'=> 'Assinatura recorrente',
                    'freemium'             => 'Modelo Freemium (gratuito com opções pagas)',
                    'taxa_transacao_uso'   => 'Taxa por transação de uso',
                ];

                // Helper genérico para mapear opção (considerando "Outro/Outros")
                $resolveOption = function (array $card, string $key, ?string $value) use ($labels) {
                    if (!$value) {
                        return null;
                    }

                    $raw = (string) $value;

                    // Se for "outro" / "outros", tenta achar o campo de texto associado
                    if (in_array(mb_strtolower($raw), ['outro', 'outros'], true)) {
                        $candidates = [
                            // padrão com dois underscores: ex: channels1__other, valueDiff1__other etc.
                            $key . '__other',
                            // compatibilidade com padrões antigos
                            $key . '_other',
                            $key . 'Other',
                            preg_replace('/\d+$/', '__other', $key),
                            preg_replace('/\d+$/', '_other', $key),
                            preg_replace('/\d+$/', 'Other', $key),
                        ];

                        foreach ($candidates as $ck) {
                            if (!empty($card[$ck])) {
                                return $card[$ck];
                            }
                        }
                    }

                    return $labels[$raw] ?? $raw;
                };


                // Helper para montar lista a partir de prefixo + índice sequencial (ex: mainPartners1..N)
                $collectSeq = function (array $card, string $prefix, int $max = 10) use ($resolveOption) {
                    $items = [];
                    for ($i = 1; $i <= $max; $i++) {
                        $key = $prefix . $i;
                        if (!isset($card[$key]) || $card[$key] === null || $card[$key] === '') {
                            continue;
                        }
                        $items[] = $resolveOption($card, $key, $card[$key]);
                    }
                    return array_values(array_filter($items));
                };

                // --- 1) Parcerias-chave (14.1 e 14.2) ---
                // 14.1 -> sócios (aqui temos apenas "partnersShares" no JSON de exemplo)
                $socios = [];
                if (!empty($card14['partnersShares'])) {
                    $socios[] = $card14['partnersShares'];
                }

                // 14.2 -> principais parceiros (mainPartners1..N)
                $principaisParceiros = $collectSeq($card14, 'mainPartners', 10);

                // --- 2) Atividades-chave (13.1) ---
                $atividadesChave = $collectSeq($card13, 'actKey', 10);

                // --- 3) Proposta de valor (7.1 e 7.2) ---
                $vpProblem    = $card7['vpProblem'] ?? null; // texto livre
                $valueDiffs   = $collectSeq($card7, 'valueDiff', 10);

                // --- 4) Relacionamento com clientes (10.2 = captação, 10.1 = fidelização) ---
                $captacao     = $collectSeq($card10, 'captaRel', 10);
                $fidelizacao  = $collectSeq($card10, 'fidelRel', 10);

                // --- 5) Segmento de clientes (8.1 e 8.2) ---
                // 8.1 -> primeiro cliente
                $primeiroCliente = [];
                if (!empty($card8['firstClient'])) {
                    $primeiroCliente[] = $resolveOption($card8, 'firstClient', $card8['firstClient']);
                }

                // 8.2 -> grupos/segmentos
                $segmentosClientes = $collectSeq($card8, 'segGroup', 10);

                // --- 6) Recursos-chave (12.1) ---
                $recursosChave = $collectSeq($card12, 'keyRes', 10);

                // --- 7) Canais (9.1) ---
                $channels = [];
                for ($i = 1; $i <= 10; $i++) {
                    $key = 'channels' . $i;

                    if (empty($card9[$key])) {
                        continue;
                    }

                    $raw   = $card9[$key];
                    $label = $resolveOption($card9, $key, $raw);

                    // Caso especial "Redes sociais": adiciona (Instagram, WhatsApp, etc.)
                    if ($raw === 'redes_sociais') {
                        $socials = [];
                        if (!empty($card1['facebook']))  { $socials[] = 'Facebook'; }
                        if (!empty($card1['instagram'])) { $socials[] = 'Instagram'; }
                        if (!empty($card1['linkedin']))  { $socials[] = 'LinkedIn'; }
                        if (!empty($card1['phone']))     { $socials[] = 'WhatsApp'; }

                        if ($socials) {
                            $label .= ' (' . implode(', ', $socials) . ')';
                        }
                    }

                    $channels[] = $label;
                }

                // --- 8) Estrutura de custos (16.1) ---
                $estruturaCustos = $collectSeq($card16, 'costChallenging', 10);

                // --- 9) Fontes de receita (11.1 e 11.2) ---
                $fontesReceitaParte1 = $collectSeq($card11, 'revSource', 10);   // antes do HR
                $fontesReceitaParte2 = $collectSeq($card11, 'monetModel', 10);  // depois do HR
            @endphp

            <div class="bmodel-board">

                <!-- PARTE DE CIMA (canvas principal) -->
                <div class="bmodel-top">

                    <!-- Parcerias-chave -->
                    <div class="bmodel-cell">
                        <div class="bmodel-header bmodel-header-left">
                            <span>Parcerias-chave</span>
                            <i class="fas fa-handshake"></i>
                        </div>
                        <div class="bmodel-body">
                            <h4 class="bmodel-subtitle">Sócios:</h4>
                            @if (!empty($socios))
                                <ul>
                                    @foreach ($socios as $item)
                                        <li>{{ $item }}</li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-muted mb-2">Não informado.</p>
                            @endif

                            <hr class="bmodel-divider">

                            <h4 class="bmodel-subtitle">Principais parceiros:</h4>
                            @if (!empty($principaisParceiros))
                                <ul>
                                    @foreach ($principaisParceiros as $item)
                                        <li>{{ $item }}</li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-muted mb-0">Não informado.</p>
                            @endif
                        </div>
                    </div>

                    <!-- Atividades-chave / Recursos-chave -->
                    <div class="bmodel-cell bmodel-cell-split border-start">

                        <!-- Atividades-chave -->
                        <div class="bmodel-cell-half">
                            <div class="bmodel-header">
                                <span>Atividades-chave</span>
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <div class="bmodel-body">
                                @if (!empty($atividadesChave))
                                    <ul>
                                        @foreach ($atividadesChave as $item)
                                            <li>{{ $item }}</li>
                                        @endforeach
                                    </ul>
                                @else
                                    <p class="text-muted mb-0">Não informado.</p>
                                @endif
                            </div>
                        </div>

                        <!-- Recursos-chave -->
                        <div class="bmodel-cell-half border-top">
                            <div class="bmodel-header">
                                <span>Recursos-chave</span>
                                <i class="fas fa-box"></i>
                            </div>
                            <div class="bmodel-body">
                                @if (!empty($recursosChave))
                                    <ul>
                                        @foreach ($recursosChave as $item)
                                            <li>{{ $item }}</li>
                                        @endforeach
                                    </ul>
                                @else
                                    <p class="text-muted mb-0">Não informado.</p>
                                @endif
                            </div>
                        </div>

                    </div>

                    <!-- Proposta de valor -->
                    <div class="bmodel-cell border-start">
                        <div class="bmodel-header">
                            <span>Proposta de valor</span>
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="bmodel-body">
                            @if (!empty($vpProblem))
                                <p>{!! nl2br(e($vpProblem)) !!}</p>
                            @else
                                <p class="text-muted">Não informado.</p>
                            @endif

                            <hr class="bmodel-divider">

                            @if (!empty($valueDiffs))
                                <ul>
                                    @foreach ($valueDiffs as $item)
                                        <li>{{ $item }}</li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-muted mb-0">Sem diferenciais cadastrados.</p>
                            @endif
                        </div>
                    </div>

                    <!-- Relação com clientes / Canais -->
                    <div class="bmodel-cell bmodel-cell-split border-start">

                        <!-- Relação com clientes -->
                        <div class="bmodel-cell-half">
                            <div class="bmodel-header">
                                <span>Relação com clientes</span>
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="bmodel-body">
                                <h4 class="bmodel-subtitle">Captação:</h4>
                                @if (!empty($captacao))
                                    <ul>
                                        @foreach ($captacao as $item)
                                            <li>{{ $item }}</li>
                                        @endforeach
                                    </ul>
                                @else
                                    <p class="text-muted mb-2">Não informado.</p>
                                @endif

                                <hr class="bmodel-divider">

                                <h4 class="bmodel-subtitle">Fidelização:</h4>
                                @if (!empty($fidelizacao))
                                    <ul>
                                        @foreach ($fidelizacao as $item)
                                            <li>{{ $item }}</li>
                                        @endforeach
                                    </ul>
                                @else
                                    <p class="text-muted mb-0">Não informado.</p>
                                @endif
                            </div>
                        </div>

                        <!-- Canais -->
                        <div class="bmodel-cell-half border-top">
                            <div class="bmodel-header">
                                <span>Canais</span>
                                <i class="fas fa-paper-plane"></i>
                            </div>
                            <div class="bmodel-body">
                                @if (!empty($channels))
                                    <ul>
                                        @foreach ($channels as $item)
                                            <li>{{ $item }}</li>
                                        @endforeach
                                    </ul>
                                @else
                                    <p class="text-muted mb-0">Não informado.</p>
                                @endif
                            </div>
                        </div>

                    </div>

                    <!-- Segmento de clientes -->
                    <div class="bmodel-cell border-start">
                        <div class="bmodel-header bmodel-header-right">
                            <span>Segmento de clientes</span>
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="bmodel-body">
                            <h4 class="bmodel-subtitle">Primeiro cliente:</h4>
                            @if (!empty($primeiroCliente))
                                <ul>
                                    @foreach ($primeiroCliente as $item)
                                        <li>{{ $item }}</li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-muted mb-2">Não informado.</p>
                            @endif

                            <hr class="bmodel-divider">

                            @if (!empty($segmentosClientes))
                                <ul>
                                    @foreach ($segmentosClientes as $item)
                                        <li>{{ $item }}</li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-muted mb-0">Sem segmentos adicionais cadastrados.</p>
                            @endif
                        </div>
                    </div>

                </div>

                <!-- PARTE DE BAIXO (estrutura de custos / fontes de receita) -->
                <div class="bmodel-bottom border-top">

                    <!-- Estrutura de custos -->
                    <div class="bmodel-cell">
                        <div class="bmodel-header">
                            <span>Estrutura de custos</span>
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <div class="bmodel-body">
                            @if (!empty($estruturaCustos))
                                <ul>
                                    @foreach ($estruturaCustos as $item)
                                        <li>{{ $item }}</li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-muted mb-0">Não informado.</p>
                            @endif
                        </div>
                    </div>

                    <!-- Fontes de receita -->
                    <div class="bmodel-cell border-start">
                        <div class="bmodel-header">
                            <span>Fontes de receita</span>
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="bmodel-body">
                            @if (!empty($fontesReceitaParte1))
                                <ul>
                                    @foreach ($fontesReceitaParte1 as $item)
                                        <li>{{ $item }}</li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-muted mb-2">Não informado.</p>
                            @endif

                            <hr class="bmodel-divider">

                            @if (!empty($fontesReceitaParte2))
                                <ul>
                                    @foreach ($fontesReceitaParte2 as $item)
                                        <li>{{ $item }}</li>
                                    @endforeach
                                </ul>
                            @else
                                <p class="text-muted mb-0">Sem modelos de monetização adicionais.</p>
                            @endif
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </section>
    <!-- End Business Model Section App -->


    <!-- Start Partnerships Section -->
    <section class="tem-wrap">
        <div class="container">
            <h2 class="tem-title mb-3">Parcerias</h2>

            @php
                $partnerships = $businessData['20']['partnerships'] ?? [];

                // remove entradas sem ano ou descrição
                $partnerships = array_filter($partnerships, function ($item) {
                    return !empty($item['year']) && !empty($item['description']);
                });

                // ordenar do ano menor para o maior
                usort($partnerships, function ($a, $b) {
                    return intval($a['year']) <=> intval($b['year']);
                });

                $partnershipCount = count($partnerships);
            @endphp

            <div class="partnership-wrapper border border-2 border-blue-900 rounded-3 p-2 bg-white">
                <div class="partnership-scroll">
                    <div class="partnership-track d-flex align-items-center gap-4">

                        @foreach ($partnerships as $index => $partnership)
                            @php
                                $year = $partnership['year'] ?? '';
                                $fullDesc = $partnership['description'] ?? '';

                                // texto curto com "..." (AGORA 60 chars)
                                $shortDesc = \Illuminate\Support\Str::limit($fullDesc, 60, '...');

                                $isLast = ($index === $partnershipCount - 1);
                            @endphp

                            <div class="partnership-item"
                                data-descbig="{{ e($fullDesc) }}"
                                data-full-text="{{ e($fullDesc) }}"
                                data-modal-title="Parcerias - {{ $year }}">
                                <h4 class="fw-bold text-primary fs-4">{{ $year }}</h4>
                                <p class="text-center partnership-text">
                                    {{ $shortDesc }}
                                </p>
                            </div>

                            @if (! $isLast)
                                <i class="fas fa-chevron-right text-primary fs-2"></i>
                            @endif
                        @endforeach

                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- End Partnerships Section -->

    <!-- Start Section Footer -->
    <section class="footer-section">
        <div class="container">
            <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div class="col-12 d-flex align-items-center justify-content-center">
                    <span class="mb-3 mb-md-0 text-body-secondary">© 2025 TEM - Versão 1.0.0</span>
                </div>
            </footer>
        </div>
    </section>
    <!-- End Section Footer -->

    <div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detalhes</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <!-- Conteúdo será preenchido via JavaScript -->
                </div>
            </div>
        </div>
    </div>

</body>

<!-- JS Scripts -->
<script src="{{ asset('assets/js/index.js') }}"></script>
<script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.bundle.min.js') }}"></script>
<script src="{{ asset('assets/js/resume-print.js') }}"></script>
<script src="{{ asset('assets/js/resume-modal-click.js') }}"></script>

</html>