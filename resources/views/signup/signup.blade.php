<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <title>Cadastrar - TEM (Territorial Effectuation Monitoring)</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/img/favicon.ico') }}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="stylesheet" href="{{ asset('assets/vendor/bootstrap-5.3.8/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/fontawesome-free-5.15.4/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/design-tokens.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/login.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
</head>

<body>

    <div class="auth-page">
        <div class="w-100 d-flex justify-content-end pe-3">
            @include('partials.google-translate')
        </div>

        <div class="auth-card auth-card-lg text-center">
            <a href="/" class="d-inline-block text-decoration-none">
                <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" alt="TEM Logo" />
            </a>

            <form class="login-form" id="signup-form">
                @csrf
                <div class="form-group">
                    <label for="name" class="form-label">
                        Nome da pessoa física ou empresa <span class="required-asterisk">*</span>
                    </label>
                    <input type="text" id="name" name="name" class="form-control" required minlength="2" maxlength="255"
                        pattern=".{2,255}" title="Informe um nome com pelo menos 2 caracteres." placeholder="Digite o nome completo ou razão social" />
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">
                        E-mail <span class="required-asterisk">*</span>
                    </label>
                    <input type="email" id="email" name="email" class="form-control" required maxlength="255"
                        pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                        title="Informe um e-mail válido, por exemplo: nome@dominio.com" placeholder="Digite seu melhor e-mail" />
                </div>

                <div class="row g-3">
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="password" class="form-label">
                                Senha <span class="required-asterisk">*</span>
                            </label>
                            <div class="password-field">
                                <input type="password" id="password" name="password" class="form-control" required minlength="8"
                                    maxlength="255" pattern=".{8,}" title="A senha deve ter pelo menos 8 caracteres." placeholder="Mínimo 8 caracteres" />
                                <i class="fa fa-eye password-toggle" data-target="password" title="Mostrar senha"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="password_confirmation" class="form-label">
                                Confirmar Senha <span class="required-asterisk">*</span>
                            </label>
                            <div class="password-field">
                                <input type="password" id="password_confirmation" name="password_confirmation" class="form-control"
                                    required minlength="8" maxlength="255" pattern=".{8,}"
                                    title="Repita a mesma senha informada." placeholder="Repita sua senha" />
                                <i class="fa fa-eye password-toggle" data-target="password_confirmation" title="Mostrar senha"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lgpd-consent-box">
                    <div class="lgpd-title">Proteção de Dados e Termos (LGPD)</div>
                    <div class="lgpd-text">
                        <p class="mb-1">
                            As informações fornecidas nesta plataforma, incluindo dados cadastrais do
                            empreendedor e do empreendimento, serão tratadas de acordo com a Lei nº
                            13.709/2018 – Lei Geral de Proteção de Dados Pessoais (LGPD).
                        </p>
                        <p class="mb-0">
                            Os dados coletados serão utilizados estritamente para finalidades de pesquisa acadêmica, caracterização dos empreendimentos e geração dos relatórios produzidos pela TEM, preservando a confidencialidade e segurança dos dados.
                        </p>
                    </div>
                    <div class="form-check mt-2 pt-1">
                        <input type="checkbox" class="form-check-input" id="lgpd_consent" name="lgpd_consent" required>
                        <label class="form-check-label" for="lgpd_consent">
                            Li e estou ciente das informações sobre o tratamento dos meus dados pessoais nos termos da LGPD.
                        </label>
                    </div>
                </div>

                <button type="submit" id="signup-submit" class="btn-submit">Criar minha conta</button>

                <div id="signup-errors" class="text-danger mt-2 text-start small"></div>
                <div id="signup-success" class="text-success mt-2 text-start small"></div>

                <div class="auth-footer-message">
                    Já tem uma conta? <a href="{{ route('login') }}">Faça Login</a>
                </div>
            </form>
        </div>

        <div class="auth-footer-partners">
            <img src="{{ asset('assets/img/logo-coppe-ufrj.webp') }}" alt="COPPE UFRJ" />
            <img src="{{ asset('assets/img/logo-faperj.webp') }}" alt="FAPERJ" />
            <img src="{{ asset('assets/img/logo-ltds.webp') }}" alt="LTDS" />
        </div>
    </div>

    <!-- JS Scripts -->
    <script>
        window.signupUrl = "{{ route('signup.store') }}";
        window.dashboardUrl = "{{ route('dashboard') }}";
        window.recaptchaSiteKey = "{{ config('services.recaptcha.site_key') }}";
    </script>

    <script src="{{ asset('assets/js/index.js') }}"></script>
    <script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.bundle.min.js') }}"></script>
    <script src="https://www.google.com/recaptcha/api.js?render={{ config('services.recaptcha.site_key') }}"></script>
    <script src="{{ asset('assets/js/signup.js') }}"></script>

</body>

</html>
