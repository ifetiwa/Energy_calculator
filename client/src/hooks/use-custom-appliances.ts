import { useState, useEffect } from 'react';

export interface CustomApplianceTemplate {
  id: string;
  name: string;
  rating: number;
  category?: string;
}

const STORAGE_KEY = 'vectis-custom-appliances';

export function useCustomAppliances() {
  const [customAppliances, setCustomAppliances] = useState<CustomApplianceTemplate[]>([]);

  // Load custom appliances from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCustomAppliances(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading custom appliances:', error);
      setCustomAppliances([]);
    }
  }, []);

  // Save to localStorage whenever custom appliances change
  useEffect(() => {
    try {
      console.log('Saving to localStorage:', customAppliances);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customAppliances));
    } catch (error) {
      console.error('Error saving custom appliances:', error);
    }
  }, [customAppliances]);

  const addCustomAppliance = (appliance: Omit<CustomApplianceTemplate, 'id'>) => {
    const newAppliance: CustomApplianceTemplate = {
      ...appliance,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    console.log('Adding custom appliance:', newAppliance);
    setCustomAppliances(prev => {
      const updated = [...prev, newAppliance];
      console.log('Updated custom appliances:', updated);
      return updated;
    });
    return newAppliance;
  };

  const updateCustomAppliance = (id: string, updates: Partial<Omit<CustomApplianceTemplate, 'id'>>) => {
    setCustomAppliances(prev => 
      prev.map(appliance => 
        appliance.id === id ? { ...appliance, ...updates } : appliance
      )
    );
  };

  const deleteCustomAppliance = (id: string) => {
    setCustomAppliances(prev => prev.filter(appliance => appliance.id !== id));
  };

  const getCustomApplianceByName = (name: string) => {
    return customAppliances.find(appliance => appliance.name === name);
  };

  return {
    customAppliances,
    addCustomAppliance,
    updateCustomAppliance,
    deleteCustomAppliance,
    getCustomApplianceByName,
  };
}