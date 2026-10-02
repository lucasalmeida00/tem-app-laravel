<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <title>Dashboard - TEM (Territorial Effectuation Monitoring)</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/img/favicon.ico') }}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="stylesheet" href="{{ asset('assets/vendor/bootstrap-5.3.8/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/fontawesome-free-5.15.4/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/design-tokens.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
</head>

<body>
    <!-- Start Section Header -->
    <header class="section-header">
        <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-between">
                <a href="{{ route('dashboard') }}" class="d-flex align-items-center text-dark text-decoration-none">
                    <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" alt="Logo TEM" />
                </a>
                <div class="d-flex align-items-center gap-3">
                    <ul class="nav nav-pills mb-0">
                        <li class="nav-item"><a href="{{ route('dashboard') }}" class="nav-link active">Início</a></li>
                        <li class="nav-item"><a href="{{ route('logout') }}" class="nav-link text-danger">Sair</a></li>
                    </ul>
                    <div class="ms-2 d-flex align-items-center">
                        @include('partials.google-translate')
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- End Section Header -->

    <!-- Start Section App -->
    <main class="tem-wrap">
        <div class="container">

            <div class="dashboard-hero-card">
                <h1 class="tem-title">Seja bem-vindo(a) ao TEM</h1>
                <p>
                    Preencha o questionário sobre a trajetória e modelo do seu empreendimento. Ao concluir as etapas, o sistema gerará automaticamente:
                </p>
                <ul class="dashboard-features-list">
                    <li class="dashboard-feature-item"><i class="fas fa-stream"></i> Linha do Tempo da Trajetória</li>
                    <li class="dashboard-feature-item"><i class="fas fa-th-large"></i> Business Model Canvas</li>
                    <li class="dashboard-feature-item"><i class="fas fa-project-diagram"></i> Rede de Parcerias</li>
                </ul>
            </div>

            <div class="dashboard-actions-bar">
                <h2 class="dashboard-section-heading">Seus Empreendimentos</h2>
                <button class="btn-tem" data-bs-toggle="modal" data-bs-target="#newBusinessModal">
                    <i class="fas fa-plus"></i> Adicionar empreendimento
                </button>
            </div>

            <div class="business-grid">
                @forelse ($businesses as $business)
                    <div class="business-card-item" data-business-id="{{ $business->id }}">
                        <div class="business-card-info">
                            <h3 class="business-card-title">{{ $business->business_name }}</h3>
                            <span class="business-card-subtitle">
                                @if ($business->formatted_cnpj)
                                    CNPJ: {{ $business->formatted_cnpj }}
                                @else
                                    Pessoa Física / Sem CNPJ
                                @endif
                            </span>
                        </div>
                        <div class="business-card-actions">
                            <a href="{{ route('dashboard.business.resume', $business->url_hash) }}"
                               class="btn-action-outline"
                               title="Visualizar Resumo e Relatórios">
                                <i class="fas fa-chart-pie"></i> Resumo
                            </a>

                            <a href="{{ route('dashboard.business.show', $business->url_hash) }}"
                               class="btn-action-primary"
                               title="Continuar preenchimento">
                                <i class="fas fa-pencil-alt"></i> Questionário
                            </a>

                            <button type="button"
                                    class="btn-action-danger js-delete-business"
                                    title="Excluir empreendimento"
                                    data-id="{{ $business->id }}"
                                    data-name="{{ $business->business_name }}"
                                    data-url="{{ route('dashboard.business.destroy', $business) }}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                @empty
                    <div class="empty-state-card">
                        <i class="fas fa-building empty-state-icon"></i>
                        <h4 class="fw-bold mb-2">Nenhum empreendimento cadastrado</h4>
                        <p class="mb-4">Clique no botão abaixo para iniciar o mapeamento do seu primeiro negócio.</p>
                        <button class="btn-tem" data-bs-toggle="modal" data-bs-target="#newBusinessModal">
                            <i class="fas fa-plus"></i> Adicionar primeiro empreendimento
                        </button>
                    </div>
                @endforelse
            </div>

        </div>
    </main>
    <!-- End Section App -->

    <!-- Modal Adicionar Empreendimento -->
    <div class="modal fade" id="newBusinessModal" tabindex="-1" aria-labelledby="newBusinessModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <form id="newBusinessForm">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title" id="newBusinessModalLabel"><i class="fas fa-building text-primary me-2"></i>Novo Empreendimento</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="business_name" class="form-label">
                                Nome do Empreendimento <span class="required-asterisk">*</span>
                            </label>
                            <input type="text"
                                   class="form-control"
                                   id="business_name"
                                   name="business_name"
                                   required
                                   minlength="2"
                                   maxlength="255"
                                   placeholder="Ex: Minha Empresa / Meu Negócio">
                            <div class="invalid-feedback">Por favor, informe o nome do empreendimento.</div>
                        </div>

                        <div class="mb-3">
                            <label for="cnpj" class="form-label">CNPJ (opcional)</label>
                            <input type="text"
                                   class="form-control"
                                   id="cnpj"
                                   name="cnpj"
                                   placeholder="00.000.000/0000-00"
                                   maxlength="18">
                            <div class="invalid-feedback">CNPJ inválido.</div>
                        </div>

                        <div id="modal-error-alert" class="alert alert-danger d-none" role="alert"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn-tem" id="btnSaveBusiness">
                            <i class="fas fa-check"></i> Criar e Iniciar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div class="modal fade" id="deleteBusinessModal" tabindex="-1" aria-labelledby="deleteBusinessModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-danger" id="deleteBusinessModalLabel"><i class="fas fa-exclamation-triangle me-2"></i>Excluir Empreendimento</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <p>Tem certeza de que deseja excluir o empreendimento <strong id="deleteBusinessName"></strong>?</p>
                    <p class="text-muted small mb-0">Esta ação apagará todas as respostas e dados coletados até o momento e não poderá ser desfeita.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmDelete">
                        <i class="fas fa-trash-alt me-1"></i> Sim, Excluir
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Start Section Footer -->
    <footer class="footer-section bg-white border-top py-4 mt-auto">
        <div class="container d-flex flex-wrap justify-content-between align-items-center">
            <p class="col-md-4 mb-0 text-muted small">&copy; TEM - Territorial Effectuation Monitoring</p>
            <div class="col-md-4 d-flex align-items-center justify-content-center">
                <img src="{{ asset('assets/img/tem-logo.png') }}" alt="Logo TEM" style="height: 32px;" />
            </div>
            <ul class="nav col-md-4 justify-content-end">
                <li class="nav-item"><a href="/" class="nav-link px-2 text-muted small">Início</a></li>
                <li class="nav-item"><a href="{{ route('logout') }}" class="nav-link px-2 text-muted small">Sair</a></li>
            </ul>
        </div>
    </footer>
    <!-- End Section Footer -->

    <!-- JS Scripts -->
    <script>
        window.businessStoreUrl = "{{ route('dashboard.business.store') }}";
    </script>
    <script src="{{ asset('assets/vendor/jquery-3.7.1/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/js/dashboard.js') }}"></script>

</body>

</html>