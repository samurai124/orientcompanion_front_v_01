import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Float, Reveal } from '@/components/motion';
import { toast } from 'sonner';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit comporter au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une lettre et un chiffre'),
  role: z.enum(['STUDENT', 'COUNSELOR']),
  stage: z.enum(['PRE_BAC', 'POST_BAC', 'CONCOURS_PREP']).optional(),
  bacTrack: z.string().optional(),
  bacYear: z.coerce.number().int().min(2000).max(2030).optional(),
  region: z.string().optional(),
});

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

export function Register() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'STUDENT',
      stage: 'PRE_BAC',
      bacTrack: 'PC',
      bacYear: new Date().getFullYear(),
      region: 'Casablanca-Settat',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    try {
      setErrorMessage(null);
      const payload = { ...values };

      // Clean up fields if counselor
      if (values.role === 'COUNSELOR') {
        delete payload.stage;
        delete payload.bacTrack;
        delete payload.bacYear;
        delete payload.region;
      }

      const user = await authRegister(payload);
      toast.success('Votre compte a été créé avec succès !');

      if (user.role === 'COUNSELOR') {
        navigate('/counselor/slots');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de votre inscription.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-auto py-8">
      {/* Two-column layout matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Lavender gradient visual card */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between rounded-[28px] lavender-card-gradient border border-lavender-200/80 p-10 sticky top-24 shadow-xs">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-ink text-xs font-medium border border-white/60 shadow-2xs backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-lavender-600" />
              <span>Nouveau compte</span>
            </div>

            <h2 className="text-3xl font-normal tracking-tight text-ink-dark leading-snug">
              Semez les graines de votre future carrière.
            </h2>

            <p className="text-sm text-ink-muted leading-relaxed font-normal">
              Accédez immédiatement à vos recommandations RIASEC, aux fiches détaillées des concours et à votre planificateur de notes.
            </p>
          </div>

          {/* Floating 3D Object */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="w-48 h-48">
              <Float distance={8} duration={6}>
                <VisualImage
                  visual={VISUALS.objCap}
                  className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
                />
              </Float>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-lavender-200/70 text-xs text-ink-muted">
            <div className="flex items-center gap-2 text-ink-dark">
              <CheckCircle2 className="w-4 h-4 text-[#4C9A7A] shrink-0" />
              <span>Gratuit et sans engagement</span>
            </div>
            <div className="flex items-center gap-2 text-ink-dark">
              <CheckCircle2 className="w-4 h-4 text-[#4C9A7A] shrink-0" />
              <span>Catalogue officiel des écoles supérieures marocaines</span>
            </div>
          </div>
        </div>

        {/* Right Column: Registration form card */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="rounded-[28px] bg-white border border-border/80 p-8 sm:p-12 shadow-xs">
              <div className="space-y-2 mb-8">
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-ink-dark">
                  Inscription
                </h1>
                <p className="text-sm text-ink-muted font-normal">
                  Créez votre compte OrientCompanion en quelques instants
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-[#C75D6B]/10 border border-[#C75D6B]/20 text-[#9A3542] text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Role selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-ink-muted">Je m'inscris en tant que :</Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-2 gap-3"
                      >
                        <Label
                          htmlFor="role-student"
                          className={`flex flex-col items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                            field.value === 'STUDENT'
                              ? 'border-ink bg-lavender-50/70 shadow-2xs'
                              : 'border-border/80 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <RadioGroupItem value="STUDENT" id="role-student" className="sr-only" />
                          <span className="font-medium text-sm text-ink-dark">Étudiant / Lycéen</span>
                          <span className="text-[11px] text-ink-muted text-center mt-1">
                            Pour préparer mon orientation
                          </span>
                        </Label>

                        <Label
                          htmlFor="role-counselor"
                          className={`flex flex-col items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                            field.value === 'COUNSELOR'
                              ? 'border-ink bg-lavender-50/70 shadow-2xs'
                              : 'border-border/80 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <RadioGroupItem value="COUNSELOR" id="role-counselor" className="sr-only" />
                          <span className="font-medium text-sm text-ink-dark">Conseiller</span>
                          <span className="text-[11px] text-ink-muted text-center mt-1">
                            Pour accompagner les étudiants
                          </span>
                        </Label>
                      </RadioGroup>
                    )}
                  />
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs font-medium text-ink-muted">
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Hamza"
                      className="h-11 rounded-xl border-border bg-[#FBFBFC] focus:bg-white text-sm"
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="text-xs font-medium text-destructive mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-medium text-ink-muted">
                      Nom
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="El Alami"
                      className="h-11 rounded-xl border-border bg-[#FBFBFC] focus:bg-white text-sm"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="text-xs font-medium text-destructive mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-ink-muted">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.ma"
                    autoComplete="email"
                    className="h-11 rounded-xl border-border bg-[#FBFBFC] focus:bg-white text-sm"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs font-medium text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-ink-muted">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Au moins 8 caractères (lettres & chiffres)"
                    autoComplete="new-password"
                    className="h-11 rounded-xl border-border bg-[#FBFBFC] focus:bg-white text-sm"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-xs font-medium text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Student specific fields */}
                {selectedRole === 'STUDENT' && (
                  <div className="space-y-4 pt-4 border-t border-border/70">
                    <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                      Informations académiques
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="stage" className="text-xs font-medium text-ink-muted">
                          Étape actuelle
                        </Label>
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
                        <Label htmlFor="bacTrack" className="text-xs font-medium text-ink-muted">
                          Filière Bac
                        </Label>
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="bacYear" className="text-xs font-medium text-ink-muted">
                          Année du Bac
                        </Label>
                        <Input
                          id="bacYear"
                          type="number"
                          placeholder="2025"
                          className="h-11 rounded-xl border-border bg-[#FBFBFC] focus:bg-white text-sm"
                          {...register('bacYear')}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="region" className="text-xs font-medium text-ink-muted">
                          Région
                        </Label>
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
                    </div>
                  </div>
                )}

                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] font-medium text-sm transition-all duration-200 group flex items-center justify-center gap-2 shadow-2xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Création du compte...</span>
                      </>
                    ) : (
                      <>
                        <span>Créer mon compte</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-border/70 text-center">
                <p className="text-xs text-ink-muted">
                  Vous avez déjà un compte ?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-ink hover:text-lavender-600 transition-colors underline-offset-4 hover:underline"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
}

export default Register;
