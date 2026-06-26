<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Modérateur : éditorial (créer/éditer decks+cartes, publier/dépublier) + catégories.
        $moderator = Role::firstOrCreate(
            ['slug' => 'moderator'],
            ['name' => 'Modérateur', 'description' => 'Gestion éditoriale des decks, cartes et catégories', 'is_system' => true]
        );

        $moderatorPermissions = [
            ['deck', 'create'],
            ['deck', 'edit'],
            ['deck', 'publish'],
            ['card', 'create'],
            ['card', 'edit'],
            ['category', 'manage'],
        ];

        $moderatorIds = Permission::query()
            ->get()
            ->filter(fn (Permission $p) => in_array([$p->entity, $p->action], $moderatorPermissions, true))
            ->pluck('id');

        $moderator->permissions()->sync($moderatorIds);

        // Admin : toutes les permissions.
        $admin = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrateur', 'description' => 'Accès complet', 'is_system' => true]
        );

        $admin->permissions()->sync(Permission::pluck('id'));
    }
}
