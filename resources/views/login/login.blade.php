<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <title>Login - TEM (Territorial Effectuation Monitoring)</title>
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

        <div class="auth-card text-center">
            <a href="/" class="d-inline-block text-decoration-none">
                <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" alt="TEM Logo" />
            </a>

            <form class="login-form" id="login-form">
                @csrf
                <div class="form-group">
                    <label for="email" class="form-label">
                        Usuário / E-mail <span class="required-asterisk">*</span>
                    </label>
                    <input type="email" id="email" name="email" class="form-control" required maxlength="255"
                        pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                        title="Informe um e-mail válido, por exemplo: nome@dominio.com" placeholder="Digite seu usuário ou e-mail" />
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">
                        Senha <span class="required-asterisk">*</span>
                    </label>
                    <div class="password-field">
                        <input type="password" id="password" name="password" class="form-control" required minlength="1"
                            maxlength="255" placeholder="Digite sua senha" />
                        <i class="fa fa-eye password-toggle" data-target="password" title="Mostrar senha"></i>
                    </div>
                    <a href="#" class="forgot-password-link" onclick="alert('Entre em contato com o suporte ou administrador do projeto.'); return false;">Esqueceu a senha?</a>
                </div>

                <button type="submit" id="login-submit" class="btn-submit">
                    Entrar
                </button>

                <div id="login-errors" class="text-danger mt-3 text-start small"></div>
                <div id="login-success" class="text-success mt-3 text-start small"></div>

                <div class="auth-footer-message">
                    Ainda não possui uma conta? <a href="{{ route('signup') }}">Cadastre-se</a>
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
        window.loginUrl = "{{ route('login.attempt') }}";
        window.dashboardUrl = "{{ route('dashboard') }}";
        window.recaptchaSiteKey = "{{ config('services.recaptcha.site_key') }}";
    </script>

    <script src="{{ asset('assets/js/index.js') }}"></script>
    <script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.bundle.min.js') }}"></script>
    <script src="https://www.google.com/recaptcha/api.js?render={{ config('services.recaptcha.site_key') }}"></script>
    <script src="{{ asset('assets/js/login.js') }}"></script>

</body>

</html>
