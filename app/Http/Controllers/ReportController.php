<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateReportRequest;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService
    ) {}

    /**
     * Generate PDF report from JSON data
     *
     * @param GenerateReportRequest $request
     * @return Response
     */
    public function generate(GenerateReportRequest $request): Response
    {
        $data = $request->validated();

        $pdf = $this->reportService->generatePdf($data);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="relatorio.pdf"',
        ]);
    }

    /**
     * Generate and download PDF report
     *
     * @param GenerateReportRequest $request
     * @return Response
     */
    public function download(GenerateReportRequest $request): Response
    {
        $data = $request->validated();

        $pdf = $this->reportService->generatePdf($data);

        $filename = 'relatorio_' . date('Y-m-d_His') . '.pdf';

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Preview HTML before PDF generation
     *
     * @param GenerateReportRequest $request
     * @return Response
     */
    public function preview(GenerateReportRequest $request): Response
    {
        $data = $request->validated();

        $html = $this->reportService->generateHtml($data);

        return response($html, 200, [
            'Content-Type' => 'text/html',
        ]);
    }

    /**
     * Health check endpoint
     *
     * @return JsonResponse
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'service' => 'PDF Report Generator',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
