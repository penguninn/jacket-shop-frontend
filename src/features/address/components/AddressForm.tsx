import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import {
    addressRequestSchema,
    type AddressRequest,
    type AddressResponse,
} from "../model";
import { useProvinces, useDistricts, useWards } from "../hooks";

interface AddressFormProps {
    defaultValues?: Partial<AddressRequest>;
    onSubmit: (data: AddressRequest) => void;
    isLoading?: boolean;
    initialData?: AddressResponse; // For Edit mode to handle initial location loading
}

export function AddressForm({ defaultValues, onSubmit, isLoading, initialData }: AddressFormProps) {
    const form = useForm<AddressRequest>({
        resolver: zodResolver(addressRequestSchema),
        defaultValues: defaultValues || {
            recipientName: "",
            recipientPhone: "",
            addressLine: "",
            provinceId: undefined,
            districtId: undefined,
            wardId: undefined,
            isDefault: false,
        },
    });

    const provinceId = form.watch("provinceId");
    const districtId = form.watch("districtId");

    const { data: provinces, isLoading: loadingProvinces } = useProvinces();
    const { data: districts, isLoading: loadingDistricts } = useDistricts(provinceId || null);
    const { data: wards, isLoading: loadingWards } = useWards(districtId || null);

    // Reset dependent fields when parent fields change
    useEffect(() => {
        if (provinceId && initialData?.province.id !== provinceId) {
            // Only reset if it's a user change, not initial load
            // Actually, checking against initialData is tricky if initialData is static.
            // Better logic: If districtId is set, check if it belongs to current province?
            // Or just simpler: logic inside the Select onChange handler is better than useEffect for user interactions.
            // But react-hook-form Select integration wraps the onChange.
        }
    }, [provinceId]);

    // We handle resets in the render's onValueChange to separate user action from data loading.

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="recipientName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter recipient name" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="recipientPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter phone number" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="provinceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Province</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        const pid = Number(value);
                                        field.onChange(pid);
                                        // Reset child fields
                                        form.setValue("districtId", 0); // 0 or undefined, but 0 might fail schema if required positive? Schema says number. 
                                        // Ideally undefined but Select value expects string.
                                        // Zod expect number.
                                        // Let's set to undefined but force cast if needed or handle in form state.
                                        form.resetField("districtId");
                                        form.resetField("wardId");
                                    }}
                                    value={field.value ? String(field.value) : undefined}
                                    disabled={loadingProvinces}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Province" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {provinces?.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="districtId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>District</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        const did = Number(value);
                                        field.onChange(did);
                                        form.resetField("wardId");
                                    }}
                                    value={field.value ? String(field.value) : undefined}
                                    disabled={!provinceId || loadingDistricts}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {districts?.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="wardId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ward</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(Number(value));
                                    }}
                                    value={field.value ? String(field.value) : undefined}
                                    disabled={!districtId || loadingWards}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Ward" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {wards?.map((w) => (
                                            <SelectItem key={w.id} value={String(w.id)}>
                                                {w.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="addressLine"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input placeholder="House number, street name..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Set as default address</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Address
                    </Button>
                </div>
            </form>
        </Form>
    );
}
