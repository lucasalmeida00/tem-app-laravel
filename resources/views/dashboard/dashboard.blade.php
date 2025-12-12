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

    <!-- Start Section App -->
    <section class="tem-wrap">
        <div class="container">
            <h1 class="tem-title">Seja bem-vindo(a) ao TEM.</h1>

            <p>Preencha o formulário sobre seu empreendimento e ao final você terá acesso a 3 gráficos:</p>
            <ul class="tem-list">
                <li>Linha do tempo</li>
                <li>Modelo de Negócios</li>
                <li>Gráfico de Parcerias</li>
            </ul>

            <div class="tem-actions">
                <button class="btn btn-brand" data-bs-toggle="modal" data-bs-target="#newBusinessModal">
                    <i class="fas fa-plus"></i>
                    Adicionar empreendimento
                </button>
            </div>

            <div class="tem-list">
                @forelse ($businesses as $business)
                    <div class="tem-item mb-2" data-business-id="{{ $business->id }}">
                        <div class="tem-item__left">
                            {{ $business->business_name }}
                            @if ($business->formatted_cnpj)
                                <small>({{ $business->formatted_cnpj }})</small>
                            @endif
                        </div>
                        <div class="tem-item__right">
                            <a href="{{ route('dashboard.business.resume', $business->url_hash) }}"
                            class="btn btn-brand btn-xs"
                            title="Resumo">
                                <i class="fas fa-file"></i>
                            </a>

                            <a href="{{ route('dashboard.business.show', $business->url_hash) }}"
                            class="btn btn-brand btn-xs"
                            title="Editar">
                                <i class="fas fa-pencil-alt"></i>
                            </a>

                            <button type="button"
                                    class="btn btn-brand btn-xs js-delete-business"
                                    title="Excluir"
                                    data-id="{{ $business->id }}"
                                    data-name="{{ $business->business_name }}"
                                    data-url="{{ route('dashboard.business.destroy', $business) }}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                @empty
                    <p>Nenhum empreendimento cadastrado ainda.</p>
                @endforelse
            </div>

        </div>
    </section>
    <!-- End Section App -->

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

<!-- Start Modal de Novo Negócio -->
<div class="modal fade" id="newBusinessModal" tabindex="-1" aria-labelledby="newBusinessModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="newBusinessModalLabel">Novo Empreendimento</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>

            <div class="modal-body">
                <form id="new-business-form">
                    @csrf

                    <div class="mb-3">
                        <label for="business_name" class="form-label">
                            Nome do Empreendimento <span class="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="business_name"
                            name="business_name"
                            class="form-control"
                            required
                            minlength="1"
                            maxlength="255"
                            pattern=".{1,255}"
                            title="Informe um nome com pelo menos 1 caractere e no máximo 255."
                            placeholder="Ex: Padaria do João"
                        >
                    </div>

                    <div id="new-business-errors" class="text-danger small"></div>
                    <div id="new-business-success" class="text-success small mt-2"></div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button type="button" id="new-business-submit" class="btn btn-primary">
                    Adicionar
                </button>
            </div>

        </div>
    </div>
</div>
<!-- End Modal de Novo Negócio -->

<!-- Start Modal de Confirmação de Exclusão -->
<div class="modal fade" id="deleteBusinessModal" tabindex="-1" aria-labelledby="deleteBusinessModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="deleteBusinessModalLabel">Excluir Empreendimento</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>

            <div class="modal-body">
                <p>
                    Tem certeza que deseja excluir o empreendimento
                    <strong id="delete-business-name"></strong>?
                </p>
                <p class="mb-0 text-danger">
                    Esta ação é irreversível.
                </p>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button type="button" id="confirm-delete-business" class="btn btn-danger">
                    Excluir
                </button>
            </div>

        </div>
    </div>
</div>
<!-- End Modal de Confirmação de Exclusão -->

<!-- JS Scripts -->
<script src="{{ asset('assets/js/index.js') }}"></script>
<script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.bundle.min.js') }}"></script>

<script>
    window.dashboardBusinessStoreUrl = "{{ route('dashboard.business.store') }}";
    window.dashboardBusinessDestroyUrl = "{{ route('dashboard.business.destroy', ['business' => '__ID__']) }}";
</script>
<script src="{{ asset('assets/js/dashboard.js') }}"></script>

</html>