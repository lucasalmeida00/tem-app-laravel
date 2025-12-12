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

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

</head>

<body>
    <script>
        window.temBusinessHash = "{{ $business->url_hash }}";
        window.temBusinessStorageKey = "tem_business_" + window.temBusinessHash + "_data";

        // Dados iniciais vindos do banco (card 1..20)
        window.temInitialBusinessData = @json($businessData ?? (object)[]);

        (function syncInitialDataToLocalStorage() {
            try {
                const key = window.temBusinessStorageKey;
                const fromDb = window.temInitialBusinessData || {};

                // Se já tiver algo no localStorage, podemos mesclar, mas
                // por simplicidade vamos sobrescrever (sempre confiar no banco).
                localStorage.setItem(key, JSON.stringify(fromDb));
            } catch (e) {
                console.error("Erro ao sincronizar dados iniciais para o localStorage", e);
            }
        })();

        // URL para autosave
        window.temAutosaveUrl = "{{ route('dashboard.business.autosave', $business->url_hash) }}";
    </script>

    <!-- Overlay de loading da TEM -->
    <div id="tem-loading-overlay" class="tem-loading-overlay">
        <div class="tem-loading-overlay__backdrop"></div>
        <div class="tem-loading-overlay__content">
            <div class="text-center">
                <div class="spinner-border" role="status" aria-hidden="true"></div>
                <div class="mt-3 fw-bold">Carregando seu formulário...</div>
                <div class="text-muted small">Aguarde um instante</div>
            </div>
        </div>
    </div>

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

    <!-- Start Section Cards -->
    <section class="section-cards py-5">
        <div class="container d-flex justify-content-c align-items-center">
            <button class="btn btn-outline-secondary swiper-button-prev position-relative"
                style="left:-20px; margin-top: 0px;" type="button" aria-label="Slide anterior">
                <i class="fas fa-chevron-left"></i>
            </button>

            <div class="swiper position-relative" id="cardsCarousel">
                <div class="swiper-wrapper">

                    <div class="swiper-slide" data-card="1">
                        <div class="cards-card is-selected">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-landmark"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">01</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Identificação do
                                Empreendimento</h3>
                            <div class="cards-chip" id="card-tem-1">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="2">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-id-card"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">02</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Identificação do Empreendedor
                                Principal</h3>
                            <div class="cards-chip" id="card-tem-2">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="3">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-book-open"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">03</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Experiência e Conhecimentos
                                do Empreendedor</h3>
                            <div class="cards-chip" id="card-tem-3">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="4">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-wallet"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">04</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Recursos Financeiros e não
                                Financeiros</h3>
                            <div class="cards-chip" id="card-tem-4">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="5">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-globe"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">05</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Rede de Relações do Empreendedor
                            </h3>
                            <div class="cards-chip" id="card-tem-5">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="6">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-compass"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">06</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Processo de Decisão do
                                Empreendedor</h3>
                            <div class="cards-chip" id="card-tem-6">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="7">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-award"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">07</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Proposta de Valor</h3>
                            <div class="cards-chip" id="card-tem-7">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="8">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-tag"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">08</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Segmentos de Clientes</h3>
                            <div class="cards-chip" id="card-tem-8">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="9">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">09</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Canais</h3>
                            <div class="cards-chip" id="card-tem-9">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="10">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-handshake"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">10</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Relação com Clientes</h3>
                            <div class="cards-chip" id="card-tem-10">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="11">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-wallet"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">11</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Fonte de Receitas</h3>
                            <div class="cards-chip" id="card-tem-11">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="12">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-key"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">12</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Recursos-chave</h3>
                            <div class="cards-chip" id="card-tem-12">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="13">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-chart-line"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">13</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Atividades-chave</h3>
                            <div class="cards-chip" id="card-tem-13">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="14">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-handshake"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">14</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Parcerias-chave</h3>
                            <div class="cards-chip" id="card-tem-14">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="15">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-project-diagram"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">15</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Rede de Parcerias</h3>
                            <div class="cards-chip" id="card-tem-15">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="16">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-wallet"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">16</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Estrutura de Custos</h3>
                            <div class="cards-chip" id="card-tem-16">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="17">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-lightbulb"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">17</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Inovação</h3>
                            <div class="cards-chip" id="card-tem-17">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="18">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-globe"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">18</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Impactos e Externalidades
                                Positivas</h3>
                            <div class="cards-chip" id="card-tem-18">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="19">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-clock"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">19</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Trajetória do Empreendimento</h3>
                            <div class="cards-chip" id="card-tem-19">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide" data-card="20">
                        <div class="cards-card">
                            <div class="cards-icon">
                                <div class="icon-circle bg-secondary text-white">
                                    <i class="fas fa-handshake"></i>
                                    <span class="icon-badge bg-secondary text-white fw-bold">20</span>
                                </div>
                            </div>
                            <h3 class="cards-title text-secondary fw-bold text-center">Parcerias</h3>
                            <div class="cards-chip" id="card-tem-20">
                                <small class="tem-card-status-label badge rounded-pill">
        Não iniciado
    </small>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <button class="btn btn-outline-secondary swiper-button-next position-relative"
                style="right: -20px; margin-top: 0px;" type="button" aria-label="Próximo slide">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </section>
    <!-- End Section Cards -->

    <!-- Start Section Cards -->
     <section class="section-forms">
        <div class="container">
            <!-- Campos criados de forma dinâmica aqui... -->
        </div>
     </section>
    <!-- End Section Cards -->

    <!-- Start Section Navigation -->
    <section class="section-navigation py-3 border-top">
        <div class="container">
            <div class="d-flex flex-wrap justify-content-end gap-2">

                <!-- Bloco Anterior -->
                <button type="button"
                        class="btn btn-success d-flex align-items-center gap-2"
                        id="btnPrevBlock">
                    <i class="fas fa-chevron-left"></i>
                    <span id="prevBlockLabel">Bloco anterior: (1/20)</span>
                </button>

                <!-- Salvar e continuar mais tarde -->
                <button type="button"
                        class="btn btn-dark d-flex align-items-center gap-2"
                        id="btnSaveLater">
                    <i class="fas fa-save"></i>
                    <span>Salvar e continuar mais tarde</span>
                </button>

                <!-- Próximo bloco -->
                <button type="button"
                        class="btn btn-danger d-flex align-items-center gap-2"
                        id="btnNextBlock">
                    <span id="nextBlockLabel">Próximo bloco: (2/20)</span>
                    <i class="fas fa-chevron-right"></i>
                </button>

                <!-- Bloco de Finalizar -->
                <button type="button" id="btnFinish" class="btn btn-primary d-none">
                    <i class="fas fa-check me-2"></i> Finalizar
                </button>

            </div>
        </div>
    </section>
    <!-- End Section Navigation -->

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

