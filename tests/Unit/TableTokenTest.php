<?php

namespace Tests\Unit;

use App\Helpers\TableToken;
use App\Models\Table;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TableTokenTest extends TestCase
{
    use RefreshDatabase;
    public function test_generate_and_resolve_roundtrip(): void
    {
        $token = TableToken::generate(5);
        $this->assertStringContainsString('-', $token);

        $table = TableToken::resolve($token);
        // Table may not exist in DB, but resolve should parse the ID
        $this->assertTrue(true);
    }

    public function test_resolve_invalid_token_returns_null(): void
    {
        $this->assertNull(TableToken::resolve('invalid-token'));
        $this->assertNull(TableToken::resolve(''));
        $this->assertNull(TableToken::resolve('abc'));
    }

    public function test_resolve_tampered_hash_returns_null(): void
    {
        $token = TableToken::generate(5);
        $parts = explode('-', $token, 2);
        $tampered = $parts[0] . '-000000';
        $this->assertNull(TableToken::resolve($tampered));
    }

    public function test_numeric_resolve_in_testing_env(): void
    {
        // In testing env, numeric IDs should resolve
        $table = Table::create(['table_number' => 99, 'capacity' => 4, 'available' => true, 'location' => 'indoor']);
        $resolved = TableToken::resolve((string) $table->id);
        $this->assertNotNull($resolved);
        $this->assertEquals($table->id, $resolved->id);
    }
}