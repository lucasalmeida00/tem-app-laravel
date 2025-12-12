<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_data_backups', function (Blueprint $table) {
            $table->id();

            // Registro vinculado ao business original
            $table->unsignedBigInteger('business_id');

            // Conteúdo completo do JSON salvo (sem cortes)
            $table->longText('business_data_json');

            // Data de inserção (não haverá updates nem deletes)
            $table->timestamp('created_at')->useCurrent();

            // FK opcional (sem cascata de delete)
            $table->foreign('business_id')->references('id')->on('business');
        });
    }

    public function down(): void
    {
        // ⚠️ Mesmo assim deixamos o drop, embora seu uso seja improvável
        Schema::dropIfExists('business_data_backups');
    }
};