<!-- Start - 19 Business Section Modal -->
<div class="modal fade" id="trajectoryEditModal" tabindex="-1" aria-labelledby="trajectoryEditModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="trajectoryEditModalLabel">Editar marco</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="trajEditYear" class="form-label">Ano do marco:</label>
                    <input type="number" class="form-control" id="trajEditYear" name="trajEditYear" placeholder="2025">
                </div>
                <div class="mb-3">
                    <label for="trajEditDesc" class="form-label">Descrição do marco:</label>
                    <textarea class="form-control" id="trajEditDesc" name="trajEditDesc" rows="4" maxlength="1000"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-confirm-edit">
                    <i class="fas fa-check me-1"></i> Editar
                </button>
            </div>
        </div>
    </div>
</div>
<!-- End - 19 Business Section Modal -->

<!-- Start - 20 Business Section Modal -->
<div class="modal fade" id="partnershipEditModal" tabindex="-1" aria-labelledby="partnershipEditModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="partnershipEditModalLabel">Editar parceria</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="partEditYear" class="form-label">Ano da parceria:</label>
                    <input type="number" class="form-control" id="partEditYear" name="partEditYear" placeholder="2025">
                </div>
                <div class="mb-3">
                    <label for="partEditDesc" class="form-label">Descrição da parceria:</label>
                    <textarea class="form-control" id="partEditDesc" name="partEditDesc" rows="4" maxlength="1000"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-confirm-part-edit">
                    <i class="fas fa-check me-1"></i> Editar
                </button>
            </div>
        </div>
    </div>
