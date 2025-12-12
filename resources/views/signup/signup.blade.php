<!DOCTYPE html>
<html>

<head>
    <title>Cadastrar - TEM (erritorial Effectuation Monitoring)</title>
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
            <form class="login-form" id="signup-form">
                @csrf
                <a href="/"
                    class="d-flex align-items-center justify-content-center me-md-auto text-dark text-decoration-none text-center mb-20">
                    <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" width="200" />
                </a>
                <input type="text" id="name" name="name" class="form-control w-270" required minlength="2" maxlength="255"
                    pattern=".{2,255}" title="Informe um nome com pelo menos 2 caracteres." placeholder="Seu Nome" />
                <input type="email" id="email" name="email" class="form-control w-270" required maxlength="255"
                    pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                    title="Informe um e-mail válido, por exemplo: nome@dominio.com" placeholder="Seu E-mail" />
                <input type="password" id="password" name="password" class="form-control w-270" required minlength="8"
                    maxlength="255" pattern=".{8,}" title="A senha deve ter pelo menos 8 caracteres." placeholder="Sua Senha" />
                <input type="password" id="password_confirmation" name="password_confirmation" class="form-control w-270"
                    required minlength="8" maxlength="255" pattern=".{8,}"
                    title="Repita a mesma senha informada acima." placeholder="Repita sua Senha" />
                <button type="submit" id="signup-submit" class="btn-tem">Cadastrar</button>

                <p class="message">Já tem uma conta? <a href="/login">Faça Login!</a></p>

                <div id="signup-errors" class="text-danger mt-2"></div>
                <div id="signup-success" class="text-success mt-2"></div>
            </form>
        </div>
    </div>

</body>

<!-- JS Scripts -->
<script>
    window.signupUrl = "{{ route('signup.store') }}";
    window.dashboardUrl = "{{ route('dashboard') }}";
    window.recaptchaSiteKey = "{{ config('services.recaptcha.site_key') }}";
</script>

<script src="{{ asset('assets/js/index.js') }}"></script>
<script src="{{ asset('assets/vendor/bootstrap-5.3.8/js/bootstrap.min.js') }}"></script>
<script src="https://www.google.com/recaptcha/api.js?render={{ config('services.recaptcha.site_key') }}"></script>

<script src="{{ asset('assets/js/signup.js') }}"></script>

</html>
