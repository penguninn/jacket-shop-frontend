import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown, User as UserIcon, Plus, Loader2, AlertCircle } from "lucide-react";
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
import type { Order } from "@/features/pos/model/schemas";
import { useUsers, useUserDetail, type User, type CreateUserInput, useCreateUser, USER_CONSTANTS } from "@/features/users";
import { useUpdatePosDraftCustomer } from "../hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Status } from "@/shared/api/schemas";
import { z } from "zod";
import { Alert, AlertDescription } from "@/shared/ui/alert";

interface CustomerSelectorProps {
    activeDraft: Order | undefined;
}

export function CustomerSelector({ activeDraft }: CustomerSelectorProps) {

    const hasDraft = activeDraft !== undefined;
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [search, setSearch] = useState("");
    const { mutate: updatePosDraftCustomer } = useUpdatePosDraftCustomer();
    const { data: activeUser } = useUserDetail(activeDraft?.userId ?? 0);
    const { data: users, isLoading } = useUsers({
        page: 0,
        size: 10,
        sortBy: "fullName",
        sortDir: "ASC",
        search: search,
        status: ["ACTIVE"],
        roles: ["CUSTOMER"]
    });

    const handleSelect = (user: User) => {
        if (!activeDraft) return;
        updatePosDraftCustomer({
            draftId: activeDraft.id,
            customerId: user.id
        }, {
            onSuccess: () => {
                setSelectedUser(user);
                setOpen(false);
            }
        });
    };

    useEffect(() => {
        if (activeDraft?.userId) {
            if (activeUser) {
                setSelectedUser(activeUser);
            }
        } else {
            setSelectedUser(null);
        }
    }, [activeDraft?.userId, activeUser]);

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
                            disabled={isLoading}
                        >
                            {selectedUser ? (
                                <span className="flex items-center gap-2 truncate">
                                    <span className="font-medium">{selectedUser.fullName}</span>
                                    <span className="text-muted-foreground text-xs">({selectedUser.phone})</span>
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    Select a customer
                                </span>
                            )}
                            {isLoading ? (
                                <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                            ) : (
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                            <CommandInput
                                placeholder="Search customer (name, phone)..."
                                value={search}
                                onValueChange={setSearch}
                            />
                            <CommandList>
                                <CommandEmpty>No customer found.</CommandEmpty>
                                <CommandGroup>
                                    {users?.contents.map((user) => (
                                        <CommandItem
                                            key={user.id}
                                            value={user.fullName + " " + user.phone}
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
            {selectedUser && (
                <div className="text-xs text-muted-foreground mt-1 px-1">
                    <p>Phone: {selectedUser.phone}</p>
                </div>
            )}
        </div>
    );
}

const quickCreateCustomerSchema = z.object({
    fullName: z
        .string()
        .min(
            USER_CONSTANTS.FULL_NAME.MIN_LENGTH,
            `Full name must be at least ${USER_CONSTANTS.FULL_NAME.MIN_LENGTH} characters`
        ),
    phone: z
        .string()
        .regex(USER_CONSTANTS.PHONE.REGEX, "Phone must be 10-15 digits"),
});

type QuickCreateCustomerInput = z.infer<typeof quickCreateCustomerSchema>;

function QuickCreateCustomerDialog() {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<QuickCreateCustomerInput>({
        resolver: zodResolver(quickCreateCustomerSchema),
        defaultValues: {
            fullName: "",
            phone: "",
        },
    });

    const { mutate: createUser } = useCreateUser({ setError: setError as any });

    const onSubmit = useCallback(
        (data: QuickCreateCustomerInput) => {
            const transformedData: CreateUserInput = {
                ...data,
                username: data.phone,
                password: data.phone,
                confirmPassword: data.phone,
                status: "ACTIVE" as Status,
                roleIds: [3],
            };
            createUser(transformedData, {
                onSuccess: () => {
                    setOpen(false);
                    reset({
                        fullName: "",
                        phone: "",
                    });
                }
            });
        },
        [createUser, reset]
    );


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(true)} title="Quick Create Customer">
                <Plus className="h-4 w-4" />
            </Button>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Quick Create Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} id="create-customer" className="space-y-4 py-4">
                    {errors.root && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.root.message}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            {...register("fullName")}
                            placeholder="Full Name"
                            autoFocus
                        />
                        {errors.fullName && (
                            <p className="text-sm text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            {...register("phone")}
                            placeholder="Phone Number"
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-muted-foreground">
                            Username and Password will be set to the Phone Number.
                        </AlertDescription>
                    </Alert>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" form="create-customer">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}