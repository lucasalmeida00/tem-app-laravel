document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');
    const errorBox = document.getElementById('signup-errors');
    const successBox = document.getElementById('signup-success');
    const submitButton = document.getElementById('signup-submit');

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');

    function validateForm() {
        const messages = [];

        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const password = form.elements['password'].value;
        const passwordConfirmation = form.elements['password_confirmation'].value;

        // name
        if (!name) {
            messages.push('O nome é obrigatório.');
        } else if (name.length < 2) {
            messages.push('O nome deve ter pelo menos 2 caracteres.');
        } else if (name.length > 255) {
            messages.push('O nome deve ter no máximo 255 caracteres.');
        }

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
        } else if (password.length < 8) {
            messages.push('A senha deve ter no mínimo 8 caracteres.');
        }

        // password confirmation
        if (!passwordConfirmation) {
            messages.push('A confirmação de senha é obrigatória.');
        } else if (password !== passwordConfirmation) {
            messages.push('As senhas não conferem.');
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
            submitButton.textContent = 'Cadastrar';
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        errorBox.innerHTML = '';
        successBox.innerHTML = '';

        // 1) Validação no front antes de enviar
        const { valid, messages } = validateForm();

        if (!valid) {
            let html = '';
            messages.forEach(msg => {
                html += `<div>${msg}</div>`;
            });
            errorBox.innerHTML = html;
            return; // não manda nada pro back
        }

        grecaptcha.ready(function () {
            grecaptcha.execute(window.recaptchaSiteKey, { action: 'signup' }).then(function (token) {

                form.insertAdjacentHTML('beforeend',
                    `<input type="hidden" name="recaptcha_token" value="${token}">`
                );

                continueSignupSubmit();
            });
        });

        return;
    });

    function continueSignupSubmit(){
        // 2) Se passou na validação, desabilita botão e envia
        setButtonLoading(true);

        const formData = new FormData(form);

        fetch(window.signupUrl, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
            body: formData
        })
            .then(async response => {
                let data;

                try {
                    data = await response.json();
                } catch (e) {
                    data = {};
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
                            data.message || 'Erro ao cadastrar. Tente novamente.';
                    }

                    // Reabilita botão para o usuário tentar de novo
                    setButtonLoading(false);
                    return;
                }

                // Sucesso
                successBox.innerHTML =
                    data.message || 'Cadastro realizado com sucesso!';

                if (data.token) {
                    localStorage.setItem('tem_token', data.token);
                }

                // Redireciona usando a URL já definida na blade
                setTimeout(() => {
                    window.location.href = window.dashboardUrl;
                }, 1500);
            })
            .catch(error => {
                console.error(error);
                errorBox.innerHTML = 'Ocorreu um erro inesperado. Tente novamente.';

                // Reabilita botão em caso de erro de rede/JS
                setButtonLoading(false);
            });
    }
});