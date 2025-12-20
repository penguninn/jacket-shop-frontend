
import { User, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/ui/dialog";

interface PosCustomerProps {
    customer: any;
    onSelectCustomer: (customer: any) => void;
}

export function PosCustomer({ customer, onSelectCustomer }: PosCustomerProps) {
    return (
        <div className="bg-white p-4 border-b">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    {customer ? (
                        <div>
                            <div className="font-medium text-sm">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.phone || "No phone"}</div>
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-gray-500">Walk-in Customer</div>
                    )}
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-blue-600">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        {/* Mock Customer Selection */}
                        <div className="p-4 text-center">
                            Search/Add Customer Feature (Mock)
                            <Button
                                className="mt-4 w-full"
                                onClick={() => onSelectCustomer({ id: 1, name: "Nguyen Van A", phone: "0909090909" })}
                            >
                                Select Mock Customer
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
