// Data service to handle fetching and caching application data
import { useState, useEffect } from 'react';

export interface AppData {
  apm_application_code: string;
  application_name: string;
  application_description: string;
  application_lifecycle: string;
  critical_information_asset: string;
  application_security_release_assessment_required: string;
  application_contact: string;
  application_contact_email: string;
  application_contact_title: string;
  user_interface: string;
  isusapp: string;
}

// Cache for the data to avoid multiple fetches
let dataCache: AppData[] | null = null;

// Function to fetch all data
export const fetchAllData = async (): Promise<AppData[]> => {
  if (dataCache) {
    return dataCache;
  }
  
  try {
    const response = await fetch('/data-small.json');
    const data = await response.json();
    dataCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// Function to fetch a specific app by code
export const fetchAppByCode = async (appCode: string): Promise<AppData | null> => {
  const allData = await fetchAllData();
  return allData.find(item => item.apm_application_code === appCode) || null;
};

// Custom hook to get a specific app
export const useApp = (appCode: string | null) => {
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!appCode) {
      setApp(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchAppByCode(appCode)
      .then(data => {
        setApp(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      });
  }, [appCode]);

  return { app, loading, error };
};
