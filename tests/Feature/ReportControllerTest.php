<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReportControllerTest extends TestCase
{
    /**
     * Testa se o health check está funcionando
     */
    public function test_health_check_returns_ok(): void
    {
        $response = $this->get('/api/report/health');

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'ok',
            'service' => 'report-generator'
        ]);
    }

    /**
     * Testa geração básica de PDF
     */
    public function test_can_generate_basic_pdf(): void
    {
        $data = [
            'titleDocument' => 'Relatório de Teste',
            'Timeline' => [
                '2024' => ['Evento de teste']
            ],
            'Contacts' => [
                'email' => 'teste@example.com'
            ]
        ];

        $response = $this->postJson('/api/report/generate', $data);

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
        $this->assertTrue(strlen($response->getContent()) > 0);
    }

    /**
     * Testa validação de dados obrigatórios
     */
    public function test_validates_required_title(): void
    {
        $data = [
            'Timeline' => []
        ];

        $response = $this->postJson('/api/report/generate', $data);

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'error',
            'details'
        ]);
    }

    /**
     * Testa geração com todos os dados
     */
    public function test_can_generate_complete_pdf(): void
    {
        $data = [
            'titleDocument' => 'Relatório Completo',
            'Timeline' => [
                '2023' => ['Fundação da empresa', 'Primeiro cliente'],
                '2024' => ['Expansão para novos mercados']
            ],
            'BusinessModel' => [
                'Parcerias-chave' => [
                    [
                        'subtitle' => 'Fornecedores',
                        'list' => [
                            ['text' => 'Fornecedor A'],
                            ['text' => 'Fornecedor B']
                        ]
                    ]
                ],
                'Proposta de valor' => [
                    [
                        'list' => [
                            ['text' => 'Qualidade superior'],
                            ['text' => 'Atendimento personalizado']
                        ]
                    ]
                ]
            ],
            'Contacts' => [
                'site' => 'https://exemplo.com',
                'email' => 'contato@exemplo.com',
                'phone' => '(11) 99999-9999'
            ],
            'partnerships' => [
                '2023' => ['Parceria A'],
                '2024' => ['Parceria B', 'Parceria C']
            ]
        ];

        $response = $this->postJson('/api/report/generate', $data);

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');

        // Verifica se o PDF tem um tamanho razoável (mais de 10KB)
        $this->assertTrue(strlen($response->getContent()) > 10240);
    }

    /**
     * Testa CORS headers
     */
    public function test_cors_headers_are_present(): void
    {
        $data = [
            'titleDocument' => 'Teste CORS'
        ];

        $response = $this->postJson('/api/report/generate', $data, [
            'Origin' => 'http://localhost:8080'
        ]);

        $response->assertHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    }
}
