"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function SettingsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Application Settings</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
