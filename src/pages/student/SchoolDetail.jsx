import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import schoolsApi from '@/api/schools';
import applicationsApi from '@/api/applications';
import gradePlannerApi from '@/api/gradePlanner';
import { formatDate } from '@/lib/format';
import { PageBanner } from '@/components/design/PageBanner';
import { DataState } from '@/components/common/DataState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { VISUALS } from '@/lib/visuals';
import { Reveal } from '@/components/motion';
import {
  Building2,
  MapPin,
  Globe,
  GraduationCap,
  Calendar,
  ArrowLeft,
  PlusCircle,
  Target,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

export function SchoolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['school', id],
    queryFn: () => schoolsApi.getSchoolById(id),
    enabled: Boolean(id),
  });

  const createApplicationMutation = useMutation({
    mutationFn: (filiereId) => applicationsApi.createApplication(filiereId),
    onSuccess: (app) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Filière ajoutée à vos candidatures avec succès !');
      navigate(`/student/applications/${app.id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de l'ajout de la candidature.");
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: (filiereId) => gradePlannerApi.createGoal(filiereId),
    onSuccess: (goal) => {
      queryClient.invalidateQueries({ queryKey: ['gradeGoals'] });
      toast.success('Objectif de notes défini pour cette filière !');
      navigate(`/student/goals/${goal.id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de la fixation de l'objectif.");
    },
  });

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/student/schools')}
        className="rounded-full text-xs text-ink-muted hover:text-ink gap-1.5"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Retour au catalogue des écoles</span>
      </Button>

      <DataState query={query} emptyMessage="Établissement introuvable.">
        {(school) => (
          <div className="space-y-8">
            {/* Banner built from the building visual */}
            <PageBanner
              title={school.name}
              description={school.description || `Établissement supérieur situé à ${school.city || 'Maroc'}.`}
              visual={VISUALS.buildingColumns}
              badge={
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 text-ink-dark border border-white/60">
                  {school.type === 'PUBLIC' ? 'Établissement Public' : 'Établissement Privé'}
                </span>
              }
              action={
                <div className="flex flex-wrap items-center gap-3">
                  {school.website && (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 text-ink text-xs font-medium border border-white/60 shadow-2xs hover:bg-white transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>Site officiel</span>
                    </a>
                  )}
                </div>
              }
            />

            {/* Quick Details Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-3xl bg-white border border-border/80 p-6 flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-lavender-100 text-lavender-700 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-ink-muted">Ville & Région</span>
                  <p className="font-medium text-ink-dark text-sm">{school.city || 'Maroc'}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-border/80 p-6 flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-lavender-100 text-lavender-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-ink-muted">Type d'établissement</span>
                  <p className="font-medium text-ink-dark text-sm">{school.type}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-border/80 p-6 flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-lavender-100 text-lavender-700 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-ink-muted">Date limite de candidature</span>
                  <p className="font-medium text-ink-dark text-sm">
                    {school.applicationDeadline ? formatDate(school.applicationDeadline) : 'Non spécifiée'}
                  </p>
                </div>
              </div>
            </div>

            {/* Filières List */}
            <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-10 shadow-2xs space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-normal text-ink-dark tracking-tight">
                  Filières d'excellence proposées
                </h3>
                <p className="text-xs text-ink-muted">
                  Sélectionnez une filière pour fixer un objectif de notes ou ajouter le dossier à vos candidatures.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {(school.filieres || []).length === 0 ? (
                  <p className="text-xs text-ink-muted py-6 text-center">
                    Aucune filière répertoriée pour cet établissement actuellement.
                  </p>
                ) : (
                  school.filieres.map((filiere, idx) => (
                    <Reveal key={filiere.id || idx} delay={0.05 * Math.min(idx, 6)}>
                      <div className="p-6 rounded-2xl bg-lavender-50/40 border border-lavender-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 max-w-xl">
                          <h4 className="text-lg font-medium text-ink-dark tracking-tight">
                            {filiere.name}
                          </h4>
                          {filiere.description && (
                            <p className="text-xs text-ink-muted leading-relaxed">
                              {filiere.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-muted pt-1">
                            {filiere.durationYears && (
                              <span>Durée : <strong>{filiere.durationYears} ans</strong></span>
                            )}
                            {filiere.degree && (
                              <span>Diplôme : <strong>{filiere.degree}</strong></span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => createGoalMutation.mutate(filiere.id)}
                            disabled={createGoalMutation.isPending}
                            className="rounded-full border-border hover:bg-white text-xs font-medium gap-1.5"
                          >
                            <Target className="h-3.5 w-3.5 text-lavender-600" />
                            <span>Objectif de notes</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => createApplicationMutation.mutate(filiere.id)}
                            disabled={createApplicationMutation.isPending}
                            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-5 gap-1.5"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Postuler</span>
                          </Button>
                        </div>
                      </div>
                    </Reveal>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </DataState>
    </div>
  );
}

export default SchoolDetail;
