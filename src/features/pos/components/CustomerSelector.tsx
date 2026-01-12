import { useState } from "react";
import { Check, ChevronsUpDown, User as UserIcon, Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";

// Dữ liệu giả lập
const DUMMY_USERS = [
    { id: 1, fullName: "Nguyen Van A", phone: "0912345678", username: "user_a" },
    { id: 2, fullName: "Tran Thi B", phone: "0987654321", username: "user_b" },
    { id: 3, fullName: "Le Van C", phone: "0909090909", username: "user_c" },
    { id: 4, fullName: "Guest User", phone: "0000000000", username: "guest" },
];

export function CustomerSelector() {
    // Giả lập trạng thái có Draft đang hoạt động
    const hasDraft = true;

    // State UI cục bộ
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<typeof DUMMY_USERS[0] | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSelect = (user: typeof DUMMY_USERS[0]) => {
        setIsUpdating(true);
        // Giả lập delay mạng
        setTimeout(() => {
            setSelectedUser(user);
            setOpen(false);
            setIsUpdating(false);
        }, 500);
    };

    if (!hasDraft) {
        return (
            <div className="flex flex-col gap-2 p-4 bg-background border rounded-lg shadow-sm opacity-50 pointer-events-none">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Customer
                </h3>
                <div className="h-9 border rounded-md bg-muted flex items-center px-3 text-sm text-muted-foreground">
                    Select a draft to continue
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-4 bg-background border rounded-lg shadow-sm">
            <h3 className="font-semibold text-sm flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Customer
                </div>
                <QuickCreateCustomerDialog />
            </h3>

            <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="flex-1 min-w-0 justify-between"
                            disabled={isUpdating}
                        >
                            {selectedUser ? (
                                <span className="flex items-center gap-2 truncate">
                                    <span className="font-medium">{selectedUser.fullName}</span>
                                    <span className="text-muted-foreground text-xs">({selectedUser.phone})</span>
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    Walk-in Customer
                                </span>
                            )}
                            {isUpdating ? (
                                <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                            ) : (
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                        {/* Bỏ shouldFilter={false} để Shadcn tự filter local data */}
                        <Command>
                            <CommandInput placeholder="Search customer (name, phone)..." />
                            <CommandList>
                                <CommandEmpty>No customer found.</CommandEmpty>
                                <CommandGroup>
                                    {DUMMY_USERS.map((user) => (
                                        <CommandItem
                                            key={user.id}
                                            value={user.fullName + " " + user.phone} // Value để search hoạt động
                                            onSelect={() => handleSelect(user)}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{user.fullName}</span>
                                                <span className="text-xs text-muted-foreground">{user.phone} - {user.username}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Customer Details Minimal View */}
            {selectedUser && (
                <div className="text-xs text-muted-foreground mt-1 px-1">
                    <p>Phone: {selectedUser.phone}</p>
                </div>
            )}
        </div>
    );
}

function QuickCreateCustomerDialog() {
    const [open, setOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        // Giả lập API call
        setTimeout(() => {
            setIsPending(false);
            setOpen(false);
            setFullName("");
            setPhone("");
            // Logic thêm user vào list cha sẽ nằm ở đây
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(true)} title="Quick Create Customer">
                <Plus className="h-4 w-4" />
            </Button>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Quick Create Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="col-span-3"
                            placeholder="Full Name"
                            autoFocus
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="col-span-3"
                            placeholder="Phone Number"
                        />
                    </div>
                    <div className="col-span-4 text-xs text-muted-foreground text-center">
                        Username and Password will be set to the Phone Number.
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}