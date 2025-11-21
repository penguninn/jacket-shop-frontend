import { UsersTable } from "../components/UsersTable";
import { UserCreateForm } from "../components/UserCreateForm";

export default function Users() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <UserCreateForm />
      </div>
      <UsersTable />
    </div>
  );
}
