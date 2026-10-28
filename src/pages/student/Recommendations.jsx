import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import recommendationsApi from '@/api/recommendations';
import gradePlannerApi from '@/api/gradePlanner';
import { PageBanner } from '@/components/design/PageBanner';
import { DataState } from '@/components/common/DataState';
import { Button } from '@/components/ui/button';
import { VISUALS } from '@/lib/visuals';
import { Reveal, CountUp } from '@/components/motion';
import { Sparkles, Building2, MapPin, Target, Eye, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function Recommendations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.getRecommendations,
  });

  const generateMutation = useMutation({
    mutationFn: recommendationsApi.generateRecommendations,
    onSuccess: (data) => {
      queryClient.setQueryData(['recommendations'], data);
      toast.success('Vos recommandations personnalisées ont été générées avec succès !');
    },
    onError: (err) => {
      toast.error(err.message || 'Impossible de générer les recommandations. Avez-vous complété le test RIASEC ?');
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: (filiereId) => gradePlannerApi.createGoal(filiereId),
    onSuccess: (goal) => {
      queryClient.invalidateQueries({ queryKey: ['gradeGoals'] });
      toast.success('Objectif de notes créé avec succès !');
      navigate(`/student/goals/${goal.id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de la création de l'objectif.");
    },
  });

  return (
    <div className="space-y-8">
      {/* Page Banner with floating compass */}
      <PageBanner
        title="Recommandations d'orientation IA"
        description="Nos algorithmes croisent votre profil psychométrique RIASEC, vos notes actuelles et les seuils d'admissibilité des grandes écoles marocaines."
        visual={VISUALS.flowerSprout}
        action={
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] px-6 h-11 text-xs font-medium gap-2 shadow-sm group"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Analyse en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-lavender-300" />
                <span>Régénérer mes recommandations</span>
              </>
            )}
          </Button>
        }
      />

      <DataState
        query={query}
        emptyMessage="Aucune recommandation disponible pour le moment."
        emptyAction={
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-6 h-11 gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Lancer la génération IA
          </Button>
        }
      >
        {(recommendations) => {
          const toPercent = (v) => {
            const n = Number(v || 0);
            return Math.round(n <= 1 ? n * 100 : n);
          };

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-ink-muted px-1">
                <span>{recommendations.length} filière(s) classée(s) par pertinence</span>
                <span>Calcul algorithmique continu</span>
              </div>

              <div className="space-y-6">
                {recommendations.map((rec, index) => {
                  const filiere = rec.filiere;
                  const school = filiere?.school;
                  const scorePercent = toPercent(rec.finalScore);
                  const structuredPercent = toPercent(rec.structuredScore);
                  const semanticPercent = toPercent(rec.semanticScore);
                  const isTopOne = index === 0;

                  // 1. TOP 1 Match: Larger Dark Card matching spec
                  if (isTopOne) {
                    return (
                      <Reveal key={rec.id || index}>
                        <div className="rounded-[28px] dark-navy-card border border-white/10 p-8 sm:p-10 shadow-md relative overflow-hidden space-y-6">
                          <div className="absolute top-0 right-0 w-80 h-80 bg-lavender-600/15 blur-3xl rounded-full pointer-events-none" />

                          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-3 max-w-2xl">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-lavender-400 text-ink-dark">
                                  #1 Meilleure Correspondance
                                </span>
                                <span className="text-xs text-white/60">Recommandation principale</span>
                              </div>

                              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
                                {filiere?.name || 'Filière d\'excellence'}
                              </h2>

                              {school && (
                                <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
                                  <span className="flex items-center gap-1.5 font-medium text-white">
                                    <Building2 className="h-4 w-4 text-lavender-300" />
                                    {school.name} ({school.code || school.type})
                                  </span>
                                  {school.city && (
                                    <span className="flex items-center gap-1.5 text-white/60">
                                      <MapPin className="h-4 w-4" />
                                      {school.city}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Score Display */}
                            <div className="shrink-0 p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center min-w-[140px]">
                              <span className="text-[11px] uppercase tracking-wider text-white/60 mb-1">Affinité IA</span>
                              <div className="text-3xl sm:text-4xl font-light text-white tracking-tight flex items-baseline">
                                <CountUp to={scorePercent} duration={1.2} />
                                <span className="text-base text-lavender-300 font-semibold">%</span>
                              </div>
                              <span className="text-[10px] text-white/50 mt-1">
                                {structuredPercent}% acad. / {semanticPercent}% sém.
                              </span>
                            </div>
                          </div>

                          {/* AI Explanation */}
                          {rec.explanation && (
                            <div className="relative z-10 p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/85 leading-relaxed">
                              <strong className="text-lavender-300 block mb-1 font-medium">
                                Analyse du conseiller algorithmique :
                              </strong>
                              {rec.explanation}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="relative z-10 pt-2 flex flex-wrap items-center justify-end gap-3">
                            {school && (
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/student/schools/${school.id}`)}
                                className="rounded-full bg-white/10 text-white hover:bg-white/15 border-white/20 text-xs font-medium px-5 h-10 gap-1.5"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Fiche de l'école</span>
                              </Button>
                            )}

                            <Button
                              onClick={() => createGoalMutation.mutate(rec.filiereId)}
                              disabled={createGoalMutation.isPending}
                              className="rounded-full bg-white text-ink-dark hover:bg-lavender-100 text-xs font-medium px-6 h-10 gap-1.5 shadow-sm group"
                            >
                              <Target className="h-3.5 w-3.5 text-ink" />
                              <span>Fixer un objectif de notes</span>
                              <ArrowRight className="h-3.5 w-3.5 text-ink transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      </Reveal>
                    );
                  }

                  // 2. Subsequent recommendations: White VisualCard-like cards
                  return (
                    <Reveal key={rec.id || index} delay={0.06 * Math.min(index, 6)}>
                      <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-2xs hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-lavender-100 text-ink text-xs font-bold">
                                {index + 1}
                              </span>
                              <h3 className="text-lg sm:text-xl font-normal text-ink-dark tracking-tight">
                                {filiere?.name || 'Filière'}
                              </h3>
                            </div>

                            {school && (
                              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted pl-8">
                                <span className="flex items-center gap-1 font-medium text-ink">
                                  <Building2 className="h-3.5 w-3.5 text-lavender-600" />
                                  {school.name} ({school.code || school.type})
                                </span>
                                {school.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {school.city}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Score Pill */}
                          <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                            <div className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-lavender-50 border border-lavender-200/80 text-ink-dark font-medium text-xs">
                              <span className="font-bold text-sm">
                                <CountUp to={scorePercent} duration={1} />%
                              </span>
                              <span className="text-[11px] text-ink-muted">affinité</span>
                            </div>
                            <span className="text-[10px] text-ink-muted">
                              Structuré : {structuredPercent}% | Sémantique : {semanticPercent}%
                            </span>
                          </div>
                        </div>

                        {/* Explanation */}
                        {rec.explanation && (
                          <div className="p-4 rounded-2xl bg-lavender-50/50 border border-lavender-100 text-xs text-ink-muted leading-relaxed">
                            <strong className="text-ink font-semibold block mb-1">
                              Analyse du conseiller IA :
                            </strong>
                            {rec.explanation}
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 border-t border-border/60">
                          {school && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/student/schools/${school.id}`)}
                              className="rounded-full border-border hover:bg-neutral-50 text-xs font-medium gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Voir l'école</span>
                            </Button>
                          )}

                          <Button
                            size="sm"
                            onClick={() => createGoalMutation.mutate(rec.filiereId)}
                            disabled={createGoalMutation.isPending}
                            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-5 gap-1.5"
                          >
                            <Target className="h-3.5 w-3.5" />
                            <span>Fixer un objectif</span>
                          </Button>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          );
        }}
      </DataState>
    </div>
  );
}

export default Recommendations;
