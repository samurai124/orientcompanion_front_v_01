import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PremiumGate } from './PremiumGate';
import { EmptyState } from '@/components/design/EmptyState';

export function DataState({
  query,
  skeleton,
  emptyMessage = "Aucune donnée disponible pour le moment.",
  emptyAction,
  emptyCondition,
  children,
}) {
  // Loading state with lavender shimmer
  if (query.isLoading) {
    if (skeleton) return <>{skeleton}</>;
    return (
      <div className="space-y-4">
        <div className="h-10 w-full rounded-2xl shimmer-lavender" />
        <div className="h-28 w-full rounded-3xl shimmer-lavender" />
        <div className="h-28 w-full rounded-3xl shimmer-lavender" />
      </div>
    );
  }

  // Error state
  if (query.isError) {
    if (query.error?.code === 'PREMIUM_REQUIRED') {
      return <PremiumGate forceShowPrompt />;
    }

    return (
      <div className="my-6 rounded-3xl bg-white border border-[#C75D6B]/30 p-6 sm:p-8 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#C75D6B]/15 text-[#C75D6B] flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="text-base font-medium text-ink-dark">
              Une erreur est survenue
            </h4>
            <p className="text-sm text-ink-muted">
              {query.error?.message || "Impossible de charger les données pour le moment."}
            </p>
            {query.refetch && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => query.refetch()}
                  className="rounded-full border-border hover:bg-lavender-50 text-xs font-medium gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Réessayer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty state check
  const isDataEmpty =
    emptyCondition !== undefined
      ? emptyCondition
      : !query.data ||
        (Array.isArray(query.data) && query.data.length === 0) ||
        (query.data?.items && Array.isArray(query.data.items) && query.data.items.length === 0) ||
        (typeof query.data === 'object' && Object.keys(query.data).length === 0);

  if (isDataEmpty) {
    return (
      <EmptyState title={emptyMessage}>
        {emptyAction}
      </EmptyState>
    );
  }

  // Normal content render
  return typeof children === 'function' ? children(query.data) : children;
}

export default DataState;
