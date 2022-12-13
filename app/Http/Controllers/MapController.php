<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MapController extends Controller
{
    private $filename;


    public function __construct()
    {
        $this->disk = 'local';
        $this->filename = 'regions.json';
    }


    public function getRegions()
    {
        if (Storage::disk($this->disk)->exists($this->filename)) {
            $regions = Storage::disk($this->disk)->get($this->filename);
            return $regions;
        } else {
            return ["status" => false, "message" => "Файл с регионами не найден: " . $this->filename];
        }
    }

    public function saveRegions(Request $request)
    {

        $regions = $request->regions;

        if (!isset($regions))
            return ["status" => false, "message" => "Ошибка получения регионов"];

        $storage = Storage::disk($this->disk)->put($this->filename, json_encode($regions));

        if ($storage) {
            return ["status" => true, "message" => "Регионы сохранены"];
        } else {
            return ["status" => false, "message" => "Ошибка записи регионов"];
        }
    }
}
