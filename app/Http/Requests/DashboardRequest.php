<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DashboardRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Está em rota protegida, então pode liberar geral aqui.
        return true;
    }

    public function rules(): array
    {
        return [
            'business_name' => ['required', 'string', 'min:1', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'business_name.required' => 'O nome do empreendimento é obrigatório.',
            'business_name.min'      => 'O nome do empreendimento deve ter ao menos 1 caractere.',
            'business_name.max'      => 'O nome do empreendimento deve ter no máximo 255 caracteres.',
        ];
    }
}