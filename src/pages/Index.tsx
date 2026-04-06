import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableProperties, Calculator } from "lucide-react";
import FeeTable from "@/components/FeeTable";
import CostCalculator from "@/components/CostCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Bảng Phí Sàn</h1>
          <p className="text-sm text-muted-foreground">
            Tra cứu phí hoa hồng & tính chi phí bán hàng
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4">
        <Tabs defaultValue="fee-table" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="fee-table" className="flex items-center gap-2">
              <TableProperties className="h-4 w-4" />
              Bảng phí sàn
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Tính chi phí
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fee-table">
            <FeeTable />
          </TabsContent>

          <TabsContent value="calculator">
            <CostCalculator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
