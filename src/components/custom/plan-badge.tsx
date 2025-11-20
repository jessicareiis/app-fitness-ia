"use client";

import { Crown, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlanBadgeProps {
  plan: 'basic' | 'plus' | 'premium' | 'trial';
  showIcon?: boolean;
  className?: string;
}

export function PlanBadge({ plan, showIcon = true, className = "" }: PlanBadgeProps) {
  const config = {
    basic: {
      label: 'Básico',
      icon: Zap,
      className: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    plus: {
      label: 'Plus',
      icon: Sparkles,
      className: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    premium: {
      label: 'Premium',
      icon: Crown,
      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    },
    trial: {
      label: 'Teste Grátis',
      icon: Sparkles,
      className: 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  };

  const { label, icon: Icon, className: badgeClassName } = config[plan];

  return (
    <Badge className={`${badgeClassName} ${className}`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </Badge>
  );
}
