import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import gradePlannerApi from '@/api/gradePlanner';
import schoolsApi from '@/api/schools';
import { PageBanner } from '@/components/design/PageBanner';
import { DataState } from '@/components/common/DataState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PremiumGate } from '@/components/common/PremiumGate';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VISUALS } from '@/lib/visuals';
import { Reveal, CountUp } from '@/components/motion';
import { Target, Plus, Building2, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function GradeGoals() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFiliereId, setSelectedFiliereId] = useState('');
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  // Queries
  const query = useQuery({
    queryKey: ['gradeGoals'],
    queryFn: gradePlannerApi.getGoals,
  });

  const { data: filieres = [] } = useQuery({
    queryKey: ['allFilieres'],
    queryFn: () => schoolsApi.getFilieres(),
    enabled: createDialogOpen,
  });

  const filiereList = Array.isArray(filieres) ? filieres : (filieres?.items || []);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (filiereId) => gradePlannerApi.createGoal(Number(filiereId)),
    onSuccess: (newGoal) => {
      queryClient.invalidateQueries({ queryKey: ['gradeGoals'] });
      setCreateDialogOpen(false);
      setSelectedFiliereId('');
      toast.success('Objectif de notes créé avec succès !');
      navigate(`/student/goals/${newGoal.id}`);
    },
    onError: (err) => {
      if (err.code === 'PREMIUM_REQUIRED') {
        setCreateDialogOpen(false);
        setShowPremiumPrompt(true);
      } else {
        toast.error(err.message || "Erreur lors de la création de l'objectif.");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => gradePlannerApi.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeGoals'] });
      setGoalToDelete(null);
      toast.success('Objectif supprimé.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la suppression.');
    },
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!selectedFiliereId) {
      toast.error('Veuillez sélectionner une filière.');
      return;
    }
    createMutation.mutate(selectedFiliereId);
  };

  return (
    <div className="space-y-8">
      <PageBanner
        title="Objectifs de notes"
        description="Fixez vos écoles cibles, analysez les écarts avec les seuils d'admissibilité et concentrez vos révisions sur les matières prioritaires."
        visual={VISUALS.objTrophy}
        action={
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-6 h-11 gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel objectif</span>
          </Button>
        }
      />

      {showPremiumPrompt && (
        <div className="my-6">
          <PremiumGate forceShowPrompt />
        </div>
      )}

      <DataState
        query={query}
        emptyMessage="Vous n'avez défini aucun objectif de notes pour le moment."
        emptyAction={
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-6 h-11 gap-2"
          >
            <Target className="h-4 w-4" />
            <span>Créer mon premier objectif</span>
          </Button>
        }
      >
        {(goals) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, idx) => {
              const filiere = goal.filiere;
              const school = filiere?.school;
              const reqs = goal.computedRequirements || {};
              const targetAvg = reqs.targetAverage || 14;
              const currentAvg = reqs.currentWeightedAverage || 13;
              const gap = reqs.overallGap !== undefined ? Number(reqs.overallGap) : 0;

              return (
                <Reveal key={goal.id} delay={0.06 * Math.min(idx, 6)}>
                  <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-2xs hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between h-full space-y-5">
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-xl font-normal text-ink-dark tracking-tight">
                          {filiere?.name || 'Filière cible'}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                          <Building2 className="h-3.5 w-3.5 text-lavender-600" />
                          <span>{school?.name || 'Établissement'}</span>
                        </div>
                      </div>
                      <StatusBadge status={goal.feasibility} />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-lavender-50/50 border border-lavender-100 p-4 text-center">
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Cible</span>
                        <span className="text-base font-semibold text-ink-dark">
                          {targetAvg}/20
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Actuelle</span>
                        <span className="text-base font-semibold text-ink-dark">
                          {currentAvg}/20
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Écart</span>
                        <span
                          className={`text-base font-semibold ${
                            gap <= 0 ? 'text-[#2D6A52]' : 'text-[#8C6418]'
                          }`}
                        >
                          {gap > 0 ? `+${gap}` : gap} pts
                        </span>
                      </div>
                    </div>

                    {reqs.advice && (
                      <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed italic">
                        "{reqs.advice}"
                      </p>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setGoalToDelete(goal.id)}
                        className="p-2 rounded-xl text-ink-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Supprimer l'objectif"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <Button
                        size="sm"
                        onClick={() => navigate(`/student/goals/${goal.id}`)}
                        className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-5 h-9 gap-1.5 group"
                      >
                        <span>Détail & Simulation</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </DataState>

      {/* Dialog for New Goal */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal text-ink-dark">
              Nouvel objectif de notes
            </DialogTitle>
            <DialogDescription className="text-xs text-ink-muted mt-1 font-normal">
              Choisissez la filière d'excellence pour laquelle vous souhaitez analyser les seuils d'admissibilité.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-5 pt-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink-muted">Sélectionner une filière</label>
              <Select value={selectedFiliereId} onValueChange={setSelectedFiliereId}>
                <SelectTrigger className="h-11 rounded-xl border-border bg-[#FBFBFC] text-sm">
                  <SelectValue placeholder="Choisir une filière..." />
                </SelectTrigger>
                <SelectContent className="max-h-64 rounded-xl">
                  {filiereList.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)} className="text-xs">
                      {f.name} ({f.school?.name || 'École'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={createMutation.isPending}
                className="rounded-full border-border hover:bg-neutral-50 text-xs font-medium px-5"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-6 gap-2"
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                <span>Calculer mon objectif</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(goalToDelete)}
        onOpenChange={(open) => !open && setGoalToDelete(null)}
        title="Supprimer cet objectif ?"
        description="Cette action retirera cet objectif de notes de votre tableau de bord. Vous pourrez le recréer ultérieurement."
        onConfirm={() => deleteMutation.mutate(goalToDelete)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default GradeGoals;
