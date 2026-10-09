<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <title>TEM - Territorial Effectuation Monitoring</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/img/favicon.ico') }}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('assets/vendor/bootstrap-5.3.8/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/fontawesome-free-5.15.4/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/design-tokens.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
</head>

<body>
    <!-- Start Section Header -->
    <header class="section-header">
        <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-between">
                <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
                    <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" alt="Logo TEM" />
                </a>
                <div class="d-flex align-items-center gap-3">
                    <ul class="nav nav-pills mb-0">
                        <li class="nav-item"><a href="#home" class="nav-link">Home</a></li>
                        <li class="nav-item"><a href="#sobre" class="nav-link">Sobre</a></li>
                        <li class="nav-item"><a href="/login" class="nav-link">Entrar</a></li>
                        <li class="nav-item"><a href="/signup" class="nav-link nav-link-btn">Registrar</a></li>
                    </ul>
                    <div class="ms-2 d-flex align-items-center">
                        @include('partials.google-translate')
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- End Section Header -->

    <!-- Start Section Hero -->
    <section class="section-hero" id="home">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Seja bem-vindo(a)</h1>
                <h2 class="hero-subtitle">
                    Territorial Effectuation Monitoring
                </h2>
                <p class="hero-text">
                    Uma ferramenta de apoio à pesquisa sobre trajetórias empreendedoras, conectando recursos, redes relacionais e modelos de negócios.
                </p>
                <div>
                    <a href="/login" class="hero-cta-btn">
                        Iniciar questionário <i class="fas fa-arrow-right ms-2"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>
    <!-- End Section Hero -->

    <!-- Start Section Content -->
    <main class="section-content">
        <div class="content-wrap">

            <!-- Como funciona -->
            <section class="content-block text-center" id="como-funciona">
                <h2 class="section-title">Como funciona?</h2>
                <div class="section-text">
                    <p>
                        O empreendedor responde a um questionário estruturado, com duração aproximada de 30 minutos.
                        Ao final, o sistema gera automaticamente um relatório descritivo, que apresenta:
                    </p>
                    <div class="d-flex justify-content-center mt-3">
                        <ul class="text-start" style="max-width: 620px;">
                            <li>A trajetória empreendedora ao longo do tempo, com seus principais marcos;</li>
                            <li>A configuração do modelo de negócio no momento da coleta de dados;</li>
                            <li>As principais parcerias formadas ao longo da trajetória.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Sobre o projeto -->
            <section class="content-block text-center" id="sobre">
                <h2 class="section-title">Sobre o projeto</h2>
                <div class="section-text">
                    <p>
                        A TEM foi desenvolvida para apoiar pesquisas sobre as lógicas de ação empreendedora em diferentes contextos,
                        com atenção à mobilização de recursos, às redes relacionais e à configuração dos modelos de negócios.
                    </p>
                    <p>
                        A ferramenta foi desenvolvida pela pesquisadora Aline Brufato, sob a coordenação do
                        professor Roberto Bartholo, com apoio da FAPERJ, por meio do edital Programa
                        Favela Inteligente em Apoio às Bases para o Parque de Inovação Social e Sustentável na
                        Rocinha.
                    </p>
                </div>

                <!-- Três cards com ícones -->
                <div class="feature-row">
                    <div class="row g-4">
                        <div class="col-12 col-md-4">
                            <div class="feature-card">
                                <div class="feature-icon-wrapper">
                                    <i class="fas fa-dollar-sign feature-icon"></i>
                                </div>
                                <p class="feature-text">
                                    Mobilização de recursos financeiros, humanos e estruturais na jornada do empreendedor.
                                </p>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="feature-card">
                                <div class="feature-icon-wrapper">
                                    <i class="fas fa-sliders-h feature-icon"></i>
                                </div>
                                <p class="feature-text">
                                    Análise dos processos de tomada de decisão e lógica de Effectuation territorial.
                                </p>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="feature-card">
                                <div class="feature-icon-wrapper">
                                    <i class="fas fa-clipboard-list feature-icon"></i>
                                </div>
                                <p class="feature-text">
                                    Geração de Business Model Canvas e relatórios sintetizados para pesquisa e planejamento.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Parceiros -->
            <section class="content-block text-center mb-0">
                <h2 class="section-title">Parceiros</h2>
                <div class="partners">
                    <img class="partner-logo" src="{{ asset('assets/img/logo-coppe-ufrj.webp') }}" alt="COPPE UFRJ" />
                    <img class="partner-logo" src="{{ asset('assets/img/logo-faperj.webp') }}" alt="FAPERJ" />
                    <img class="partner-logo" src="{{ asset('assets/img/logo-ltds.webp') }}" alt="LTDS" />
                </div>
            </section>

        </div>
    </main>
    <!-- End Section Content -->

    <script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.bundle.min.js') }}"></script>
</body>

</html>