</div>
<!-- End - 20 Business Section Modal -->

<!-- JS Scripts -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js" crossorigin="anonymous"></script>
<script src="{{ asset('assets/js/index.js') }}"></script>
<script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.min.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="{{ asset('assets/js/app-carrosel.js') }}"></script>
<script src="{{ asset('assets/js/app-loading-overlay.js') }}"></script>

<script src="{{ asset('assets/js/forms-schema.js') }}"></script>
<script src="{{ asset('assets/js/options/countries-pt.js') }}"></script>

<script src="{{ asset('assets/js/forms/identificacao-do-empreendimento-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/identificacao-do-empreendedor-principal-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/experiencia-e-conhecimentos-do-empreendedor-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/recursos-financeiros-e-nao-financeiros-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/rede-de-relacoes-do-empreendedor-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/processo-de-decisao-do-empreendedor-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/proposta-de-valor-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/segmentos-de-clientes-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/canais-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/relacao-com-clientes-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/fontes-de-receita-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/recursos-chave-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/atividades-chave-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/parcerias-chave-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/rede-de-parcerias-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/estrutura-de-custos-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/inovacao-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/impactos-e-externalidades-positivas-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/trajetoria-do-empreendimento-form.js') }}"></script>
<script src="{{ asset('assets/js/forms/parcerias-form.js') }}"></script>

<script src="{{ asset('assets/js/form-renderer.js') }}"></script>
<script src="{{ asset('assets/js/card1-identificacao.js') }}"></script>
<script src="{{ asset('assets/js/card2-identificacao-empreendedor.js') }}"></script>
<script src="{{ asset('assets/js/card3-experiencia-e-conhecimentos.js') }}"></script>
<script src="{{ asset('assets/js/card-4-recursos-financeiros.js') }}"></script>
<script src="{{ asset('assets/js/card5-rede-relacoes.js') }}"></script>
<script src="{{ asset('assets/js/card6-processo-decisao.js') }}"></script>
<script src="{{ asset('assets/js/card7-proposta-de-valor.js') }}"></script>
<script src="{{ asset('assets/js/card8-segmentos-de-clientes.js') }}"></script>
<script src="{{ asset('assets/js/card9-canais.js') }}"></script>
<script src="{{ asset('assets/js/card10-relacao-com-clientes.js') }}"></script>
<script src="{{ asset('assets/js/card11-fontes-de-receita.js') }}"></script>
<script src="{{ asset('assets/js/card12-recursos-chave.js') }}"></script>
<script src="{{ asset('assets/js/card13-atividades-chave.js') }}"></script>
<script src="{{ asset('assets/js/card14-parcerias-chave.js') }}"></script>
<script src="{{ asset('assets/js/card15-rede-de-parcerias.js') }}"></script>
<script src="{{ asset('assets/js/card16-estrutura-de-custos.js') }}"></script>
<script src="{{ asset('assets/js/card-17-inovacao.js') }}"></script>
<script src="{{ asset('assets/js/card-18-impactos-e-externalidades-positivas.js') }}"></script>
<script src="{{ asset('assets/js/card-19-trajetoria-do-empreendimento.js') }}"></script>
<script src="{{ asset('assets/js/card-20-parcerias.js') }}"></script>

<script src="{{ asset('assets/js/app-navigation-buttons.js') }}"></script>
<script src="{{ asset('assets/js/app-save-later.js') }}"></script>
<script src="{{ asset('assets/js/app-card-status.js') }}"></script>


<script>
  // Render inicial do Card 1 (o primeiro já vem .is-selected no seu HTML)
  document.addEventListener('DOMContentLoaded', () => {
    if (window.renderDynamicForm) window.renderDynamicForm(1);
  });

  // (Opcional) Se quiser ouvir o evento:
  window.addEventListener('card:selected', (ev) => {
    // console.log("card:", ev.detail.cardId);
  });
</script>

</html>