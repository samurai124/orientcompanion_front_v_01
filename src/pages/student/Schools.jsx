import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import schoolsApi from '@/api/schools';
import { PageBanner } from '@/components/design/PageBanner';
import { DataState } from '@/components/common/DataState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Reveal } from '@/components/motion';
import { Building2, MapPin, Search, ArrowRight, GraduationCap } from 'lucide-react';

const CITIES = [
  'Toutes les villes',
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Oujda',
  'Kénitra',
  'Tétouan',
];

const TYPES = [
  { value: 'ALL', label: 'Tous les types' },
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Privé' },
  { value: 'SEMI_PUBLIC', label: 'Semi-public' },
];

export function Schools() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes');
  const [selectedType, setSelectedType] = useState('ALL');

  const queryParams = {
    search: searchTerm || undefined,
    city: selectedCity !== 'Toutes les villes' ? selectedCity : undefined,
    type: selectedType !== 'ALL' ? selectedType : undefined,
  };

  const query = useQuery({
    queryKey: ['schools', queryParams],
    queryFn: () => schoolsApi.getSchools(queryParams),
  });

  return (
    <div className="space-y-8">
      <PageBanner
        title="Catalogue des écoles supérieures"
        description="Explorez les établissements d'enseignement supérieur au Maroc, leurs filières d'excellence et leurs critères d'admission."
        visual={VISUALS.buildingColumns}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-ink-muted" />
          <Input
            placeholder="Rechercher par nom d'école ou acronyme (ex: ENSA, ENCG, FST)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border bg-white text-sm"
          />
        </div>

        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-border bg-white text-sm">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {CITIES.map((c) => (
              <SelectItem key={c} value={c} className="text-xs">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl border-border bg-white text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value} className="text-xs">
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataState
        query={query}
        emptyMessage="Aucun établissement ne correspond à vos critères de recherche."
      >
        {(schoolsData) => {
          const schools = Array.isArray(schoolsData)
            ? schoolsData
            : (schoolsData?.items || []);

          return (
            <div className="space-y-6">
              <div className="text-xs text-ink-muted px-1">
                {schools.length} établissement(s) répertorié(s)
              </div>

              {/* Grid of School Cards with Lavender Image Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((school, index) => {
                  const filieresCount = school.filieres?.length || 0;

                  return (
                    <Reveal key={school.id || index} delay={0.05 * Math.min(index, 6)}>
                      <div
                        onClick={() => navigate(`/student/schools/${school.id}`)}
                        className="group rounded-3xl bg-white border border-border/80 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col justify-between h-full"
                      >
                        {/* Lavender visual header */}
                        <div className="relative h-36 w-full lavender-card-gradient overflow-hidden flex items-center justify-center p-4">
                          <VisualImage
                            visual={VISUALS.buildingColumns}
                            className="max-h-28 object-contain object-bottom opacity-85 group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/80 text-ink-dark backdrop-blur-xs border border-white/60">
                              {school.type === 'PUBLIC' ? 'Public' : 'Privé'}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-xl font-normal text-ink-dark tracking-tight leading-snug group-hover:text-lavender-700 transition-colors">
                              {school.name}
                            </h3>

                            {school.city && (
                              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                                <MapPin className="h-3.5 w-3.5 text-lavender-600" />
                                <span>{school.city}</span>
                              </div>
                            )}

                            {school.description && (
                              <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed pt-1">
                                {school.description}
                              </p>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                            <span className="text-ink-muted font-medium">
                              {filieresCount} filière(s) proposée(s)
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-ink group-hover:text-lavender-600 transition-colors">
                              <span>Consulter</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          );
        }}
      </DataState>
    </div>
  );
}

export default Schools;
