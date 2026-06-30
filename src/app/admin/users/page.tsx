import { db } from "@/lib/db";
import { UsersClient, type UserListItem } from "@/features/users";

export default async function AdminUsersPage() {
  const users: UserListItem[] = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      mustChangePassword: true,
    },
  });
  return <UsersClient users={users} />;
}
