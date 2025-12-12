<?php

namespace App\Http\Controllers;

use App\Http\Requests\DashboardRequest;
use App\Models\Business;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\BusinessCompletionService;
use App\Models\BusinessDataBackup;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->is_reviewer) {
            // Reviewer enxerga todos os empreendimentos (ajuste o filtro se quiser)
            $businesses = Business::orderBy('created_at', 'desc')->get();

            return view('dashboard.reviewer', [
                'businesses' => $businesses,
            ]);
        }
        
        // 👉 Carrega o dashboard normal
        $businesses = Business::where('id_user', Auth::id())
            ->orderBy('business_name', 'asc')
            ->get();

        return view('dashboard.dashboard', compact('businesses'));
    }

    public function store(DashboardRequest $request)
    {
        $userId = Auth::id();

        // Gera UUID e confia na uniqueness + índice unique
        $urlHash = (string) Str::uuid();

        $business = Business::create([
            'id_user'            => $userId,
            'url_hash'           => $urlHash,
            'business_name'      => $request->business_name,
            'business_cnpj'      => null,  // vazio por enquanto
            'is_complete'        => false,
            'business_data_json' => '{}',  // vazio/objeto inicial
        ]);

        return response()->json([
            'message'  => 'Empreendimento criado com sucesso.',
            'business' => $business,
        ], 201);
    }

    // /dashboard/{url_hash}
    public function show(string $url_hash)
    {
        $business = Business::where('url_hash', $url_hash)
            ->where('id_user', Auth::id())
            ->first(); 

        if (! $business) {
            return redirect()->route('dashboard');
        }

        $businessData = json_decode($business->business_data_json ?: '{}', true) ?? [];

        return view('dashboard.business', [
            'business' => $business,
            'businessData' => $businessData,
        ]);
    }

    // DELETE /dashboard/business/{business}
    public function destroy(Business $business, Request $request)
    {
        // Garante que o cara só apague o que é dele
        if ($business->id_user !== Auth::id()) {
            return response()->json([
                'message' => 'Você não tem permissão para excluir este empreendimento.',
            ], 403);
        }

        $business->delete(); // soft delete

        return response()->json([
            'message' => 'Empreendimento excluído com sucesso.',
        ]);
    }

    public function autosave(string $url_hash, Request $request)
    {
        $business = Business::where('url_hash', $url_hash)
            ->where('id_user', Auth::id())
            ->firstOrFail();

        // ignorando validação de estrutura, como você pediu 😉
        $data = $request->input('data');

        // Pode vir array ou string. Se for array, encoda.
        if (! is_string($data)) {
            $data = json_encode($data ?? [], JSON_UNESCAPED_UNICODE);
        }

        // --- LÓGICA PARA ATUALIZAÇÃO DE business_name E business_cnpj --- //
        try {
            $decoded = json_decode($data, true);

            if (is_array($decoded) && isset($decoded['1'])) {
                $section1 = $decoded['1'];

                // Atualizar business_name, se vier preenchido
                if (!empty($section1['companyNameOrTradeName'])) {
                    $business->business_name = substr($section1['companyNameOrTradeName'], 0, 255);
                }

                // Atualizar business_cnpj, se vier preenchido
                if (!empty($section1['cnpj'])) {
                    // remove tudo que não é número, e corta no limite
                    $cleanCnpj = preg_replace('/\D/', '', $section1['cnpj']);
                    $business->business_cnpj = substr($cleanCnpj, 0, 14);
                }
            }
        } catch (\Throwable $e) {
            // ignora qualquer erro...
        }

        // Salvar o JSON integral independente das alterações acima
        $business->business_data_json = $data;

        // 🔎 Verificar se está completo com base no JSON
        try {
            $decoded = json_decode($data, true);
            $business->is_complete = BusinessCompletionService::isBusinessComplete($decoded);
        } catch (\Throwable $e) {
            $business->is_complete = false; // fallback seguro
        }

        $business->save();

        // Salvar Backup de Versão (snapshot do JSON recebido)
        BusinessDataBackup::create([
            'business_id'         => $business->id,
            'business_data_json'  => $data, // JSON puro sem cortes
            'created_at'          => Carbon::now(),
        ]);

        return response()->json([
            'ok'      => true,
            'message' => 'Dados salvos com sucesso.',
        ]);
    }

    // /dashboard/{url_hash}/resume
    public function resume(string $url_hash)
    {
        $user = Auth::user();

        if ($user->is_reviewer) {
            // 👉 Avaliador: pode ver QUALQUER business pelo hash
            $business = Business::where('url_hash', $url_hash)->first();
        } else {
            // 👉 Usuário normal: só pode ver o que é dele
            $business = Business::where('url_hash', $url_hash)
                ->where('id_user', $user->id)
                ->first();
        }

        if (! $business) {
            return redirect()->route('dashboard');
        }

        $businessData = json_decode($business->business_data_json ?: '{}', true) ?? [];

        return view('dashboard.resume', [
            'business'       => $business,
            'businessData'   => $businessData,
            'isReviewer'     => (bool) $user->is_reviewer,
            'businessResume' => $business->business_resume,
        ]);
    }

}