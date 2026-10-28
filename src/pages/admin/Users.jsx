import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/api/admin';
import { formatDate } from '@/lib/format';
import { PageBanner } from '@/components/design/PageBanner';
import { VISUALS } from '@/lib/visuals';
import { Reveal } from '@/components/motion';
import { DataState } from '@/components/common/DataState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users as UsersIcon, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function Users() {
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [userToToggle, setUserToToggle] = useState(null);

  const queryParams = {
    role: roleFilter !== 'ALL' ? roleFilter : undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    search: searchQuery.trim() || undefined,
  };

  const query = useQuery({
    queryKey: ['adminUsers', queryParams],
    queryFn: () => adminApi.getUsers(queryParams),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => adminApi.updateUserStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setUserToToggle(null);
      toast.success('Statut du compte utilisateur mis à jour.');
    },
    onError: (err) => {
      toast.error(err.message || 'Erreur lors de la modification du statut.');
    },
  });

  const handleConfirmToggle = () => {
    if (!userToToggle) return;
    const newStatus = userToToggle.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    toggleStatusMutation.mutate({
      id: userToToggle.id,
      newStatus,
    });
  };

  return (
    <div className="space-y-8">
      <PageBanner
        badge="Administration"
        title="Gestion des comptes utilisateurs"
        description="Supervisez les comptes étudiants, conseillers d'orientation et administrateurs, et contrôlez leurs droits d'accès."
        visual={VISUALS.objCompass}
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-ink-muted" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white text-xs sm:text-sm"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white text-xs sm:text-sm">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="STUDENT">Étudiants</SelectItem>
            <SelectItem value="COUNSELOR">Conseillers</SelectItem>
            <SelectItem value="ADMIN">Administrateurs</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-[#E3E2EC] focus:border-[#6B5BD2] bg-white text-xs sm:text-sm">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="ACTIVE">Actifs</SelectItem>
            <SelectItem value="SUSPENDED">Suspendus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataState query={query} emptyMessage="Aucun utilisateur ne correspond à vos filtres.">
        {(usersResponse) => {
          const userList = Array.isArray(usersResponse)
            ? usersResponse
            : usersResponse?.items || usersResponse?.data || [];

          return (
            <Reveal>
              <div className="rounded-[28px] bg-white border border-[#E3E2EC] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3E2EC]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#E4E3F5] text-[#2A2545] flex items-center justify-center">
                      <UsersIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-ink-dark tracking-tight">
                        Utilisateurs inscrits
                      </h3>
                      <p className="text-xs text-ink-muted">
                        Visualisez et gérez les comptes actifs et suspendus sur la plateforme.
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F7] text-ink-muted border border-[#E3E2EC] self-start sm:self-auto">
                    {userList.length} compte{userList.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="rounded-2xl border border-[#E3E2EC] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F5F5F7]/70 hover:bg-[#F5F5F7]/70 border-b border-[#E3E2EC]">
                        <TableHead className="w-16 text-ink-dark font-medium">ID</TableHead>
                        <TableHead className="text-ink-dark font-medium">Utilisateur</TableHead>
                        <TableHead className="text-ink-dark font-medium">Email</TableHead>
                        <TableHead className="text-ink-dark font-medium">Rôle</TableHead>
                        <TableHead className="text-ink-dark font-medium">Statut</TableHead>
                        <TableHead className="text-ink-dark font-medium">Date d'inscription</TableHead>
                        <TableHead className="text-center text-ink-dark font-medium">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userList.map((u) => {
                        const isActive = u.status === 'ACTIVE';

                        return (
                          <TableRow key={u.id} className="border-b border-[#E3E2EC] hover:bg-[#F5F5F7]/40 transition-colors">
                            <TableCell className="font-mono text-xs text-ink-muted">
                              #{u.id}
                            </TableCell>
                            <TableCell className="font-medium text-ink-dark text-sm">
                              {u.firstName} {u.lastName}
                            </TableCell>
                            <TableCell className="text-xs text-ink-muted font-mono">
                              {u.email}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={u.role} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={u.status} />
                            </TableCell>
                            <TableCell className="text-xs text-ink-muted">
                              {formatDate(u.createdAt)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                variant={isActive ? 'outline' : 'default'}
                                onClick={() => setUserToToggle(u)}
                                className={`rounded-full h-8 text-xs px-3.5 gap-1.5 font-medium transition-all ${
                                  isActive
                                    ? 'border-[#C75D6B]/30 text-[#C75D6B] hover:bg-[#C75D6B]/10'
                                    : 'bg-[#4C9A7A] hover:bg-[#3d8366] text-white'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <ShieldAlert className="h-3 w-3" />
                                    Suspendre
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="h-3 w-3" />
                                    Activer
                                  </>
                                )}
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

      {/* Suspend / Activate Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(userToToggle)}
        onOpenChange={(open) => !open && setUserToToggle(null)}
        title={
          userToToggle?.status === 'ACTIVE'
            ? `Suspendre le compte de ${userToToggle?.firstName} ${userToToggle?.lastName} ?`
            : `Réactiver le compte de ${userToToggle?.firstName} ${userToToggle?.lastName} ?`
        }
        description={
          userToToggle?.status === 'ACTIVE'
            ? 'L’utilisateur ne pourra plus se connecter à la plateforme ni accéder à ses données jusqu’à réactivation.'
            : 'L’utilisateur retrouvera l’accès complet à son espace personnel.'
        }
        confirmText={userToToggle?.status === 'ACTIVE' ? 'Suspendre' : 'Réactiver'}
        variant={userToToggle?.status === 'ACTIVE' ? 'destructive' : 'default'}
        onConfirm={handleConfirmToggle}
        isLoading={toggleStatusMutation.isPending}
      />
    </div>
  );
}

export default Users;
