<!DOCTYPE html>
<html>

<head>
    <title>Login - TEM (Territorial Effectuation Monitoring)</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/img/favicon.ico') }}">
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="stylesheet" href="{{ asset('assets/vendor/bootstrap-5.3.8/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/vendor/fontawesome-free-5.15.4/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/login.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
</head>

<body>

    <div class="login-page">
        <div class="form">
            <form class="login-form" id="login-form">
                @csrf
                <a href="/" class="d-flex align-items-center justify-content-center me-md-auto text-dark text-decoration-none text-center mb-20">
                    <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" width="200" />
                </a>
                <input type="email" id="email" name="email" class="form-control w-270" required maxlength="255"
                    pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                    title="Informe um e-mail válido, por exemplo: nome@dominio.com" placeholder="Seu E-mail" />
                <input type="password" id="password" name="password" class="form-control w-270" required minlength="8"
                    maxlength="255" pattern=".{1,}" title="A senha deve ter pelo menos 1 caracteres." placeholder="Sua Senha" />
                <button type="submit" id="login-submit" class="btn-tem w-100">
                    Entrar
                </button>

                <div id="login-errors" class="text-danger mt-3"></div>
                <div id="login-success" class="text-success mt-3"></div>

                <p class="message mt-3">
                    Não tem uma conta? <a href="{{ route('signup') }}">Crie uma conta!</a>
                </p>
            </form>
        </div>
    </div>

</body>

<!-- JS Scripts -->
 <script>
    window.loginUrl     = "{{ route('login.attempt') }}";
    window.dashboardUrl = "{{ route('dashboard') }}";
    window.recaptchaSiteKey = "{{ config('services.recaptcha.site_key') }}";
</script>

<script src="{{ asset('assets/js/index.js') }}"></script>
<script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.min.js') }}"></script>
<script src="https://www.google.com/recaptcha/api.js?render={{ config('services.recaptcha.site_key') }}"></script>

<script src="{{ asset('assets/js/login.js') }}"></script>
</html>