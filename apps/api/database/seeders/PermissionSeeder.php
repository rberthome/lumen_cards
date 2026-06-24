<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['deck', 'create', 'Créer un deck'],
            ['deck', 'edit', 'Éditer un deck'],
            ['deck', 'publish', 'Publier / dépublier un deck'],
            ['deck', 'delete', 'Supprimer un deck'],
            ['card', 'create', 'Créer une carte'],
            ['card', 'edit', 'Éditer une carte'],
            ['card', 'delete', 'Supprimer une carte'],
            ['category', 'manage', 'Gérer les catégories'],
            ['user', 'manage', 'Gérer les utilisateurs'],
            ['role', 'manage', 'Gérer les rôles et permissions'],
        ];

        foreach ($permissions as [$entity, $action, $description]) {
            Permission::firstOrCreate(
                ['entity' => $entity, 'action' => $action],
                ['description' => $description]
            );
        }
    }
}
