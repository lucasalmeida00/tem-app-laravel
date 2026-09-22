@props(['backups'])

@if($backups->isNotEmpty())
    <div class="ms-3 d-flex align-items-center gap-1">
        <label for="temBackupSelect" class="me-2 mb-0 small text-muted">Ver versão:</label>
        <button type="button" id="temBackupPrevBtn" class="btn btn-outline-secondary btn-sm" title="Backup anterior (mais antigo)">
            <i class="fas fa-chevron-left"></i>
        </button>
        <select id="temBackupSelect" class="form-select form-select-sm" style="width: auto;">
            <option value="">Dados atuais</option>
            @foreach($backups as $bk)
                <option value="{{ $bk->id }}">{{ $bk->created_at->format('d/m/Y H:i:s') }} — backup #{{ $bk->id }}</option>
            @endforeach
        </select>
        <button type="button" id="temBackupNextBtn" class="btn btn-outline-secondary btn-sm" title="Próximo backup (mais recente)">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
@endif
