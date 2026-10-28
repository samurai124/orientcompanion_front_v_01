import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Float, Reveal } from '@/components/motion';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est obligatoire'),
});

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      setErrorMessage(null);
      const user = await login(values);
      toast.success(`Bienvenue, ${user.firstName} !`);

      if (user.role === 'COUNSELOR') {
        navigate('/counselor/slots');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/users');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Identifiants invalides. Veuillez réessayer.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-auto py-8">
      {/* Two-column layout matching reference design language */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Lavender gradient visual card */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between rounded-[28px] lavender-card-gradient border border-lavender-200/80 p-10 relative overflow-hidden shadow-xs">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/40 blur-2xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-ink text-xs font-medium border border-white/60 shadow-2xs backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-lavender-600" />
              <span>Espace OrientCompanion</span>
            </div>

            <h2 className="text-3xl font-normal tracking-tight text-ink-dark leading-snug">
              Retrouvez votre parcours là où vous l'avez laissé.
            </h2>

            <p className="text-sm text-ink-muted leading-relaxed font-normal">
              Accédez à vos simulations de notes, vos résultats RIASEC et vos séances de mentorat.
            </p>
          </div>

          {/* Floating 3D Object */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="w-48 h-48">
              <Float distance={8} duration={6}>
                <VisualImage
                  visual={VISUALS.objCompass}
                  className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
                />
              </Float>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-lavender-200/70 text-xs text-ink-muted flex items-center justify-between">
            <span>Orientation Maroc</span>
            <span className="font-medium text-ink">Édition 2025–2026</span>
          </div>
        </div>

        {/* Right Column: Clean authentication form card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <Reveal>
            <div className="rounded-[28px] bg-white border border-border/80 p-8 sm:p-12 shadow-xs">
              <div className="space-y-2 mb-8">
                <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-ink-dark">
                  Connexion
                </h1>
                <p className="text-sm text-ink-muted font-normal">
                  Entrez vos identifiants pour accéder à votre tableau de bord
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-[#C75D6B]/10 border border-[#C75D6B]/20 text-[#9A3542] text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-ink-muted">
                    Adresse Email
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
                    <p className="text-xs font-medium text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-ink-muted">
                      Mot de passe
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 rounded-xl border-border bg-[#FBFBFC] focus:bg-white text-sm"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-xs font-medium text-destructive mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-full bg-[#1E1B33] text-white hover:bg-[#2A2545] font-medium text-sm transition-all duration-200 group flex items-center justify-center gap-2 shadow-2xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Connexion en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Se connecter</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-border/70 text-center">
                <p className="text-xs text-ink-muted">
                  Vous n'avez pas encore de compte ?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-ink hover:text-lavender-600 transition-colors underline-offset-4 hover:underline"
                  >
                    Créer un compte gratuitement
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

export default Login;
