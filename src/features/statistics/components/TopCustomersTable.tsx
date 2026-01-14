import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { formatCurrency } from "@/shared/utils/format";
import type { TopCustomer } from "../model/schemas";
import { User } from "lucide-react";

interface TopCustomersTableProps {
    customers: TopCustomer[];
}

export function TopCustomersTable({ customers }: TopCustomersTableProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">User</TableHead>
                            <TableHead>Info</TableHead>
                            <TableHead className="text-right">Orders</TableHead>
                            <TableHead className="text-right">Spent</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.userId}>
                                <TableCell>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={customer.avatar || ""} alt={customer.fullName} />
                                        <AvatarFallback>
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{customer.fullName}</span>
                                        <span className="text-xs text-muted-foreground">{customer.email || customer.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{customer.orderCount}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
