import { useContext } from 'react';
import { BusinessOwnerContext } from '../contexts/BusinessOwnerContext';

export function useBusinessOwner() {
  const context = useContext(BusinessOwnerContext);
  if (context === undefined) {
    throw new Error('useBusinessOwner must be used within a BusinessOwnerProvider');
  }
  return context;
}
