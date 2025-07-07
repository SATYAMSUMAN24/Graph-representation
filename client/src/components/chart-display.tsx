import { useEffect, useRef, useState } from "react";
import { Chart } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getChartOptions } from "@/lib/chart-utils";
import { Expand, Settings, Edit, Download } from "lucide-react";

interface ChartDisplayProps {
  chart: Chart | null;
}

declare global {
  interface Window {
    echarts: any;
  }
}

export function ChartDisplay({ chart }: ChartDisplayProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load ECharts script if not already loaded
    if (!window.echarts) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
      script.onload = () => {
        initializeChart();
      };
      script.onerror = () => {
        console.error('ChartDisplay: Failed to load ECharts script');
      };
      document.head.appendChild(script);
    } else {
      initializeChart();
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (chart && chartInstanceRef.current) {
      updateChart();
    }
  }, [chart]);

  const initializeChart = () => {
    if (chartRef.current && window.echarts) {
      chartInstanceRef.current = window.echarts.init(chartRef.current);
      
      // Handle window resize
      const handleResize = () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.resize();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      if (chart) {
        updateChart();
      }
    }
  };

  const updateChart = () => {
    if (!chart || !chartInstanceRef.current) return;
    
    setIsLoading(true);
    
    try {
      const options = getChartOptions(chart);
      chartInstanceRef.current.setOption(options, true);
    } catch (error) {
      console.error('Error updating chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    if (!chart || !Array.isArray(chart.data)) {
      return { dataPoints: 0, maxValue: 0, average: 0 };
    }

    const values = chart.data.map(d => d.value);
    const dataPoints = values.length;
    const maxValue = Math.max(...values);
    const average = values.reduce((sum, val) => sum + val, 0) / dataPoints;

    return { dataPoints, maxValue, average };
  };

  const stats = calculateStats();
  
  if (!chart) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Chart Selected</h3>
          <p className="text-gray-500">Configure your chart settings to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chart Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-on-surface">{chart.title}</h2>
            <p className="text-secondary text-sm mt-1">
              Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-secondary">
              <span className="capitalize">{chart.chartType} Chart</span>
            </div>
            <Button variant="outline" size="sm">
              <Expand className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 p-6 relative">
        <Card className="h-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-secondary">Updating chart...</p>
              </div>
            </div>
          )}

          <div ref={chartRef} className="h-full w-full p-4 min-h-[400px]" />

          {/* Chart Stats Panel */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200">
            <h4 className="font-medium text-sm text-on-surface mb-2">Quick Stats</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Data Points:</span>
                <span className="font-medium">{stats.dataPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Max Value:</span>
                <span className="font-medium">{stats.maxValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Average:</span>
                <span className="font-medium">{stats.average.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Data Table */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-on-surface">Data Table</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-secondary">
                  {chart.xAxisLabel || "Label"}
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary">
                  {chart.yAxisLabel || "Value"}
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(chart.data) && chart.data.map((dataPoint, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{dataPoint.label}</td>
                  <td className="py-3 px-4 font-medium">{dataPoint.value.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark mr-3">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-error hover:text-red-600">
                      <span>×</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!Array.isArray(chart.data) || chart.data.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No data available</p>
              <p className="text-sm">Add data points to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
