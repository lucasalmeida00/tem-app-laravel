<?php

namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;

class ReportService
{
    private Dompdf $dompdf;

    public function __construct()
    {
        $this->initializeDompdf();
    }

    /**
     * Gera um PDF a partir dos dados fornecidos
     *
     * @param array $data
     * @return string PDF bytes
     */
    public function generatePdf(array $data): string
    {
        // Remove valores vazios e deduplica
        $data = $this->removeEmptyValues($data);
        $data = $this->deduplicateBusinessModel($data);

        // Extrai dados principais
        $title = $data['titleDocument'] ?? 'Documento';
        $timeline = $data['Timeline'] ?? [];
        $businessModel = $data['BusinessModel'] ?? [];
        $contacts = $data['Contacts'] ?? [];
        $partners = $data['partnerships'] ?? [];
        $summary = $data['summary'] ?? null;

        // Gera HTML
        $html = $this->buildHtml($title, $timeline, $businessModel, $contacts, $partners, $summary);

        // Renderiza PDF
        $this->dompdf->loadHtml($html, 'UTF-8');
        $this->dompdf->setPaper('A4', 'portrait');
        $this->dompdf->render();

        return $this->dompdf->output();
    }

    /**
     * Retorna o nome sugerido do arquivo
     *
     * @param string $title
     * @return string
     */
    public function getSuggestedFilename(string $title): string
    {
        $normalized = iconv('UTF-8', 'ASCII//TRANSLIT', $title);
        $filename = preg_replace('~[^\w\-]+~', '-', $normalized);
        return $filename . '-TEM.pdf';
    }

    /**
     * Inicializa o Dompdf com as opções necessárias
     */
    private function initializeDompdf(): void
    {
        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');

        // Desabilita uso de imagens/GD (importante para Heroku)
        $options->set('isPhpEnabled', false);

        $this->dompdf = new Dompdf($options);
    }

    /**
     * Remove valores vazios do array recursivamente
     *
     * @param mixed $data
     * @return mixed
     */
    private function removeEmptyValues($data)
    {
        if (!is_array($data)) {
            return $data;
        }

        $result = [];
        foreach ($data as $key => $value) {
            if (is_string($value) && $value === '') {
                continue;
            }

            $clean = $this->removeEmptyValues($value);

            if ($clean === null) {
                continue;
            }

            if (is_array($clean) && count($clean) === 0) {
                continue;
            }

            $result[$key] = $clean;
        }

        return $result;
    }

    /**
     * Deduplica textos no BusinessModel
     *
     * @param array $data
     * @return array
     */
    private function deduplicateBusinessModel(array $data): array
    {
        if (!isset($data['BusinessModel']) || !is_array($data['BusinessModel'])) {
            return $data;
        }

        foreach ($data['BusinessModel'] as $sectionName => $groups) {
            if (!is_array($groups)) {
                continue;
            }

            $seen = [];
            foreach ($groups as $groupIndex => $group) {
                if (!isset($group['list']) || !is_array($group['list'])) {
                    continue;
                }

                $newList = [];
                foreach ($group['list'] as $item) {
                    $text = is_array($item) ? ($item['text'] ?? null) : (is_string($item) ? $item : null);

                    if ($text === null) {
                        continue;
                    }

                    $textTrim = trim($text);
                    if ($textTrim === '') {
                        continue;
                    }

                    $key = $this->normalizeTextKey($textTrim);
                    if (isset($seen[$key])) {
                        continue;
                    }

                    $seen[$key] = true;

                    if (is_array($item)) {
                        $item['text'] = $textTrim;
                        $newList[] = $item;
                    } else {
                        $newList[] = $textTrim;
                    }
                }

                $data['BusinessModel'][$sectionName][$groupIndex]['list'] = array_values($newList);
            }
        }

        return $data;
    }

    /**
     * Normaliza texto para comparação (dedupe)
     *
     * @param string $text
     * @return string
     */
    private function normalizeTextKey(string $text): string
    {
        $text = preg_replace('/\s+/u', ' ', trim($text));
        $text = mb_strtolower($text, 'UTF-8');

        $noAccents = @iconv('UTF-8', 'ASCII//TRANSLIT', $text);
        if ($noAccents !== false) {
            $text = $noAccents;
        }

        return $text;
    }

