<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:1'],
            'recaptcha_token' => ['required', new \App\Rules\RecaptchaRule('login')],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'O e-mail é obrigatório.',
            'email.email'       => 'Informe um e-mail válido.',
            'email.max'         => 'O e-mail deve ter no máximo 255 caracteres.',
            'password.required' => 'A senha é obrigatória.',
            'password.min'      => 'A senha deve ter no mínimo 1 caracteres.',
        ];
    }
}