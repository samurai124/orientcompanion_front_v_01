import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import concoursApi from '@/api/concours';
import { formatDate } from '@/lib/format';
import { PremiumGate } from '@/components/common/PremiumGate';
import { PageBanner } from '@/components/design/PageBanner';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Reveal, Float, CountUp } from '@/components/motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Trophy,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { toast } from 'sonner';

export function Concours() {
  const queryClient = useQueryClient();

  // Queries
  const { data: concoursList = [] } = useQuery({
    queryKey: ['concoursList'],
    queryFn: concoursApi.getConcours,
  });

  const { data: studyPlans = [] } = useQuery({
    queryKey: ['studyPlans'],
    queryFn: concoursApi.getStudyPlans,
  });

  // Active study plan is the first active one
  const activePlan = studyPlans.length > 0 ? studyPlans[0] : null;

  // Form state for creating study plan
  const [selectedConcoursId, setSelectedConcoursId] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [examDate, setExamDate] = useState('');

  // Exam session state
  const [activeExamSession, setActiveExamSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [examResults, setExamResults] = useState(null);

  // Mutations
  const createPlanMutation = useMutation({
    mutationFn: (data) => concoursApi.createStudyPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyPlans'] });
      toast.success("Plan d'entraînement créé avec succès !");
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la création du plan.');
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ taskId, status }) => concoursApi.toggleTask(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyPlans'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la mise à jour de la tâche.');
    },
  });

  const startExamMutation = useMutation({
    mutationFn: (mockExamId) => concoursApi.startExam(mockExamId),
    onSuccess: (sessionData) => {
      setActiveExamSession(sessionData);
      setCurrentQuestionIndex(0);
      setExamAnswers({});
      setExamResults(null);
      setTimeLeftSeconds((sessionData.durationMinutes || 60) * 60);
      toast.info('L’épreuve a commencé. Bonne chance !');
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors du démarrage de l'examen.");
    },
  });

  const submitExamMutation = useMutation({
    mutationFn: ({ mockExamId, answers }) => concoursApi.submitExam(mockExamId, answers),
    onSuccess: (results) => {
      setExamResults(results);
      setActiveExamSession(null);
      queryClient.invalidateQueries({ queryKey: ['studyPlans'] });
      toast.success('Examen blanc terminé et corrigé !');
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de l'envoi des réponses.");
    },
  });

  // Countdown timer effect
  useEffect(() => {
    if (!activeExamSession || timeLeftSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeExamSession, timeLeftSeconds]);

  const handleAutoSubmit = () => {
    if (!activeExamSession) return;
    toast.warning("Temps écoulé ! Soumission automatique de vos réponses.");
    submitExamMutation.mutate({
      mockExamId: activeExamSession.mockExamId,
      answers: examAnswers,
    });
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!selectedConcoursId) {
      toast.error('Veuillez sélectionner un concours.');
      return;
    }
    if (!examDate) {
      toast.error("Veuillez renseigner la date prévue de l'épreuve.");
      return;
    }
    createPlanMutation.mutate({
      concoursId: Number(selectedConcoursId),
      hoursPerWeek: Number(hoursPerWeek),
      examDate: new Date(examDate).toISOString(),
    });
  };

  const handleTaskToggle = (task) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    toggleTaskMutation.mutate({
      taskId: task.id,
      status: newStatus,
    });
  };

  // Group tasks by weekNumber
  const groupedTasks = {};
  if (activePlan?.tasks) {
    for (const t of activePlan.tasks) {
      const w = t.weekNumber || 1;
      if (!groupedTasks[w]) groupedTasks[w] = [];
      groupedTasks[w].push(t);
    }
  }

  // Format countdown string
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PremiumGate>
      <div className="space-y-8">
        <PageBanner
          badge="Excellence Post-Bac"
          title="Préparation aux Concours d'Excellence"
          description="Espace d'entraînement réservé aux membres Premium : plans de révision hebdomadaires personnalisés et examens blancs interactifs au format officiel."
          visual={VISUALS.objTrophy}
          action={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/90 text-amber-700 border border-amber-200/80 shadow-2xs backdrop-blur-xs">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                Accès Premium Activé
              </span>
            </div>
          }
        />

        {/* If taking an active exam session */}
        {activeExamSession && (
          <Reveal>
            <div className="rounded-[28px] bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E2EC]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-[#E4E3F5] text-[#2A2545]">
                      {activeExamSession.concoursName || 'Concours'}
                    </span>
                    <span className="text-xs text-ink-muted">
                      Question {currentQuestionIndex + 1} sur {activeExamSession.questions.length}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-normal text-ink-dark tracking-tight">
                    {activeExamSession.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-semibold transition-colors ${
                      timeLeftSeconds < 300
                        ? 'bg-[#C75D6B]/10 text-[#C75D6B] border border-[#C75D6B]/30 animate-pulse'
                        : 'bg-[#F5F5F7] text-ink-dark border border-[#E3E2EC]'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    <span>{formatTimer(timeLeftSeconds)}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir soumettre vos réponses et terminer l'épreuve ?")) {
                        submitExamMutation.mutate({
                          mockExamId: activeExamSession.mockExamId,
                          answers: examAnswers,
                        });
                      }
                    }}
                    disabled={submitExamMutation.isPending}
                    className="rounded-full border-[#C75D6B]/30 text-[#C75D6B] hover:bg-[#C75D6B]/10 h-9 px-4 text-xs font-medium gap-1.5"
                  >
                    {submitExamMutation.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    Terminer le test
                  </Button>
                </div>
              </div>

              {/* Question Navigator Pills */}
              <div className="flex flex-wrap gap-2 py-2">
                {activeExamSession.questions.map((q, idx) => {
                  const isAnswered = examAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-8 w-8 rounded-full text-xs font-medium flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#2A2545] text-white shadow-xs scale-105'
                          : isAnswered
                          ? 'bg-[#4C9A7A] text-white'
                          : 'bg-[#F5F5F7] text-ink-muted hover:bg-[#E4E3F5] hover:text-ink-dark'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Current Question Body */}
              {activeExamSession.questions[currentQuestionIndex] && (
                <div className="space-y-6 pt-2">
                  {(() => {
                    const q = activeExamSession.questions[currentQuestionIndex];
                    const selected = examAnswers[q.id];

                    return (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E4E3F5] text-ink-dark">
                              {q.subjectCode}
                            </span>
                            {q.topic && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F7] text-ink-muted border border-[#E3E2EC]">
                                {q.topic}
                              </span>
                            )}
                          </div>
                          <p className="text-base sm:text-lg text-ink-dark leading-relaxed font-normal pt-1">
                            {q.statement}
                          </p>
                        </div>

                        {/* Options RadioGroup */}
                        <div className="space-y-3 pt-2">
                          <RadioGroup
                            value={selected !== undefined ? String(selected) : ''}
                            onValueChange={(val) =>
                              setExamAnswers((prev) => ({
                                ...prev,
                                [q.id]: Number(val),
                              }))
                            }
                            className="space-y-3"
                          >
                            {q.options.map((optText, optIdx) => {
                              const isChecked = selected === optIdx;
                              return (
                                <Label
                                  key={optIdx}
                                  htmlFor={`opt-${q.id}-${optIdx}`}
                                  className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                                    isChecked
                                      ? 'border-[#6B5BD2] bg-[#E4E3F5]/30 text-ink-dark font-medium shadow-2xs'
                                      : 'border-[#E3E2EC] bg-white hover:bg-[#F5F5F7] text-ink-dark'
                                  }`}
                                >
                                  <RadioGroupItem value={String(optIdx)} id={`opt-${q.id}-${optIdx}`} />
                                  <span className="text-sm sm:text-base leading-relaxed">{optText}</span>
                                </Label>
                              );
                            })}
                          </RadioGroup>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between border-t border-[#E3E2EC] pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] px-4 gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Précédente
                </Button>

                {currentQuestionIndex < activeExamSession.questions.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 gap-1.5"
                  >
                    Suivante
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      submitExamMutation.mutate({
                        mockExamId: activeExamSession.mockExamId,
                        answers: examAnswers,
                      });
                    }}
                    disabled={submitExamMutation.isPending}
                    className="rounded-full bg-[#4C9A7A] hover:bg-[#3d8366] text-white px-6 gap-1.5 font-medium"
                  >
                    {submitExamMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Soumettre mes réponses
                  </Button>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* If exam result screen is shown */}
        {examResults && (
          <Reveal>
            <div className="space-y-6">
              {/* Score Highlight Banner */}
              <div className="rounded-[28px] dark-navy-card border border-white/10 p-8 sm:p-10 shadow-lg text-white relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-60 h-60 bg-lavender-600/20 blur-3xl rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-xs border border-white/10">
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      Épreuve terminée et corrigée
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
                      Résultats de votre examen blanc
                    </h2>

                    <p className="text-sm sm:text-base text-white/70 max-w-lg leading-relaxed">
                      Votre score global a été calculé selon la grille officielle du concours. Retrouvez l'analyse détaillée par sujet ci-dessous.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                      <span className="text-4xl font-normal tracking-tight text-white">
                        <CountUp value={examResults.percentage ?? examResults.score ?? 0} />%
                      </span>
                      <span className="text-xs text-white/60 mt-0.5">de réussite</span>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setExamResults(null)}
                      className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs px-4 py-2 gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Retour aux épreuves
                    </Button>
                  </div>
                </div>
              </div>

              {/* Analysis by Subject and Topic */}
              {examResults.scoreByTopic && Object.keys(examResults.scoreByTopic).length > 0 && (
                <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                      Analyse des compétences par thème
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-muted mt-1">
                      Identifiez vos points forts et les notions fragiles à réviser en priorité.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E3E2EC] overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#F5F5F7]/70 hover:bg-[#F5F5F7]/70 border-b border-[#E3E2EC]">
                          <TableHead className="text-ink-dark font-medium">Thème du concours</TableHead>
                          <TableHead className="text-center text-ink-dark font-medium">Réponses correctes</TableHead>
                          <TableHead className="text-right text-ink-dark font-medium">Taux de réussite</TableHead>
                          <TableHead className="text-center text-ink-dark font-medium">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(examResults.scoreByTopic).map(([topic, stats]) => {
                          const isWeak = (examResults.weakTopics || []).includes(topic);
                          const pct = Math.round((stats.correct / stats.total) * 100);
                          return (
                            <TableRow key={topic} className={`border-b border-[#E3E2EC] ${isWeak ? 'bg-[#C75D6B]/5' : ''}`}>
                              <TableCell className="font-medium text-ink-dark text-sm">
                                {topic}
                              </TableCell>
                              <TableCell className="text-center text-ink-muted text-sm">
                                {stats.correct} / {stats.total}
                              </TableCell>
                              <TableCell className="text-right font-medium text-ink-dark text-sm">
                                {pct}%
                              </TableCell>
                              <TableCell className="text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                    isWeak
                                      ? 'bg-[#C75D6B]/15 text-[#C75D6B]'
                                      : 'bg-[#4C9A7A]/15 text-[#4C9A7A]'
                                  }`}
                                >
                                  {isWeak ? 'À renforcer' : 'Maîtrisé'}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* Regular Tabs View when not in active exam or viewing single result */}
        {!activeExamSession && !examResults && (
          <Tabs defaultValue="plan" className="w-full space-y-6">
            <div className="flex justify-start">
              <TabsList className="rounded-full bg-[#E4E3F5]/40 border border-[#E3E2EC] p-1.5 h-auto">
                <TabsTrigger
                  value="plan"
                  className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
                >
                  Plan d'étude hebdomadaire
                </TabsTrigger>
                <TabsTrigger
                  value="exams"
                  className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
                >
                  Examens blancs chronométrés
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Plan d'étude */}
            <TabsContent value="plan" className="space-y-6 outline-hidden">
              {!activePlan ? (
                <Reveal>
                  <div className="max-w-xl mx-auto rounded-[28px] bg-white border border-[#E3E2EC] p-8 sm:p-10 shadow-xs">
                    <div className="text-center space-y-2 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#E4E3F5] text-[#2A2545] mx-auto flex items-center justify-center">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-normal text-ink-dark tracking-tight">
                        Générer mon plan d'entraînement
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-normal">
                        Notre algorithme répartit les matières et intensifie les révisions sur vos notions fragiles jusqu'au jour de l'épreuve.
                      </p>
                    </div>

                    <form onSubmit={handleCreatePlan} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-ink-muted">Concours visé</Label>
                        <Select value={selectedConcoursId} onValueChange={setSelectedConcoursId}>
                          <SelectTrigger className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white">
                            <SelectValue placeholder="Sélectionner le concours..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {concoursList.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="hours" className="text-xs font-medium text-ink-muted">Heures de travail par semaine</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="5"
                          max="40"
                          value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(e.target.value)}
                          className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="examDate" className="text-xs font-medium text-ink-muted">Date prévisionnelle de l'épreuve</Label>
                        <Input
                          id="examDate"
                          type="date"
                          value={examDate}
                          onChange={(e) => setExamDate(e.target.value)}
                          className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white"
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white py-3 font-medium transition-all duration-300 gap-2"
                          disabled={createPlanMutation.isPending}
                        >
                          {createPlanMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Génération de votre planning...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 text-amber-300" />
                              Construire mon plan d'entraînement
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </Reveal>
              ) : (
                <div className="space-y-6">
                  {/* Plan Overview Card */}
                  <div className="rounded-[28px] lavender-card-gradient border border-lavender-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/80 text-ink-dark border border-white/60 shadow-2xs mb-2">
                        Plan actif
                      </span>
                      <h2 className="text-xl sm:text-2xl font-normal text-ink-dark tracking-tight">
                        {activePlan.concours?.name || "Plan de révision concours"}
                      </h2>
                      <p className="text-xs sm:text-sm text-ink-muted mt-1">
                        Objectif épreuve le {formatDate(activePlan.targetExamDate)} • {activePlan.hoursPerWeek}h / semaine
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-white/90 text-ink-dark border border-[#E3E2EC] shadow-2xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#4C9A7A]" />
                        {activePlan.tasks?.filter((t) => t.status === 'DONE').length || 0} / {activePlan.tasks?.length || 0} tâches terminées
                      </span>
                    </div>
                  </div>

                  {/* Tasks grouped by week */}
                  <div className="space-y-6">
                    {Object.keys(groupedTasks).length === 0 ? (
                      <div className="rounded-3xl bg-white border border-[#E3E2EC] p-8 text-center text-ink-muted text-sm">
                        Aucune tâche générée pour ce plan d'étude.
                      </div>
                    ) : (
                      Object.entries(groupedTasks).map(([week, tasks], idx) => (
                        <Reveal key={week} delay={idx * 0.05}>
                          <div className="rounded-3xl bg-white border border-[#E3E2EC] overflow-hidden shadow-xs">
                            <div className="px-6 py-4 bg-[#F5F5F7]/80 border-b border-[#E3E2EC] flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-[#6B5BD2]" />
                                <h4 className="text-sm font-medium text-ink-dark">
                                  Semaine {week}
                                </h4>
                              </div>
                              <span className="text-xs text-ink-muted">
                                {tasks.filter((t) => t.status === 'DONE').length} / {tasks.length} complétées
                              </span>
                            </div>

                            <div className="divide-y divide-[#E3E2EC]">
                              {tasks.map((task) => {
                                const isDone = task.status === 'DONE';
                                return (
                                  <div
                                    key={task.id}
                                    className={`flex items-start gap-4 p-4 sm:px-6 transition-colors ${
                                      isDone ? 'bg-[#F5F5F7]/40 text-ink-muted line-through opacity-75' : 'hover:bg-[#F5F5F7]/50'
                                    }`}
                                  >
                                    <Checkbox
                                      checked={isDone}
                                      onCheckedChange={() => handleTaskToggle(task)}
                                      className="mt-1 rounded-md border-[#C9C7EE] data-[state=checked]:bg-[#2A2545] data-[state=checked]:border-[#2A2545]"
                                    />
                                    <div className="space-y-1 flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs font-medium ${isDone ? 'text-ink-muted' : 'text-ink-dark'}`}>
                                          {task.subjectCode} : {task.topic}
                                        </span>
                                        {task.isWeak && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#C75D6B]/15 text-[#C75D6B]">
                                            À consolider
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-ink-muted leading-relaxed">
                                        {task.instructions || `Séance d'exercices et révision approfondie (${task.allocatedHours || 2}h).`}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Reveal>
                      ))
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Examens blancs */}
            <TabsContent value="exams" className="space-y-6 outline-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {concoursList.flatMap((c) =>
                  (c.mockExams || []).map((exam, idx) => (
                    <Reveal key={exam.id} delay={idx * 0.05}>
                      <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-7 flex flex-col justify-between hover:border-[#C9C7EE] transition-all duration-300 shadow-xs h-full">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E4E3F5] text-ink-dark">
                              {c.name}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                              <Clock className="h-3.5 w-3.5 text-[#6B5BD2]" />
                              {exam.durationMinutes} minutes
                            </span>
                          </div>

                          <h3 className="text-lg font-normal text-ink-dark tracking-tight pt-1">
                            {exam.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-normal">
                            Épreuve interactive au format officiel. Calcul instantané du score et détection des axes d'amélioration.
                          </p>
                        </div>

                        <div className="pt-6 border-t border-[#E3E2EC] mt-6 flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => startExamMutation.mutate(exam.id)}
                            disabled={startExamMutation.isPending}
                            className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 py-2 text-xs font-medium gap-2 transition-all duration-300"
                          >
                            <Trophy className="h-3.5 w-3.5" />
                            Démarrer l'examen
                          </Button>
                        </div>
                      </div>
                    </Reveal>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PremiumGate>
  );
}

export default Concours;
