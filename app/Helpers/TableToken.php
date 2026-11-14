<?php

namespace App\Helpers;

use App\Models\Table;

class TableToken
{
    /**
     * Salt adalah hasil hash dari angka saja.
     */
    private static function getSalt(): string
    {
        return hash('sha256', '7980312123789');
    }

    /**
     * Generate token acak yang aman untuk meja berdasarkan ID dan salt hash angka.
     */
    public static function generate(int $tableId): string
    {
        $hash = substr(hash('sha256', $tableId . self::getSalt()), 0, 6);
        $encodedId = base_convert((string) $tableId, 10, 36);
        return $encodedId . '-' . $hash;
    }

    /**
     * Resolve meja berdasarkan token atau ID 
     */
    public static function resolve(string $identifier): ?Table
    {
        if (is_numeric($identifier) && app()->environment('local', 'testing')) {
            $table = Table::find((int) $identifier);
            if ($table) {
                return $table;
            }
            return Table::where('table_number', (int) $identifier)->first();
        }

        if (str_contains($identifier, '-')) {
            $parts = explode('-', $identifier, 2);
            if (count($parts) === 2) {
                $tableId = base_convert($parts[0], 36, 10);
                $expectedHash = substr(hash('sha256', $tableId . self::getSalt()), 0, 6);

                if (hash_equals($expectedHash, $parts[1])) {
                    return Table::find((int) $tableId);
                }
            }
        }

        return null;
    }
}
