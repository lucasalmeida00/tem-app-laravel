document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.password-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            const input = document.getElementById(toggle.getAttribute('data-target'));
            if (!input) return;

            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';

            toggle.classList.toggle('fa-eye', !isHidden);
            toggle.classList.toggle('fa-eye-slash', isHidden);
            toggle.title = isHidden ? 'Ocultar senha' : 'Mostrar senha';
        });
    });
});
