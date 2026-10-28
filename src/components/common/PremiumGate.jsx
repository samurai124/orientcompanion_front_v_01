import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import subscriptionsApi from '@/api/subscriptions';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle2, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Float } from '@/components/motion';
import { toast } from 'sonner';

export function PremiumGate({ children, forceShowPrompt = false }) {
  const { isPremium, refreshSubscription } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // If user is already premium and we are not forcing the prompt, show contents
  if (isPremium && !forceShowPrompt) {
    return <>{children}</>;
  }

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      await subscriptionsApi.checkout('PREMIUM');
      await refreshSubscription();
      toast.success('Félicitations ! Votre abonnement Premium est maintenant actif.');
    } catch (err) {
      toast.error(err.message || "Échec de l'activation de l'abonnement Premium.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="flex justify-center p-4 my-8">
      {/* Dark Navy Card matching design language */}
      <div className="max-w-xl w-full rounded-[28px] dark-navy-card border border-white/10 p-8 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-lavender-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Floating Hourglass / Flower visual */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4">
            <Float distance={8} duration={6}>
              <VisualImage
                visual={VISUALS.objHourglass}
                className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
              />
            </Float>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-3 backdrop-blur-xs border border-white/10">
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>OrientCompanion Premium</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white mb-3">
            Débloquez votre plein potentiel
          </h2>

          <p className="text-sm text-white/70 leading-relaxed font-normal max-w-md mb-8">
            Accédez à toutes les fonctionnalités avancées pour réussir vos concours et sécuriser votre place dans les meilleures écoles du Maroc.
          </p>

          {/* Benefits list */}
          <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 text-left mb-8">
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Simulateur illimité d'<strong>objectifs de notes</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Module <strong>Concours complet</strong> (plans d'étude & examens blancs chronométrés)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Priorité de réservation auprès des <strong>conseillers d'orientation</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Analyses de dossiers et prédictions algorithmiques approfondies</span>
            </div>
          </div>

          {/* Price display */}
          <div className="mb-6">
            <div className="text-3xl font-light text-white tracking-tight">
              299 <span className="text-base text-white/60 font-normal">DH / an</span>
            </div>
            <p className="text-xs text-white/50 mt-1">Paiement unique, sans renouvellement automatique</p>
          </div>

          {/* Pill CTA button with sliding arrow */}
          <Button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="w-full sm:w-auto px-8 h-12 rounded-full bg-white text-ink-dark hover:bg-lavender-100 font-medium text-sm transition-all shadow-md group flex items-center justify-center gap-2"
          >
            {isUpgrading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-ink" />
                <span>Activation en cours...</span>
              </>
            ) : (
              <>
                <span>Activer OrientCompanion Premium</span>
                <ArrowRight className="h-4 w-4 text-ink transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PremiumGate;
