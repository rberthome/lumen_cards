<?php

namespace Tests\Unit;

use App\Services\SM2Service;
use PHPUnit\Framework\TestCase;

class SM2ServiceTest extends TestCase
{
    private SM2Service $service;

    protected function setUp(): void
    {
        $this->service = new SM2Service();
    }

    public function test_first_correct_answer_gives_interval_one(): void
    {
        $result = $this->service->calculate(0, 2.5, 0, 4);
        $this->assertEquals(1, $result['interval']);
        $this->assertEquals(1, $result['repetition']);
    }

    public function test_second_correct_answer_gives_interval_six(): void
    {
        $result = $this->service->calculate(1, 2.5, 1, 4);
        $this->assertEquals(6, $result['interval']);
        $this->assertEquals(2, $result['repetition']);
    }

    public function test_wrong_answer_resets_repetition(): void
    {
        $result = $this->service->calculate(3, 2.5, 10, 1);
        $this->assertEquals(0, $result['repetition']);
        $this->assertEquals(1, $result['interval']);
    }

    public function test_ease_factor_decreases_on_wrong_answer(): void
    {
        $result = $this->service->calculate(2, 2.5, 6, 1);
        $this->assertLessThan(2.5, $result['ease_factor']);
        $this->assertGreaterThanOrEqual(1.3, $result['ease_factor']);
    }
}
