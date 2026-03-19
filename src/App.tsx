import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualEntry from "@/components/ManualEntry";
import BatchImport from "@/components/BatchImport";

export default function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 标题栏 */}
      <header className="border-b bg-card px-6 py-3 flex items-center gap-3">
        <h1 className="text-base font-semibold">国民体质测定评分系统</h1>
        <span className="text-xs text-muted-foreground">
          基于《国民体质测定标准》成年人部分（国家体育总局，2003）
        </span>
      </header>

      {/* 主体 */}
      <main className="flex-1 p-6">
        <Tabs defaultValue="manual">
          <TabsList className="mb-4">
            <TabsTrigger value="manual">手动录入</TabsTrigger>
            <TabsTrigger value="batch">批量导入</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <ManualEntry />
          </TabsContent>

          <TabsContent value="batch">
            <BatchImport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
