
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { formatCurrency } from "@/shared/utils/format";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// Mock Data Type
interface Order {
    id: number;
    code: string;
    totalProducts: number;
    totalAmount: number;
    customerName: string;
    createdAt: Date;
    type: "pos" | "online";
    status: "completed" | "cancelled" | "pending_delivery" | "online_pending";
}

// Mock Data
const MOCK_ORDERS: Order[] = [
    { id: 1, code: "HD10", totalProducts: 6, totalAmount: 2127500, customerName: "Walk-in Customer", createdAt: new Date("2023-12-21T13:48:00"), type: "pos", status: "completed" },
    { id: 2, code: "HD9", totalProducts: 6, totalAmount: 3317500, customerName: "Walk-in Customer", createdAt: new Date("2023-12-21T13:39:00"), type: "pos", status: "completed" },
    { id: 3, code: "HD1703043", totalProducts: 6, totalAmount: 660000, customerName: "Nguyễn Văn Nhật", createdAt: new Date("2023-12-20T10:36:00"), type: "online", status: "pending_delivery" },
    { id: 4, code: "HD1703043", totalProducts: 1, totalAmount: 34000, customerName: "Nguyễn Thị Thùy Dương", createdAt: new Date("2023-12-20T10:30:00"), type: "online", status: "cancelled" },
    { id: 5, code: "HD8", totalProducts: 2, totalAmount: 180000, customerName: "Walk-in Customer", createdAt: new Date("2023-12-20T10:19:00"), type: "pos", status: "completed" },
];

const TYPE_BADGES = {
    pos: { label: "POS", className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" },
    online: { label: "Online", className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100" },
};

const STATUS_BADGES = {
    completed: { label: "Completed", className: "bg-purple-100 text-purple-700 border-purple-200" },
    cancelled: { label: "Cancelled", className: "bg-green-100 text-green-700 border-green-200" }, // Using green for cancelled as per image? Or maybe stick to standard Red? Image shows "Đã hủy" as Green.
    pending_delivery: { label: "Pending Delivery", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    online_pending: { label: "Pending Confirmation", className: "bg-orange-100 text-orange-700 border-orange-200" },
};

export function OrderTable() {
    return (
        <div className="bg-white rounded-sm shadow-sm border mt-4">
            <Table>
                <TableHeader className="bg-gray-50 uppercase">
                    <TableRow>
                        <TableHead className="w-12 text-center font-bold text-gray-600">#</TableHead>
                        <TableHead className="font-bold text-gray-600">Code</TableHead>
                        <TableHead className="text-center font-bold text-gray-600">Total Products</TableHead>
                        <TableHead className="font-bold text-gray-600">Total Amount</TableHead>
                        <TableHead className="font-bold text-gray-600">Customer Name</TableHead>
                        <TableHead className="font-bold text-gray-600">Created At</TableHead>
                        <TableHead className="text-center font-bold text-gray-600">Order Type</TableHead>
                        <TableHead className="text-center font-bold text-gray-600">Status</TableHead>
                        <TableHead className="text-center font-bold text-gray-600">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_ORDERS.map((order, index) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                            <TableCell className="text-center py-4">{index + 1}</TableCell>
                            <TableCell className="font-medium">{order.code}</TableCell>
                            <TableCell className="text-center">{order.totalProducts}</TableCell>
                            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{format(order.createdAt, "dd/MM/yyyy HH:mm")}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant="outline" className={cn("font-normal rounded-full", TYPE_BADGES[order.type].className)}>
                                    {TYPE_BADGES[order.type].label}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant="outline" className={cn("font-normal rounded-full", STATUS_BADGES[order.status]?.className || "bg-gray-100")}>
                                    {STATUS_BADGES[order.status]?.label || order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                                        <Printer className="w-4 h-4" />
                                    </Button> */}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
