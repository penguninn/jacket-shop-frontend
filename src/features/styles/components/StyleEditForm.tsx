import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { updateStyleSchema, type UpdateStyleInput, type Style } from "../model/schemas";
import { useUpdateStyle } from "../hooks";


interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    style: Style;
}

export function StyleEditForm({ open, onOpenChange, style }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateStyleInput>({
        resolver: zodResolver(updateStyleSchema),
        defaultValues: {
            name: style.name,
            description: style.description || "",
            status: style.status,
        },
    });

    const { mutate: doUpdateStyle, isPending } = useUpdateStyle({ setError: setError as any });

    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    useEffect(() => {
        if (open && style) {
            reset({
                name: style.name,
                description: style.description || "",
                status: style.status,
            });
        }
    }, [open, style, reset]);

    const onSubmit = (data: UpdateStyleInput) => {
        doUpdateStyle(
            { id: style.id, data },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Style: {style.name}</DialogTitle>
                    <DialogDescription>
                        Update style information.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <form
                        id="edit-style-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 pr-4"
                    >
                        {errors.root && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.root.message}</AlertDescription>
                            </Alert>
                        )}
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Style Name *</Label>
                            <Input
                                id="name"
                                placeholder="Bomber, Biker, Hoodie, etc."
                                {...register("name")}
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
                                value={currentStatus}
                                onValueChange={(value) =>
                                    setValue("status", value as any, {
                                        shouldDirty: true,
                                    })
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
                        onClick={() => onOpenChange(false)}
                        disabled={busy}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-style-form"
                        disabled={busy || !isDirty}
                    >
                        {busy ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
