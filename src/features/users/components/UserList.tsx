import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserPlus, Trash2, Edit, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import type { User } from "../types";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const UserList = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
  });

  const { mutate: deleteUser } = useDeleteUser();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case "supervisor": return <ShieldCheck className="h-4 w-4 text-blue-500" />;
      default: return <Shield className="h-4 w-4 text-slate-400" />;
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "employeeId",
      header: "Employee ID",
      cell: ({ row }: { row: any }) => <div className="font-mono font-bold">{row.getValue("employeeId")}</div>,
    },
    {
      accessorKey: "name",
      header: "Full Name",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: { row: any }) => {
        const role = row.getValue("role") as string;
        return (
          <div className="flex items-center space-x-2">
            {getRoleIcon(role)}
            <span className="capitalize">{role}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "passwordChangeRequired",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const required = row.getValue("passwordChangeRequired") as boolean;
        return (
          <Badge variant={required ? "destructive" : "outline"}>
            {required ? "Change Required" : "Active"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => (navigator as any).clipboard.writeText(user.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Edit User
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this user?")) {
                    deleteUser(user.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-slate-500">Manage system access, roles, and employee accounts.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pageCount={data?.meta?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
};
