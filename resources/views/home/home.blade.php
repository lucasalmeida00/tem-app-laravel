<!DOCTYPE html>
<html>

<head>
    <title>TEM - Territorial Effectuation Monitoring</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/img/favicon.ico') }}">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="{{ asset('assets/vendor/bootstrap-5.3.8/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/fontawesome-free-5.15.4/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
</head>

<body>
    <!-- Start Section Header -->
    <section class="section-header">
        <div class="container">
            <header class="d-flex flex-wrap justify-content-center">
                <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                    <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" />
                </a>
                <ul class="nav nav-pills">
                    {{-- <li class="nav-item"><a href="#home" class="nav-link" aria-current="page">Home</a></li> --}}
                    {{-- <li class="nav-item"><a href="#sobre" class="nav-link">Sobre</a></li> --}}
                    <li class="nav-item"><a href="/login" class="nav-link">Entrar</a></li>
                    <li class="nav-item"><a href="/signup" class="nav-link">Registrar-se</a></li>
                </ul>
            </header>
        </div>
    </section>
    <!-- End Section Header -->

    <!-- Start Section Hero -->
    <section class="section-hero" id="home">
        <div class="hero-container d-flex flex-column justify-content-center text-white">
            <div class="hero-content col-12 col-md-6">
                <h1 class="hero-title fw-bold display-4">Seja bem-vindo(a)</h1>
                <h2 class="hero-subtitle fw-semibold fs-3 mb-4">
                   Territorial Effectuation Monitoring
                </h2>
                <p class="hero-text fs-5">
                   Uma ferramenta de apoio à pesquisa sobre trajetórias empreendedoras
                </p>
            </div>
        </div>
    </section>
    <!-- End Section Hero -->

    <!-- Start Section Content -->
    <section class="section-content">
        <div class="content-wrap">

            <!-- Como funciona -->
            <section class="content-block text-center">
                <h1 class="section-title">Como funciona?</h1>
                <div class="section-text">
                    <p>
                        O empreendedor responde a um questionário estruturado, com duração aproximada de 20 minutos.
                        Ao final, o sistema gera automaticamente um relatório descritivo, que apresenta:
                    </p>
                    <ul class="text-start mx-auto" style="max-width: 600px;">
                        <li>a trajetória empreendedora ao longo do tempo, com seus principais marcos;</li>
                        <li>a configuração do modelo de negócio no momento da coleta;</li>
                        <li>as parcerias formadas ao longo da trajetória.</li>
                    </ul>
                </div>
            </section>

            <!-- Sobre o projeto -->
            <section class="content-block text-center" id="sobre">
                <h1 class="section-title">Sobre o projeto</h1>
                <div class="section-text">
                    <p>
                        A TEM foi desenvolvida para apoiar pesquisas sobre as lógicas de ação empreendedora em diferentes contextos,
                        com atenção à mobilização de recursos, às redes relacionais e à configuração dos modelos de negócios.
                    </p>
                    <p>
                        A ferramenta foi desenvolvida com o apoio da FAPERJ, por meio do edital Programa Favela Inteligente
                        em Apoio às Bases para o Parque de Inovação Social e Sustentável na Rocinha.
                    </p>
                </div>
            </section>

            {{-- <!-- Três cards com ícones -->
            <section class="feature-row">
                <div class="row g-4">
                    <div class="col-12 col-md-4">
                        <div class="feature-card feature-muted text-center">
                            <i class="fas fa-dollar-sign feature-icon"></i>
                            <p class="feature-text">
                                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna.
                                Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
                                Maecenas vitae.
                            </p>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="feature-card text-center">
                            <i class="fas fa-sliders-h feature-icon"></i>
                            <p class="feature-text">
                                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna.
                                Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
                                Maecenas vitae.
                            </p>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="feature-card feature-muted text-center">
                            <i class="fas fa-clipboard-list feature-icon"></i>
                            <p class="feature-text">
                                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna.
                                Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
                                Maecenas vitae.
                            </p>
                        </div>
                    </div>
                </div>
            </section> --}}

            <!-- Parceiros -->
            <section class="content-block text-center">
                <h1 class="section-title">Parceiros</h1>
                <div class="partners">
                    <img src="{{ asset('assets/img/logo-ltds.webp') }}" alt="LTDS" class="partner-logo">
                    <img src="{{ asset('assets/img/logo-pep.png') }}" alt="PEP" class="partner-logo">
                    <img src="{{ asset('assets/img/logo-coppe-ufrj.webp') }}" alt="COPPE UFRJ" class="partner-logo">
                    <img src="{{ asset('assets/img/logo-faperj.webp') }}" alt="FAPERJ" class="partner-logo">
                </div>
            </section>

        </div>
    </section>
    <!-- End Section Content -->

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
</body>

<!-- JS Scripts -->
<script src="{{ asset('assets/js/index.js') }}"></script>
<script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.min.js') }}"></script>

</html>
