import { useState } from "react";
import { Check, ChevronsUpDown, User as UserIcon, X, Plus, Loader2 } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useUsers, useCreateUser } from "@/features/users/hooks";
import { useRoles } from "@/features/roles/hooks";
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
import { usePosStore } from "../hooks/usePosState";
import type { User } from "@/features/users/model/schemas";
import { toast } from "sonner";

export function CustomerSelector() {
    const { tabs, activeTabId, setCustomer } = usePosStore();

    // Find active tab safely
    const activeTab = tabs.find((t) => t.id === activeTabId);
    const selectedCustomer = activeTab?.customer || null;

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Increase size to get "all" customers
    const { data: usersData, isLoading } = useUsers({
        search: debouncedSearch,
        page: 0,
        size: 1000,
        sortDir: "DESC",
        sortBy: "createdAt",
    });

    const handleSelect = (user: User) => {
        setCustomer(user);
        setOpen(false);
        setSearchTerm("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCustomer(null);
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-background border rounded-lg shadow-sm">
            <h3 className="font-semibold text-sm flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Customer
                </div>
                <QuickCreateCustomerDialog onCustomerCreated={handleSelect} />
            </h3>

            <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selectedCustomer ? (
                                <span className="flex items-center gap-2 truncate">
                                    <span className="font-medium">{selectedCustomer.fullName}</span>
                                    <span className="text-muted-foreground text-xs">({selectedCustomer.phone || selectedCustomer.username})</span>
                                </span>
                            ) : (
                                <span className="text-muted-foreground">Select customer...</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                        <Command shouldFilter={false}>
                            <CommandInput
                                placeholder="Search customer (name, phone)..."
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                            />
                            <CommandList>
                                <CommandEmpty>
                                    {isLoading ? "Searching..." : "No customer found."}
                                </CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        value="walk-in"
                                        onSelect={() => {
                                            setCustomer(null);
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer font-semibold"
                                    >
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        Walk-in Customer
                                    </CommandItem>
                                    {usersData?.contents.map((user) => (
                                        <CommandItem
                                            key={user.id}
                                            value={user.id.toString()}
                                            onSelect={() => handleSelect(user)}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCustomer?.id === user.id ? "opacity-100" : "opacity-0"
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

                {selectedCustomer && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        title="Clear customer"
                        className="shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Customer Details Minimal View */}
            {selectedCustomer && (
                <div className="text-xs text-muted-foreground mt-1 px-1">
                    <p>Phone: {selectedCustomer.phone || "N/A"}</p>
                </div>
            )}
        </div>
    );
}

function QuickCreateCustomerDialog({ onCustomerCreated }: { onCustomerCreated: (user: User) => void }) {
    const [open, setOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    const { mutate: createUser, isPending } = useCreateUser();
    const { data: roles } = useRoles();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName || !phone) {
            toast.error("Please fill in all fields");
            return;
        }

        // Find "Customer" role or default to first role
        // Ideally we should have a reliable way to get customer role ID
        // Note: roles is Role[], not { contents: Role[] } based on schema
        const roleList = Array.isArray(roles) ? roles : (roles as any)?.contents || [];
        const customerRole = roleList.find((r: any) => r.name.toLowerCase().includes('customer')) || roleList[0];

        if (!customerRole) {
            toast.error("No roles found to assign");
            return;
        }

        createUser({
            fullName,
            phone,
            username: phone, // Phone as username
            password: phone, // Phone as password
            confirmPassword: phone,
            status: "ACTIVE",
            roleIds: [customerRole.id],
        }, {
            onSuccess: (newUser) => {
                toast.success("Customer created successfully");
                onCustomerCreated(newUser);
                setOpen(false);
                setFullName("");
                setPhone("");
            },
            onError: (error: any) => {
                // Should rely on global error handler, but showing toast here for clarity if needed
                // console.error(error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Using a small icon button to trigger */}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(true)} title="Quick Create Customer">
                <Plus className="h-4 w-4" />
            </Button>
            <DialogContent className="sm:max-w-[425px]">
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
