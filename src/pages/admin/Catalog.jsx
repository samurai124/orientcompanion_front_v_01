import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/api/admin';
import schoolsApi from '@/api/schools';
import concoursApi from '@/api/concours';
import { PageBanner } from '@/components/design/PageBanner';
import { VISUALS } from '@/lib/visuals';
import { Reveal } from '@/components/motion';
import { CrudTable } from '@/components/common/CrudTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, FileCode2, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function Catalog() {
  const queryClient = useQueryClient();

  // Bulk Import state
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkConcoursId, setBulkConcoursId] = useState('1');

  // Queries
  const { data: schools = [], isLoading: loadingSchools } = useQuery({
    queryKey: ['schools'],
    queryFn: () => schoolsApi.getSchools({}),
  });

  const { data: filieres = [], isLoading: loadingFilieres } = useQuery({
    queryKey: ['filieres'],
    queryFn: () => schoolsApi.getFilieres({}),
  });

  const schoolList = Array.isArray(schools) ? schools : (schools?.items || []);
  const filiereList = Array.isArray(filieres) ? filieres : (filieres?.items || []);

  const { data: concoursList = [], isLoading: loadingConcours } = useQuery({
    queryKey: ['concoursList'],
    queryFn: concoursApi.getConcours,
  });

  const { data: questionsResp, isLoading: loadingQuestions } = useQuery({
    queryKey: ['questionBank'],
    queryFn: () => concoursApi.getQuestionBank({ limit: 50 }),
  });
  const questions = questionsResp?.items || questionsResp?.data || [];

  // Bulk Import Mutation
  const bulkImportMutation = useMutation({
    mutationFn: (questionsArray) => adminApi.bulkImportQuestions(questionsArray),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionBank'] });
      setBulkDialogOpen(false);
      setBulkJson('');
      toast.success('Questions importées avec succès !');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de l’importation JSON des questions.');
    },
  });

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) {
        toast.error('Le format JSON doit être un tableau d’objets questions.');
        return;
      }
      bulkImportMutation.mutate({
        concoursId: Number(bulkConcoursId || 1),
        questions: parsed,
      });
    } catch {
      toast.error('JSON syntaxiquement invalide. Veuillez vérifier votre saisie.');
    }
  };

  return (
    <div className="space-y-8">
      <PageBanner
        badge="Référentiel académique"
        title="Catalogue & Banque d'exercices"
        description="Administrez les fiches écoles, les parcours post-bac et la banque de questions des concours d'excellence."
        visual={VISUALS.buildingColumns}
        action={
          <Button
            onClick={() => setBulkDialogOpen(true)}
            className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all duration-300 gap-2"
          >
            <Upload className="h-4 w-4" />
            Import JSON en masse
          </Button>
        }
      />

      <Tabs defaultValue="schools" className="w-full space-y-6">
        <div className="flex justify-start">
          <TabsList className="rounded-full bg-[#E4E3F5]/40 border border-[#E3E2EC] p-1.5 h-auto flex flex-wrap gap-1">
            <TabsTrigger
              value="schools"
              className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
            >
              Écoles ({schoolList.length})
            </TabsTrigger>
            <TabsTrigger
              value="filieres"
              className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
            >
              Filières ({filiereList.length})
            </TabsTrigger>
            <TabsTrigger
              value="conditions"
              className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
            >
              Conditions
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="concours"
              className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
            >
              Concours ({concoursList.length})
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-[#2A2545] data-[state=active]:text-white transition-all"
            >
              Questions ({questions.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Écoles */}
        <TabsContent value="schools" className="outline-hidden">
          <div className="rounded-[28px] overflow-hidden bg-white border border-[#E3E2EC] shadow-xs">
            <CrudTable
              title="Établissements d'enseignement supérieur"
              description="Écoles d'ingénieurs, de commerce, facultés et universités marocaines."
              items={schoolList}
              isLoading={loadingSchools}
              columns={[
                { key: 'name', label: 'Nom de l’école' },
                { key: 'acronym', label: 'Sigle' },
                { key: 'city', label: 'Ville' },
                {
                  key: 'type',
                  label: 'Type',
                  render: (row) => (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.type === 'PUBLIC'
                          ? 'bg-[#E4E3F5] text-ink-dark'
                          : 'bg-[#F5F5F7] text-ink-muted border border-[#E3E2EC]'
                      }`}
                    >
                      {row.type}
                    </span>
                  ),
                },
              ]}
              fields={[
                { name: 'name', label: 'Nom complet', required: true },
                { name: 'acronym', label: 'Sigle / Acronyme (ex: ENSA)' },
                { name: 'city', label: 'Ville', required: true },
                { name: 'region', label: 'Région (ex: Casablanca-Settat, Rabat-Salé-Kénitra)', required: true },
                {
                  name: 'type',
                  label: 'Type d’établissement',
                  type: 'select',
                  options: [
                    { value: 'PUBLIC', label: 'Public' },
                    { value: 'PRIVATE', label: 'Privé' },
                    { value: 'SEMI_PUBLIC', label: 'Semi-public' },
                  ],
                  required: true,
                },
                { name: 'website', label: 'Site web URL' },
                { name: 'description', label: 'Description', type: 'textarea' },
              ]}
              onCreate={async (data) => {
                await adminApi.createSchool({
                  ...data,
                  region: data.region || 'Casablanca-Settat',
                });
                queryClient.invalidateQueries({ queryKey: ['schools'] });
                toast.success('École créée.');
              }}
              onUpdate={async (id, data) => {
                await adminApi.updateSchool(id, data);
                queryClient.invalidateQueries({ queryKey: ['schools'] });
                toast.success('École mise à jour.');
              }}
              onDelete={async (id) => {
                await adminApi.deleteSchool(id);
                queryClient.invalidateQueries({ queryKey: ['schools'] });
                toast.success('École supprimée.');
              }}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Filières */}
        <TabsContent value="filieres" className="outline-hidden">
          <div className="rounded-[28px] overflow-hidden bg-white border border-[#E3E2EC] shadow-xs">
            <CrudTable
              title="Filières de formation"
              description="Parcours universitaires et spécialisations proposées."
              items={filiereList}
              isLoading={loadingFilieres}
              columns={[
                { key: 'name', label: 'Nom de la filière' },
                { key: 'level', label: 'Niveau' },
                {
                  key: 'requiredBacTracks',
                  label: 'Bacs éligibles',
                  render: (row) => (
                    <span className="text-xs text-ink-muted">
                      {Array.isArray(row.requiredBacTracks) ? row.requiredBacTracks.join(', ') : 'Tous'}
                    </span>
                  ),
                },
              ]}
              fields={[
                { name: 'name', label: 'Intitulé de la filière', required: true },
                { name: 'schoolId', label: 'ID de l’école associée', type: 'number', required: true },
                {
                  name: 'level',
                  label: 'Niveau d’études',
                  type: 'select',
                  options: [
                    { value: 'BAC+5', label: 'Bac+5 (Diplôme d’Ingénieur / Master)' },
                    { value: 'BAC+3', label: 'Bac+3 (Licence)' },
                    { value: 'BAC+2', label: 'Bac+2 (DUT / BTS)' },
                  ],
                  required: true,
                },
                { name: 'description', label: 'Description', type: 'textarea' },
              ]}
              onCreate={async (data) => {
                await adminApi.createFiliere({
                  ...data,
                  level: data.level || 'BAC+5',
                  requiredBacTracks: ['SM_A', 'SM_B', 'PC', 'SVT'],
                  riasecProfile: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
                  tags: [],
                });
                queryClient.invalidateQueries({ queryKey: ['filieres'] });
                toast.success('Filière créée.');
              }}
              onUpdate={async (id, data) => {
                await adminApi.updateFiliere(id, data);
                queryClient.invalidateQueries({ queryKey: ['filieres'] });
                toast.success('Filière mise à jour.');
              }}
              onDelete={async (id) => {
                await adminApi.deleteFiliere(id);
                queryClient.invalidateQueries({ queryKey: ['filieres'] });
                toast.success('Filière supprimée.');
              }}
            />
          </div>
        </TabsContent>

        {/* Tab 3: Conditions d'admission */}
        <TabsContent value="conditions" className="outline-hidden">
          <div className="rounded-[28px] overflow-hidden bg-white border border-[#E3E2EC] shadow-xs">
            <CrudTable
              title="Conditions et seuils d'admissibilité"
              description="Moyennes minimales et coefficients de présélection."
              items={[]}
              isLoading={false}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'filiereId', label: 'Filière ID' },
                { key: 'minAverage', label: 'Seuil minimum (/20)' },
                { key: 'year', label: 'Année' },
              ]}
              fields={[
                { name: 'filiereId', label: 'Filière ID', type: 'number', required: true },
                { name: 'minAverage', label: 'Moyenne minimale (/20)', type: 'number', step: '0.1', required: true },
                { name: 'year', label: 'Année de référence', type: 'number', required: true },
              ]}
              onCreate={async (data) => {
                await adminApi.createRequirement({
                  ...data,
                  subjectWeights: { MATH: 0.5, PC: 0.5 },
                });
                toast.success('Condition d’admission ajoutée.');
              }}
              onDelete={async (id) => {
                await adminApi.deleteRequirement(id);
                toast.success('Condition supprimée.');
              }}
            />
          </div>
        </TabsContent>

        {/* Tab 4: Documents requis */}
        <TabsContent value="documents" className="outline-hidden">
          <div className="rounded-[28px] overflow-hidden bg-white border border-[#E3E2EC] shadow-xs">
            <CrudTable
              title="Documents administratifs requis"
              description="Pièces demandées pour constituer les dossiers de candidature."
              items={[]}
              isLoading={false}
              columns={[
                { key: 'name', label: 'Nom du document' },
                { key: 'schoolId', label: 'École ID' },
                {
                  key: 'isMandatory',
                  label: 'Obligation',
                  render: (row) => (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.isMandatory
                          ? 'bg-[#E4E3F5] text-ink-dark'
                          : 'bg-[#F5F5F7] text-ink-muted border border-[#E3E2EC]'
                      }`}
                    >
                      {row.isMandatory ? 'Obligatoire' : 'Facultatif'}
                    </span>
                  ),
                },
              ]}
              fields={[
                { name: 'name', label: 'Nom de la pièce', required: true },
                { name: 'schoolId', label: 'École ID', type: 'number', required: true },
                {
                  name: 'isMandatory',
                  label: 'Caractère obligatoire',
                  type: 'select',
                  options: [
                    { value: 'true', label: 'Obligatoire' },
                    { value: 'false', label: 'Facultatif' },
                  ],
                  required: true,
                },
                { name: 'howToObtain', label: 'Comment l’obtenir ?', type: 'textarea' },
              ]}
              onCreate={async (data) => {
                await adminApi.createDocument({
                  ...data,
                  isMandatory: data.isMandatory === 'true',
                });
                toast.success('Document requis configuré.');
              }}
              onDelete={async (id) => {
                await adminApi.deleteDocument(id);
                toast.success('Document supprimé.');
              }}
            />
          </div>
        </TabsContent>

        {/* Tab 5: Concours */}
        <TabsContent value="concours" className="outline-hidden">
          <div className="rounded-[28px] overflow-hidden bg-white border border-[#E3E2EC] shadow-xs">
            <CrudTable
              title="Concours nationaux répertoriés"
              description="Banques d'épreuves et examens blancs associés."
              items={concoursList}
              isLoading={loadingConcours}
              columns={[
                { key: 'name', label: 'Nom du concours' },
                {
                  key: 'subjects',
                  label: 'Matières',
                  render: (row) => (
                    <div className="flex flex-wrap gap-1">
                      {(row.subjects || []).map((s) => (
                        <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E4E3F5] text-ink-dark">
                          {s}
                        </span>
                      ))}
                    </div>
                  ),
                },
                { key: 'examDate', label: 'Date épreuve' },
              ]}
              fields={[
                { name: 'name', label: 'Nom du concours (ex: CNC, ENSA)', required: true },
                { name: 'description', label: 'Description', type: 'textarea' },
              ]}
              onCreate={async (data) => {
                await adminApi.createConcours({
                  ...data,
                  subjects: ['MATH', 'PC'],
                });
                queryClient.invalidateQueries({ queryKey: ['concoursList'] });
                toast.success('Concours ajouté.');
              }}
            />
          </div>
        </TabsContent>

        {/* Tab 6: Questions */}
        <TabsContent value="questions" className="outline-hidden">
          <div className="rounded-[28px] overflow-hidden bg-white border border-[#E3E2EC] shadow-xs">
            <CrudTable
              title="Banque de questions pour examens blancs"
              description="Questions à choix multiples indexées par matière, thème et difficulté."
              items={questions}
              isLoading={loadingQuestions}
              extraActions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkDialogOpen(true)}
                  className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] text-xs h-8 px-3.5 gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Import JSON en masse
                </Button>
              }
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'subjectCode', label: 'Matière' },
                { key: 'topic', label: 'Thème' },
                {
                  key: 'difficulty',
                  label: 'Difficulté',
                  render: (row) => (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.difficulty === 'HARD'
                          ? 'bg-[#C75D6B]/15 text-[#C75D6B]'
                          : row.difficulty === 'MEDIUM'
                          ? 'bg-[#D9A441]/15 text-[#D9A441]'
                          : 'bg-[#4C9A7A]/15 text-[#4C9A7A]'
                      }`}
                    >
                      {row.difficulty}
                    </span>
                  ),
                },
                {
                  key: 'statement',
                  label: 'Énoncé',
                  render: (row) => (
                    <span className="line-clamp-1 max-w-md text-ink-dark text-xs">{row.statement}</span>
                  ),
                },
              ]}
              fields={[
                { name: 'concoursId', label: 'ID du concours', type: 'number', required: true },
                { name: 'subjectCode', label: 'Code matière (ex: MATH, PC)', required: true },
                { name: 'topic', label: 'Thème spécifique', required: true },
                {
                  name: 'difficulty',
                  label: 'Difficulté',
                  type: 'select',
                  options: [
                    { value: 'EASY', label: 'Facile' },
                    { value: 'MEDIUM', label: 'Moyen' },
                    { value: 'HARD', label: 'Difficile' },
                  ],
                  required: true,
                },
                { name: 'statement', label: 'Énoncé complet', type: 'textarea', required: true },
                { name: 'correctOption', label: 'Index de la bonne réponse (0, 1, 2...)', type: 'number', required: true },
              ]}
              onCreate={async (data) => {
                await adminApi.createQuestion({
                  ...data,
                  concoursId: Number(data.concoursId || 1),
                  correctOption: Number(data.correctOption || 0),
                  options: ['Option A', 'Option B', 'Option C', 'Option D'],
                });
                queryClient.invalidateQueries({ queryKey: ['questionBank'] });
                toast.success('Question créée.');
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk JSON Import Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-[28px] border border-[#E3E2EC] bg-white p-6 sm:p-8 shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl font-normal text-ink-dark tracking-tight">
              <FileCode2 className="h-5 w-5 text-[#6B5BD2]" />
              Importation de questions au format JSON
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Collez un tableau JSON d'objets contenant : <code>subjectCode</code>, <code>topic</code>, <code>statement</code>, <code>options</code> (tableau), <code>correctOption</code> (index numérique) et <code>explanation</code>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBulkSubmit} className="space-y-4 pt-3">
            <Textarea
              placeholder={`[
  {
    "concoursId": 1,
    "subjectCode": "MATH",
    "topic": "Intégrales et primitives",
    "difficulty": "MEDIUM",
    "statement": "Quelle est la primitive de e^(2x) ?",
    "options": ["e^(2x)", "2e^(2x)", "(1/2)e^(2x)", "e^x"],
    "correctOption": 2,
    "explanation": "La dérivée de (1/2)e^(2x) est e^(2x)."
  }
]`}
              rows={10}
              className="font-mono text-xs rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-[#F5F5F7]/50"
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
            />

            <DialogFooter className="flex flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBulkDialogOpen(false)}
                disabled={bulkImportMutation.isPending}
                className="rounded-full border-[#E3E2EC] text-ink-dark hover:bg-[#F5F5F7] px-4"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={bulkImportMutation.isPending}
                className="rounded-full bg-[#2A2545] hover:bg-[#1E1B33] text-white px-5 gap-2 font-medium"
              >
                {bulkImportMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Lancer l'importation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Catalog;
