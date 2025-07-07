import { users, charts, type User, type InsertUser, type Chart, type InsertChart } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chart operations
  getChart(id: number): Promise<Chart | undefined>;
  getAllCharts(): Promise<Chart[]>;
  createChart(chart: InsertChart): Promise<Chart>;
  updateChart(id: number, chart: Partial<InsertChart>): Promise<Chart | undefined>;
  deleteChart(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private charts: Map<number, Chart>;
  private currentUserId: number;
  private currentChartId: number;

  constructor() {
    this.users = new Map();
    this.charts = new Map();
    this.currentUserId = 1;
    this.currentChartId = 1;
    
    // Initialize with sample charts
    this.initializeSampleCharts();
  }

  private initializeSampleCharts() {
    const sampleChart: Chart = {
      id: 1,
      title: "Sales Performance Q4 2024",
      chartType: "bar",
      xAxisLabel: "Months",
      yAxisLabel: "Revenue ($)",
      colorTheme: "blue",
      data: [
        { label: "Jan", value: 45000 },
        { label: "Feb", value: 52000 },
        { label: "Mar", value: 38000 },
        { label: "Apr", value: 61000 },
        { label: "May", value: 48000 },
        { label: "Jun", value: 55000 },
        { label: "Jul", value: 49000 },
        { label: "Aug", value: 67000 },
        { label: "Sep", value: 59000 },
        { label: "Oct", value: 62000 },
        { label: "Nov", value: 48000 },
        { label: "Dec", value: 58000 }
      ],
      options: {
        showGrid: true,
        showLegend: true,
        showDataLabels: false,
        enableAnimation: true
      },
      createdAt: new Date().toISOString()
    };
    
    this.charts.set(1, sampleChart);
    this.currentChartId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChart(id: number): Promise<Chart | undefined> {
    return this.charts.get(id);
  }

  async getAllCharts(): Promise<Chart[]> {
    return Array.from(this.charts.values());
  }

  async createChart(insertChart: InsertChart): Promise<Chart> {
    const id = this.currentChartId++;
    const chart: Chart = { 
      ...insertChart, 
      id,
      createdAt: new Date().toISOString()
    };
    this.charts.set(id, chart);
    return chart;
  }

  async updateChart(id: number, updateData: Partial<InsertChart>): Promise<Chart | undefined> {
    const existingChart = this.charts.get(id);
    if (!existingChart) return undefined;
    
    const updatedChart: Chart = { ...existingChart, ...updateData };
    this.charts.set(id, updatedChart);
    return updatedChart;
  }

  async deleteChart(id: number): Promise<boolean> {
    return this.charts.delete(id);
  }
}

export const storage = new MemStorage();
