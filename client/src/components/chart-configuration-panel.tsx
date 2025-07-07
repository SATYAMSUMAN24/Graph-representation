import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Chart } from "@shared/schema";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Sparkle, 
  TrendingUp, 
  Radar,
  RefreshCw,
  RotateCcw
} from "lucide-react";

interface ChartConfigurationPanelProps {
  chart: Chart | null;
  onChartUpdate: (chart: Chart) => void;
}

export function ChartConfigurationPanel({ chart, onChartUpdate }: ChartConfigurationPanelProps) {
  const [localChart, setLocalChart] = useState<Chart | null>(chart);

  const handleChartTypeChange = (chartType: string) => {
    if (!chart) return;
    
    const updatedChart = { ...chart, chartType };
    setLocalChart(updatedChart);
    onChartUpdate(updatedChart);
  };

  const handleConfigChange = (field: keyof Chart, value: any) => {
    if (!chart) return;
    
    const updatedChart = { ...chart, [field]: value };
    setLocalChart(updatedChart);
    onChartUpdate(updatedChart);
  };

  const handleOptionsChange = (optionKey: string, value: any) => {
    if (!chart) return;
    
    const updatedOptions = { ...chart.options, [optionKey]: value };
    const updatedChart = { ...chart, options: updatedOptions };
    setLocalChart(updatedChart);
    onChartUpdate(updatedChart);
  };

  const resetToDefault = () => {
    if (!chart) return;
    
    const defaultChart: Chart = {
      ...chart,
      title: "New Chart",
      chartType: "bar",
      xAxisLabel: "X-Axis",
      yAxisLabel: "Y-Axis",
      colorTheme: "blue",
      options: {
        showGrid: true,
        showLegend: true,
        showDataLabels: false,
        enableAnimation: true
      }
    };
    
    setLocalChart(defaultChart);
    onChartUpdate(defaultChart);
  };

  if (!chart) {
    return (
      <div className="text-center text-gray-500">
        <p>No chart selected</p>
      </div>
    );
  }

  const chartTypes = [
    { value: "bar", label: "Bar Chart", icon: BarChart3 },
    { value: "line", label: "Line Chart", icon: LineChart },
    { value: "pie", label: "Pie Chart", icon: PieChart },
    { value: "scatter", label: "Sparkle", icon: Sparkle },
    { value: "area", label: "Area Chart", icon: TrendingUp },
    { value: "radar", label: "Radar", icon: Radar },
  ];

  return (
    <div className="space-y-6">
      {/* Chart Type Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-on-surface">Chart Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {chartTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.value}
                variant={chart.chartType === type.value ? "default" : "outline"}
                className={`p-3 h-auto flex flex-col items-center space-y-1 ${
                  chart.chartType === type.value 
                    ? "bg-primary text-white hover:bg-primary-dark" 
                    : "bg-gray-100 hover:bg-gray-200 text-on-surface"
                }`}
                onClick={() => handleChartTypeChange(type.value)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{type.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Chart Configuration */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-on-surface">Chart Configuration</h3>
        
        <div className="space-y-4">
          {/* Chart Title */}
          <div>
            <Label htmlFor="chart-title" className="text-sm font-medium text-secondary">
              Chart Title
            </Label>
            <Input
              id="chart-title"
              value={chart.title}
              onChange={(e) => handleConfigChange("title", e.target.value)}
              placeholder="Enter chart title"
              className="mt-2"
            />
          </div>

          {/* X-Axis Label */}
          <div>
            <Label htmlFor="x-axis" className="text-sm font-medium text-secondary">
              X-Axis Label
            </Label>
            <Input
              id="x-axis"
              value={chart.xAxisLabel || ""}
              onChange={(e) => handleConfigChange("xAxisLabel", e.target.value)}
              placeholder="X-axis label"
              className="mt-2"
            />
          </div>

          {/* Y-Axis Label */}
          <div>
            <Label htmlFor="y-axis" className="text-sm font-medium text-secondary">
              Y-Axis Label
            </Label>
            <Input
              id="y-axis"
              value={chart.yAxisLabel || ""}
              onChange={(e) => handleConfigChange("yAxisLabel", e.target.value)}
              placeholder="Y-axis label"
              className="mt-2"
            />
          </div>

          {/* Color Theme */}
          <div>
            <Label className="text-sm font-medium text-secondary">Color Theme</Label>
            <Select
              value={chart.colorTheme || "blue"}
              onValueChange={(value) => handleConfigChange("colorTheme", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue Gradient</SelectItem>
                <SelectItem value="green">Green Theme</SelectItem>
                <SelectItem value="purple">Purple Scheme</SelectItem>
                <SelectItem value="orange">Orange Palette</SelectItem>
                <SelectItem value="multicolor">Multi-color</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-on-surface">Display Options</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="show-grid"
              checked={chart.options?.showGrid || false}
              onCheckedChange={(checked) => handleOptionsChange("showGrid", checked)}
            />
            <Label htmlFor="show-grid" className="text-sm text-secondary">
              Show Grid Lines
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="show-legend"
              checked={chart.options?.showLegend || false}
              onCheckedChange={(checked) => handleOptionsChange("showLegend", checked)}
            />
            <Label htmlFor="show-legend" className="text-sm text-secondary">
              Show Legend
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="show-data-labels"
              checked={chart.options?.showDataLabels || false}
              onCheckedChange={(checked) => handleOptionsChange("showDataLabels", checked)}
            />
            <Label htmlFor="show-data-labels" className="text-sm text-secondary">
              Show Data Labels
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="enable-animation"
              checked={chart.options?.enableAnimation || false}
              onCheckedChange={(checked) => handleOptionsChange("enableAnimation", checked)}
            />
            <Label htmlFor="enable-animation" className="text-sm text-secondary">
              Enable Animation
            </Label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button 
          className="w-full bg-primary hover:bg-primary-dark text-white"
          onClick={() => onChartUpdate(chart)}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Chart
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={resetToDefault}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
