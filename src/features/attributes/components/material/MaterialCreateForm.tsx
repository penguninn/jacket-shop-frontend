import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useCreateMaterial } from "../../hooks";
import { createMaterialSchema, type CreateMaterialInput, type MaterialStatus } from "../../model/schemas";


export function MaterialCreateForm() {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,

        setValue,
        reset,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateMaterialInput>({
        resolver: zodResolver(createMaterialSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "ACTIVE",
        },
    });

    const { mutate: doCreateMaterial, isPending } = useCreateMaterial({ setError: setError as any });

    const busy = isSubmitting || isPending;
    const currentStatus = watch("status");

    const onSubmit = (data: CreateMaterialInput) => {
        doCreateMaterial(data, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset();
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Material
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Material</DialogTitle>
                    <DialogDescription>
                        Add a new material to the system. Fill in all required fields.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <form
                        id="create-material-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 pr-4"
                    >

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="Material Name"
                                {...register("name")}
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Description"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select
                                value={currentStatus}
                                onValueChange={(value) =>
                                    setValue("status", value as MaterialStatus)
                                }
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-xs text-red-500">
                                    {errors.status.message}
                                </p>
                            )}
                        </div>
                    </form>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={busy}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-material-form"
                        disabled={busy}
                    >
                        {busy ? "Creating..." : "Create Material"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
