import { useMutation } from "@tanstack/react-query";
import { getShippingRates } from "../api";
import type { GoshipRateRequest } from "../model/schemas";

export function useShippingRates() {
    return useMutation({
        mutationFn: (data: GoshipRateRequest) => getShippingRates(data),
    });
}
