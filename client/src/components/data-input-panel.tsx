import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chart } from "@shared/schema";
import { Plus, Trash2, Keyboard, Upload } from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
}

interface DataInputPanelProps {
  chart: Chart | null;
  onChartUpdate: (chart: Chart) => void;
}

export function DataInputPanel({ chart, onChartUpdate }: DataInputPanelProps) {
  const [newDataPoint, setNewDataPoint] = useState<DataPoint>({ label: "", value: 0 });

  const sampleDatasets = {
    sales: [
      { label: "Jan", value: 45000 },
      { label: "Feb", value: 52000 },
      { label: "Mar", value: 38000 },
      { label: "Apr", value: 61000 },
      { label: "May", value: 48000 },
      { label: "Jun", value: 55000 }
    ],
    analytics: [
      { label: "Page Views", value: 12500 },
      { label: "Unique Visitors", value: 8300 },
      { label: "Sessions", value: 9200 },
      { label: "Bounce Rate", value: 32 }
    ],
    products: [
      { label: "Product A", value: 85 },
      { label: "Product B", value: 92 },
      { label: "Product C", value: 78 },
      { label: "Product D", value: 96 }
    ]
  };

  const handleSampleDataLoad = (datasetKey: string) => {
    if (!chart) return;
    
    const dataset = sampleDatasets[datasetKey as keyof typeof sampleDatasets];
    if (dataset) {
      const updatedChart = { ...chart, data: dataset };
      onChartUpdate(updatedChart);
    }
  };

  const handleAddDataPoint = () => {
    if (!chart || !newDataPoint.label) return;
    
    const updatedData = [...(Array.isArray(chart.data) ? chart.data : []), newDataPoint];
    const updatedChart = { ...chart, data: updatedData };
    onChartUpdate(updatedChart);
    setNewDataPoint({ label: "", value: 0 });
  };

  const handleUpdateDataPoint = (index: number, field: keyof DataPoint, value: string | number) => {
    if (!chart || !Array.isArray(chart.data)) return;
    
    const updatedData = [...chart.data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    const updatedChart = { ...chart, data: updatedData };
    onChartUpdate(updatedChart);
  };

  const handleDeleteDataPoint = (index: number) => {
    if (!chart || !Array.isArray(chart.data)) return;
    
    const updatedData = chart.data.filter((_, i) => i !== index);
    const updatedChart = { ...chart, data: updatedData };
    onChartUpdate(updatedChart);
  };

  if (!chart) {
    return (
      <div className="text-center text-gray-500">
        <p>No chart selected</p>
      </div>
    );
  }

  const chartData = Array.isArray(chart.data) ? chart.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-on-surface">Data Input</h3>
        
        {/* Sample Data Sets */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-secondary">Load Sample Data</Label>
          <Select onValueChange={handleSampleDataLoad}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select sample dataset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Performance</SelectItem>
              <SelectItem value="analytics">Website Analytics</SelectItem>
              <SelectItem value="products">Product Comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Entry Method */}
        <div className="flex space-x-2 mb-4">
          <Button 
            className="flex-1 bg-primary text-white hover:bg-primary-dark text-sm"
            variant="default"
          >
            <Keyboard className="mr-2 h-4 w-4" />
            Manual Entry
          </Button>
          <Button variant="outline" className="flex-1 text-sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
        </div>

        {/* Quick Data Entry */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="Label"
              value={newDataPoint.label}
              onChange={(e) => setNewDataPoint({ ...newDataPoint, label: e.target.value })}
              className="flex-1 text-sm"
            />
            <Input
              type="number"
              placeholder="Value"
              value={newDataPoint.value}
              onChange={(e) => setNewDataPoint({ ...newDataPoint, value: Number(e.target.value) })}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleAddDataPoint}
              className="bg-success text-white hover:bg-green-600"
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Data Points */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {chartData.map((dataPoint, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={dataPoint.label}
                  onChange={(e) => handleUpdateDataPoint(index, "label", e.target.value)}
                  className="flex-1 text-sm"
                />
                <Input
                  type="number"
                  value={dataPoint.value}
                  onChange={(e) => handleUpdateDataPoint(index, "value", Number(e.target.value))}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={() => handleDeleteDataPoint(index)}
                  variant="outline"
                  size="sm"
                  className="text-error hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {chartData.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">No data points added yet</p>
              <p className="text-xs text-gray-400">Add data points above or load sample data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
