<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessDataBackup extends Model
{
    public $timestamps = false; // Só temos created_at manual

    protected $fillable = [
        'business_id',
        'business_data_json',
        'created_at',
    ];
}