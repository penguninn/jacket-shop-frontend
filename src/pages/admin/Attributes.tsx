import { useState } from "react";
import { ColorTable } from "@/components/admin/tables/color/ColorTable";
import { SizeTable } from "@/components/admin/tables/size/SizeTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorCreateForm } from "@/components/admin/forms/ColorCreateForm";
import { SizeCreateForm } from "@/components/admin/forms/SizeCreateForm";

export default function Attributes() {
  const [activeTab, setActiveTab] = useState("color");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attributes Management</h1>
          <p className="text-muted-foreground">
            Manage product colors and sizes
          </p>
        </div>
        {activeTab === "color" ? <ColorCreateForm /> : <SizeCreateForm />}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="color">Colors</TabsTrigger>
          <TabsTrigger value="size">Sizes</TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-4">
          <ColorTable />
        </TabsContent>

        <TabsContent value="size" className="space-y-4">
          <SizeTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
