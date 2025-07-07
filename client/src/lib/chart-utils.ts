import { Chart } from "@shared/schema";

interface DataPoint {
  label: string;
  value: number;
}

const colorThemes = {
  blue: ['#1976D2', '#42A5F5', '#90CAF9', '#BBDEFB'],
  green: ['#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'],
  purple: ['#9C27B0', '#BA68C8', '#CE93D8', '#E1BEE7'],
  orange: ['#FF9800', '#FFB74D', '#FFCC02', '#FFE082'],
  multicolor: ['#1976D2', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4']
};

export function getChartOptions(chart: Chart) {
  const data = Array.isArray(chart.data) ? chart.data : [];
  const colors = colorThemes[chart.colorTheme as keyof typeof colorThemes] || colorThemes.blue;
  
  const baseOptions = {
    title: {
      text: chart.title,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '15%',
      show: chart.options?.showGrid || false
    },
    animation: chart.options?.enableAnimation || false,
    color: colors
  };

  switch (chart.chartType) {
    case 'bar':
      return {
        ...baseOptions,
        xAxis: {
          type: 'category',
          data: data.map(d => d.label),
          name: chart.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: chart.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [{
          data: data.map(d => d.value),
          type: 'bar',
          itemStyle: {
            color: colors[0]
          },
          label: {
            show: chart.options?.showDataLabels || false,
            position: 'top'
          }
        }],
        legend: {
          show: chart.options?.showLegend || false
        }
      };

    case 'line':
      return {
        ...baseOptions,
        xAxis: {
          type: 'category',
          data: data.map(d => d.label),
          name: chart.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: chart.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [{
          data: data.map(d => d.value),
          type: 'line',
          smooth: true,
          itemStyle: {
            color: colors[0]
          },
          lineStyle: {
            color: colors[0]
          },
          label: {
            show: chart.options?.showDataLabels || false,
            position: 'top'
          }
        }],
        legend: {
          show: chart.options?.showLegend || false
        }
      };

    case 'pie':
      return {
        ...baseOptions,
        series: [{
          name: chart.title,
          type: 'pie',
          radius: '50%',
          data: data.map((d, index) => ({
            value: d.value,
            name: d.label,
            itemStyle: {
              color: colors[index % colors.length]
            }
          })),
          label: {
            show: chart.options?.showDataLabels !== false,
            formatter: '{b}: {c} ({d}%)'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }],
        legend: {
          show: chart.options?.showLegend !== false,
          orient: 'vertical',
          left: 'left'
        }
      };

    case 'scatter':
      return {
        ...baseOptions,
        xAxis: {
          type: 'value',
          name: chart.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: chart.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [{
          symbolSize: 8,
          data: data.map((d, index) => [index, d.value]),
          type: 'scatter',
          itemStyle: {
            color: colors[0]
          },
          label: {
            show: chart.options?.showDataLabels || false,
            formatter: (params: any) => data[params.data[0]]?.label || ''
          }
        }],
        legend: {
          show: chart.options?.showLegend || false
        }
      };

    case 'area':
      return {
        ...baseOptions,
        xAxis: {
          type: 'category',
          data: data.map(d => d.label),
          name: chart.xAxisLabel,
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: chart.yAxisLabel,
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [{
          data: data.map(d => d.value),
          type: 'line',
          areaStyle: {
            color: `rgba(${colors[0].replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.3)`
          },
          itemStyle: {
            color: colors[0]
          },
          lineStyle: {
            color: colors[0]
          },
          label: {
            show: chart.options?.showDataLabels || false,
            position: 'top'
          }
        }],
        legend: {
          show: chart.options?.showLegend || false
        }
      };

    case 'radar':
      const indicators = data.map(d => ({ name: d.label, max: Math.max(...data.map(item => item.value)) * 1.2 }));
      return {
        ...baseOptions,
        radar: {
          indicator: indicators
        },
        series: [{
          name: chart.title,
          type: 'radar',
          data: [{
            value: data.map(d => d.value),
            name: 'Data',
            itemStyle: {
              color: colors[0]
            },
            areaStyle: {
              color: `rgba(${colors[0].replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.3)`
            }
          }],
          label: {
            show: chart.options?.showDataLabels || false
          }
        }],
        legend: {
          show: chart.options?.showLegend || false
        }
      };

    default:
      return baseOptions;
  }
}
