import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAppByCode } from '../api/dataService';

export const ApiAppEndpoint: React.FC = () => {
  const { appCode } = useParams<{ appCode: string }>();
  
  useEffect(() => {
    const fetchAndReturnJson = async () => {
      try {
        const appData = await fetchAppByCode(appCode || '');
        
        // Set the content type to application/json
        document.querySelector('html')?.setAttribute('content-type', 'application/json');
        
        // Format the JSON with indentation for better readability
        const formattedJson = JSON.stringify(appData, null, 2);
        
        // Replace the entire document with the JSON
        document.body.innerHTML = `<pre>${formattedJson}</pre>`;
        document.title = `API: ${appCode}`;
      } catch (error) {
        console.error('Error fetching app data:', error);
        document.body.innerHTML = JSON.stringify({ error: 'Failed to fetch application data' }, null, 2);
      }
    };
    
    fetchAndReturnJson();
  }, [appCode]);
  
  // This component doesn't render anything visible
  // The useEffect above will replace the entire document
  return null;
};
