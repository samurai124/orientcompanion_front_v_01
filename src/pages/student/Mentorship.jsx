import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import mentorshipApi from '@/api/mentorship';
import { formatDate } from '@/lib/format';
import { PageBanner } from '@/components/design/PageBanner';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Reveal, Float } from '@/components/motion';
import { DataState } from '@/components/common/DataState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  Calendar,
  Clock,
  Video,
  Star,
  Plus,
  AlertCircle,
  ExternalLink,
  Ban,
  Loader2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

export function Mentorship() {
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey: ['myMentorshipSessions'],
    queryFn: mentorshipApi.getSessions,
  });

  const { data: counselors = [] } = useQuery({
    queryKey: ['counselorsList'],
    queryFn: mentorshipApi.getCounselors,
  });

  // Dialog states
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedCounselorId, setSelectedCounselorId] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('10:00');
  const [subject, setSubject] = useState('');

  // Rating Dialog state
  const [ratingSessionId, setRatingSessionId] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');

  // Cancel Dialog state
  const [cancelSessionId, setCancelSessionId] = useState(null);

  // Mutations
  const requestMutation = useMutation({
    mutationFn: (data) => mentorshipApi.requestSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMentorshipSessions'] });
      setRequestDialogOpen(false);
      setSelectedCounselorId('');
      setSubject('');
      toast.success('Votre demande de séance a été envoyée au conseiller.');
    },
    onError: (err) => {
      toast.error(err.message || 'Impossible de réserver ce créneau (Règle des 24h min requise).');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => mentorshipApi.cancelSession(id, 'Annulé par l’étudiant'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMentorshipSessions'] });
      setCancelSessionId(null);
      toast.info('Séance annulée.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de l’annulation de la séance.');
    },
  });

  const rateMutation = useMutation({
    mutationFn: ({ id, rating, feedback }) =>
      mentorshipApi.rateSession(id, { rating: Number(rating), feedback }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMentorshipSessions'] });
      setRatingSessionId(null);
      toast.success('Merci pour votre avis !');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la notation.');
    },
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!selectedCounselorId) {
      toast.error('Veuillez sélectionner un conseiller.');
      return;
    }
    if (!sessionDate || !sessionTime) {
      toast.error('Veuillez spécifier la date et l’heure souhaitées.');
      return;
    }
    if (!subject.trim()) {
      toast.error('Veuillez préciser le sujet ou vos interrogations.');
      return;
    }

    // Build ISO start and end timestamps (1 hour session)
    const start = new Date(`${sessionDate}T${sessionTime}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    requestMutation.mutate({
      counselorId: Number(selectedCounselorId),
      requestedStart: start.toISOString(),
      requestedEnd: end.toISOString(),
      subject: subject.trim(),
    });
  };

  return (
    <div className="space-y-8">
      <PageBanner
        badge="Accompagnement Sur-Mesure"
        title="Séances de mentorat individuel"
        description="Bénéficiez de l'accompagnement personnalisé d'un conseiller d'orientation pour affiner vos choix de filières et réussir vos concours."
        visual={VISUALS.flowerSprout}
        action={
          <Button
            onClick={() => setRequestDialogOpen(true)}
            className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all duration-300 gap-2"
          >
            <Plus className="h-4 w-4" />
            Demander une séance
          </Button>
        }
      />

      <DataState
        query={query}
        emptyMessage="Vous n'avez aucune séance de mentorat programmée."
        emptyAction={
          <Button
            onClick={() => setRequestDialogOpen(true)}
            className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-6 py-2.5 font-medium gap-2 text-xs"
          >
            <Users className="h-4 w-4" />
            Réserver avec un conseiller
          </Button>
        }
      >
        {(sessions) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((session, idx) => {
              const counselorUser = session.counselor?.user;
              const isScheduled = session.status === 'SCHEDULED';
              const isCompleted = session.status === 'COMPLETED';
              const isPending = session.status === 'PENDING';

              return (
                <Reveal key={session.id} delay={idx * 0.05}>
                  <div className="rounded-3xl bg-white border border-[#E3E2EC] p-6 sm:p-7 flex flex-col justify-between hover:border-[#C9C7EE] transition-all duration-300 shadow-xs h-full space-y-6">
                    <div className="space-y-4">
                      {/* Header with name and status */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                            {counselorUser
                              ? `${counselorUser.firstName} ${counselorUser.lastName}`
                              : 'Conseiller d’orientation'}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-1">
                            <Calendar className="h-3.5 w-3.5 text-[#6B5BD2]" />
                            <span>
                              {formatDate(session.requestedStart)} ({session.requestedStart ? new Date(session.requestedStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''})
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={session.status} />
                      </div>

                      {/* Subject description box */}
                      <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-[#E3E2EC]/60 text-xs space-y-1.5">
                        <span className="font-medium text-ink-muted block text-[11px] uppercase tracking-wider">
                          Objet de l'échange
                        </span>
                        <p className="text-ink-dark leading-relaxed font-normal">
                          {session.subject || 'Orientation générale et choix de parcours'}
                        </p>
                      </div>

                      {/* Scheduled Video Call Link */}
                      {isScheduled && session.meetingLink && (
                        <div className="p-4 rounded-2xl bg-[#4C9A7A]/10 border border-[#4C9A7A]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 text-xs text-[#2A2545] font-medium">
                            <Video className="h-4 w-4 text-[#4C9A7A] shrink-0" />
                            <span>Visioconférence prête</span>
                          </div>
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#4C9A7A] hover:bg-[#3d8366] px-4 py-2 rounded-full shadow-2xs transition-colors"
                          >
                            Rejoindre l'appel <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {/* Counselor feedback report */}
                      {session.report && (
                        <div className="p-4 rounded-2xl bg-[#E4E3F5]/30 border border-[#C9C7EE]/60 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-ink-dark font-medium mb-1">
                            <MessageSquare className="h-3.5 w-3.5 text-[#6B5BD2]" />
                            <span>Compte-rendu du conseiller</span>
                          </div>
                          <p className="text-ink-muted italic leading-relaxed">
                            "{session.report}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom actions */}
                    <div className="pt-4 border-t border-[#E3E2EC] flex items-center justify-between">
                      <div>
                        {isPending && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancelSessionId(session.id)}
                            className="text-xs text-[#C75D6B] hover:bg-[#C75D6B]/10 rounded-full px-3 h-8"
                          >
                            <Ban className="h-3.5 w-3.5 mr-1" />
                            Annuler la demande
                          </Button>
                        )}
                      </div>

                      {isCompleted && (
                        <div>
                          {session.rating ? (
                            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              <span>Votre note : {session.rating}/5</span>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRatingSessionId(session.id)}
                              className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] text-xs gap-1.5 h-8 px-4 font-medium"
                            >
                              <Star className="h-3.5 w-3.5 text-amber-500" />
                              Noter la séance
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </DataState>

      {/* Demander une séance Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[28px] border border-[#E3E2EC] bg-white p-6 sm:p-8 shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-normal text-ink-dark tracking-tight">
              Demander une séance de mentorat
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-ink-muted">
              Planifiez un échange individuel d'une heure avec un conseiller d'orientation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestSubmit} className="space-y-4 pt-3">
            <div className="rounded-2xl bg-amber-50 p-3.5 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong>Règle de réservation :</strong> Les demandes de séance doivent être formulées au moins 24 heures à l'avance.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-ink-muted">Choisir un conseiller</Label>
              <Select value={selectedCounselorId} onValueChange={setSelectedCounselorId}>
                <SelectTrigger className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white">
                  <SelectValue placeholder="Sélectionner un conseiller..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {counselors.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.user?.firstName} {c.user?.lastName} ({c.specialties?.join(', ') || 'Orientation'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-medium text-ink-muted">Date souhaitée</Label>
                <Input
                  id="date"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="time" className="text-xs font-medium text-ink-muted">Heure</Label>
                <Input
                  id="time"
                  type="time"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-xs font-medium text-ink-muted">Sujet de l'échange</Label>
              <Textarea
                id="subject"
                placeholder="Ex : Choix entre CPGE et ENSA, préparation de l'entretien oral..."
                rows={3}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white resize-none"
              />
            </div>

            <DialogFooter className="mt-6 flex flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRequestDialogOpen(false)}
                disabled={requestMutation.isPending}
                className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] px-4"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={requestMutation.isPending}
                className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 gap-2 font-medium"
              >
                {requestMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Envoyer la demande
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={Boolean(ratingSessionId)} onOpenChange={(open) => !open && setRatingSessionId(null)}>
        <DialogContent className="sm:max-w-md rounded-[28px] border border-[#E3E2EC] bg-white p-6 sm:p-8 shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-normal text-ink-dark tracking-tight">
              Évaluer votre séance
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-ink-muted">
              Donnez une note de 1 à 5 étoiles sur la clarté et l'impact des conseils reçus.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  className="p-1 focus:outline-hidden transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= ratingValue
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-[#E3E2EC]'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedback" className="text-xs font-medium text-ink-muted">Commentaire (facultatif)</Label>
              <Textarea
                id="feedback"
                placeholder="Partagez vos impressions sur cet entretien..."
                rows={3}
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRatingSessionId(null)}
              disabled={rateMutation.isPending}
              className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] px-4"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={() =>
                rateMutation.mutate({
                  id: ratingSessionId,
                  rating: ratingValue,
                  feedback: ratingFeedback,
                })
              }
              disabled={rateMutation.isPending}
              className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 gap-2 font-medium"
            >
              {rateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Valider la note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(cancelSessionId)}
        onOpenChange={(open) => !open && setCancelSessionId(null)}
        title="Annuler cette demande de séance ?"
        description="Cette demande sera annulée et le conseiller en sera informé immédiatement."
        onConfirm={() => cancelMutation.mutate(cancelSessionId)}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}

export default Mentorship;
