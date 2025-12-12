document.addEventListener('DOMContentLoaded', function () {
    const form         = document.getElementById('login-form');
    const errorBox     = document.getElementById('login-errors');
    const successBox   = document.getElementById('login-success');
    const submitButton = document.getElementById('login-submit');

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');

    // Validação no front, espelhando o LoginRequest
    function validateForm() {
        const messages = [];

        const email    = form.elements['email'].value.trim();
        const password = form.elements['password'].value;

        // email
        if (!email) {
            messages.push('O e-mail é obrigatório.');
        } else if (email.length > 255) {
            messages.push('O e-mail deve ter no máximo 255 caracteres.');
        } else {
            const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            if (!emailRegex.test(email)) {
                messages.push('Informe um e-mail válido.');
            }
        }

        // password
        if (!password) {
            messages.push('A senha é obrigatória.');
        } else if (password.length < 1) {
            messages.push('A senha deve ter no mínimo 1 caracteres.');
        }

        return {
            valid: messages.length === 0,
            messages
        };
    }

    function setButtonLoading(isLoading) {
        if (!submitButton) return;

        if (isLoading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Aguarde...';
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        errorBox.innerHTML   = '';
        successBox.innerHTML = '';

        // 1) Validação no front
        const { valid, messages } = validateForm();

        if (!valid) {
            let html = '';
            messages.forEach(msg => {
                html += `<div>${msg}</div>`;
            });
            errorBox.innerHTML = html;
            return;
        }

        // Executar reCAPTCHA invisível
        grecaptcha.ready(function () {
            grecaptcha.execute(window.recaptchaSiteKey, { action: 'login' }).then(function (token) {

                // adiciona o token no form
                form.insertAdjacentHTML('beforeend',
                    `<input type="hidden" name="recaptcha_token" value="${token}">`
                );

                // agora sim enviar
                continueLoginSubmit();
            });
        });

        // cancelamos o envio padrão e criamos a função real
        return;
    });

    function continueLoginSubmit() {
        // 2) Se passou na validação, desabilita botão e envia
        setButtonLoading(true);

        const formData = new FormData(form);

        fetch(window.loginUrl, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
            body: formData
        })
            .then(async response => {
                let data = {};
                try {
                    data = await response.json();
                } catch (e) {
                    // Se não veio JSON, deixa data vazio
                }

                if (!response.ok) {
                    // Erros de validação (422)
                    if (response.status === 422 && data.errors) {
                        let messages = '';
                        Object.keys(data.errors).forEach(function (field) {
                            data.errors[field].forEach(function (msg) {
                                messages += `<div>${msg}</div>`;
                            });
                        });
                        errorBox.innerHTML = messages;
                    } else {
                        errorBox.innerHTML =
                            data.message || 'Não foi possível fazer login. Verifique suas credenciais.';
                    }

                    setButtonLoading(false);
                    return;
                }

                // Sucesso
                successBox.innerHTML =
                    data.message || 'Login realizado com sucesso!';

                if (data.token) {
                    localStorage.setItem('tem_token', data.token);
                }

                setTimeout(() => {
                    window.location.href = window.dashboardUrl;
                }, 1000);
            })
            .catch(error => {
                console.error(error);
                errorBox.innerHTML =
                    'Ocorreu um erro inesperado. Tente novamente em alguns instantes.';
                setButtonLoading(false);
            });
    }
});