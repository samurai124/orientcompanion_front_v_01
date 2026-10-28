import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import applicationsApi from '@/api/applications';
import { formatDate } from '@/lib/format';
import { PageBanner } from '@/components/design/PageBanner';
import { DataState } from '@/components/common/DataState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VISUALS } from '@/lib/visuals';
import { Reveal, AnimatedProgress } from '@/components/motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  AlertTriangle,
  Upload,
  CheckCircle2,
  FileText,
  Clock,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['applicationProgress', id],
    queryFn: () => applicationsApi.getApplicationProgress(id),
    enabled: Boolean(id),
  });

  const [notesState, setNotesState] = useState({});
  const [uploadingItemId, setUploadingItemId] = useState(null);

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, data }) => applicationsApi.updateDocumentStatus(id, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicationProgress', id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Dossier mis à jour.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la mise à jour du document.');
    },
  });

  const handleStatusChange = (itemId, newStatus) => {
    updateItemMutation.mutate({
      itemId,
      data: { status: newStatus },
    });
  };

  const handleNotesBlur = (itemId, originalNotes) => {
    const currentVal = notesState[itemId];
    if (currentVal !== undefined && currentVal !== originalNotes) {
      updateItemMutation.mutate({
        itemId,
        data: { notes: currentVal },
      });
    }
  };

  const handleFileUpload = async (itemId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingItemId(itemId);
      await applicationsApi.uploadDocument(id, itemId, formData);
      queryClient.invalidateQueries({ queryKey: ['applicationProgress', id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Fichier téléversé avec succès !');
    } catch (err) {
      toast.error(err.message || 'Erreur lors du téléversement du fichier.');
    } finally {
      setUploadingItemId(null);
    }
  };

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/student/applications')}
        className="rounded-full text-xs text-ink-muted hover:text-ink gap-1.5"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Retour aux candidatures</span>
      </Button>

      <DataState query={query} emptyMessage="Dossier de candidature introuvable.">
        {(appProgress) => {
          const app = appProgress?.application;
          const filiere = app?.filiere;
          const school = filiere?.school;
          const items = appProgress?.items || [];
          const progressVal = appProgress?.progressPercentage || 0;

          return (
            <div className="space-y-8">
              {/* Page Banner with Book Visual */}
              <PageBanner
                title={filiere?.name || "Dossier de candidature"}
                description={school ? `${school.name} (${school.city || 'Maroc'})` : "Suivi des pièces et démarches"}
                visual={VISUALS.objBook}
                badge={<StatusBadge status={app?.status} />}
              />

              {/* Progress & Deadline Summary Card */}
              <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Progression globale du dossier
                    </span>
                    <h3 className="text-2xl font-light text-ink-dark tracking-tight">
                      {progressVal}% complété
                    </h3>
                  </div>

                  {school?.applicationDeadline && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-800 font-medium">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Date limite : <strong>{formatDate(school.applicationDeadline)}</strong></span>
                    </div>
                  )}
                </div>

                <AnimatedProgress value={progressVal} max={100} duration={1} />
              </div>

              {/* Checklist Items */}
              <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-10 shadow-2xs space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-normal text-ink-dark tracking-tight">
                    Pièces justificatives et étapes obligatoires
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Téléversez vos justificatifs ou marquez chaque étape validée.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {items.length === 0 ? (
                    <p className="text-xs text-ink-muted py-8 text-center">
                      Aucune pièce justificative requise enregistrée pour cette filière.
                    </p>
                  ) : (
                    items.map((item, idx) => {
                      const isValidated = item.status === 'VALIDATED';
                      const isUploaded = item.status === 'UPLOADED';

                      return (
                        <Reveal key={item.id || idx} delay={0.05 * Math.min(idx, 6)}>
                          <div
                            className={`p-6 rounded-2xl border transition-all ${
                              isValidated
                                ? 'bg-[#4C9A7A]/5 border-[#4C9A7A]/25'
                                : isUploaded
                                ? 'bg-lavender-50/50 border-lavender-200/80'
                                : 'bg-white border-border/80 hover:bg-neutral-50/60'
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-3 max-w-xl">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 hover:scale-110 cursor-pointer ${
                                    isValidated
                                      ? 'bg-[#4C9A7A] text-white shadow-2xs'
                                      : 'bg-lavender-100 text-ink-muted'
                                  }`}
                                  onClick={() => handleStatusChange(item.id, isValidated ? 'PENDING' : 'VALIDATED')}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-medium text-ink-dark">
                                      {item.documentName || item.title || 'Document requis'}
                                    </h4>
                                    {item.isRequired && (
                                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
                                        Obligatoire
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-xs text-ink-muted leading-relaxed">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.fileUrl && (
                                    <a
                                      href={item.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-lavender-700 hover:underline pt-1"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      <span>Consulter le fichier téléversé</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <Select
                                  value={item.status}
                                  onValueChange={(val) => handleStatusChange(item.id, val)}
                                >
                                  <SelectTrigger className="h-9 w-36 rounded-xl border-border bg-white text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl">
                                    <SelectItem value="PENDING" className="text-xs">En attente</SelectItem>
                                    <SelectItem value="UPLOADED" className="text-xs">Téléversé</SelectItem>
                                    <SelectItem value="VALIDATED" className="text-xs">Validé</SelectItem>
                                  </SelectContent>
                                </Select>

                                <label className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-lavender-100 text-ink hover:bg-lavender-200/70 cursor-pointer text-xs font-medium transition-colors">
                                  {uploadingItemId === item.id ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Envoi...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Téléverser</span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => handleFileUpload(item.id, e)}
                                    disabled={uploadingItemId === item.id}
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Note field */}
                            <div className="mt-4 pt-3 border-t border-border/50">
                              <Input
                                placeholder="Ajouter une note personnelle (ex: demandé au secrétariat le 12/03)..."
                                value={notesState[item.id] ?? (item.notes || '')}
                                onChange={(e) =>
                                  setNotesState({
                                    ...notesState,
                                    [item.id]: e.target.value,
                                  })
                                }
                                onBlur={() => handleNotesBlur(item.id, item.notes)}
                                className="h-9 rounded-xl border-border bg-white text-xs"
                              />
                            </div>
                          </div>
                        </Reveal>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        }}
      </DataState>
    </div>
  );
}

export default ApplicationDetail;
