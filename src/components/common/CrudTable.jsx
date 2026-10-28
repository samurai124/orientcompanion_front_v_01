import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { FormDialog } from './FormDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { Plus, Edit2, Trash2, Search, RefreshCw } from 'lucide-react';

export function CrudTable({
  title,
  description,
  columns = [],
  fields = [],
  items = [],
  isLoading = false,
  onCreate,
  onUpdate,
  onDelete,
  extraActions,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawList = Array.isArray(items) ? items : (items?.items || items?.data || []);

  // Filter items by search term across all string properties
  const filteredItems = rawList.filter((item) => {
    if (!searchTerm) return true;
    return Object.values(item).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await onUpdate(editingItem.id, formData);
      } else {
        await onCreate(formData);
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      setIsSubmitting(true);
      await onDelete(itemToDelete.id);
      setItemToDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {extraActions}
          {onCreate && (
            <Button size="sm" onClick={handleOpenCreate} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    {col.label}
                  </TableHead>
                ))}
                {(onUpdate || onDelete) && (
                  <TableHead className="w-24 text-center">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="py-8 text-center">
                    <div className="space-y-2 max-w-sm mx-auto">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="py-8 text-center text-xs text-muted-foreground">
                    Aucun enregistrement trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.render ? col.render(item) : item[col.key] || '--'}
                      </TableCell>
                    ))}

                    {(onUpdate || onDelete) && (
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {onUpdate && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(item)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setItemToDelete(item)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Generic Add / Edit Dialog */}
      <FormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingItem ? `Modifier : ${title}` : `Ajouter : ${title}`}
        fields={fields}
        initialValues={editingItem || {}}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Generic Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Confirmer la suppression ?"
        description="Cette action est définitive et supprimera l'élément sélectionné du catalogue."
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
      />
    </Card>
  );
}

export default CrudTable;
