"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, ScanLine, Clock, MapPin } from "lucide-react";
import { Machine, getStatusColor, getStatusTextColor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface MachineSelectionProps {
  machines: Machine[];
  onSelect: (machine: Machine) => void;
}

export function MachineSelection({ machines, onSelect }: MachineSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || machine.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="p-2 -ml-2 hover:bg-cat-gray rounded transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-cat-black">Select Machine</h1>
              <p className="text-sm text-muted-foreground">
                Choose a machine to inspect
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, ID, or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-cat-gray rounded text-cat-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cat-yellow"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {["all", "pending", "pass", "monitor", "fail"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors",
                  filterStatus === status
                    ? "bg-cat-black text-white"
                    : "bg-cat-gray text-cat-black hover:bg-cat-gray-dark"
                )}
              >
                {status === "all" ? "All Machines" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* QR Scan Button */}
      <div className="px-4 py-4">
        <button className="w-full flex items-center justify-center gap-3 py-4 bg-cat-yellow text-cat-black font-bold rounded">
          <ScanLine className="h-5 w-5" />
          Scan QR Code
        </button>
      </div>

      {/* Machine List */}
      <div className="px-4 pb-8">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredMachines.length} machine{filteredMachines.length !== 1 ? "s" : ""} found
        </p>

        <div className="space-y-3">
          {filteredMachines.map((machine) => (
            <button
              key={machine.id}
              onClick={() => onSelect(machine)}
              className="w-full bg-cat-gray hover:bg-cat-gray-dark rounded p-4 text-left transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Machine Name and ID */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-cat-black truncate">
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

                  {/* Machine ID */}
                  <p className="text-sm font-mono text-muted-foreground mb-2">
                    {machine.id}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {machine.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {machine.lastInspection}
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-cat-black">
                    {machine.hours.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">hours</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
