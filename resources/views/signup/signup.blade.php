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

    <div class="text-center pt-3">
        @include('partials.google-translate')
    </div>

    <div class="login-page">
        <div class="form">
            <form class="login-form" id="signup-form">
                @csrf
                <a href="/"
                    class="d-flex align-items-center justify-content-center me-md-auto text-dark text-decoration-none text-center mb-20">
                    <img class="tem-logo" src="{{ asset('assets/img/tem-logo.png') }}" width="200" />
                </a>
                <input type="text" id="name" name="name" class="form-control w-270" required minlength="2" maxlength="255"
                    pattern=".{2,255}" title="Informe um nome com pelo menos 2 caracteres." placeholder="Nome da pessoa física ou empresa" />
                <input type="email" id="email" name="email" class="form-control w-270" required maxlength="255"
                    pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                    title="Informe um e-mail válido, por exemplo: nome@dominio.com" placeholder="Seu E-mail" />
                <div class="password-field w-270">
                    <input type="password" id="password" name="password" class="form-control" required minlength="8"
                        maxlength="255" pattern=".{8,}" title="A senha deve ter pelo menos 8 caracteres." placeholder="Sua Senha" />
                    <i class="fa fa-eye password-toggle" data-target="password" title="Mostrar senha"></i>
                </div>
                <div class="password-field w-270">
                    <input type="password" id="password_confirmation" name="password_confirmation" class="form-control"
                        required minlength="8" maxlength="255" pattern=".{8,}"
                        title="Repita a mesma senha informada acima." placeholder="Repita sua Senha" />
                    <i class="fa fa-eye password-toggle" data-target="password_confirmation" title="Mostrar senha"></i>
                </div>

                <div class="lgpd-consent text-start my-3">
                    <p class="fw-bold mb-2" style="font-size: 13px;">Proteção de Dados e LGPD</p>
                    <div class="lgpd-text">
                        <p>
                            As informações fornecidas nesta plataforma, incluindo dados cadastrais do
                            empreendedor e do empreendimento, serão tratadas de acordo com a Lei nº
                            13.709/2018 – Lei Geral de Proteção de Dados Pessoais (LGPD).
                        </p>
                        <p>
                            Os dados coletados serão utilizados para finalidades relacionadas à pesquisa, à
                            caracterização dos empreendedores e dos empreendimentos, à análise das
                            trajetórias empreendedoras e à geração dos relatórios produzidos pela TEM.
                        </p>
                        <p>
                            O tratamento dos dados observará os princípios de finalidade, adequação,
                            necessidade, transparência, segurança e confidencialidade. As informações
                            serão armazenadas e tratadas de forma segura e não serão utilizadas para fins
                            comerciais ou para finalidades diferentes daquelas informadas ao participante.
                        </p>
                        <p>
                            Os resultados das pesquisas poderão ser utilizados em relatórios, publicações
                            acadêmicas, apresentações, eventos científicos e outros produtos de
                            pesquisa, preferencialmente de forma agregada ou de maneira que não permita a
                            identificação individual dos participantes.
                        </p>
                        <p class="mb-0">
                            Ao preencher o questionário e prosseguir na utilização da plataforma, o
                            participante declara estar ciente das condições de tratamento dos dados descritas
                            acima.
                        </p>
                    </div>
                    <div class="form-check mt-2">
                        <input type="checkbox" class="form-check-input" id="lgpd_consent" name="lgpd_consent" required>
                        <label class="form-check-label" for="lgpd_consent">
                            Li e estou ciente das informações sobre o tratamento dos meus dados
                            pessoais, nos termos da LGPD.
                        </label>
                    </div>
                </div>

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
