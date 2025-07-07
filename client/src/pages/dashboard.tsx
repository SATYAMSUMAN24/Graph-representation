import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChartConfigurationPanel } from "@/components/chart-configuration-panel";
import { ChartDisplay } from "@/components/chart-display";
import { DataInputPanel } from "@/components/data-input-panel";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Chart } from "@shared/schema";
import { Download, Save, ChartBar } from "lucide-react";

export default function Dashboard() {
  const [currentChart, setCurrentChart] = useState<Chart | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: charts, isLoading } = useQuery({
    queryKey: ["/api/charts"],
  });

  const saveChartMutation = useMutation({
    mutationFn: async (chartData: Partial<Chart>) => {
      if (currentChart?.id) {
        const response = await apiRequest("PUT", `/api/charts/${currentChart.id}`, chartData);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/charts", chartData);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/charts"] });
      toast({
        title: "Chart saved successfully",
        description: "Your chart has been saved to the dashboard.",
      });
    },
    onError: () => {
      toast({
        title: "Error saving chart",
        description: "There was an error saving your chart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveChart = () => {
    if (currentChart) {
      saveChartMutation.mutate({
        title: currentChart.title,
        chartType: currentChart.chartType,
        xAxisLabel: currentChart.xAxisLabel,
        yAxisLabel: currentChart.yAxisLabel,
        colorTheme: currentChart.colorTheme,
        data: currentChart.data,
        options: currentChart.options,
      });
    }
  };

  const handleExportChart = () => {
    // Export functionality would be implemented here
    toast({
      title: "Export feature",
      description: "Chart export functionality will be implemented soon.",
    });
  };

  // Initialize with first chart if available
  if (!currentChart && charts && charts.length > 0) {
    setCurrentChart(charts[0]);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ChartBar className="text-primary text-2xl" />
            <h1 className="text-xl font-medium text-on-surface">ChartCraft Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleExportChart}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Chart
            </Button>
            <Button 
              onClick={handleSaveChart}
              variant="secondary"
              disabled={saveChartMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {saveChartMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <ChartConfigurationPanel 
              chart={currentChart}
              onChartUpdate={setCurrentChart}
            />
            <DataInputPanel 
              chart={currentChart}
              onChartUpdate={setCurrentChart}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <ChartDisplay chart={currentChart} />
        </div>
      </div>
    </div>
  );
}
