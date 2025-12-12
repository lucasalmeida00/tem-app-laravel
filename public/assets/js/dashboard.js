document.addEventListener('DOMContentLoaded', function () {
    // ========= CRIAÇÃO DE NOVO EMPREENDIMENTO =========
    const form         = document.getElementById('new-business-form');
    const submitButton = document.getElementById('new-business-submit');
    const errorBox     = document.getElementById('new-business-errors');
    const successBox   = document.getElementById('new-business-success');
    const modalElement = document.getElementById('newBusinessModal');
    const csrfToken    = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    function validateForm() {
        const messages = [];

        if (!form) {
            return { valid: true, messages }; // se não existir o form, ignora
        }

        const name = form.elements['business_name'].value.trim();

        if (!name) {
            messages.push('O nome do empreendimento é obrigatório.');
        } else if (name.length < 1) {
            messages.push('O nome do empreendimento deve ter pelo menos 1 caractere.');
        } else if (name.length > 255) {
            messages.push('O nome do empreendimento deve ter no máximo 255 caracteres.');
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
            submitButton.textContent = 'Adicionar';
        }
    }

    function clearMessages() {
        if (errorBox)   errorBox.innerHTML   = '';
        if (successBox) successBox.innerHTML = '';
    }

    function hideModal() {
        if (!modalElement) return;

        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();
    }

    if (submitButton && form) {
        submitButton.addEventListener('click', function () {
            clearMessages();

            // 1) Validação no front
            const { valid, messages } = validateForm();
            if (!valid) {
                let html = '';
                messages.forEach(msg => {
                    html += `<div>${msg}</div>`;
                });
                if (errorBox) errorBox.innerHTML = html;
                return;
            }

            // 2) Desabilita botão
            setButtonLoading(true);

            const formData = new FormData(form);

            fetch(window.dashboardBusinessStoreUrl, {
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
                        // se não vier JSON, ignora
                    }

                    if (!response.ok) {
                        // erros de validação 422
                        if (response.status === 422 && data.errors) {
                            let html = '';
                            Object.keys(data.errors).forEach(field => {
                                data.errors[field].forEach(msg => {
                                    html += `<div>${msg}</div>`;
                                });
                            });
                            if (errorBox) errorBox.innerHTML = html;
                        } else {
                            if (errorBox) {
                                errorBox.innerHTML =
                                    data.message || 'Erro ao criar o empreendimento. Tente novamente.';
                            }
                        }

                        setButtonLoading(false);
                        return;
                    }

                    // Sucesso
                    if (successBox) {
                        successBox.innerHTML = data.message || 'Empreendimento criado com sucesso.';
                    }

                    // Limpa o campo
                    form.reset();

                    // Fecha o modal depois de um pequeno delay e recarrega a página
                    setTimeout(() => {
                        hideModal();
                        setButtonLoading(false);
                        clearMessages();
                        window.location.reload();
                    }, 800);
                })
                .catch(error => {
                    console.error(error);
                    if (errorBox) {
                        errorBox.innerHTML = 'Ocorreu um erro inesperado. Tente novamente.';
                    }
                    setButtonLoading(false);
                });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();          // impede o submit padrão (/dashboard?... )
            submitButton.click();        // reaproveita toda a lógica do botão
        });
    }

    // ========= EXCLUSÃO DE EMPREENDIMENTO (SOFT DELETE) =========
    const deleteModalEl      = document.getElementById('deleteBusinessModal');
    const deleteBusinessName = document.getElementById('delete-business-name');
    const confirmDeleteBtn   = document.getElementById('confirm-delete-business');

    let businessToDeleteButton = null;

    if (deleteModalEl && confirmDeleteBtn) {
        const deleteModal = new bootstrap.Modal(deleteModalEl);

        // Delegação de evento: todos os botões .js-delete-business
        document.querySelectorAll('.js-delete-business').forEach(btn => {
            btn.addEventListener('click', function () {
                businessToDeleteButton = this;

                const name = this.dataset.name || 'o empreendimento';
                if (deleteBusinessName) {
                    deleteBusinessName.textContent = name;
                }

                deleteModal.show();
            });
        });

        confirmDeleteBtn.addEventListener('click', function () {
            if (!businessToDeleteButton) {
                return;
            }

            const url  = businessToDeleteButton.dataset.url;
            const row  = businessToDeleteButton.closest('.tem-item');

            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.textContent = 'Excluindo...';

            fetch(url, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                }
            })
                .then(async response => {
                    let data = {};
                    try {
                        data = await response.json();
                    } catch (e) {}

                    if (!response.ok) {
                        console.error(data);
                        alert(data.message || 'Erro ao excluir o empreendimento. Tente novamente.');
                        confirmDeleteBtn.disabled = false;
                        confirmDeleteBtn.textContent = 'Excluir';
                        return;
                    }

                    // Remove o item visualmente
                    if (row) {
                        row.remove();
                    }

                    deleteModal.hide();
                    confirmDeleteBtn.disabled = false;
                    confirmDeleteBtn.textContent = 'Excluir';
                    businessToDeleteButton = null;
                })
                .catch(error => {
                    console.error(error);
                    alert('Ocorreu um erro inesperado ao excluir o empreendimento.');
                    confirmDeleteBtn.disabled = false;
                    confirmDeleteBtn.textContent = 'Excluir';
                });
        });
    }
});