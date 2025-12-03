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
import type { Problem } from "@/shared/api/error";
import { useCreateStyle } from "../hooks";
import { createStyleSchema, type CreateStyleInput } from "../model/schemas";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
    if (err.errors) {
        for (const [field, msg] of Object.entries(err.errors)) {
            setError(field as any, { message: String(msg) });
        }
        return;
    }
    const msg = err.message || err.detail || "Failed to create style";
    setError("name", { message: msg });
}

export function StyleCreateForm() {
    const [open, setOpen] = useState(false);

    const { mutate: doCreateStyle, isPending } = useCreateStyle();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateStyleInput>({
        resolver: zodResolver(createStyleSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "ACTIVE",
        },
    });

    const busy = isSubmitting || isPending;

    const onSubmit = (data: CreateStyleInput) => {
        doCreateStyle(data, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
            onError: (e: any) => mapProblemToForm(e, setError),
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
                    New Style
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Style</DialogTitle>
                    <DialogDescription>
                        Add a new jacket style (bomber, biker, hoodie, etc.).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Style Name *</Label>
                        <Input
                            id="name"
                            placeholder="Bomber, Biker, Hoodie, etc."
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
                            placeholder="Description of the style..."
                            {...register("description")}
                            rows={3}
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
                            defaultValue="ACTIVE"
                            onValueChange={(value) => setValue("status", value as any)}
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
                            <p className="text-xs text-red-500">{errors.status.message}</p>
                        )}
                    </div>
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={busy}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={busy}>
                        {busy ? "Creating..." : "Create Style"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
