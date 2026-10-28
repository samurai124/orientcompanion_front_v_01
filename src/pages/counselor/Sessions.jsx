import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import mentorshipApi from '@/api/mentorship';
import { formatDate } from '@/lib/format';
import { PageBanner } from '@/components/design/PageBanner';
import { VISUALS } from '@/lib/visuals';
import { Reveal } from '@/components/motion';
import { DataState } from '@/components/common/DataState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  CalendarCheck,
  Calendar,
  Check,
  X,
  Video,
  FileCheck,
  Crown,
  ExternalLink,
  Loader2,
  Star,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

export function Sessions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['counselorSessions'],
    queryFn: mentorshipApi.getSessions,
  });

  // Dialog state for completing a session with report
  const [completeSessionId, setCompleteSessionId] = useState(null);
  const [reportText, setReportText] = useState('');

  // Dialog state for rejecting
  const [rejectSessionId, setRejectSessionId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Mutations
  const acceptMutation = useMutation({
    mutationFn: (id) => mentorshipApi.acceptSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorSessions'] });
      toast.success('Séance acceptée. Lien de visioconférence généré.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de l’acceptation de la séance.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => mentorshipApi.rejectSession(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorSessions'] });
      setRejectSessionId(null);
      setRejectReason('');
      toast.info('Séance refusée.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors du refus.');
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, report }) => mentorshipApi.completeSession(id, { report }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorSessions'] });
      setCompleteSessionId(null);
      setReportText('');
      toast.success('Séance marquée comme terminée et compte-rendu transmis à l’étudiant.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la clôture de la séance.');
    },
  });

  // Filter and sort sessions helper (Premium priority first!)
  const processSessions = (list = [], statusFilter) => {
    return list
      .filter((s) => s.status === statusFilter)
      .sort((a, b) => {
        // Prioritize premium requests
        const aPrem = a.priority || a.isPriority || a.student?.user?.isPremium || false;
        const bPrem = b.priority || b.isPriority || b.student?.user?.isPremium || false;
        if (aPrem && !bPrem) return -1;
        if (!aPrem && bPrem) return 1;
        return new Date(a.requestedStart) - new Date(b.requestedStart);
      });
  };

  return (
    <div className="space-y-8">
      <PageBanner
        badge="Mentorats"
        title="Gestion des séances de mentorat"
        description="Gérez les demandes de rendez-vous reçues des étudiants, animez vos entretiens et rédigez vos comptes-rendus d'orientation."
        visual={VISUALS.flowerSprout}
      />

      <DataState query={query} emptyMessage="Aucune séance enregistrée pour le moment.">
        {(allSessions) => {
          const pendingSessions = processSessions(allSessions, 'PENDING');
          const scheduledSessions = processSessions(allSessions, 'SCHEDULED');
          const completedSessions = processSessions(allSessions, 'COMPLETED');

          return (
            <Tabs defaultValue="pending" className="w-full space-y-6">
              <div className="flex justify-start">
                <TabsList className="rounded-full bg-[#E4E3F5]/40 border border-[#E3E2EC] p-1.5 h-auto">
                  <TabsTrigger
                    value="pending"
                    className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
                  >
                    À confirmer ({pendingSessions.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="scheduled"
                    className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
                  >
                    Planifiées ({scheduledSessions.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
                  >
                    Terminées ({completedSessions.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab 1: PENDING */}
              <TabsContent value="pending" className="space-y-4 outline-hidden">
                {pendingSessions.length === 0 ? (
                  <div className="rounded-3xl bg-white border border-[#E3E2EC] p-8 text-center text-xs text-ink-muted">
                    Aucune nouvelle demande de séance en attente de confirmation.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingSessions.map((session, idx) => {
                      const studentUser = session.student?.user;
                      const isPriority = session.isPriority || session.student?.user?.isPremium;

                      return (
                        <Reveal key={session.id} delay={idx * 0.05}>
                          <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-7 flex flex-col justify-between hover:border-[#C9C7EE] transition-all duration-300 shadow-xs h-full space-y-5">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                                      {studentUser ? `${studentUser.firstName} ${studentUser.lastName}` : 'Étudiant'}
                                    </h3>
                                    {isPriority && (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                                        <Crown className="h-3 w-3 text-amber-500" />
                                        Priorité Premium
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-1">
                                    <Calendar className="h-3.5 w-3.5 text-[#6B5BD2]" />
                                    <span>
                                      {formatDate(session.requestedStart)} à {session.requestedStart ? new Date(session.requestedStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                  </div>
                                </div>
                                <StatusBadge status={session.status} />
                              </div>

                              <div className="rounded-2xl bg-[#F5F5F7] p-3.5 border border-[#E3E2EC]/60 text-xs space-y-1">
                                <span className="font-medium text-ink-muted block text-[11px] uppercase tracking-wider">
                                  Sujet de l'échange
                                </span>
                                <p className="text-ink-dark leading-relaxed font-normal">
                                  {session.subject || 'Non précisé'}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-[#E3E2EC] flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setRejectSessionId(session.id);
                                  setRejectReason('');
                                }}
                                className="rounded-full border-[#C75D6B]/30 text-[#C75D6B] hover:bg-[#C75D6B]/10 text-xs px-4 h-9 gap-1.5"
                              >
                                <X className="h-3.5 w-3.5" />
                                Refuser
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => acceptMutation.mutate(session.id)}
                                disabled={acceptMutation.isPending}
                                className="rounded-full bg-[#4C9A7A] hover:bg-[#3d8366] text-white text-xs px-5 h-9 gap-1.5 font-medium shadow-2xs"
                              >
                                {acceptMutation.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                                Accepter la séance
                              </Button>
                            </div>
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: SCHEDULED */}
              <TabsContent value="scheduled" className="space-y-4 outline-hidden">
                {scheduledSessions.length === 0 ? (
                  <div className="rounded-3xl bg-white border border-[#E3E2EC] p-8 text-center text-xs text-ink-muted">
                    Aucune séance planifiée actuellement.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scheduledSessions.map((session, idx) => {
                      const studentUser = session.student?.user;

                      return (
                        <Reveal key={session.id} delay={idx * 0.05}>
                          <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-7 flex flex-col justify-between hover:border-[#C9C7EE] transition-all duration-300 shadow-xs h-full space-y-5">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                                    {studentUser ? `${studentUser.firstName} ${studentUser.lastName}` : 'Étudiant'}
                                  </h3>
                                  <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-1">
                                    <Calendar className="h-3.5 w-3.5 text-[#6B5BD2]" />
                                    <span>
                                      {formatDate(session.requestedStart)} à {session.requestedStart ? new Date(session.requestedStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                  </div>
                                </div>
                                <StatusBadge status={session.status} />
                              </div>

                              <div className="rounded-2xl bg-[#F5F5F7] p-3.5 border border-[#E3E2EC]/60 text-xs space-y-1">
                                <span className="font-medium text-ink-muted block text-[11px] uppercase tracking-wider">
                                  Sujet
                                </span>
                                <p className="text-ink-dark leading-relaxed font-normal">{session.subject}</p>
                              </div>

                              {session.meetingLink && (
                                <div className="p-3.5 rounded-2xl bg-[#4C9A7A]/10 border border-[#4C9A7A]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <span className="font-medium text-[#2A2545] text-xs">
                                    Salle Jitsi Meet prête
                                  </span>
                                  <a
                                    href={session.meetingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#4C9A7A] hover:bg-[#3d8366] px-4 py-1.5 rounded-full shadow-2xs transition-colors"
                                  >
                                    <Video className="h-3.5 w-3.5" />
                                    Démarrer la visioconférence
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-[#E3E2EC] flex justify-end">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setCompleteSessionId(session.id);
                                  setReportText('');
                                }}
                                className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white text-xs px-5 h-9 gap-1.5 font-medium"
                              >
                                <FileCheck className="h-3.5 w-3.5" />
                                Clôturer avec compte-rendu
                              </Button>
                            </div>
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: COMPLETED */}
              <TabsContent value="completed" className="space-y-4 outline-hidden">
                {completedSessions.length === 0 ? (
                  <div className="rounded-3xl bg-white border border-[#E3E2EC] p-8 text-center text-xs text-ink-muted">
                    Aucune séance archivée.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedSessions.map((session, idx) => {
                      const studentUser = session.student?.user;

                      return (
                        <Reveal key={session.id} delay={idx * 0.05}>
                          <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-7 flex flex-col justify-between hover:border-[#C9C7EE] transition-all duration-300 shadow-xs h-full space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                                  {studentUser ? `${studentUser.firstName} ${studentUser.lastName}` : 'Étudiant'}
                                </h3>
                                <p className="text-xs text-ink-muted mt-1">
                                  Effectuée le {formatDate(session.requestedStart)}
                                </p>
                              </div>
                              <StatusBadge status={session.status} />
                            </div>

                            <div className="space-y-3 text-xs">
                              {session.report && (
                                <div className="p-3.5 rounded-2xl bg-[#E4E3F5]/30 border border-[#C9C7EE]/60 space-y-1">
                                  <div className="flex items-center gap-1.5 text-ink-dark font-medium">
                                    <MessageSquare className="h-3.5 w-3.5 text-[#6B5BD2]" />
                                    <span>Compte-rendu envoyé</span>
                                  </div>
                                  <p className="text-ink-muted italic leading-relaxed">
                                    "{session.report}"
                                  </p>
                                </div>
                              )}

                              {session.rating && (
                                <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60">
                                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                  <span>Note attribuée par l'étudiant : {session.rating}/5</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          );
        }}
      </DataState>

      {/* Complete with Report Dialog */}
      <Dialog open={Boolean(completeSessionId)} onOpenChange={(open) => !open && setCompleteSessionId(null)}>
        <DialogContent className="sm:max-w-md rounded-[28px] border border-[#E3E2EC] bg-white p-6 sm:p-8 shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-normal text-ink-dark tracking-tight">
              Clôturer la séance de mentorat
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-ink-muted">
              Rédigez une synthèse ou vos recommandations pour l'étudiant. Ce texte lui sera directement transmis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <Textarea
              placeholder="Ex : Bon potentiel en sciences. Recommandé de postuler en priorité aux ENSA et de consolider le programme de physique..."
              rows={4}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white resize-none"
            />
          </div>

          <DialogFooter className="flex flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCompleteSessionId(null)}
              disabled={completeMutation.isPending}
              className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] px-4"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={() =>
                completeMutation.mutate({
                  id: completeSessionId,
                  report: reportText,
                })
              }
              disabled={completeMutation.isPending}
              className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 gap-2 font-medium"
            >
              {completeMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Valider et terminer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Session Dialog */}
      <Dialog open={Boolean(rejectSessionId)} onOpenChange={(open) => !open && setRejectSessionId(null)}>
        <DialogContent className="sm:max-w-md rounded-[28px] border border-[#E3E2EC] bg-white p-6 sm:p-8 shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-normal text-ink-dark tracking-tight">
              Refuser la séance
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-ink-muted">
              Indiquez le motif de l'indisponibilité pour informer l'étudiant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <Textarea
              placeholder="Motif (ex: Créneau déjà réservé en présentiel, merci de choisir un autre horaire)..."
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white resize-none"
            />
          </div>

          <DialogFooter className="flex flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectSessionId(null)}
              disabled={rejectMutation.isPending}
              className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] px-4"
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                rejectMutation.mutate({
                  id: rejectSessionId,
                  reason: rejectReason,
                })
              }
              disabled={rejectMutation.isPending}
              className="rounded-full border-[#C75D6B]/30 bg-[#C75D6B] hover:bg-[#b04f5d] text-white px-5 gap-2 font-medium"
            >
              {rejectMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmer le refus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Sessions;
