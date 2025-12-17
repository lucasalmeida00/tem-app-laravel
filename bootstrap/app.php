<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        // Desabilita CSRF para rotas da API de relatórios
        $middleware->validateCsrfTokens(except: [
            'api/report/*',
        ]);

        // Registra o middleware de CORS para reports
        $middleware->alias([
            'report.cors' => \App\Http\Middleware\HandleReportCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
