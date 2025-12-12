<?php

namespace App\Services;

class BusinessCompletionService
{
    /**
     * Verifica, de forma hardcoded, se os campos mínimos necessários
     * para considerar o cadastro completo (is_complete) estão preenchidos.
     */
    public static function isBusinessComplete(?array $data): bool
    {
        if (!is_array($data)) {
            return false;
        }

        // Lista dos campos obrigatórios para completar o cadastro,
        // baseados na lógica da tela de resumo (resume.blade.php)
        $requiredChecks = [
            // Card 1 - Dados da empresa
            '1.companyNameOrTradeName',
            '1.cnpj',
            '1.companySector',
            '1.companyLocation',

            // Card 2 - Dados do empreendedor
            '2.entrepreneurFullName',
            '2.entrepreneurCPF',
            '2.entrepreneurPhone',

            // Card 7 - Proposta de valor
            '7.vpProblem',
            '7.valueDiff1',

            // Card 8 - Segmentação de clientes
            '8.segGroup1',
            '8.firstClient',

            // Card 11 - Fontes de receita
            '11.revSource1',

            // Card 13 - Atividades-chave
            '13.actKey1',

            // Card 16 - Estrutura de custos
            '16.costChallenging1',

            // Card 19 - Linha do tempo
            '19.milestones.0.year',
            '19.milestones.0.description',
        ];

        // Verifica se cada campo obrigatório está presente e preenchido
        foreach ($requiredChecks as $field) {
            if (!self::hasFilled($data, $field)) {
                return false; // Basta um campo faltando → cadastro incompleto
            }
        }

        return true; // Todos preenchidos
    }

    /**
     * Verifica se um campo nested existe e está preenchido.
     * Exemplo: hasFilled($data, '19.milestones.0.year')
     */
    private static function hasFilled(array $data, string $path): bool
    {
        $segments = explode('.', $path);

        foreach ($segments as $segment) {
            if (!is_array($data) || !array_key_exists($segment, $data)) {
                return false;
            }
            $data = $data[$segment];
        }

        if (is_array($data)) {
            return !empty($data);
        }

        return !is_null($data) && trim((string) $data) !== '';
    }
}