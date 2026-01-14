import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import type { OutOfStockProduct } from "../model/schemas";

interface OutOfStockProductsTableProps {
    products: OutOfStockProduct[];
}

export function OutOfStockProductsTable({ products }: OutOfStockProductsTableProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.variantId}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium truncate max-w-[200px]" title={product.productName}>
                                            {product.productName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{product.sku}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{product.colorName}</Badge>
                                        <Badge variant="outline">{product.sizeName}</Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={product.availableQuantity === 0 ? "destructive" : "secondary"}>
                                        {product.availableQuantity}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
