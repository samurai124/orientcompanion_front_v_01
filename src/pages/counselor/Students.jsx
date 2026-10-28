import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import mentorshipApi from '@/api/mentorship';
import { PageBanner } from '@/components/design/PageBanner';
import { VISUALS } from '@/lib/visuals';
import { Reveal } from '@/components/motion';
import { DataState } from '@/components/common/DataState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Users, Eye, BookOpen, GraduationCap, Compass } from 'lucide-react';

export function Students() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch counselor sessions to derive unique students followed
  const query = useQuery({
    queryKey: ['counselorSessions'],
    queryFn: mentorshipApi.getSessions,
  });

  // Extract unique students from sessions
  const getUniqueStudents = (sessions = []) => {
    const map = new Map();
    for (const s of sessions) {
      if (s.student && !map.has(s.student.id)) {
        map.set(s.student.id, s.student);
      }
    }
    return Array.from(map.values());
  };

  return (
    <div className="space-y-8">
      <PageBanner
        badge="Accompagnement"
        title="Mes étudiants accompagnés"
        description="Consultez les dossiers académiques, séries de baccalauréat et relevés de notes des élèves que vous suivez."
        visual={VISUALS.objCap}
      />

      <DataState
        query={query}
        emptyCondition={getUniqueStudents(query.data).length === 0}
        emptyMessage="Vous n'avez pas encore d'étudiants assignés ou ayant réservé une séance."
      >
        {(sessions) => {
          const students = getUniqueStudents(sessions);

          return (
            <Reveal>
              <div className="rounded-[28px] bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3E2EC]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#E4E3F5] text-[#2A2545] flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                        Liste des étudiants suivis
                      </h3>
                      <p className="text-xs text-ink-muted">
                        Cliquez sur "Dossier" pour ouvrir le relevé de notes et les orientations suggérées.
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F7] text-ink-muted border border-[#E3E2EC] self-start sm:self-auto">
                    {students.length} étudiant{students.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="rounded-2xl border border-[#E3E2EC] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F5F5F7]/70 hover:bg-[#F5F5F7]/70 border-b border-[#E3E2EC]">
                        <TableHead className="text-ink-dark font-medium">Nom de l'étudiant</TableHead>
                        <TableHead className="text-ink-dark font-medium">Email</TableHead>
                        <TableHead className="text-ink-dark font-medium">Étape</TableHead>
                        <TableHead className="text-ink-dark font-medium">Filière Bac</TableHead>
                        <TableHead className="text-ink-dark font-medium">Région</TableHead>
                        <TableHead className="text-ink-dark font-medium text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((st) => {
                        const user = st.user;
                        return (
                          <TableRow key={st.id} className="border-b border-[#E3E2EC] hover:bg-[#F5F5F7]/40 transition-colors">
                            <TableCell className="font-medium text-ink-dark text-sm">
                              {user ? `${user.firstName} ${user.lastName}` : `Étudiant #${st.id}`}
                            </TableCell>
                            <TableCell className="text-xs text-ink-muted font-mono">
                              {user?.email || '--'}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={st.stage} />
                            </TableCell>
                            <TableCell className="text-xs font-medium text-ink-dark">
                              {st.bacTrack || 'Non spécifiée'}
                            </TableCell>
                            <TableCell className="text-xs text-ink-muted">
                              {st.region || 'Maroc'}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedStudent(st)}
                                className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] h-8 px-3.5 text-xs font-medium gap-1.5"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Dossier
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Reveal>
          );
        }}
      </DataState>

      {/* Read-Only Profile & Grades Dialog */}
      <Dialog open={Boolean(selectedStudent)} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border border-[#E3E2EC] bg-white p-6 sm:p-8 shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl font-normal text-ink-dark tracking-tight">
              <GraduationCap className="h-5 w-5 text-[#6B5BD2]" />
              Dossier académique de {selectedStudent?.user?.firstName} {selectedStudent?.user?.lastName}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-ink-muted">
              Consultation en lecture seule du profil et du relevé de notes officiel.
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 pt-3">
              {/* Profile summary info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F5F5F7] border border-[#E3E2EC]/70 text-xs">
                <div>
                  <span className="text-ink-muted block text-[11px]">Étape</span>
                  <span className="font-medium text-ink-dark text-xs sm:text-sm">{selectedStudent.stage}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Filière Bac</span>
                  <span className="font-medium text-ink-dark text-xs sm:text-sm">{selectedStudent.bacTrack || '--'}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Année</span>
                  <span className="font-medium text-ink-dark text-xs sm:text-sm">{selectedStudent.bacYear || '--'}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Région</span>
                  <span className="font-medium text-ink-dark text-xs sm:text-sm">{selectedStudent.region || '--'}</span>
                </div>
              </div>

              {/* RIASEC Profile if exists */}
              {selectedStudent.riasecScores && Object.keys(selectedStudent.riasecScores).length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted uppercase tracking-wider">
                    <Compass className="h-3.5 w-3.5 text-[#6B5BD2]" />
                    <span>Profil psychométrique RIASEC</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                    {Object.entries(selectedStudent.riasecScores).map(([dim, score]) => (
                      <div key={dim} className="p-3 rounded-2xl border border-lavender-200/80 bg-[#E4E3F5]/30">
                        <span className="text-xs font-semibold text-[#2A2545] block">{dim}</span>
                        <span className="text-base font-medium text-ink-dark">{score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grades Table */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted uppercase tracking-wider">
                  <BookOpen className="h-3.5 w-3.5 text-[#6B5BD2]" />
                  <span>Relevé de notes officiel</span>
                </div>

                <div className="rounded-2xl border border-[#E3E2EC] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F5F5F7]/70 hover:bg-[#F5F5F7]/70 border-b border-[#E3E2EC]">
                        <TableHead className="text-ink-dark font-medium">Matière</TableHead>
                        <TableHead className="text-ink-dark font-medium">Période</TableHead>
                        <TableHead className="text-right text-ink-dark font-medium">Note (/20)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(!selectedStudent.grades || selectedStudent.grades.length === 0) ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-xs text-ink-muted">
                            Aucune note renseignée pour cet étudiant.
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedStudent.grades.map((g, idx) => (
                          <TableRow key={idx} className="border-b border-[#E3E2EC]">
                            <TableCell className="font-medium text-ink-dark text-sm">{g.subjectCode}</TableCell>
                            <TableCell className="text-xs text-ink-muted">{g.period}</TableCell>
                            <TableCell className="text-right font-medium text-ink-dark text-sm">
                              {g.gradeValue} / 20
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Students;
