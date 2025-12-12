<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class LogoutController extends Controller
{
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $currentAccessToken = $user->currentAccessToken();

            // Se for um token persistido (PersonalAccessToken), revoga só ele
            if ($currentAccessToken instanceof PersonalAccessToken) {
                $currentAccessToken->delete();
            } else {
                // Se for TransientToken (modo SPA/cookie), opcionalmente revoga todos os tokens persistidos
                if (method_exists($user, 'tokens')) {
                    $user->tokens()->delete();
                }
            }
        }

        // 🔹 Logout da sessão no guard "web", se estiver usando sessão
        if (Auth::guard('web')->check()) {
            Auth::guard('web')->logout();

            // Invalida a sessão e regenera o token CSRF
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        // 🔹 Se for requisição AJAX (Accept: application/json)
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Logout realizado com sucesso.',
            ]);
        }

        // 🔹 Redireciona para a tela de login
        return redirect()->route('home');
    }
}