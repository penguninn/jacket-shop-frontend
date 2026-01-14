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
import type { TopSellingProduct } from "../model/schemas";

interface TopSellingProductsTableProps {
    products: TopSellingProduct[];
}

export function TopSellingProductsTable({ products }: TopSellingProductsTableProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Sold</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.productId}>
                                <TableCell>
                                    <Avatar className="h-10 w-10 rounded-md">
                                        <AvatarImage src={product.thumbnail || ""} alt={product.productName} />
                                        <AvatarFallback className="rounded-md">IMG</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium truncate max-w-[200px]" title={product.productName}>
                                            {product.productName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{product.brandName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">{product.soldCount}</TableCell>
                                <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
