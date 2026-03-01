"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  Truck,
  ArrowRight,
  Filter,
} from "lucide-react";
import { machines, Machine, mockInspectionResult, getStatusColor, getStatusTextColor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calculate fleet stats
  const fleetStats = {
    total: machines.length,
    pass: machines.filter((m) => m.status === "pass").length,
    monitor: machines.filter((m) => m.status === "monitor").length,
    fail: machines.filter((m) => m.status === "fail").length,
    pending: machines.filter((m) => m.status === "pending").length,
  };

  const filteredMachines =
    statusFilter === "all"
      ? machines
      : machines.filter((m) => m.status === statusFilter);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-cat-black mb-2">
          Fleet Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor machine status and inspection reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Fleet"
          value={fleetStats.total}
          icon={Truck}
          color="bg-cat-black"
        />
        <StatCard
          label="Ready"
          value={fleetStats.pass}
          icon={CheckCircle}
          color="bg-green-500"
          onClick={() => setStatusFilter("pass")}
          active={statusFilter === "pass"}
        />
        <StatCard
          label="Monitor"
          value={fleetStats.monitor}
          icon={AlertTriangle}
          color="bg-cat-yellow"
          textDark
          onClick={() => setStatusFilter("monitor")}
          active={statusFilter === "monitor"}
        />
        <StatCard
          label="Failed"
          value={fleetStats.fail}
          icon={XCircle}
          color="bg-cat-red"
          onClick={() => setStatusFilter("fail")}
          active={statusFilter === "fail"}
        />
        <StatCard
          label="Pending"
          value={fleetStats.pending}
          icon={Clock}
          color="bg-gray-400"
          onClick={() => setStatusFilter("pending")}
          active={statusFilter === "pending"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Machine List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-cat-black">Machines</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded transition-colors",
                    statusFilter === "all"
                      ? "bg-cat-black text-white"
                      : "bg-cat-gray text-cat-black hover:bg-cat-gray-dark"
                  )}
                >
                  All
                </button>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-3">
              {filteredMachines.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => setSelectedMachine(machine)}
                  className={cn(
                    "w-full text-left p-4 rounded border transition-all",
                    selectedMachine?.id === machine.id
                      ? "border-cat-yellow bg-cat-yellow/5"
                      : "border-border hover:border-cat-black/20 bg-cat-gray/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cat-gray rounded flex items-center justify-center">
                        <Truck className="h-6 w-6 text-cat-black" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cat-black">
                            {machine.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-bold px-2 py-0.5 rounded uppercase",
                              getStatusColor(machine.status),
                              getStatusTextColor(machine.status)
                            )}
                          >
                            {machine.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {machine.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-muted-foreground">
                        {machine.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last: {machine.lastInspection}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedMachine ? (
            <MachineDetailPanel machine={selectedMachine} />
          ) : (
            <div className="bg-white rounded p-6 h-full flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Select a machine to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-cat-yellow rounded p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-cat-black mb-1">
              Start New Inspection
            </h3>
            <p className="text-cat-black/70">
              {fleetStats.pending} machines pending inspection
            </p>
          </div>
          <Link
            href="/inspect"
            className="inline-flex items-center gap-2 bg-cat-black text-white font-bold px-6 py-3 rounded hover:bg-cat-black/90 transition-colors"
          >
            Start Inspection
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  textDark = false,
  onClick,
  active = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  textDark?: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      onClick={onClick}
      className={cn(
        "rounded p-4 transition-all",
        color,
        onClick && "hover:opacity-90 cursor-pointer",
        active && "ring-2 ring-cat-black ring-offset-2"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={cn("h-5 w-5", textDark ? "text-cat-black" : "text-white")} />
      </div>
      <p className={cn("text-3xl font-black", textDark ? "text-cat-black" : "text-white")}>
        {value}
      </p>
      <p className={cn("text-sm", textDark ? "text-cat-black/70" : "text-white/70")}>
        {label}
      </p>
    </Component>
  );
}

function MachineDetailPanel({ machine }: { machine: Machine }) {
  return (
    <div className="bg-white rounded p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-cat-black">{machine.name}</h3>
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded uppercase",
              getStatusColor(machine.status),
              getStatusTextColor(machine.status)
            )}
          >
            {machine.status}
          </span>
        </div>
        <p className="text-sm font-mono text-muted-foreground">{machine.id}</p>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Model</span>
          <span className="text-sm font-medium text-cat-black">{machine.model}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Location</span>
          <span className="text-sm font-medium text-cat-black">{machine.location}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Hours</span>
          <span className="text-sm font-medium text-cat-black">
            {machine.hours.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Last Inspection</span>
          <span className="text-sm font-medium text-cat-black">
            {machine.lastInspection}
          </span>
        </div>
      </div>

      {/* Latest Inspection Summary */}
      {machine.status !== "pending" && (
        <div className="bg-cat-gray rounded p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Latest Finding
          </h4>
          <p className="text-sm text-cat-black leading-relaxed">
            {machine.status === "monitor"
              ? "Minor hydraulic seepage detected at left track tensioner. Monitoring recommended."
              : machine.status === "fail"
              ? "Critical brake pad wear detected. Immediate maintenance required."
              : "All systems operating within normal parameters."}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <Link
          href="/inspect"
          className="w-full py-3 bg-cat-yellow text-cat-black font-bold rounded flex items-center justify-center gap-2 hover:brightness-95 transition-all"
        >
          New Inspection
        </Link>
        <button className="w-full py-3 bg-cat-gray text-cat-black font-medium rounded hover:bg-cat-gray-dark transition-colors">
          View History
        </button>
      </div>
    </div>
  );
}
