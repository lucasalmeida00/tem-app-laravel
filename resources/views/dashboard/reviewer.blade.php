<!DOCTYPE html>
<html>

<head>
    <title>TEM - Territorial Effectuation Monitoring</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/img/favicon.ico') }}">
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="stylesheet" href="{{ asset('assets/vendor/bootstrap-5.3.8/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/fontawesome-free-5.15.4/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
</head>

<body>
    <!-- Start Section Header -->
    <section class="section-header">
        <div class="container">
            <header class="d-flex flex-wrap justify-content-center">
                <a href="{{ route('dashboard') }}" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                    <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" />
                </a>
                <ul class="nav nav-pills">
                    <li class="nav-item"><a href="{{ route('dashboard') }}" class="nav-link" aria-current="page">Início</a></li>
                    <li class="nav-item"><a href="{{ route('logout') }}" class="nav-link">Sair</a></li>
                </ul>
            </header>
        </div>
    </section>
    <!-- End Section Header -->

    <!-- Start Section Review -->
    <section class="content-body">
        <div class="container py-5">
            <div class="row g-4">

                {{-- CARD 1 - Sumário Executivo --}}
                {{-- <div class="mb-4">
                    <div class="card border-0" style="background-color: #e5e7eb;">
                        <div class="card-body py-4 px-4">
                            <h2 class="h4 mb-0 text-center" style="color: #1e71bd;">
                                Sumário Executivo
                            </h2>
                        </div>
                    </div>
                </div> --}}

                {{-- CARD 2 - Empreendimentos --}}
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm h-100" style="background-color: #e5e7eb;">
                        <div class="card-body p-4">
                            <h2 class="h5 mb-3 text-center" style="color: #1e71bd;">
                                Empreendimentos
                            </h2>

                            @forelse ($businesses as $business)
                                <div class="d-flex justify-content-between align-items-center p-2 mb-2 rounded"
                                    style="background-color: #d1d5db;">
                                    <span class="fw-semibold text-dark" style="font-size: 0.9rem;">
                                        {{ $business->business_name ?? $business->name ?? 'Empreendimento sem nome' }}
                                    </span>

                                    <a href="{{ route('dashboard.business.resume', ['url_hash' => $business->url_hash]) }}"
                                        class="btn btn-sm btn-primary" style="font-size: 0.85rem; padding: 0.25rem 0.75rem;">
                                            Ver mais
                                    </a>
                                </div>
                            @empty
                                <p class="text-muted mb-0 text-center" style="font-size: 0.9rem;">
                                    Nenhum empreendimento encontrado para avaliação.
                                </p>
                            @endforelse
                        </div>
                    </div>
                </div>

                {{-- CARD 3 - Análises Conjuntas --}}
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm h-100" style="background-color: #e5e7eb;">
                        <div class="card-body p-4 d-flex flex-column">
                            <h2 class="h5 mb-3 text-center" style="color: #1e71bd;">
                                Análise Conjunta
                            </h2>
                            
                            <div class="d-flex flex-column justify-content-center align-items-center text-center flex-fill">
                                <p class="text-dark mb-4" style="font-size: 0.95rem;">
                                    Clique no ícone e baixe o relatório de acompanhamento do conjunto de empreendimentos
                                </p>

                                <a href="{{ asset('documents/RELATORIO DE ACOMPANHAMENTO COM ANEXOS 21 DEZ 2025.pdf') }}" 
                                   class="btn btn-lg rounded-circle d-flex align-items-center justify-content-center"
                                   style="width: 80px; height: 80px; background-color: #1e71bd; color: white;"
                                   download
                                   title="Baixar relatório">
                                    <i class="fas fa-file-pdf fa-2x"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
    <!-- End Section Review -->

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
<script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.bundle.min.js') }}"></script>

</html>
