import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import mentorshipApi from '@/api/mentorship';
import { PageBanner } from '@/components/design/PageBanner';
import { VISUALS } from '@/lib/visuals';
import { Reveal } from '@/components/motion';
import { DataState } from '@/components/common/DataState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, Plus, Trash2, Clock, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

export function Slots() {
  const queryClient = useQueryClient();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [slotToDelete, setSlotToDelete] = useState(null);

  const query = useQuery({
    queryKey: ['counselorAvailability'],
    queryFn: mentorshipApi.getAvailability,
  });

  const addMutation = useMutation({
    mutationFn: (data) => mentorshipApi.addAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorAvailability'] });
      setAddDialogOpen(false);
      toast.success('Créneau de disponibilité ajouté.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de l’ajout du créneau.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => mentorshipApi.deleteAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselorAvailability'] });
      setSlotToDelete(null);
      toast.success('Créneau supprimé.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la suppression.');
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      toast.error('Veuillez renseigner les heures de début et de fin.');
      return;
    }
    addMutation.mutate({
      dayOfWeek: Number(selectedDay),
      startTime,
      endTime,
    });
  };

  const getDayName = (dayNumber) => {
    const found = DAYS_OF_WEEK.find((d) => d.value === dayNumber);
    return found ? found.label : `Jour ${dayNumber}`;
  };

  return (
    <div className="space-y-8">
      <PageBanner
        badge="Disponibilités"
        title="Mes créneaux de disponibilité"
        description="Définissez vos plages horaires hebdomadaires pour permettre aux étudiants de réserver des séances d'orientation."
        visual={VISUALS.flowerSprout}
        action={
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all duration-300 gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un créneau
          </Button>
        }
      />

      <DataState
        query={query}
        emptyMessage="Vous n'avez défini aucun créneau de disponibilité pour le moment."
        emptyAction={
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-6 py-2.5 font-medium gap-2 text-xs"
          >
            <Plus className="h-4 w-4" />
            Configurer mes horaires
          </Button>
        }
      >
        {(slots) => (
          <Reveal>
            <div className="rounded-[28px] bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3E2EC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E4E3F5] text-[#2A2545] flex items-center justify-center">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                      Planning hebdomadaire récurrent
                    </h3>
                    <p className="text-xs text-ink-muted">
                      Ces créneaux sont automatiquement proposés aux étudiants lors de leurs demandes de mentorat.
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F7] text-ink-muted border border-[#E3E2EC] self-start sm:self-auto">
                  {slots.length} créneau{slots.length > 1 ? 's' : ''} configuré{slots.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="rounded-2xl border border-[#E3E2EC] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F5F5F7]/70 hover:bg-[#F5F5F7]/70 border-b border-[#E3E2EC]">
                      <TableHead className="text-ink-dark font-medium w-[30%]">Jour</TableHead>
                      <TableHead className="text-ink-dark font-medium w-[30%]">Heure de début</TableHead>
                      <TableHead className="text-ink-dark font-medium w-[30%]">Heure de fin</TableHead>
                      <TableHead className="text-ink-dark font-medium w-[10%] text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slots.map((slot) => (
                      <TableRow key={slot.id} className="border-b border-[#E3E2EC] hover:bg-[#F5F5F7]/40 transition-colors">
                        <TableCell className="font-medium text-ink-dark text-sm">
                          {getDayName(slot.dayOfWeek)}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-ink-dark">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E3E2EC]">
                            <Clock className="h-3 w-3 text-[#6B5BD2]" />
                            {slot.startTime}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-ink-dark">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E3E2EC]">
                            <Clock className="h-3 w-3 text-[#6B5BD2]" />
                            {slot.endTime}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSlotToDelete(slot.id)}
                            className="rounded-full text-[#C75D6B] hover:bg-[#C75D6B]/10 h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Reveal>
        )}
      </DataState>

      {/* Add Slot Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[28px] border border-[#E3E2EC] bg-white p-6 sm:p-8 shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-normal text-ink-dark tracking-tight">
              Ajouter un créneau hebdomadaire
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-ink-muted">
              Indiquez le jour de la semaine et la plage horaire disponible pour vos rendez-vous.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-ink-muted">Jour de la semaine</Label>
              <Select value={String(selectedDay)} onValueChange={(val) => setSelectedDay(Number(val))}>
                <SelectTrigger className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {DAYS_OF_WEEK.map((d) => (
                    <SelectItem key={d.value} value={String(d.value)}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startTime" className="text-xs font-medium text-ink-muted">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="endTime" className="text-xs font-medium text-ink-muted">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                disabled={addMutation.isPending}
                className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] px-4"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={addMutation.isPending}
                className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 gap-2 font-medium"
              >
                {addMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Ajouter ce créneau
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Slot Confirmation */}
      <ConfirmDialog
        open={Boolean(slotToDelete)}
        onOpenChange={(open) => !open && setSlotToDelete(null)}
        title="Supprimer ce créneau ?"
        description="Ce créneau ne sera plus proposé aux étudiants pour de futures séances."
        onConfirm={() => deleteMutation.mutate(slotToDelete)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default Slots;
