<?php

return [
    /*
     * The paths where typescript-transformer will look for PHP classes
     * annotated with #[TypeScript] to transform into TypeScript types.
     */
    'auto_discover_types' => [
        app_path(),
    ],

    'collectors' => [
        Spatie\TypeScriptTransformer\Collectors\DefaultCollector::class,
        Spatie\TypeScriptTransformer\Collectors\EnumCollector::class,
    ],

    /*
     * Transformers limited to what this project actually uses: native PHP
     * enums + plain DTOs. The bundled SpatieEnumTransformer /
     * SpatieStateTransformer are intentionally omitted because they depend on
     * spatie/enum and spatie/laravel-model-states, which are not installed and
     * would throw a ReflectionException on every class.
     */
    'transformers' => [
        Spatie\TypeScriptTransformer\Transformers\EnumTransformer::class,
        Spatie\LaravelTypeScriptTransformer\Transformers\DtoTransformer::class,
    ],

    'default_type_replacements' => [
        DateTime::class => 'string',
        DateTimeImmutable::class => 'string',
        Carbon\CarbonInterface::class => 'string',
        Carbon\CarbonImmutable::class => 'string',
        Carbon\Carbon::class => 'string',
    ],

    'output_file' => resource_path('ts/generated.d.ts'),

    'writer' => Spatie\TypeScriptTransformer\Writers\TypeDefinitionWriter::class,

    'formatter' => null,

    'transform_to_native_enums' => false,

    'transform_null_to_optional' => false,
];
