<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function index()
    {
        return view('login.login');
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        // Tenta autenticar via guard web
        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciais inválidas. Verifique seu e-mail e senha.',
            ], 422);
        }

        // Regenera a sessão por segurança
        $request->session()->regenerate();

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Cria o token Sanctum
        $token = $user->createToken('tem-app')->plainTextToken;

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'token'   => $token,
        ]);
    }
}