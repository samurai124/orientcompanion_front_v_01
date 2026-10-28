import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import applicationsApi from '@/api/applications';
import { formatDate } from '@/lib/format';
import { PageBanner } from '@/components/design/PageBanner';
import { DataState } from '@/components/common/DataState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { VISUALS } from '@/lib/visuals';
import { Reveal, AnimatedProgress } from '@/components/motion';
import { FileCheck2, Building2, Calendar, ArrowRight, PlusCircle } from 'lucide-react';

export function Applications() {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.getApplications,
  });

  return (
    <div className="space-y-8">
      <PageBanner
        title="Mes candidatures"
        description="Suivez l'état d'avancement de vos dossiers d'inscription, vérifiez les pièces justificatives et respectez les dates limites."
        visual={VISUALS.objBook}
        action={
          <Button
            onClick={() => navigate('/student/schools')}
            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-6 h-11 gap-2 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nouvelle candidature</span>
          </Button>
        }
      />

      <DataState
        query={query}
        emptyMessage="Vous n'avez soumis aucune candidature pour l'instant."
        emptyAction={
          <Button
            onClick={() => navigate('/student/schools')}
            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-6 h-11 gap-2"
          >
            <Building2 className="h-4 w-4" />
            <span>Explorer les écoles</span>
          </Button>
        }
      >
        {(applications) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app, idx) => {
              const filiere = app.filiere;
              const school = filiere?.school;
              const progressVal = app.progressPercentage !== undefined ? app.progressPercentage : 40;

              return (
                <Reveal key={app.id} delay={0.06 * Math.min(idx, 6)}>
                  <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-2xs hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between h-full space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-xl font-normal text-ink-dark tracking-tight">
                          {filiere?.name || 'Filière'}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                          <Building2 className="h-3.5 w-3.5 text-lavender-600" />
                          <span>{school?.name || 'Établissement'}</span>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="space-y-2 p-4 rounded-2xl bg-lavender-50/50 border border-lavender-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-ink-muted font-medium">Progression du dossier</span>
                        <span className="font-bold text-ink-dark">{progressVal}%</span>
                      </div>
                      <AnimatedProgress value={progressVal} max={100} duration={1} />
                    </div>

                    {/* Deadline */}
                    {school?.applicationDeadline && (
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        <Calendar className="h-3.5 w-3.5 text-amber-600" />
                        <span>Date limite : <strong>{formatDate(school.applicationDeadline)}</strong></span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                      <span className="text-[11px] text-ink-muted">
                        Créé le {formatDate(app.createdAt)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/student/applications/${app.id}`)}
                        className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-5 h-9 gap-1.5 group"
                      >
                        <span>Ouvrir le dossier</span>
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
    </div>
  );
}

export default Applications;
