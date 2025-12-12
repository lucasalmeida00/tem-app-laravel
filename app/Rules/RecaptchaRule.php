<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class RecaptchaRule implements ValidationRule
{
    private string $action;

    public function __construct(string $action)
    {
        $this->action = $action;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $secret = config('services.recaptcha.secret_key');

        $response = Http::asForm()->post(
            'https://www.google.com/recaptcha/api/siteverify',
            [
                'secret'   => $secret,
                'response' => $value,
            ]
        );

        if (!$response->successful()) {
            $fail('Falha ao validar o reCAPTCHA.');
            return;
        }

        $result = $response->json();

        if (empty($result['success']) || ($result['score'] ?? 0) < 0.5) {
            $fail('Falha na verificação anti-bots. Tente novamente.');
            return;
        }

        // opcional: validar ação (não obrigatório)
        if (!empty($result['action']) && $result['action'] !== $this->action) {
            $fail('Ação do reCAPTCHA inválida.');
        }
    }
}