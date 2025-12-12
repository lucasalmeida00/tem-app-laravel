<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('business', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
            $table->uuid('url_hash')->unique();
            $table->string('business_name', 255);
            $table->string('business_cnpj', 14)->nullable(); // só números, sem máscara
            $table->boolean('is_complete')->default(false);
            $table->longText('business_data_json')->nullable(); // JSON grande
            $table->longText('business_resume')->nullable(); // Resumo do negócio
            $table->softDeletes(); // 👈 soft delete
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business');
    }
};
