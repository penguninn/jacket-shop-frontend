import { ColorTable } from "@/components/admin/tables/color/ColorTable";
import { SizeTable } from "@/components/admin/tables/size/SizeTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Attributes() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Attributes Management</h1>

      <Tabs defaultValue="color" className="space-y-4">
        <TabsList>
          <TabsTrigger value="color">Colors</TabsTrigger>
          <TabsTrigger value="size">Sizes</TabsTrigger>
        </TabsList>

        <TabsContent value="color">
          <ColorTable />
        </TabsContent>

        <TabsContent value="size">
          <SizeTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
