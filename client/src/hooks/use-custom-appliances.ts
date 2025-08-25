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
    const loadCustomAppliances = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCustomAppliances(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading custom appliances:', error);
        setCustomAppliances([]);
      }
    };

    loadCustomAppliances();
    
    // Also listen for storage events to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadCustomAppliances();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to localStorage whenever custom appliances change
  useEffect(() => {
    try {
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
    
    setCustomAppliances(prev => [...prev, newAppliance]);
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