import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationsApi from '@/api/notifications';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Target,
  GraduationCap,
  FileCheck2,
  Trophy,
  Users,
  CalendarDays,
  CalendarCheck,
  FolderKanban,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  User,
  Crown,
  CheckCheck,
  Menu,
  ArrowRight,
  Sparkle,
} from 'lucide-react';
import { toast } from 'sonner';

export function Topbar() {
  const { user, role, isPremium, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch notifications (only when user is authenticated)
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
    refetchInterval: 30000,
    enabled: Boolean(user),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Toutes les notifications sont marquées comme lues');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la mise à jour des notifications');
    },
  });

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.readAt && !n.read).length
    : 0;

  const latestNotifications = Array.isArray(notifications)
    ? notifications.slice(0, 5)
    : [];

  const handleLogout = async () => {
    await logout();
    toast.info('Vous êtes déconnecté.');
    navigate('/login');
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  // Navigation Links configuration
  const studentLinks = [
    { to: '/student/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { to: '/student/test', label: 'TEST', icon: Compass },
    { to: '/student/recommendations', label: 'RECOMMANDATIONS', icon: Sparkles },
    { to: '/student/goals', label: 'OBJECTIFS', icon: Target },
    { to: '/student/schools', label: 'ÉCOLES', icon: GraduationCap },
    { to: '/student/applications', label: 'CANDIDATURES', icon: FileCheck2 },
    {
      to: '/student/concours',
      label: 'CONCOURS',
      icon: Trophy,
      badge: isPremium ? null : 'PRO',
    },
    { to: '/student/mentorship', label: 'MENTORAT', icon: Users },
  ];

  const counselorLinks = [
    { to: '/counselor/slots', label: 'DISPONIBILITÉS', icon: CalendarDays },
    { to: '/counselor/sessions', label: 'SÉANCES', icon: CalendarCheck },
    { to: '/counselor/students', label: 'ÉTUDIANTS', icon: Users },
  ];

  const adminLinks = [
    { to: '/admin/users', label: 'UTILISATEURS', icon: Users },
    { to: '/admin/catalog', label: 'CATALOGUE', icon: FolderKanban },
    { to: '/admin/stats', label: 'STATISTIQUES', icon: BarChart3 },
  ];

  const isLandingPage = location.pathname === '/';

  let navLinks = [];
  let homeRoute = '/';
  if (role === 'STUDENT') {
    navLinks = studentLinks;
    homeRoute = '/student/dashboard';
  } else if (role === 'COUNSELOR') {
    navLinks = counselorLinks;
    homeRoute = '/counselor/slots';
  } else if (role === 'ADMIN') {
    navLinks = adminLinks;
    homeRoute = '/admin/users';
  }

  // Active check helper
  const isItemActive = (to) => {
    if (location.pathname === to) return true;
    if (
      to !== '/student/dashboard' &&
      to !== '/counselor/slots' &&
      to !== '/admin/users' &&
      location.pathname.startsWith(to)
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F7F8FA]/95 backdrop-blur-md border-b border-neutral-200/70 transition-all select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 py-2.5 flex items-center justify-between gap-4">
          
          {/* LEFT: Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile menu trigger (hidden on landing page) */}
            {!isLandingPage && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden h-10 w-10 rounded-xl bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <Link
              to={isLandingPage ? '/' : homeRoute}
              className="flex items-center gap-3 transition-transform active:scale-95"
            >
              <Logo size="md" />
            </Link>
          </div>

          {/* CENTER: Floating Pill Navigation Bar (Desktop) - Hidden on landing page */}
          {!isLandingPage && navLinks.length > 0 && (
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-2">
              <div className="bg-[#E9ECF0] border border-neutral-200/80 p-1 rounded-2xl shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.to);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={cn(
                        'flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] xl:text-xs font-bold tracking-wider uppercase transition-all duration-150 shrink-0 whitespace-nowrap',
                        active
                          ? 'bg-[#1F2124] text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-white' : 'text-neutral-500')} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[9px] font-black px-1.5 py-0.5 rounded-full',
                            active
                              ? 'bg-amber-400 text-neutral-900'
                              : 'bg-amber-100 text-amber-700'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </nav>
          )}

          {/* RIGHT: Actions */}
          {isLandingPage || !user ? (
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 rounded-full text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-3.5 sm:px-5 py-2 rounded-full bg-[#1F2124] text-white text-xs font-bold shadow-sm hover:bg-[#2A2545] transition-all flex items-center gap-1.5 group"
              >
                <span>S'inscrire</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 shrink-0">

              {/* Settings Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Paramètres"
                    className="h-10 w-10 rounded-xl bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-lg border-neutral-200">
                  <DropdownMenuLabel className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1.5">
                    Paramètres
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {role === 'STUDENT' && (
                    <DropdownMenuItem
                      onClick={() => navigate('/student/profile')}
                      className="rounded-lg cursor-pointer text-xs font-medium py-2"
                    >
                      <User className="mr-2 h-4 w-4 text-neutral-500" />
                      <span>Mon profil & Préférences</span>
                    </DropdownMenuItem>
                  )}
                  {role === 'STUDENT' && !isPremium && (
                    <DropdownMenuItem
                      onClick={() => navigate('/student/concours')}
                      className="rounded-lg cursor-pointer text-xs font-medium py-2 text-amber-600 focus:text-amber-700"
                    >
                      <Crown className="mr-2 h-4 w-4 text-amber-500" />
                      <span>Passer à Premium (299 DH)</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => toast.info('Paramètres système à jour.')}
                    className="rounded-lg cursor-pointer text-xs font-medium py-2"
                  >
                    <Sparkle className="mr-2 h-4 w-4 text-neutral-500" />
                    <span>Préférences d'affichage</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg cursor-pointer text-xs font-medium py-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="h-10 w-10 rounded-xl bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 relative transition-colors"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 shadow-lg border-neutral-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-50/70 border-b border-neutral-200/80">
                    <span className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                        onClick={() => markAllMutation.mutate()}
                        disabled={markAllMutation.isPending}
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
                    {latestNotifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-neutral-500">
                        Aucune notification pour le moment.
                      </div>
                    ) : (
                      latestNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            'p-3.5 text-xs transition-colors hover:bg-neutral-50/80',
                            !n.readAt && !n.read ? 'bg-primary/5 font-medium' : ''
                          )}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <p className="font-semibold text-neutral-900">{n.title}</p>
                            <span className="text-[10px] text-neutral-400 shrink-0">
                              {formatDate(n.createdAt)}
                            </span>
                          </div>
                          <p className="text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                            {n.body || n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Avatar Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Menu profil"
                    className="h-10 w-10 rounded-xl overflow-hidden border border-neutral-200/80 shadow-sm hover:ring-2 hover:ring-neutral-300 transition-all flex items-center justify-center bg-white cursor-pointer"
                  >
                    <Avatar className="h-full w-full rounded-none">
                      {user?.avatarUrl && (
                        <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                      )}
                      <AvatarFallback className="rounded-none bg-[#1F2124] text-white font-bold text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-lg border-neutral-200">
                  <DropdownMenuLabel className="font-normal px-2 py-2">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold leading-none text-neutral-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        {isPremium && (
                          <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <p className="text-xs leading-none text-neutral-500">
                        {user?.email}
                      </p>
                      <div className="pt-1.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700"
                        >
                          {role === 'STUDENT'
                            ? 'Étudiant'
                            : role === 'COUNSELOR'
                            ? 'Conseiller'
                            : 'Administrateur'}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  {/* Non-premium student upgrade box */}
                  {role === 'STUDENT' && !isPremium && (
                    <div className="my-1.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-700">
                        <Crown className="h-3.5 w-3.5 text-amber-600" />
                        <span>Passez à Premium</span>
                      </div>
                      <p className="text-[11px] text-amber-900/80 leading-snug">
                        Accédez aux concours et simulateurs illimités pour 299 DH.
                      </p>
                      <Link
                        to="/student/concours"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline"
                      >
                        En savoir plus <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}

                  <DropdownMenuSeparator className="my-1" />

                  {role === 'STUDENT' && (
                    <DropdownMenuItem
                      onClick={() => navigate('/student/profile')}
                      className="rounded-lg cursor-pointer text-xs font-medium py-2"
                    >
                      <User className="mr-2 h-4 w-4 text-neutral-500" />
                      <span>Mon profil</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg cursor-pointer text-xs font-medium py-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE SHEET MENU */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-[#F7F8FA] flex flex-col">
          <SheetHeader className="p-4 border-b border-neutral-200/70 bg-white">
            <SheetTitle className="text-left">
              <Logo size="sm" />
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1">
              Navigation
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all',
                    active
                      ? 'bg-[#1F2124] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('h-4 w-4', active ? 'text-white' : 'text-neutral-500')} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[9px] font-black px-1.5 py-0.5 rounded-full',
                        active
                          ? 'bg-amber-400 text-neutral-900'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom mobile drawer actions */}
          {!user ? (
            <div className="p-4 border-t border-neutral-200/70 bg-white space-y-2 shrink-0">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F2124] text-white text-xs font-bold shadow-sm hover:bg-[#2A2545] transition-all"
              >
                <span>S'inscrire gratuitement</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs font-bold hover:bg-neutral-100 transition-colors"
              >
                Connexion
              </Link>
            </div>
          ) : (
            <>
              {role === 'STUDENT' && !isPremium && (
                <div className="p-4 border-t border-neutral-200/70 bg-white shrink-0">
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-700">
                      <Crown className="h-3.5 w-3.5 text-amber-600" />
                      <span>Passez à Premium</span>
                    </div>
                    <p className="text-[11px] text-amber-900/80">
                      Accédez aux concours et simulateurs illimités pour 299 DH.
                    </p>
                    <Link
                      to="/student/concours"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline"
                    >
                      Découvrir les avantages &rarr;
                    </Link>
                  </div>
                </div>
              )}
              <div className="p-3 border-t border-neutral-200/70 bg-white shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Topbar;