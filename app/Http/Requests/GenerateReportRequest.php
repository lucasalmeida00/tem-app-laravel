<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Altere se precisar de autenticação
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titleDocument' => 'required|string|max:255',
            'SiteDocument' => 'nullable|string',
            'InstagramDocument' => 'nullable|string',
            'Contacts' => 'nullable|array',
            'Contacts.site' => 'nullable|string',
            'Contacts.instagram' => 'nullable|string',
            'Contacts.linkedin' => 'nullable|string',
            'Contacts.facebook' => 'nullable|string',
            'Contacts.email' => 'nullable|email',
            'Contacts.phone' => 'nullable|string',
            'Contacts.whatsapp' => 'nullable|string',
            'Contacts.others' => 'nullable|array',
            'summary' => 'nullable|string|max:5000',
            'Timeline' => 'nullable|array',
            'BusinessModel' => 'nullable|array',
            'partnerships' => 'nullable|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titleDocument.required' => 'O título do documento é obrigatório',
            'Contacts.email.email' => 'O e-mail deve ser válido',
        ];
    }
}