    /**
     * Constrói o HTML completo do documento
     *
     * @param string $title
     * @param array $timeline
     * @param array $businessModel
     * @param array $contacts
     * @param array $partners
     * @param string|null $summary
     * @return string
     */
    private function buildHtml(string $title, array $timeline, array $businessModel, array $contacts, array $partners, ?string $summary = null): string
    {
        $css = $this->getCss();
        $contactsHtml = $this->buildContactsHtml($contacts);
        $summaryHtml = $this->buildSummaryHtml($summary);
        $timelineHtml = $this->buildTimelineHtml($timeline);
        $businessModelHtml = $this->buildBusinessModelHtml($businessModel);
        $partnersHtml = $this->buildPartnersHtml($partners);

        return <<<HTML
<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<title>Relatório - {$this->escape($title)}</title>
<style>{$css}</style>
</head>
<body>
<header>
    <table class="header-table">
        <tr>
            <td class="title-cell"><h1>{$this->escape($title)}</h1></td>
            <td class="logo-cell"><img src="https://fazerbem.com.br/outros/tem/tem-logo.png" class="tem-logo" /></td>
        </tr>
    </table>
    {$contactsHtml}
    {$summaryHtml}
</header>

<section>
  {$timelineHtml}
</section>

<div>
  {$businessModelHtml}
</div>

<div style="page-break-before: always;"></div>

<section>
  {$partnersHtml}
</section>

</body>
</html>
HTML;
    }

    /**
     * Escapa HTML
     *
     * @param string $string
     * @return string
     */
    private function escape(string $string): string
    {
        return htmlspecialchars($string, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Retorna o CSS do documento
     *
     * @return string
     */
    private function getCss(): string
    {
        return file_get_contents(resource_path('views/pdf/styles.css'));
    }

    /**
     * Constrói HTML do resumo do empreendimento
     *
     * @param string|null $summary
     * @return string
     */
    private function buildSummaryHtml(?string $summary): string
    {
        if (empty($summary)) {
            return '';
        }

        return <<<HTML
<div class="summary-section">
    <h2 class="summary-title">Resumo do Empreendimento</h2>
    <p class="summary-text">{$this->escape($summary)}</p>
</div>
HTML;
    }

    /**
     * Constrói HTML dos contatos
     *
     * @param array $contacts
     * @return string
     */
    private function buildContactsHtml(array $contacts): string
    {
        $lines = [];

        if (!empty($contacts['site'])) {
            $lines[] = 'Site: ' . $this->escape($contacts['site']);
        }
        if (!empty($contacts['instagram'])) {
            $lines[] = 'Instagram: ' . $this->escape($contacts['instagram']);
        }
        if (!empty($contacts['linkedin'])) {
            $lines[] = 'LinkedIn: ' . $this->escape($contacts['linkedin']);
        }
        if (!empty($contacts['facebook'])) {
            $lines[] = 'Facebook: ' . $this->escape($contacts['facebook']);
        }
        if (!empty($contacts['email'])) {
            $lines[] = 'Email: ' . $this->escape($contacts['email']);
        }
        if (!empty($contacts['phone'])) {
            $lines[] = 'Telefone: ' . $this->escape($contacts['phone']);
        }
        if (!empty($contacts['whatsapp'])) {
            $lines[] = 'WhatsApp: ' . $this->escape($contacts['whatsapp']);
        }

        if (empty($lines)) {
            return '';
        }

        return '<p class="muted">' . implode('<br /><br /> • ', $lines) . '</p>';
    }

    /**
     * Constrói HTML da timeline
     *
     * @param array $timeline
     * @return string
     */
    private function buildTimelineHtml(array $timeline): string
    {
        if (empty($timeline)) {
            return '';
        }

        $helper = new ReportHtmlHelper();
        return $helper->renderTimeline($timeline);
    }

    /**
     * Constrói HTML do modelo de negócios
     *
     * @param array $businessModel
     * @return string
     */
    private function buildBusinessModelHtml(array $businessModel): string
    {
        if (empty($businessModel)) {
            return '';
        }

        $helper = new ReportHtmlHelper();
        return $helper->renderBusinessModelCanvas($businessModel);
    }

    /**
     * Constrói HTML das parcerias
     *
     * @param array $partners
     * @return string
     */
    private function buildPartnersHtml(array $partners): string
    {
        if (empty($partners)) {
            return '';
        }

        $helper = new ReportHtmlHelper();
        return $helper->renderPartnerships($partners);
    }
}
