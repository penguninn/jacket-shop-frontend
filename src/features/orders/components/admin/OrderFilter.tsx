
import { Search, QrCode, Plus } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";

export function OrderFilter() {
    const [date, setDate] = useState<Date>();

    return (
        <div className="bg-white p-4 rounded-sm shadow-sm space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search orders" className="pl-10" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 gap-2">
                        <QrCode className="w-4 h-4" />
                        Scan QR
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
                        <Plus className="w-4 h-4" />
                        Create Order
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    {/* From Date */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "dd/MM/yyyy") : <span>From Date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </Popover>

                    {/* To Date */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "dd/MM/yyyy") : <span>To Date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-4">
                    <span className="font-medium text-sm text-gray-700">Type:</span>
                    <RadioGroup defaultValue="all" className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="r1" className="text-orange-600 border-orange-600" />
                            <Label htmlFor="r1" className="cursor-pointer">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="online" id="r2" />
                            <Label htmlFor="r2" className="cursor-pointer">Online</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pos" id="r3" />
                            <Label htmlFor="r3" className="cursor-pointer">POS</Label>
                        </div>
                    </RadioGroup>
                </div>

                <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 ml-auto">
                    Export Excel
                </Button>
            </div>
        </div>
    )
}
