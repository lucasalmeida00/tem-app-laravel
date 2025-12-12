<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SignupController extends Controller
{
    public function index()
    {
        return view('signup.signup');
    }

    public function store(SignupRequest $request)
    {
        // Dados já validados pelo SignupRequest
        $data = $request->validated();

        // Cria usuário
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_reviewer' => false,
        ]);

        // Faz login na sessão web (se quiser já logar o usuário)
        Auth::login($user);

        // Cria token Sanctum para chamadas futuras via AJAX
        $token = $user->createToken('tem-app')->plainTextToken;

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso.',
            'token'   => $token,
        ], 201);
    }
}