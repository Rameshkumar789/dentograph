'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface PlanInfo {
  tier: PlanTier;
  recordLimit: number;
  hasAIChat: boolean;
  hasClinicalNarrative: boolean;
  isComplianceActive: boolean;
}

const TIER_CONFIG: Record<PlanTier, PlanInfo> = {
  free: {
    tier: 'free',
    recordLimit: 1,
    hasAIChat: false,
    hasClinicalNarrative: false,
    isComplianceActive: true, // Core value prop is always active
  },
  pro: {
    tier: 'pro',
    recordLimit: 50,
    hasAIChat: true,
    hasClinicalNarrative: true,
    isComplianceActive: true,
  },
  enterprise: {
    tier: 'enterprise',
    recordLimit: Infinity,
    hasAIChat: true,
    hasClinicalNarrative: true,
    isComplianceActive: true,
  }
};

export function usePlan() {
  const [plan, setPlan] = useState<PlanInfo>(TIER_CONFIG.free);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch from normalized profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single();

      const tier = (profile?.tier as PlanTier) || 'free';
      setPlan(TIER_CONFIG[tier]);
      setLoading(false);
    }
    loadPlan();
  }, []);

  return { plan, loading };
}
