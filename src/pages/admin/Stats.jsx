import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApi from '@/api/admin';
import { PageBanner } from '@/components/design/PageBanner';
import { VISUALS } from '@/lib/visuals';
import { Reveal, CountUp } from '@/components/motion';
import { DataState } from '@/components/common/DataState';
import {
  Users,
  Crown,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  TrendingUp,
  Compass,
} from 'lucide-react';

export function Stats() {
  const query = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
  });

  return (
    <div className="space-y-8">
      <PageBanner
        badge="Observatoire"
        title="Statistiques de la plateforme"
        description="Indicateurs clés de performance et métriques d'utilisation d'OrientCompanion en temps réel."
        visual={VISUALS.objTrophy}
      />

      <DataState query={query} emptyMessage="Statistiques indisponibles.">
        {(stats) => {
          // Derive counts supporting both nested and flat structures
          const totalUsers = stats.overview?.totalUsers ?? stats.totalUsers ?? 0;
          const activeSubscriptions = stats.overview?.activeSubscriptions ?? stats.activeSubscriptions ?? 0;
          const totalRecommendations = stats.overview?.totalRecommendations ?? stats.totalRecommendations ?? 0;
          const totalMentorshipSessions = stats.mentorship?.totalSessions ?? stats.totalMentorshipSessions ?? 0;
          const completedMentorshipSessions = stats.mentorship?.completedSessions ?? stats.completedMentorshipSessions ?? 0;

          // Compute students count
          const totalStudents =
            typeof stats.usersByRole === 'object' && !Array.isArray(stats.usersByRole)
              ? stats.usersByRole.STUDENT || 0
              : Array.isArray(stats.usersByRole)
              ? stats.usersByRole.find((r) => r.role === 'STUDENT')?._count?.id || 0
              : 0;

          // Stages list
          const stagesList =
            typeof stats.studentsByStage === 'object' && !Array.isArray(stats.studentsByStage)
              ? Object.entries(stats.studentsByStage).map(([stage, count]) => ({ stage, count }))
              : (stats.studentsByStage || []).map((s) => ({ stage: s.stage, count: s._count?.id ?? s.count ?? 0 }));

          // Top filières list
          const topList = stats.topRecommendedFilieres || stats.topRecommended || [];

          const statCards = [
            {
              title: 'Utilisateurs inscrits',
              value: totalUsers,
              description: 'Tous rôles confondus (Étudiants, Conseillers, Admins)',
              icon: Users,
              iconBg: 'bg-[#E4E3F5] text-[#2A2545]',
            },
            {
              title: 'Abonnements Premium',
              value: activeSubscriptions,
              description: 'Formules actives donnant accès aux concours et simulateurs',
              icon: Crown,
              iconBg: 'bg-amber-50 text-amber-600',
            },
            {
              title: 'Recommandations IA',
              value: totalRecommendations,
              description: 'Analyses d’admissibilité et d’affinité générées',
              icon: Sparkles,
              iconBg: 'bg-[#C9C7EE]/50 text-[#6B5BD2]',
            },
            {
              title: 'Séances de mentorat',
              value: totalMentorshipSessions,
              description: 'Demandes de rendez-vous enregistrées',
              icon: CalendarCheck,
              iconBg: 'bg-[#4C9A7A]/15 text-[#4C9A7A]',
            },
            {
              title: 'Séances complétées',
              value: completedMentorshipSessions,
              description: 'Entretiens individuels menés à terme avec compte-rendu',
              icon: CheckCircle2,
              iconBg: 'bg-[#4C9A7A]/15 text-[#4C9A7A]',
            },
            {
              title: 'Étudiants actifs',
              value: totalStudents,
              description: 'Lycéens et étudiants préparant leur orientation',
              icon: GraduationCap,
              iconBg: 'bg-[#E4E3F5] text-[#2A2545]',
            },
          ];

          return (
            <div className="space-y-8">
              {/* 6 Bento-style Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <Reveal key={idx} delay={idx * 0.05}>
                      <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-7 flex flex-col justify-between hover:border-[#C9C7EE] transition-all duration-300 shadow-xs h-full space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                            {stat.title}
                          </span>
                          <div className={`w-9 h-9 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0`}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>

                        <div>
                          <div className="text-3xl sm:text-4xl font-normal text-ink-dark tracking-tight">
                            <CountUp value={stat.value} />
                          </div>
                          <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                            {stat.description}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              {/* Additional breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Students by stage */}
                <Reveal delay={0.1}>
                  <div className="rounded-[28px] bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-xs space-y-5 h-full">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3E2EC]">
                      <div className="w-9 h-9 rounded-full bg-[#E4E3F5] text-[#2A2545] flex items-center justify-center">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                          Répartition par étape d'études
                        </h3>
                        <p className="text-xs text-ink-muted">
                          Distribution des élèves selon leur niveau actuel
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {stagesList.length === 0 ? (
                        <p className="text-xs text-ink-muted py-4 text-center">
                          Aucun étudiant inscrit pour le moment.
                        </p>
                      ) : (
                        stagesList.map((stageItem) => (
                          <div
                            key={stageItem.stage}
                            className="flex items-center justify-between p-4 rounded-2xl border border-[#E3E2EC] bg-[#F5F5F7]/50 transition-colors hover:bg-[#F5F5F7]"
                          >
                            <span className="font-medium text-sm text-ink-dark">
                              {stageItem.stage === 'PRE_BAC'
                                ? 'Lycéens (Pré-Bac)'
                                : stageItem.stage === 'POST_BAC'
                                ? 'Enseignement Supérieur (Post-Bac)'
                                : 'Préparationnaires Concours'}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-ink-dark border border-[#E3E2EC] shadow-2xs">
                              {stageItem.count} élève{stageItem.count > 1 ? 's' : ''}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Reveal>

                {/* Top recommended filières */}
                <Reveal delay={0.15}>
                  <div className="rounded-[28px] bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-xs space-y-5 h-full">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3E2EC]">
                      <div className="w-9 h-9 rounded-full bg-[#E4E3F5] text-[#2A2545] flex items-center justify-center">
                        <Compass className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                          Filières les plus recommandées
                        </h3>
                        <p className="text-xs text-ink-muted">
                          Formations correspondant le plus fréquemment aux profils RIASEC
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {topList.length === 0 ? (
                        <p className="text-xs text-ink-muted py-6 text-center">
                          Aucune recommandation n'a encore été enregistrée.
                        </p>
                      ) : (
                        topList.map((top, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 rounded-2xl border border-[#E3E2EC] bg-[#F5F5F7]/50 transition-colors hover:bg-[#F5F5F7]"
                          >
                            <span className="font-medium text-sm text-ink-dark">
                              {top.filiereName || `Filière ID #${top.filiereId}`}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E4E3F5] text-[#2A2545] border border-lavender-200">
                              {top.recommendationCount || top._count?.id || 1} fois
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          );
        }}
      </DataState>
    </div>
  );
}

export default Stats;
