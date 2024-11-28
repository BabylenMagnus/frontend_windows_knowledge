"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToastProvider } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

function SettingsPageContent() {
  const { toast } = useToast();
  
  // Load settings from localStorage on initial render
  const [token, setToken] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('apiToken') || '' : '';
  });
  
  const [selectedModel, setSelectedModel] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('selectedModel') || 'gpt-4o' : 'gpt-4o';
  });
  
  const [webSearchEnabled, setWebSearchEnabled] = useState(() => {
    const storedValue = typeof window !== 'undefined' ? localStorage.getItem('webSearchEnabled') : 'false';
    return storedValue === 'true';
  });

  const [neuroApiEnabled, setNeuroApiEnabled] = useState(() => {
    const storedValue = typeof window !== 'undefined' ? localStorage.getItem('neuroApiEnabled') : 'false';
    return storedValue === 'true';
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiToken', token);
      localStorage.setItem('selectedModel', selectedModel);
      localStorage.setItem('webSearchEnabled', webSearchEnabled.toString());
      localStorage.setItem('neuroApiEnabled', neuroApiEnabled.toString());
    }
  }, [token, selectedModel, webSearchEnabled, neuroApiEnabled]);

  const handleSave = () => {
    // Validate token (basic check)
    if (!token.trim()) {
      toast({
        title: "Validation Error",
        description: "API Token cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Save successful
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md space-y-6">
      <h1 className="text-2xl font-bold mb-6">Application Settings</h1>
      
      <div>
        <Label htmlFor="token">API Token</Label>
        <Input 
          id="token"
          type="text" 
          placeholder="Enter your API token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Select Model</Label>
        <Select 
          value={selectedModel} 
          onValueChange={setSelectedModel}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Choose a model">
              {selectedModel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">gpt-4o</SelectItem>
            <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
            <SelectItem value="Qwen/Qwen2-72B-Instruct">Qwen/Qwen2-72B-Instruct</SelectItem>
            <SelectItem value="meta-llama/Meta-Llama-3.1-70B-Instruct">meta-llama/Meta-Llama-3.1-70B-Instruct</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Web Search</Label>
        <RadioGroup 
          value={webSearchEnabled.toString()} 
          onValueChange={(value) => setWebSearchEnabled(value === 'true')}
          className="mt-2 flex space-x-4"
        >
          <RadioGroupItem value="false" id="web-search-off">
            <Label htmlFor="web-search-off">Off</Label>
          </RadioGroupItem>
          <RadioGroupItem value="true" id="web-search-on">
            <Label htmlFor="web-search-on">On</Label>
          </RadioGroupItem>
        </RadioGroup>
      </div>

      <div>
        <Label>Neuro API</Label>
        <RadioGroup 
          value={neuroApiEnabled.toString()} 
          onValueChange={(value) => setNeuroApiEnabled(value === 'true')}
          className="mt-2 flex space-x-4"
        >
          <RadioGroupItem value="false" id="neuro-api-off">
            <Label htmlFor="neuro-api-off">Disabled</Label>
          </RadioGroupItem>
          <RadioGroupItem value="true" id="neuro-api-on">
            <Label htmlFor="neuro-api-on">Enabled</Label>
          </RadioGroupItem>
        </RadioGroup>
      </div>

      <Button 
        onClick={handleSave} 
        className="w-full mt-4"
      >
        Save Settings
      </Button>

      <Toaster />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsPageContent />
    </ToastProvider>
  );
}
