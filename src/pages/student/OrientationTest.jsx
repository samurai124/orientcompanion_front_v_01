import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import assessmentApi from '@/api/assessment';
import studentsApi from '@/api/students';
import { PageBanner } from '@/components/design/PageBanner';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { VISUALS } from '@/lib/visuals';
import { Reveal, AnimatedProgress, CountUp } from '@/components/motion';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const RIASEC_DIMENSIONS = {
  R: { name: 'Réaliste', desc: 'Pratique, concret, orienté technique, ingénierie et terrain.' },
  I: { name: 'Investigateur', desc: 'Analytique, scientifique, curieux, résolution de problèmes logiques.' },
  A: { name: 'Artistique', desc: 'Créatif, expressif, innovant, sensible au design, médias et arts.' },
  S: { name: 'Social', desc: 'Empathique, relationnel, axé sur l\'entraide, l\'enseignement et la santé.' },
  E: { name: 'Entreprenant', desc: 'Leader, persuasif, orienté projets, affaires et prise de décision.' },
  C: { name: 'Conventionnel', desc: 'Méthodique, précis, rigoureux dans l\'organisation et la gestion.' },
};

export function OrientationTest() {
  const queryClient = useQueryClient();

  const { data: studentProfile, isLoading: loadingStudent } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentsApi.getProfile,
  });

  const { data: questionnaireData, isLoading: loadingQuestions } = useQuery({
    queryKey: ['riasecQuestionnaire'],
    queryFn: assessmentApi.getQuestions,
  });

  const questions = questionnaireData?.questions || [];
  const totalQuestions = questions.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isRetaking, setIsRetaking] = useState(false);

  const existingScores = studentProfile?.riasecScores;
  const isCompleted = (existingScores && Object.keys(existingScores).length > 0 && !isRetaking) || Boolean(submissionResult);
  const activeScores = submissionResult?.riasecScores || existingScores;

  const submitMutation = useMutation({
    mutationFn: assessmentApi.submitResponses,
    onSuccess: (data) => {
      setSubmissionResult(data);
      setIsRetaking(false);
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast.success('Test complété avec succès ! Vos scores ont été calculés.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la soumission du questionnaire.');
    },
  });

  if (loadingStudent || loadingQuestions) {
    return (
      <div className="space-y-6">
        <PageBanner
          title="Test d'orientation RIASEC"
          description="Chargement du questionnaire psychométrique..."
          visual={VISUALS.objCompass}
        />
        <div className="rounded-3xl bg-white border border-border/80 p-8 space-y-4">
          <Skeleton className="h-6 w-1/3 rounded-xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  const currentQ = questions[currentStep];
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
  const progressPercent = totalQuestions > 0 ? Math.round(((currentStep + 1) / totalQuestions) * 100) : 0;

  const handleSelectScore = (scoreVal) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: Number(scoreVal),
    }));
  };

  const handleNext = () => {
    if (!currentAnswer) {
      toast.warning('Veuillez sélectionner une réponse pour continuer.');
      return;
    }
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const payload = Object.entries(answers).map(([qId, sc]) => ({
        questionId: Number(qId),
        score: Number(sc),
      }));

      if (payload.length < totalQuestions) {
        toast.error(`Il reste des questions non répondues (${payload.length}/${totalQuestions}).`);
        return;
      }
      submitMutation.mutate(payload);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStartRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setSubmissionResult(null);
    setIsRetaking(true);
  };

  // If already completed or just submitted, show results view
  if (isCompleted && activeScores) {
    const sortedEntries = Object.entries(activeScores).sort(([, a], [, b]) => b - a);
    const dominantCodes = sortedEntries.slice(0, 3).map(([k]) => k).join('-');

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <PageBanner
          title="Votre profil d'orientation RIASEC"
          description="Basé sur la typologie de John Holland. Vos dimensions dominantes guident les recommandations de filières et écoles au Maroc."
          visual={VISUALS.objCompass}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartRetake}
              className="rounded-full bg-white/80 border-white/80 text-xs font-medium text-ink hover:bg-white shadow-2xs gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Repasser le test</span>
            </Button>
          }
        />

        {/* Profile dominant summary */}
        <Reveal>
          <div className="rounded-[28px] dark-navy-card border border-white/10 p-8 sm:p-10 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-lavender-300" />
                <span>Code RIASEC dominant : {dominantCodes}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Vos trois plus fortes inclinations
              </h2>
              <p className="text-sm text-white/70 leading-relaxed font-normal">
                {sortedEntries.slice(0, 3).map(([k]) => RIASEC_DIMENSIONS[k]?.name).join(', ')}.
              </p>
            </div>

            <Link to="/student/recommendations" className="shrink-0">
              <Button className="rounded-full bg-white text-ink-dark hover:bg-lavender-100 font-medium text-xs px-6 h-11 gap-2 shadow-sm group">
                <span>Voir mes filières recommandées</span>
                <ArrowRight className="w-3.5 h-3.5 text-ink transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Reveal>

        {/* 6 Dimension Progress Bars */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-10 shadow-2xs space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-normal text-ink-dark tracking-tight">
                Détail des 6 dimensions psychométriques
              </h3>
              <p className="text-xs text-ink-muted">
                Score normalisé de 0 à 100 pour chaque facette d'intérêt.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {Object.entries(RIASEC_DIMENSIONS).map(([key, info]) => {
                const score = activeScores[key] || 0;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-lavender-100 text-ink-dark font-bold text-xs flex items-center justify-center">
                          {key}
                        </span>
                        <span className="font-semibold text-ink-dark">{info.name}</span>
                        <span className="hidden sm:inline text-xs text-ink-muted">
                          — {info.desc}
                        </span>
                      </div>
                      <span className="font-bold text-ink-dark">
                        <CountUp to={score} duration={1} /> / 100
                      </span>
                    </div>
                    <AnimatedProgress value={score} max={100} duration={1} />
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-ink-muted">
                Calculé par le moteur d'évaluation OrientCompanion.
              </span>
              <Link to="/student/recommendations">
                <Button size="sm" className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-5 gap-1.5">
                  <span>Explorer les recommandations</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  // Taking questionnaire step by step
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <PageBanner
        title="Test d'orientation RIASEC"
        description="Répondez spontanément à chaque affirmation selon votre niveau d'intérêt ou d'accord."
        visual={VISUALS.objCompass}
      />

      <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-10 shadow-2xs space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-muted font-medium">
            <span>Question {currentStep + 1} sur {totalQuestions}</span>
            <span>{progressPercent}% complété</span>
          </div>
          <AnimatedProgress value={progressPercent} max={100} duration={0.3} />
        </div>

        {currentQ && (
          <div className="space-y-6 pt-2">
            <div className="rounded-2xl lavender-card-gradient border border-lavender-200/80 p-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                Affirmation #{currentQ.id}
              </span>
              <p className="text-base sm:text-lg font-normal text-ink-dark leading-relaxed">
                "{currentQ.text}"
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-ink-muted">Votre niveau d'accord :</Label>
              <RadioGroup
                value={currentAnswer !== undefined ? String(currentAnswer) : ''}
                onValueChange={handleSelectScore}
                className="space-y-2.5"
              >
                {[
                  { val: 1, label: '1 - Pas du tout d’accord' },
                  { val: 2, label: '2 - Plutôt pas d’accord' },
                  { val: 3, label: '3 - Neutre / Indifférent' },
                  { val: 4, label: '4 - Plutôt d’accord' },
                  { val: 5, label: '5 - Tout à fait d’accord' },
                ].map((option) => (
                  <Label
                    key={option.val}
                    htmlFor={`q-score-${option.val}`}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      currentAnswer === option.val
                        ? 'border-ink bg-lavender-50/80 font-medium text-ink-dark shadow-2xs'
                        : 'border-border/80 bg-white hover:bg-neutral-50 text-ink-muted'
                    }`}
                  >
                    <RadioGroupItem value={String(option.val)} id={`q-score-${option.val}`} />
                    <span className="text-sm">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border/70 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0 || submitMutation.isPending}
            className="rounded-full border-border hover:bg-neutral-50 text-xs font-medium px-5 h-10 gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Précédent</span>
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={submitMutation.isPending || currentAnswer === undefined}
            className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] text-xs font-medium px-6 h-10 gap-1.5 shadow-2xs"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Calcul en cours...</span>
              </>
            ) : currentStep === totalQuestions - 1 ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Terminer et soumettre</span>
              </>
            ) : (
              <>
                <span>Suivant</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrientationTest;
