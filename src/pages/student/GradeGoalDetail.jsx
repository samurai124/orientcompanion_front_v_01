import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import gradePlannerApi from '@/api/gradePlanner';
import { PageBanner } from '@/components/design/PageBanner';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VISUALS } from '@/lib/visuals';
import { Reveal, AnimatedProgress, CountUp } from '@/components/motion';
import {
  ArrowLeft,
  Building2,
  Sparkles,
  Calculator,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';

export function GradeGoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['gradeGoals'],
    queryFn: gradePlannerApi.getGoals,
  });

  const goal = goals.find((g) => String(g.id) === String(id));
  const filiere = goal?.filiere;
  const school = filiere?.school;
  const reqs = goal?.computedRequirements || {};
  const subjects = reqs.subjects || [];

  const [hypotheticalGrades, setHypotheticalGrades] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);

  const simulateMutation = useMutation({
    mutationFn: (data) => gradePlannerApi.simulate(data),
    onSuccess: (res) => {
      setSimulationResult(res);
      toast.success('Simulation calculée avec succès !');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors du calcul de la simulation.');
    },
  });

  const handleSimulate = (e) => {
    e.preventDefault();
    if (!goal?.filiereId) return;

    const formatted = {};
    for (const [k, v] of Object.entries(hypotheticalGrades)) {
      formatted[k.toUpperCase()] = Number(v);
    }

    simulateMutation.mutate({
      filiereId: goal.filiereId,
      hypotheticalGrades: formatted,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageBanner title="Chargement de l'objectif..." description="Calcul des données d'admissibilité..." />
        <div className="h-64 rounded-3xl bg-white border border-border/80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/student/goals')}
          className="gap-2 rounded-full text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux objectifs</span>
        </Button>
        <div className="p-12 text-center rounded-3xl bg-white border border-border/80 text-ink-muted">
          Objectif de notes introuvable.
        </div>
      </div>
    );
  }

  const isOnTrack = goal.feasibility === 'ON_TRACK';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/student/goals')}
          className="rounded-full text-xs text-ink-muted hover:text-ink gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux objectifs de notes</span>
        </Button>

        <StatusBadge status={goal.feasibility} />
      </div>

      {/* Page Banner with Trophy */}
      <PageBanner
        title={filiere?.name || "Objectif d'admissibilité"}
        description={school ? `${school.name} (${school.city || 'Maroc'})` : "Analyse d'admissibilité personnalisée"}
        visual={VISUALS.objTrophy}
        badge={<StatusBadge status={goal.feasibility} />}
      />

      {/* Sparkle burst celebration banner if ON_TRACK */}
      {isOnTrack && (
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-emerald-500/10 via-lavender-100 to-emerald-500/10 border border-emerald-500/25 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600/15 text-emerald-700 flex items-center justify-center shrink-0 animate-sparkle-burst">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-base font-medium text-emerald-900">
                Félicitations, vous êtes sur la bonne voie !
              </h4>
              <p className="text-xs text-emerald-800/80">
                Vos notes actuelles atteignent ou dépassent les seuils requis pour cet établissement. Continuez sur cette lancée !
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white border border-border/80 p-6 text-center space-y-1 shadow-2xs">
          <span className="text-xs uppercase tracking-wider text-ink-muted">Moyenne cible requise</span>
          <div className="text-3xl font-light text-ink-dark tracking-tight">
            <CountUp to={Number(reqs.targetAverage || 14)} decimals={1} />
            <span className="text-sm font-normal text-ink-muted"> / 20</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-border/80 p-6 text-center space-y-1 shadow-2xs">
          <span className="text-xs uppercase tracking-wider text-ink-muted">Votre moyenne actuelle</span>
          <div className="text-3xl font-light text-ink-dark tracking-tight">
            <CountUp to={Number(reqs.currentWeightedAverage || 13)} decimals={1} />
            <span className="text-sm font-normal text-ink-muted"> / 20</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-border/80 p-6 text-center space-y-1 shadow-2xs">
          <span className="text-xs uppercase tracking-wider text-ink-muted">Écart global</span>
          <div
            className={`text-3xl font-light tracking-tight ${
              Number(reqs.overallGap || 0) <= 0 ? 'text-[#2D6A52]' : 'text-[#8C6418]'
            }`}
          >
            {Number(reqs.overallGap) > 0 ? `+${reqs.overallGap}` : reqs.overallGap || 0}
            <span className="text-sm font-normal text-ink-muted"> pts</span>
          </div>
        </div>
      </div>

      {/* Per-Subject Requirements with AnimatedProgress Bars */}
      <Reveal>
        <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-normal text-ink-dark tracking-tight">
              Analyse détaillée matière par matière
            </h3>
            <p className="text-xs text-ink-muted">
              Comparaison entre votre note actuelle et la note requise pour sécuriser l'admissibilité.
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {subjects.map((sub, index) => {
              const current = sub.currentGrade !== undefined ? Number(sub.currentGrade) : 0;
              const required = sub.requiredGrade !== undefined ? Number(sub.requiredGrade) : 14;
              const isPassing = current >= required;

              return (
                <div key={index} className="space-y-2 p-4 rounded-2xl bg-lavender-50/40 border border-lavender-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink-dark text-sm">{sub.subject}</span>
                      <span className="text-ink-muted text-[11px]">(Coeff: {sub.coefficient || 1})</span>
                      {isPassing ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A52]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Atteint
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8C6418]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Effort requis (+{(required - current).toFixed(1)} pts)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 font-medium">
                      <span>Actuelle : <strong>{current}/20</strong></span>
                      <span className="text-ink-muted">|</span>
                      <span>Requise : <strong>{required}/20</strong></span>
                    </div>
                  </div>

                  <AnimatedProgress
                    value={current}
                    max={20}
                    duration={1}
                    barClassName={isPassing ? 'bg-[#4C9A7A]' : 'bg-[#D9A441]'}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Simulator Section */}
      <Reveal delay={0.1}>
        <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-ink-dark">
              <Calculator className="w-5 h-5 text-lavender-600" />
              <h3 className="text-xl font-normal tracking-tight">Simulateur d'hypothèses de notes</h3>
            </div>
            <p className="text-xs text-ink-muted">
              Ajustez vos notes potentielles pour simuler l'impact immédiat sur votre admissibilité.
            </p>
          </div>

          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map((sub, index) => (
                <div key={index} className="space-y-1.5 p-3.5 rounded-2xl bg-lavender-50/50 border border-lavender-100">
                  <label className="text-xs font-medium text-ink-muted block">{sub.subject}</label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    placeholder="Note sur 20"
                    value={hypotheticalGrades[sub.subject] ?? (sub.currentGrade || 14)}
                    onChange={(e) =>
                      setHypotheticalGrades({
                        ...hypotheticalGrades,
                        [sub.subject]: e.target.value,
                      })
                    }
                    className="h-10 rounded-xl border-border bg-white text-right font-semibold text-sm"
                  />
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={simulateMutation.isPending}
              className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] font-medium text-xs px-6 h-11 gap-2 shadow-2xs"
            >
              {simulateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Calcul de la simulation...</span>
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  <span>Calculer l'impact</span>
                </>
              )}
            </Button>
          </form>

          {/* Simulation Result */}
          {simulationResult && (
            <div className="mt-6 p-6 rounded-2xl lavender-card-gradient border border-lavender-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Résultat simulé</span>
                <StatusBadge status={simulationResult.feasibility} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center py-2">
                <div>
                  <span className="text-xs text-ink-muted block">Moyenne simulée</span>
                  <span className="text-xl font-bold text-ink-dark">{simulationResult.simulatedAverage}/20</span>
                </div>
                <div>
                  <span className="text-xs text-ink-muted block">Moyenne cible</span>
                  <span className="text-xl font-bold text-ink-dark">{simulationResult.targetAverage}/20</span>
                </div>
                <div>
                  <span className="text-xs text-ink-muted block">Écart simulé</span>
                  <span className="text-xl font-bold text-ink-dark">
                    {simulationResult.gap > 0 ? `+${simulationResult.gap}` : simulationResult.gap} pts
                  </span>
                </div>
              </div>
              {simulationResult.advice && (
                <p className="text-xs text-ink-dark/80 italic pt-1 border-t border-lavender-200/70">
                  "{simulationResult.advice}"
                </p>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}

export default GradeGoalDetail;
