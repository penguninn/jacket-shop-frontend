

import { useParams, useNavigate } from "react-router-dom";
import {
  useOrder,
  useOrderHistory,
  useConfirmOrder,
  useShipOrder,
  useCompleteOrder,
  useCancelOrder,


} from "../../hooks";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Badge } from "@/shared/ui/badge";
import { formatCurrency } from "@/shared/utils/format";
import {
  ChevronLeft,
  User,
  CreditCard,
  Package,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";



import { format } from "date-fns";
import { toast } from "sonner";
import { OrderItemsTable } from "../../components/admin/OrderItemsTable";


export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading: isLoadingOrder } = useOrder(orderId);
  const { data: history, isLoading: isLoadingHistory } = useOrderHistory(orderId);

  const confirmMutation = useConfirmOrder();
  const shipMutation = useShipOrder();
  const completeMutation = useCompleteOrder();
  const cancelMutation = useCancelOrder();




  const handleAction = (mutation: any) => {
    mutation.mutate(orderId, {
      onError: (error: any) => toast.error(error.message || "Action failed"),
    });
  };

  if (isLoadingOrder) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return <div className="p-8 text-center">Order not found</div>;
  }

  // Helper to format full address
  const fullAddress = [
    order.shippingAddressLine,
    order.shippingWardName,
    order.shippingDistrictName,
    order.shippingProvinceName
  ].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/orders")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order {order.orderCode}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{format(new Date(order.createdAt), "PPP p")}</span>
              <span>•</span>
              <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
              <span>•</span>
              <Badge variant="outline">{order.paymentStatus}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order.status === "PENDING" && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={cancelMutation.isPending}>
                    Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel order <strong>{order.orderCode}</strong>? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, keep order</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleAction(cancelMutation)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, cancel order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={confirmMutation.isPending}>Confirm Order</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to confirm order <strong>{order.orderCode}</strong>? The order will be ready for shipping.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleAction(confirmMutation)}>
                      Yes, confirm order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {order.status === "CONFIRMED" && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={cancelMutation.isPending}>
                    Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel order <strong>{order.orderCode}</strong>? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, keep order</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleAction(cancelMutation)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, cancel order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={shipMutation.isPending}>Ship Order</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ship Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to mark order <strong>{order.orderCode}</strong> as shipped?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleAction(shipMutation)}>
                      Yes, ship order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {order.status === "SHIPPING" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={completeMutation.isPending}>Mark Delivered</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Complete Order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark order <strong>{order.orderCode}</strong> as delivered/completed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction(completeMutation)}>
                    Yes, mark delivered
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 pt-4">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column: Customer & Shipping */}
            <div className="col-span-2 space-y-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" /> Customer & Shipping
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Customer</p>
                    <p className="text-muted-foreground">{order.customerName}</p>
                    {order.customerPhone && <p className="text-muted-foreground">{order.customerPhone}</p>}
                  </div>
                  <div>
                    <p className="font-medium">Shipping Address</p>
                    <p className="text-muted-foreground">{fullAddress}</p>
                  </div>
                  <div>
                    <p className="font-medium">Shipping Carrier</p>
                    <p className="text-muted-foreground">{order.carrierName || "Standard Shipping"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">{order.paymentMethodName || "N/A"}</p>
                    <p className="text-muted-foreground text-xs mt-1">Status: <span className="font-medium">{order.paymentStatus}</span></p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
                <h3 className="font-semibold text-lg flex items-center gap-2 p-2">
                  <Package className="h-4 w-4" /> Order Items
                </h3>

                <div className="p-2">
                  <OrderItemsTable data={order.details || []} />
                </div>
              </div>
            </div>

            {/* Right Column: Calculations */}
            <div className="col-span-1 space-y-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                  {(order.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <div className="flex gap-1">
                        <span>Discount</span>
                        {order.couponCode && <span className="text-xs border border-green-200 bg-green-50 px-1 rounded flex items-center">{order.couponCode}</span>}
                      </div>
                      <span>-{formatCurrency(order.discount!)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          {isLoadingHistory ? (
            <div>Loading history...</div>
          ) : (
            <div className="space-y-8 pl-4 border-l-2 border-muted ml-4 relative">
              {history?.map((event) => (
                <div key={event.id} className="relative pl-6 pb-2">
                  <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                  <div className="text-sm font-medium">Status Update</div>
                  {event.changedByUserId && (
                    <div className="text-xs text-muted-foreground">Updated by User ID: {event.changedByUserId}</div>
                  )}
                  <div className="text-xs text-muted-foreground mb-1">{format(new Date(event.createdAt), "PPP p")}</div>
                  {event.note && (
                    <div className="text-sm mt-1 p-2 bg-muted/50 rounded-md border text-muted-foreground">
                      Note: {event.note}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {event.oldStatus ? `${event.oldStatus} → ` : "Initial: "}{event.newStatus}
                    </Badge>
                    {(event.oldPaymentStatus !== event.newPaymentStatus || (event.newPaymentStatus && !event.oldPaymentStatus)) && (
                      <Badge variant="outline" className="text-xs">
                        Payment: {event.oldPaymentStatus ? `${event.oldPaymentStatus} → ` : ""}{event.newPaymentStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {history?.length === 0 && <p className="text-muted-foreground text-sm pl-6">No history events found.</p>}
            </div>
          )}
        </TabsContent>
      </Tabs>




    </div>
  );
}

function getOrderStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PENDING": return "secondary";
    case "CONFIRMED": return "default";
    case "SHIPPING": return "default";
    case "COMPLETED": return "default";
    case "CANCELLED": return "destructive";
    case "RETURNED": return "outline";
    default: return "outline";
  }
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="col-span-1">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}




