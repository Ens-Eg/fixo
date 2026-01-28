import { useState, useEffect } from 'react';
import { checkAvailability } from '@/services/auth.service';

// Regex constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

interface UseAvailabilityCheckOptions {
  value: string;
  type: 'email' | 'phone';
  minLength?: number;
  debounceMs?: number;
}

interface UseAvailabilityCheckReturn {
  isAvailable: boolean | null;
  isChecking: boolean;
}

/**
 * Custom hook to check availability of email or phone number
 * with debouncing and validation
 */
export function useAvailabilityCheck({
  value,
  type,
  minLength = 3,
  debounceMs = 800,
}: UseAvailabilityCheckOptions): UseAvailabilityCheckReturn {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Reset if value is too short
    if (!value || value.length < minLength) {
      setIsAvailable(null);
      return;
    }

    // Validate format before checking
    const isValid =
      type === 'email'
        ? EMAIL_REGEX.test(value)
        : PHONE_REGEX.test(value) && value.length >= 8;

    if (!isValid) {
      setIsAvailable(null);
      return;
    }

    // Debounced API call
    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const result = await checkAvailability(
          type === 'email' ? value : undefined,
          type === 'phone' ? value : undefined
        );
        
        // Handle the response - result should contain isAvailable
        if (result && typeof result.isAvailable === 'boolean') {
          setIsAvailable(result.isAvailable);
        } else {
          console.warn(`Unexpected response format for ${type} availability check:`, result);
          setIsAvailable(null);
        }
      } catch (error) {
        console.error(`Error checking ${type} availability:`, error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, type, minLength, debounceMs]);

  return { isAvailable, isChecking };
}

