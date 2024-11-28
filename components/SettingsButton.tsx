"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';

export function SettingsButton() {
  const router = useRouter();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => router.push('/settings')}
    >
      <Settings className="h-5 w-5" />
    </Button>
  );
}
