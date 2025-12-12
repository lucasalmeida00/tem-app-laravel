<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Business extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'business';

    protected $fillable = [
        'id_user',
        'url_hash',
        'business_name',
        'business_cnpj',
        'is_complete',
        'business_data_json',
    ];

    protected $casts = [
        'is_complete' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    // Helper para formatar o CNPJ no padrão 00.000.000/0000-00
    public function getFormattedCnpjAttribute(): ?string
    {
        if (empty($this->business_cnpj)) {
            return null;
        }

        $cnpj = preg_replace('/\D/', '', $this->business_cnpj);

        if (strlen($cnpj) !== 14) {
            return $this->business_cnpj; // devolve como está se tamanho for inválido
        }

        return substr($cnpj, 0, 2) . '.' .
               substr($cnpj, 2, 3) . '.' .
               substr($cnpj, 5, 3) . '/' .
               substr($cnpj, 8, 4) . '-' .
               substr($cnpj, 12, 2);
    }
}