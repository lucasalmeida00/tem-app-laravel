<?php

namespace App\Services;

class ReportHtmlHelper
{
    /**
     * Escapa HTML
     */
    private function escape(string $string): string
    {
        return htmlspecialchars($string, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Estima número de linhas pelo tamanho do texto
     */
    private function estimateLines(string $text, int $charsPerLine = 95): int
    {
        $len = mb_strlen(trim($text));
        if ($len <= 0) {
            return 1;
        }

        $lines = (int) ceil($len / max(10, $charsPerLine));
        return max(1, min(20, $lines));
    }

    /**
     * Mapeia número de linhas para top%
     */
    private function topForLines(int $lines): float
    {
        if ($lines <= 1) {
            return 1.7;
        }
        if ($lines === 2) {
            return 2.7;
        }
        return 4.0 + 1.3 * ($lines - 3);
    }

    /**
     * Renderiza lista aninhada
     */
    private function renderList(array $list): string
    {
        $html = '<ul>';

        foreach ($list as $item) {
            $text = $this->escape((string) ($item['text'] ?? ''));
            $html .= '<li>' . $text;

            if (!empty($item['children']) && is_array($item['children'])) {
                $html .= $this->renderList($item['children']);
            }

            $html .= '</li>';
        }

        $html .= '</ul>';
        return $html;
    }

    /**
     * Renderiza Timeline
     */
    public function renderTimeline(array $timeline): string
    {
        // Normaliza e ordena
        $byYear = [];
        foreach ($timeline as $year => $items) {
            $arr = is_array($items) ? $items : [$items];
            $arr = array_values(array_filter(array_map('strval', $arr), fn($s) => trim($s) !== ''));

            if ($arr) {
                $byYear[(string) $year] = $arr;
            }
        }

        if (empty($byYear)) {
            return '';
        }

        ksort($byYear, SORT_NATURAL);

        $html = '<h2>Linha do tempo</h2>';

        foreach ($byYear as $year => $events) {
            $html .= '
              <table class="tl-year" role="presentation" style="width:100%;">
                <thead>
                  <tr>
                    <th colspan="2" class="tl-year-header">' . $this->escape($year) . '</th>
                  </tr>
                </thead>
                <tbody>';

            foreach ($events as $event) {
                $lines = $this->estimateLines($event, 95);
                $top = $this->topForLines($lines);
                $top = number_format($top, 2, '.', '');

                $html .= '
                  <tr>
                    <td class="tl-left" style="width:2%;"><span class="tl-dot" style="top: ' . $top . '%;" aria-hidden="true"></span></td>
                    <td class="tl-desc" style="width:93%;">' . $this->escape($event) . '</td>
                  </tr>';
            }

            $html .= '
                </tbody>
              </table>';
        }

        return $html;
    }

    /**
     * Renderiza Parcerias
     */
    public function renderPartnerships(array $partners): string
    {
        // Normaliza: "ano" => [itens...]
        $byYear = [];

        foreach ($partners as $year => $items) {
            if (is_array($items)) {
                $arr = [];
                foreach ($items as $value) {
                    $value = (string) $value;

                    if (strpos($value, ';') !== false || strpos($value, "\n") !== false) {
                        $chunks = preg_split('~[;\n]+~', $value);
                        foreach ($chunks as $chunk) {
                            $chunk = trim($chunk);
                            if ($chunk !== '') {
                                $arr[] = $chunk;
                            }
                        }
                    } else {
                        $value = trim($value);
                        if ($value !== '') {
                            $arr[] = $value;
                        }
                    }
                }
            } else {
                $string = (string) $items;
                $arr = array_filter(
                    array_map('trim', preg_split('~[;\n]+~', $string)),
                    fn($x) => $x !== ''
                );
            }

            if (!empty($arr)) {
                $byYear[(string) $year] = array_values($arr);
            }
        }

        if (empty($byYear)) {
            return '';
        }

        ksort($byYear, SORT_NATURAL);

        $html = '<h2>Parcerias</h2>';

        foreach ($byYear as $year => $events) {
            $html .= '
              <table class="tl-year" role="presentation" style="width:100%;">
                <thead>
                  <tr><th colspan="2" class="tl-year-header">' . $this->escape($year) . '</th></tr>
                </thead>
                <tbody>';

            foreach ($events as $event) {
                $lines = $this->estimateLines($event, 95);
                $top = $this->topForLines($lines);
                $top = number_format($top, 2, '.', '');

                $html .= '
                  <tr>
                    <td class="tl-left" style="width:2%;"><span class="tl-dot" style="top: ' . $top . '%;" aria-hidden="true"></span></td>
                    <td class="tl-desc" style="width:93%;">' . $this->escape($event) . '</td>
                  </tr>';
            }

            $html .= '
                </tbody>
              </table>';
        }

        return $html;
    }

    /**
     * Renderiza seção do Business Model
     */
    private function renderBusinessModelSection(array $bm, string $key, string $title): string
    {
        $html = '<div class="bmc2-card">';
        $html .= '<div class="bmc2-head" style="height:50px;">';
        $html .= '<table class="bmc2-headTbl" role="presentation"><tr>';
        $html .= '<td class="bmc2-htext">' . $this->escape($title) . '</td>';
        $html .= '<td class="bmc2-hicon">' . $this->getSvgIcon($title) . '</td>';
        $html .= '</tr></table>';
        $html .= '</div>';
        $html .= '<div class="bmc2-body">';

        $data = $bm[$key] ?? $bm[$title] ?? null;

        if ($data && is_array($data)) {
            foreach ($data as $block) {
                $subtitle = isset($block['subtitle']) && $block['subtitle'] !== null
                    ? trim((string) $block['subtitle'])
                    : '';

                $list = $block['list'] ?? [];

                if ($subtitle !== '') {
                    $html .= '<h4>' . $this->escape($subtitle) . ':</h4>';
                }

                if (is_array($list) && $list) {
                    $html .= '<ul>';

                    foreach ($list as $li) {
                        $text = is_array($li) ? ($li['text'] ?? '') : (string) $li;
                        $text = trim((string) $text);

                        if ($text === '') {
                            continue;
                        }

                        $html .= '<li>' . $this->escape($text) . '</li>';

                        // Filhos (children)
                        if (is_array($li) && !empty($li['children']) && is_array($li['children'])) {
                            $html .= '<ul>';

                            foreach ($li['children'] as $child) {
                                $ctext = is_array($child) ? ($child['text'] ?? '') : (string) $child;
                                $ctext = trim((string) $ctext);

                                if ($ctext === '') {
                                    continue;
                                }

                                $html .= '<li>' . $this->escape($ctext) . '</li>';
                            }

                            $html .= '</ul>';
                        }
                    }

                    $html .= '</ul>';
                }

                $html .= '<hr class="bmc2-hr" />';
            }
        }

        // Remove último <hr>
        $html = preg_replace('~<hr class="bmc2-hr" />$~', '', $html);
        $html .= '</div></div>';

        return $html;
    }

    /**
     * Renderiza Business Model Canvas
     */
    public function renderBusinessModelCanvas(array $bm): string
    {
        // Chaves conforme JSON
        $sections = [
            'parcerias' => 'Parcerias-chave',
            'atividades' => 'Atividades-chave',
            'recursos' => 'Recursos-chave',
            'proposta' => 'Proposta de valor',
            'relacao' => 'Relação com clientes',
            'canais' => 'Canais',
            'segmento' => 'Segmento de clientes',
            'custos' => 'Estrutura de custos',
            'receita' => 'Fontes de receita',
        ];

        $rendered = [];
        foreach ($sections as $key => $title) {
            $rendered[$key] = $this->renderBusinessModelSection($bm, $title, $title);
        }

        $html = '<div class="bm2-wrap keep-together">';
        $html .= '<h2 class="h2_secondary">Modelo de Negócios</h2>';
        $html .= '<table class="bmc_secondary keep-together" role="presentation">';
        $html .= '<colgroup>';
        $html .= '<col style="width:16.66%"><col style="width:16.66%"><col style="width:16.66%">';
        $html .= '<col style="width:16.66%"><col style="width:16.66%"><col style="width:16.66%">';
        $html .= '</colgroup>';

        // Linha 1: [Parcerias x2] [Atividades x2 + Recursos (empilhados)] [Proposta x2]
        $html .= '<tr>';
        $html .= '<td class="bmc2-col" colspan="2">' . $rendered['parcerias'] . '</td>';
        $html .= '<td class="bmc2-col" colspan="2">';
        $html .= '<div class="bmc2-card">' . $rendered['atividades'] . '</div>';
        $html .= '<div class="bmc2-card">' . $rendered['recursos'] . '</div>';
        $html .= '</td>';
        $html .= '<td class="bmc2-col" colspan="2">' . $rendered['proposta'] . '</td>';
        $html .= '</tr>';

        // Linha 2: [Relação x2] [Canais x2] [Segmento x2]
        $html .= '<tr>';
        $html .= '<td class="bmc2-col" colspan="2">' . $rendered['relacao'] . '</td>';
        $html .= '<td class="bmc2-col" colspan="2">' . $rendered['canais'] . '</td>';
        $html .= '<td class="bmc2-col" colspan="2">' . $rendered['segmento'] . '</td>';
        $html .= '</tr>';

        // Linha 3: [Custos x3] [Receita x3]
        $html .= '<tr>';
        $html .= '<td class="bmc2-col" colspan="3">' . $rendered['custos'] . '</td>';
        $html .= '<td class="bmc2-col" colspan="3">' . $rendered['receita'] . '</td>';
        $html .= '</tr>';

        $html .= '</table>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Retorna SVG do ícone
     */
    private function getSvgIcon(string $title, int $size = 14): string
    {
        $iconMap = [
            'Parcerias-chave' => 'handshake',
            'Atividades-chave' => 'briefcase',
            'Recursos-chave' => 'box',
            'Proposta de valor' => 'star',
            'Relação com clientes' => 'heart',
            'Canais' => 'send',
            'Segmento de clientes' => 'users',
            'Estrutura de custos' => 'clipboard-list',
            'Fontes de receita' => 'dollar-sign',
        ];

        $svgs = [
            'handshake' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>',
            'briefcase' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>',
            'box' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
            'star' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16Z"/></svg>',
            'heart' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
            'send' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11Z"/><path d="m21.854 2.147-10.94 10.939"/></svg>',
            'users' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            'clipboard-list' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
            'dollar-sign' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        ];

        $iconName = $iconMap[$title] ?? '';

        if (!isset($svgs[$iconName])) {
            return '';
        }

        $stroke = '#ffffff';
        $svg = preg_replace(
            '/<(path|line|rect|circle|polyline|polygon)\b([^>]*)>/i',
            '<$1 stroke="' . $stroke . '" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"$2>',
            $svgs[$iconName]
        );

        $data = base64_encode($svg);
        return '<img class="bm2-icon" src="data:image/svg+xml;base64,' . $data . '" width="' . $size . '" height="' . $size . '" alt="" />';
    }
}
