import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import studentsApi from '@/api/students';
import recommendationsApi from '@/api/recommendations';
import applicationsApi from '@/api/applications';
import mentorshipApi from '@/api/mentorship';
import { formatDate } from '@/lib/format';
import { VISUALS } from '@/lib/visuals';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageBanner, BentoCard } from '@/components/design';
import { Reveal, AnimatedProgress, CountUp } from '@/components/motion';
import { Button } from '@/components/ui/button';
import {
  Compass,
  Sparkles,
  Calendar,
  Users,
  Crown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Target,
  FileText,
  Clock,
} from 'lucide-react';

export function Dashboard() {
  const { user, isPremium } = useAuth();

  // Queries
  const { data: profile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentsApi.getProfile,
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.getRecommendations,
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.getApplications,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['mentorshipSessions'],
    queryFn: mentorshipApi.getSessions,
  });

  const stage = profile?.stage || 'PRE_BAC';
  const hasRiasec = Boolean(profile?.riasecScores && Object.keys(profile.riasecScores).length > 0);
  const topRecommendation = recommendations.length > 0 ? recommendations[0] : null;

  // Next application deadline
  const nextApp = applications.find(
    (a) => a.filiere?.school?.applicationDeadline && new Date(a.filiere.school.applicationDeadline) > new Date()
  );

  // Next mentorship session
  const nextSession = sessions.find(
    (s) => s.status === 'SCHEDULED' && new Date(s.requestedStart) > new Date()
  );

  const riasecScores = profile?.riasecScores || {};
  const riasecEntries = [
    { key: 'R', label: 'Réaliste', val: riasecScores.R || 0 },
    { key: 'I', label: 'Investigateur', val: riasecScores.I || 0 },
    { key: 'A', label: 'Artistique', val: riasecScores.A || 0 },
    { key: 'S', label: 'Social', val: riasecScores.S || 0 },
    { key: 'E', label: 'Entreprenant', val: riasecScores.E || 0 },
    { key: 'C', label: 'Conventionnel', val: riasecScores.C || 0 },
  ];

  const topRecScore = topRecommendation
    ? topRecommendation.finalScore <= 1
      ? Math.round(topRecommendation.finalScore * 100)
      : Math.round(topRecommendation.finalScore)
    : 0;

  return (
    <div className="space-y-8">
      {/* 1. Welcome Hero-style PageBanner */}
      <PageBanner
        badge={<StatusBadge status={stage} />}
        title={`Bonjour, ${user?.firstName || 'Étudiant'} !`}
        description="Bienvenue sur votre espace d'orientation personnalisé. Retrouvez vos analyses RIASEC, prédictions d'admissibilité et calendrier de préparation."
        visual={VISUALS.objCap}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/student/test">
              <Button
                variant="outline"
                className="rounded-full bg-white/80 border-white/80 text-xs font-medium text-ink-dark hover:bg-white shadow-2xs gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-[#6B5BD2]" />
                <span>Test RIASEC</span>
              </Button>
            </Link>
            <Link to="/student/goals">
              <Button
                className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium shadow-2xs gap-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Objectifs</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Main Bento Grid (5 cols + 4 cols + 3 cols = 12 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Bento 1: RIASEC Profile with Animated Progress Bars (lg:col-span-5) */}
        <Reveal delay={0.05} className="md:col-span-1 lg:col-span-5 flex flex-col">
          <BentoCard
            variant="plain"
            subtitle="Profil Psychométrique"
            title="Vos dimensions d'affinité RIASEC"
            className="h-full min-h-[380px]"
            footer={
              <div className="pt-2">
                <Link
                  to="/student/test"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-dark hover:text-[#6B5BD2] transition-colors group"
                >
                  <span>{hasRiasec ? "Consulter l'analyse complète" : "Passer le test d'orientation"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            }
          >
            {hasRiasec ? (
              <div className="space-y-3 pt-2">
                {riasecEntries.map((dim) => (
                  <div key={dim.key} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-ink-dark">{dim.label}</span>
                      <span className="text-ink-muted font-semibold">{dim.val}%</span>
                    </div>
                    <AnimatedProgress value={dim.val} max={100} duration={1} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#E4E3F5]/40 border border-lavender-200/60 text-center space-y-3 my-4">
                <Compass className="w-8 h-8 text-[#6B5BD2] mx-auto animate-pulse" />
                <p className="text-xs text-ink-muted leading-relaxed">
                  Votre profil n'est pas encore évalué. Répondez aux 30 questions pour débloquer vos recommandations personnalisées.
                </p>
                <Link to="/student/test">
                  <Button size="sm" className="rounded-full bg-[#1E1B33] hover:bg-[#2A2545] text-white text-xs mt-1">
                    Commencer le test
                  </Button>
                </Link>
              </div>
            )}
          </BentoCard>
        </Reveal>

        {/* Bento 2: Top Recommendation (Dark Card) (lg:col-span-4) */}
        <Reveal delay={0.15} className="md:col-span-1 lg:col-span-4 flex flex-col">
          <BentoCard
            variant="dark"
            subtitle="Top Recommandation IA"
            title={
              topRecommendation
                ? topRecommendation.filiere?.name || "Filière recommandée"
                : "Filière à découvrir"
            }
            description={
              topRecommendation?.filiere?.school
                ? `${topRecommendation.filiere.school.name} (${topRecommendation.filiere.school.city || 'Maroc'})`
                : "Générez vos recommandations pour révéler la filière qui correspond le mieux à vos forces."
            }
            className="h-full min-h-[380px]"
            footer={
              <div className="space-y-4">
                {topRecommendation && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/70">Affinité calculée</span>
                    <div className="text-2xl font-light text-white tracking-tight flex items-baseline gap-0.5">
                      <CountUp value={topRecScore} duration={1.2} />
                      <span className="text-xs text-lavender-300 font-semibold">%</span>
                    </div>
                  </div>
                )}
                <div>
                  <Link
                    to="/student/recommendations"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-lavender-300 hover:text-white transition-colors group"
                  >
                    <span>Explorer toutes les recommandations</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            }
          />
        </Reveal>

        {/* Bento 3: Deadlines & Next Session Column (lg:col-span-3) */}
        <Reveal delay={0.25} className="md:col-span-2 lg:col-span-3 flex flex-col gap-6 justify-between">
          {/* Next Application Deadline */}
          <BentoCard
            variant="plain"
            subtitle="Calendrier"
            title={nextApp ? formatDate(nextApp.filiere.school.applicationDeadline) : "Aucune échéance"}
            description={
              nextApp
                ? `${nextApp.filiere?.name} — ${nextApp.filiere?.school?.name}`
                : "Aucune date limite urgente enregistrée dans votre dossier."
            }
            className="flex-1"
            footer={
              <Link
                to="/student/applications"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-dark hover:text-[#6B5BD2] transition-colors"
              >
                <span>Mes candidatures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />

          {/* Next Mentorship Session */}
          <BentoCard
            variant="plain"
            subtitle="Mentorat"
            title={nextSession ? formatDate(nextSession.requestedStart) : "Non planifiée"}
            description={
              nextSession
                ? `Séance avec ${nextSession.counselor?.user?.firstName || 'votre conseiller'}`
                : "Réservez un créneau avec un conseiller d'orientation certifié."
            }
            className="flex-1"
            footer={
              <Link
                to="/student/mentorship"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-dark hover:text-[#6B5BD2] transition-colors"
              >
                <span>Prendre rendez-vous</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
        </Reveal>

      </div>

      {/* 3. Premium Upsell BentoCard (if not premium) */}
      {!isPremium && (
        <Reveal>
          <div className="rounded-[28px] dark-navy-card border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-lavender-600/15 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center shrink-0 border border-white/10">
                <Crown className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-normal text-white tracking-tight">
                  Accélérez vos admissions avec OrientCompanion Premium
                </h3>
                <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed font-normal">
                  Simulations illimitées d'objectifs de notes, modules de concours chronométrés et créneaux prioritaires avec les mentors pour 299 DH/an.
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link to="/student/concours">
                <Button className="rounded-full bg-white text-ink-dark hover:bg-lavender-100 font-medium text-xs px-6 h-11 gap-2 shadow-sm group">
                  <span>Passer en Premium (299 DH)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-dark transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      )}

      {/* 4. Recommended Actions & Academic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <Reveal delay={0.08} className="flex flex-col">
          <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-2xs space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                Étapes clés recommandées
              </h3>
              <div className="space-y-3">
                <Link
                  to="/student/profile"
                  className="flex items-center justify-between p-4 rounded-2xl border border-[#E3E2EC] hover:border-lavender-300 hover:bg-[#F5F5F7]/60 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-ink-dark">1. Compléter votre relevé de notes</p>
                    <p className="text-xs text-ink-muted">Indispensable pour le calcul des seuils d'admissibilité.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink-dark group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/student/test"
                  className="flex items-center justify-between p-4 rounded-2xl border border-[#E3E2EC] hover:border-lavender-300 hover:bg-[#F5F5F7]/60 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-ink-dark">2. Passer le test d'orientation RIASEC</p>
                    <p className="text-xs text-ink-muted">Découvrez vos affinités dominantes en 10 minutes.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink-dark group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/student/schools"
                  className="flex items-center justify-between p-4 rounded-2xl border border-[#E3E2EC] hover:border-lavender-300 hover:bg-[#F5F5F7]/60 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-ink-dark">3. Explorer le catalogue des écoles</p>
                    <p className="text-xs text-ink-muted">Consultez les critères d'accès, filières et villes.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink-dark group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16} className="flex flex-col">
          <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-2xs space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                Dossier académique
              </h3>
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#E3E2EC] text-xs">
                <div className="space-y-1">
                  <span className="text-ink-muted uppercase tracking-wider text-[10px]">Filière Bac</span>
                  <p className="font-medium text-sm text-ink-dark">{profile?.bacTrack || 'Non spécifiée'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-ink-muted uppercase tracking-wider text-[10px]">Année</span>
                  <p className="font-medium text-sm text-ink-dark">{profile?.bacYear || '2025'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-ink-muted uppercase tracking-wider text-[10px]">Région</span>
                  <p className="font-medium text-sm text-ink-dark">{profile?.region || 'Casablanca-Settat'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-ink-muted uppercase tracking-wider text-[10px]">Formule</span>
                  <p className="font-medium text-sm text-ink-dark">
                    {isPremium ? 'Premium (Actif)' : 'Standard'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/student/profile" className="block">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] text-xs font-medium h-10"
                >
                  Modifier mon profil académique &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default Dashboard;
