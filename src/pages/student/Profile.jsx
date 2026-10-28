import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentsApi from '@/api/students';
import { useAuth } from '@/hooks/useAuth';
import { PageBanner } from '@/components/design/PageBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VISUALS } from '@/lib/visuals';
import { Reveal } from '@/components/motion';
import { Plus, Trash2, Save, Loader2, BookOpen, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const BAC_TRACKS = [
  { value: 'SM_A', label: 'Sciences Mathématiques A' },
  { value: 'SM_B', label: 'Sciences Mathématiques B' },
  { value: 'PC', label: 'Sciences Physiques et Chimie' },
  { value: 'SVT', label: 'Sciences de la Vie et de la Terre' },
  { value: 'ECO', label: 'Sciences Économiques' },
  { value: 'TGC', label: 'Gestion Comptable' },
  { value: 'STE', label: 'Sciences & Tech Électriques' },
  { value: 'STM', label: 'Sciences & Tech Mécaniques' },
  { value: 'LETTRES', label: 'Lettres & Sciences Humaines' },
];

const REGIONS = [
  'Casablanca-Settat',
  'Rabat-Salé-Kénitra',
  'Tanger-Tétouan-Al Hoceïma',
  'Fès-Meknès',
  'Marrakech-Safi',
  'Souss-Massa',
  'Béni Mellal-Khénifra',
  'Oriental',
  'Drâa-Tafilalet',
  'Guelmim-Oued Noun',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab',
];

const COMMON_SUBJECTS = [
  'MATH',
  'PC',
  'SVT',
  'FRANCAIS',
  'ANGLAIS',
  'PHILO',
  'ARABE',
  'HISTOIRE_GEO',
  'ECONOMIE',
];

const PERIODS = [
  { value: 'S1', label: '1er Semestre (S1)' },
  { value: 'S2', label: '2ème Semestre (S2)' },
  { value: 'REGIONAL', label: 'Examen Régional' },
  { value: 'NATIONAL', label: 'Examen National' },
];

const profileSchema = z.object({
  bacTrack: z.string().optional(),
  bacYear: z.coerce.number().int().min(2000).max(2050).optional(),
  region: z.string().optional(),
  stage: z.enum(['PRE_BAC', 'POST_BAC', 'CONCOURS_PREP']),
});

export function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: studentData, isLoading: loadingStudent } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentsApi.getProfile,
  });

  const { data: initialGrades = [] } = useQuery({
    queryKey: ['studentGrades'],
    queryFn: studentsApi.getGrades,
  });

  const [gradesList, setGradesList] = useState([]);

  useEffect(() => {
    if (initialGrades && initialGrades.length > 0) {
      setGradesList(initialGrades);
    } else if (gradesList.length === 0) {
      setGradesList([
        { subjectCode: 'MATH', gradeValue: 15.5, period: 'NATIONAL' },
        { subjectCode: 'PC', gradeValue: 14.0, period: 'NATIONAL' },
        { subjectCode: 'FRANCAIS', gradeValue: 13.0, period: 'REGIONAL' },
      ]);
    }
  }, [initialGrades]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting: savingProfile },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      stage: 'PRE_BAC',
      bacTrack: 'PC',
      bacYear: 2025,
      region: 'Casablanca-Settat',
    },
  });

  useEffect(() => {
    if (studentData) {
      reset({
        stage: studentData.stage || 'PRE_BAC',
        bacTrack: studentData.bacTrack || 'PC',
        bacYear: studentData.bacYear || 2025,
        region: studentData.region || 'Casablanca-Settat',
      });
    }
  }, [studentData, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: studentsApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      toast.success('Informations personnelles mises à jour avec succès.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la mise à jour du profil.');
    },
  });

  const updateGradesMutation = useMutation({
    mutationFn: studentsApi.updateGrades,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentGrades'] });
      queryClient.invalidateQueries({ queryKey: ['gradeGoals'] });
      toast.success('Relevé de notes enregistré avec succès !');
    },
    onError: (err) => {
      toast.error(err.message || "Erreur lors de l'enregistrement des notes.");
    },
  });

  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleAddGradeRow = () => {
    setGradesList((prev) => [
      ...prev,
      { subjectCode: 'MATH', gradeValue: 12.0, period: 'NATIONAL' },
    ]);
  };

  const handleUpdateGrade = (index, field, value) => {
    setGradesList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteGradeRow = (index) => {
    setGradesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGrades = () => {
    const invalid = gradesList.find(
      (g) => isNaN(Number(g.gradeValue)) || Number(g.gradeValue) < 0 || Number(g.gradeValue) > 20
    );
    if (invalid) {
      toast.error('Toutes les notes doivent être des nombres compris entre 0 et 20.');
      return;
    }

    if (gradesList.length === 0) {
      toast.error('Veuillez ajouter au moins une note à votre relevé.');
      return;
    }

    const payload = gradesList.map((g) => ({
      subjectCode: String(g.subjectCode).trim().toUpperCase(),
      gradeValue: Number(g.gradeValue),
      period: String(g.period).trim().toUpperCase(),
    }));

    updateGradesMutation.mutate(payload);
  };

  return (
    <div className="space-y-8">
      <PageBanner
        title="Mon profil académique"
        description="Gérez vos informations de scolarité et mettez à jour votre relevé de notes pour optimiser vos recommandations et calculs de seuils."
        visual={VISUALS.objBook}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal info */}
        <div className="lg:col-span-1">
          <Reveal>
            <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-ink-dark">
                  <User className="h-5 w-5 text-lavender-600" />
                  <h3 className="text-xl font-normal tracking-tight">Informations générales</h3>
                </div>
                <p className="text-xs text-ink-muted">Données associées à votre scolarité</p>
              </div>

              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4 text-sm">
                <div className="space-y-1">
                  <Label className="text-xs text-ink-muted">Nom complet</Label>
                  <p className="font-semibold text-ink-dark py-1 border-b border-border/70">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-ink-muted">Adresse Email</Label>
                  <p className="font-medium text-ink-dark py-1 border-b border-border/70 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="stage" className="text-xs font-medium text-ink-muted">Étape actuelle</Label>
                  <Controller
                    control={control}
                    name="stage"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="stage" className="h-11 rounded-xl border-border bg-[#FBFBFC]">
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="PRE_BAC">Pré-Bac (Lycéen)</SelectItem>
                          <SelectItem value="POST_BAC">Post-Bac (Études sup)</SelectItem>
                          <SelectItem value="CONCOURS_PREP">Prépa Concours</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bacTrack" className="text-xs font-medium text-ink-muted">Filière Baccalauréat</Label>
                  <Controller
                    control={control}
                    name="bacTrack"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="bacTrack" className="h-11 rounded-xl border-border bg-[#FBFBFC]">
                          <SelectValue placeholder="Filière..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-60">
                          {BAC_TRACKS.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bacYear" className="text-xs font-medium text-ink-muted">Année du Bac</Label>
                  <Input
                    id="bacYear"
                    type="number"
                    className="h-11 rounded-xl border-border bg-[#FBFBFC]"
                    {...register('bacYear')}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="region" className="text-xs font-medium text-ink-muted">Région</Label>
                  <Controller
                    control={control}
                    name="region"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="region" className="h-11 rounded-xl border-border bg-[#FBFBFC]">
                          <SelectValue placeholder="Région..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-60">
                          {REGIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] font-medium text-xs gap-2"
                    disabled={savingProfile || updateProfileMutation.isPending}
                  >
                    {savingProfile || updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Mise à jour...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Enregistrer les infos</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Grades Table */}
        <div className="lg:col-span-2">
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-ink-dark">
                    <BookOpen className="h-5 w-5 text-lavender-600" />
                    <h3 className="text-xl font-normal tracking-tight">Relevé de notes</h3>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Notes sur 20 utilisées pour calculer vos écarts avec les seuils officiels.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGradeRow}
                  className="rounded-full border-border hover:bg-neutral-50 text-xs font-medium gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Ajouter une matière</span>
                </Button>
              </div>

              {/* Table */}
              <div className="border border-border/70 rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-lavender-50/60">
                    <TableRow className="border-border/70">
                      <TableHead className="w-[35%] text-xs font-semibold text-ink-dark">Matière</TableHead>
                      <TableHead className="w-[30%] text-xs font-semibold text-ink-dark">Période</TableHead>
                      <TableHead className="w-[25%] text-xs font-semibold text-ink-dark">Note (/20)</TableHead>
                      <TableHead className="w-[10%] text-center text-xs font-semibold text-ink-dark">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradesList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-xs text-ink-muted">
                          Aucune note ajoutée pour l'instant. Cliquez sur "Ajouter une matière".
                        </TableCell>
                      </TableRow>
                    ) : (
                      gradesList.map((item, index) => (
                        <TableRow key={index} className="border-border/70">
                          <TableCell>
                            <Input
                              list="common-subjects"
                              value={item.subjectCode}
                              onChange={(e) =>
                                handleUpdateGrade(index, 'subjectCode', e.target.value.toUpperCase())
                              }
                              placeholder="ex: MATH"
                              className="h-9 rounded-xl border-border bg-[#FBFBFC] text-xs font-medium"
                            />
                            <datalist id="common-subjects">
                              {COMMON_SUBJECTS.map((s) => (
                                <option key={s} value={s} />
                              ))}
                            </datalist>
                          </TableCell>

                          <TableCell>
                            <Select
                              value={item.period}
                              onValueChange={(val) => handleUpdateGrade(index, 'period', val)}
                            >
                              <SelectTrigger className="h-9 rounded-xl border-border bg-[#FBFBFC] text-xs">
                                <SelectValue placeholder="Période" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                {PERIODS.map((p) => (
                                  <SelectItem key={p.value} value={p.value} className="text-xs">
                                    {p.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.25"
                              value={item.gradeValue}
                              onChange={(e) =>
                                handleUpdateGrade(index, 'gradeValue', e.target.value)
                              }
                              className="h-9 rounded-xl border-border bg-[#FBFBFC] text-right font-semibold text-xs"
                            />
                          </TableCell>

                          <TableCell className="text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteGradeRow(index)}
                              className="p-1.5 rounded-lg text-ink-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Supprimer la note"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-xs text-ink-muted">
                  {gradesList.length} note(s) configurée(s)
                </span>
                <Button
                  type="button"
                  onClick={handleSaveGrades}
                  disabled={updateGradesMutation.isPending}
                  className="rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] font-medium text-xs px-6 h-11 gap-2"
                >
                  {updateGradesMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Enregistrer les notes</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default Profile;
