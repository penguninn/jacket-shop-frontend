import { useState } from "react";
import { ColorTable } from "../components/color/ColorTable";
import { SizeTable } from "../components/size/SizeTable";
import { MaterialTable } from "../components/material/MaterialTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ColorCreateForm } from "../components/color/ColorCreateForm";
import { SizeCreateForm } from "../components/size/SizeCreateForm";
import { MaterialCreateForm } from "../components/material/MaterialCreateForm";

export default function Attributes() {
  const [activeTab, setActiveTab] = useState("color");

  const renderCreateForm = () => {
    switch (activeTab) {
      case "color":
        return <ColorCreateForm />;
      case "size":
        return <SizeCreateForm />;
      case "material":
        return <MaterialCreateForm />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attributes Management</h1>
          <p className="text-muted-foreground">
            Manage product colors, sizes, and materials
          </p>
        </div>
        {renderCreateForm()}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="color">Colors</TabsTrigger>
          <TabsTrigger value="size">Sizes</TabsTrigger>
          <TabsTrigger value="material">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-4">
          <ColorTable />
        </TabsContent>

        <TabsContent value="size" className="space-y-4">
          <SizeTable />
        </TabsContent>

        <TabsContent value="material" className="space-y-4">
          <MaterialTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
