
'use client';

import * as React from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Inbox,
  Upload,
  Trash2,
  Package,
  PackageOpen,
  Edit,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
  Barcode as BarcodeIcon,
  TrendingDown,
  Layers,
  Box,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CachedImage } from "@/components/shared/cached-image";
import { useFirestore } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp, query, where, orderBy, limit, startAfter, onSnapshot, count, getAggregateFromServer, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import VisualCountDialog from '@/components/syllabus-tracker/visual-count-dialog';
import type { Subject, StudentProfile } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import ImportDialog from '@/components/syllabus-tracker/import-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import QuickEditDialog from '@/components/syllabus-tracker/quick-edit-dialog';
import { useAcademy } from '@/context/academy-context';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';
import { logAuditEvent } from '@/lib/audit';
import BulkEditDialog from '@/components/syllabus-tracker/bulk-edit-dialog';
import BarcodeDialog from '@/components/syllabus-tracker/barcode-dialog';
import { BarcodeScanner } from '@/components/syllabus-tracker/barcode-scanner';
import { QrCode } from 'lucide-react';
import { ImageDialog } from "@/components/shared/image-dialog";
const getSubjectProgress = (product: Subject): number => {
  if (!product) return 0;
  const modules = product.modules || [];
  const totalTopics = modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0);
  
  if (totalTopics > 0) {
    const storedTopics = localStorage.getItem(`pinnacle_topics_${product.id}`);
    if (storedTopics) {
      try {
        const completedIds = JSON.parse(storedTopics) as string[];
        const allTopicIds = new Set(modules.flatMap(m => m.topics?.map(t => t.id) || []));
        const validCompletedCount = completedIds.filter(id => allTopicIds.has(id)).length;
        return Math.round((validCompletedCount / totalTopics) * 100);
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }
  
  const storedProgress = localStorage.getItem(`pinnacle_progress_${product.id}`);
  if (storedProgress !== null) {
    const parsed = parseInt(storedProgress, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  let hash = 0;
  for (let i = 0; i < product.id.length; i++) {
    hash = product.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 11) * 10;
};

function UpdateProgressDialog({
  product,
  isOpen,
  onOpenChange,
  currentProgress,
  onSave,
}: {
  product: Subject | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentProgress: number;
  onSave: (progress: number) => void;
}) {
  const [val, setVal] = React.useState(currentProgress);

  React.useEffect(() => {
    if (isOpen) {
      setVal(currentProgress);
    }
  }, [isOpen, currentProgress]);

  if (!product) return null;

  const modules = product.modules || [];
  const totalTopics = modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Syllabus Progress</DialogTitle>
          <DialogDescription>
            {totalTopics > 0 
              ? `Learning progress for ${product.name} is managed via topic checklist.`
              : `Adjust your learning completion progress for ${product.name}.`
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {totalTopics > 0 ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This subject has a structured syllabus with <strong>{totalTopics}</strong> topic(s). Progress is calculated automatically as you complete topics in the learning space.
              </p>
              <Button asChild className="w-full">
                <Link href={`/syllabus-tracker/details?id=${product.id}`}>
                  Go to Student Learning Space
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Completion Percentage</span>
                  <span className="text-primary font-bold">{val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={val}
                  onChange={(e) => setVal(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0, 25, 50, 75, 100].map((pct) => (
                  <Button
                    key={pct}
                    type="button"
                    variant={val === pct ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setVal(pct)}
                  >
                    {pct}%
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {totalTopics === 0 && (
            <Button
              onClick={() => {
                onSave(val);
                onOpenChange(false);
              }}
            >
              Save Progress
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProductRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="w-12"><Skeleton className="h-4 w-4" /></TableCell>
      <TableCell className="w-16 sm:w-[100px]">
        <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-full" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-6 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 ml-auto" />
      </TableCell>
    </TableRow>
  )
}

const PRODUCTS_PER_PAGE = 60;

function InventoryPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

export default function InventoryPage() {
    return (
        <React.Suspense fallback={<InventoryPageSkeleton />}>
            <InventoryPageContent />
        </React.Suspense>
    );
}

function InventoryPageContent() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const { 
    subjects, 
    admissions, 
    mentorshipBookings, 
    optimisticProducts, 
    isLoading: isPosLoading, 
    isSyncing,
    academy, 
    currencySymbol, 
    currentUserProfile, 
    triggerRefresh, 
    removeFromQueue, 
    addToQueue,
    searchProducts,
    searchProductsByField,
    fetchMoreProducts,
    queuedActions
  } = useAcademy();

  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [quickEditProduct, setQuickEditProduct] = React.useState<Subject | null>(null);
  const [barcodeProduct, setBarcodeProduct] = React.useState<Subject | null>(null);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [previewImage, setPreviewImage] = React.useState<{ src: string, alt: string } | null>(null);

  const [progressMap, setProgressMap] = React.useState<Record<string, number>>({});
  const [progressDialogProduct, setProgressDialogProduct] = React.useState<Subject | null>(null);

  const searchParams = useSearchParams();
  const initialSortBy = (searchParams.get('sortBy') as any) || 'name';

  const [stockFilter, setStockFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'stock-desc' | 'stock-asc' | 'newest' | 'progress-desc' | 'progress-asc'>((searchParams.get('sortBy') as any) || 'newest');

  React.useEffect(() => {
    if (subjects) {
      const initialMap: Record<string, number> = {};
      subjects.forEach((p) => {
        initialMap[p.id] = getSubjectProgress(p);
      });
      setProgressMap(initialMap);
    }
  }, [subjects]);

  const handleSaveProgress = (subjectId: string, progress: number) => {
    localStorage.setItem(`pinnacle_progress_${subjectId}`, progress.toString());
    setProgressMap((prev) => ({ ...prev, [subjectId]: progress }));
    toast({
      variant: 'default',
      title: 'Progress Updated',
      description: `Subject syllabus progress set to ${progress}%.`,
    });
  };

  const [isLoadingState, setIsLoadingState] = React.useState(false);
  const isLoading = isPosLoading || isLoadingState;
  const isPageLoading = isLoading;

  // Manual search button helper
  const performSearch = React.useCallback(async (term: string) => {
    // No-op for remote search, local filtering is instant via filteredProducts useMemo
  }, []);


  // Update sorting from URL
  React.useEffect(() => {
    const s = searchParams.get('sortBy');
    if (s === 'stock-desc' || s === 'stock-asc' || s === 'name' || s === 'newest') {
      setSortBy(s as any);
    }
  }, [searchParams]);

  // Subscription logic removed here as it is now handled by the root layout's subscription guard overlay.

  const userRole = currentUserProfile?.role;
  const canManageStock = currentUserProfile?.permissions?.manage_inventory ?? (userRole === 'admin' || userRole === 'manager');

  // Get IDs of subjects queued for deletion
  const queuedDeletionIds = React.useMemo(() => {
    return queuedActions
      .filter(a => a.type === 'delete-product' && (a.status === 'pending' || a.status === 'processing' || a.status === 'completed'))
      .flatMap(a => a.payload.productIds as string[]);

  }, [queuedActions]);

  const filteredProducts = React.useMemo(() => {
    // Local subjects only
    let base = [...(subjects || [])];
    
    // Apply local search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      base = base.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.sku?.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower)
      );
    }

    
    // 1. Combine with optimistic subjects
    let combined = [...(optimisticProducts || []), ...base];
    
    // 2. Filter out queued deletions
    let valid = combined.filter(p => !queuedDeletionIds.includes(p.id));

  // 3. Category
    if (categoryFilter !== 'all') {
      valid = valid.filter(p => p.category === categoryFilter);
    }

    // 4. Stock Status (Services are usually 0 stock but shouldn't trigger 'Out of Stock' filters)
    const isService = (p: Subject) => p.categoryType === 'service' || p.category?.toLowerCase() === 'service' || p.category?.toLowerCase() === 'services';

    if (stockFilter === 'out-of-stock') {
      valid = valid.filter(p => !isService(p) && (p.stock || 0) === 0);
    } else if (stockFilter === 'debt') {
      valid = valid.filter(p => !isService(p) && (p.stock || 0) < 0);
    } else if (stockFilter === 'in-stock') {
      valid = valid.filter(p => isService(p) || (p.stock || 0) > 0);
    } else if (stockFilter === 'low-stock') {
      valid = valid.filter(p => !isService(p) && (p.stock || 0) <= (p.lowStockThreshold || 10));
    }

    // 5. Apply Sorting
    valid.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'stock-desc') {
        const stockDiff = (b.stock || 0) - (a.stock || 0);
        if (stockDiff !== 0) return stockDiff;
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'stock-asc') {
        const stockDiff = (a.stock || 0) - (b.stock || 0);
        if (stockDiff !== 0) return stockDiff;
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'progress-desc') {
        const progressA = progressMap[a.id] ?? 0;
        const progressB = progressMap[b.id] ?? 0;
        if (progressB !== progressA) return progressB - progressA;
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'progress-asc') {
        const progressA = progressMap[a.id] ?? 0;
        const progressB = progressMap[b.id] ?? 0;
        if (progressA !== progressB) return progressA - progressB;
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'newest') {
        const dateA = a.createdAt?.toMillis?.() || (a.createdAt as any)?.seconds || 0;
        const dateB = b.createdAt?.toMillis?.() || (b.createdAt as any)?.seconds || 0;
        if (dateB !== dateA) return dateB - dateA;
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return valid;
  }, [subjects, optimisticProducts, queuedDeletionIds, searchTerm, categoryFilter, stockFilter, sortBy]);

  const totalCount = filteredProducts.length;



  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleRowSelect = (subjectId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0 || !academy || !currentUserProfile) return;

    addToQueue({
      type: 'delete-product',
      payload: { productIds: selectedProductIds }
    }, `Deleting ${selectedProductIds.length} product(s)`);

    // We don't need to manually mutate here because we will filter in the UI based on queuedActions
    toast({ variant: 'default', title: 'Deletion Queued', description: `${selectedProductIds.length} product(s) will be deleted.` });

    setSelectedProductIds([]);
    setIsDeleteDialogOpen(false);
  };

  const handleImportSuccess = () => {
    setIsImportOpen(false);
  };

  const handleBulkEditSuccess = () => {
    setSelectedProductIds([]);
  }

  const handleVisualAddItems = async (items: any[]) => {
    if (!academy?.id || items.length === 0) return;
    setIsLoadingState(true);

    const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__;

    try {
        if (isTauri) {
            items.forEach(item => {
                const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random();
                addToQueue({
                    type: 'add-product',
                    payload: { ...item, id: newId, academyId: academy.id }
                }, `Importing product: ${item.name}`);
            });

            toast({ title: "Import Queued", description: `${items.length} subjects will be added when online.` });
            triggerRefresh();
        } else {
            const batch = writeBatch(firestore);
            const productsRef = collection(firestore, 'subjects');
            items.forEach(item => {
                const productRef = doc(productsRef);
                batch.set(productRef, {
                    ...item,
                    academyId: academy.id,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });
            await batch.commit();
            toast({ title: "Import Successful", description: `${items.length} subjects added.` });
            triggerRefresh();
        }
    } catch (error) {
        toast({ title: "Import Failed", description: "Could not add subjects.", variant: 'destructive' });
    } finally {
        setIsLoadingState(false);
    }
  };

  const handleExport = async () => {
    if (!academy?.id) return;
    
    toast({ variant: 'default', title: 'Preparing Export', description: 'Fetching all product data...' });

    try {
      const q = query(collection(firestore, 'subjects'), where('academyId', '==', academy.id));
      const snap = await getDocs(q);
      const allProductsData = snap.docs.map(doc => doc.data() as Subject);

      const csvData = Papa.unparse(
        allProductsData.map(p => ({
          Name: p.name,
          SKU: p.sku,
          Category: p.category,
          Price: p.price,
          Stock: p.stock,
          Description: p.description,
          ImageURL: p.imageUrl,
        }))
      );
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        link.setAttribute('href', url);
        link.setAttribute('download', `zeneva-subjects-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      reader.readAsDataURL(blob);
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: 'Your product data has been downloaded.',
      });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not fetch data for export.' });
    }
  };

  const activeFilterCount = (stockFilter !== 'all' ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0) + (sortBy !== 'name' ? 1 : 0);
  return (
    <div className="flex flex-col flex-1 w-full pb-16 md:pb-0">
      <div className="flex items-center sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3.5 gap-4 z-10 border-b mb-4">
        <div className="flex flex-col flex-1">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search subjects..."
                className="w-full rounded-lg bg-background pl-8 ring-offset-background focus-visible:ring-primary h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    performSearch(searchTerm);
                  }
                }}
              />

            </div>
            <Button 
               variant="secondary" 
               size="icon"
               className="h-10 w-10 shrink-0 border shadow-sm hover:shadow-md transition-all active:scale-95"
               onClick={() => performSearch(searchTerm)}
               aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
            {selectedProductIds.length > 0 && canManageStock && (
              <>
                <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => setIsBulkEditDialogOpen(true)}>
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sm:whitespace-nowrap">
                    Bulk Edit ({selectedProductIds.length})
                  </span>
                </Button>
                <Button variant="destructive" size="sm" className="h-9 gap-1" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sm:whitespace-nowrap">
                    Delete ({selectedProductIds.length})
                  </span>
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="rounded-full h-5 w-5 p-0 flex items-center justify-center ml-1">{activeFilterCount}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions & Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsScannerOpen(true)}>
                  <QrCode className="mr-2 h-4 w-4" /> Search by Barcode
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Stock Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={stockFilter} onValueChange={setStockFilter}>
                      <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="in-stock">In Stock</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="low-stock">Low Stock</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="out-of-stock">Out of Stock</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="debt">Negative Stock (Debt)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                      <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                      {academy?.settings?.productCategories?.map((cat: string) => (
                        <DropdownMenuRadioItem key={cat} value={cat}>{cat}</DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Sort By</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                      <DropdownMenuRadioItem value="newest">Newest Added</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="progress-desc">Highest Progress</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="progress-asc">Lowest Progress</DropdownMenuRadioItem>
                      {canManageStock && <DropdownMenuRadioItem value="stock-desc">Highest Seat Capacity</DropdownMenuRadioItem>}
                      {canManageStock && <DropdownMenuRadioItem value="stock-asc">Lowest Seat Capacity</DropdownMenuRadioItem>}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                {activeFilterCount > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => { setStockFilter('all'); setCategoryFilter('all'); setSortBy('newest'); }} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      Clear Filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" variant="outline" className="h-9 gap-1" onClick={() => handleExport()}>
              <Download className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Export</span>
            </Button>
            {canManageStock && (
              <Button size="sm" variant="outline" className="h-9 gap-1" onClick={() => setIsImportOpen(true)}>
                <Upload className="h-3.5 w-3.5" />
                <span className="sm:whitespace-nowrap">Import</span>
              </Button>
            )}
            {canManageStock && (
              <Button size="sm" asChild variant="secondary" className="h-9 gap-1">
                <Link href="/syllabus-tracker/debts">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span className="sm:whitespace-nowrap">Manage Debts</span>
                </Link>
              </Button>
            )}
            {canManageStock && (
              <Button size="sm" asChild className="h-9 gap-1">
                <Link href="/syllabus-tracker/add">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sm:whitespace-nowrap">Add Subject</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Actions Modal/Menu */}
          <div className="flex md:hidden items-center gap-2">
            {selectedProductIds.length > 0 && canManageStock && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="h-9 px-3 gap-2">
                    <Activity className="h-4 w-4" />
                    <span>{selectedProductIds.length} Selected</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsBulkEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Bulk Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Inventory Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => setIsScannerOpen(true)}>
                  <QrCode className="mr-2 h-4 w-4" /> Scan Barcode
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />

                {/* Mobile Filter Group */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter & Sort {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Stock Status</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={stockFilter} onValueChange={setStockFilter}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="in-stock">In Stock</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="low-stock">Low Stock</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="out-of-stock">Out of Stock</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="debt">Negative Stock (Debt)</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                          <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                          {academy?.settings?.productCategories?.map((cat: string) => (
                            <DropdownMenuRadioItem key={cat} value={cat}>{cat}</DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Sort By</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                          <DropdownMenuRadioItem value="newest">Newest Added</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="progress-desc">Highest Progress</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="progress-asc">Lowest Progress</DropdownMenuRadioItem>
                          {canManageStock && <DropdownMenuRadioItem value="stock-desc">Highest Seat Capacity</DropdownMenuRadioItem>}
                          {canManageStock && <DropdownMenuRadioItem value="stock-asc">Lowest Seat Capacity</DropdownMenuRadioItem>}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => handleExport()}>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </DropdownMenuItem>
                
                {canManageStock && (
                  <DropdownMenuItem onClick={() => setIsImportOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" /> Import CSV
                  </DropdownMenuItem>
                )}

                {canManageStock && (
                  <DropdownMenuItem asChild>
                    <Link href="/syllabus-tracker/debts">
                      <TrendingDown className="mr-2 h-4 w-4" /> Manage Debts
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                
                {canManageStock && (
                  <DropdownMenuItem asChild className="bg-primary text-primary-foreground focus:bg-primary/90">
                    <Link href="/syllabus-tracker/add">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </div>
      <Card className="flex-1 flex flex-col min-h-0 w-full overflow-hidden mb-2 shadow-premium border-none bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-headline text-2xl">
            Syllabus Tracker
          </CardTitle>
          <CardDescription>
            {canManageStock 
              ? "Manage academic subjects, configure syllabus content, and track curriculum capacity."
              : "Track your syllabus progress, manage active study checklists, and prepare for CBT examinations."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-y-auto min-h-0">
          {(isLoading && filteredProducts.length === 0) || subjects === null ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50 mb-4" />
              <p className="text-muted-foreground animate-pulse font-medium">Scanning syllabus catalog...</p>
              <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-widest">Just a moment</p>
            </div>
          ) : (
            filteredProducts && filteredProducts.length > 0 ? (
              <>
              {/* Select All / Batch Actions Bar */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border/10 bg-muted/5">
                <Checkbox
                  id="select-all-subjects"
                  checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all-subjects" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                  Select All Subjects ({selectedProductIds.length} selected)
                </label>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {filteredProducts.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);
                  const progress = progressMap[product.id] ?? 0;
                  
                  return (
                    <Card 
                      key={product.id} 
                      className={cn(
                        "relative overflow-hidden flex flex-col justify-between transition-all duration-200 border bg-card/40 hover:bg-card/70 hover:shadow-md hover:border-primary/30",
                        isSelected && "border-primary bg-primary/5",
                        (product as any).isOptimistic && "opacity-70"
                      )}
                    >
                      {/* Checkbox selector */}
                      <div className="absolute top-3 left-3 z-10">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleRowSelect(product.id)}
                          disabled={(product as any).isOptimistic}
                        />
                      </div>

                      {/* Dropdown Menu actions */}
                      <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu 
                          open={openMenuId === product.id} 
                          onOpenChange={(open) => setOpenMenuId(open ? product.id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canManageStock ? (
                              <>
                                <DropdownMenuItem onSelect={() => router.push(`/syllabus-tracker/details?id=${product.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" /> Full Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setQuickEditProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" /> Quick Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setProgressDialogProduct(product)}>
                                  <Activity className="mr-2 h-4 w-4" /> Update Progress
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem onSelect={() => router.push(`/syllabus-tracker/details?id=${product.id}`)}>
                                  <Package className="mr-2 h-4 w-4" /> Student Learning Space
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setProgressDialogProduct(product)}>
                                  <Activity className="mr-2 h-4 w-4" /> Update Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => router.push(`/syllabus-tracker/details?id=${product.id}&tab=questions`)}>
                                  <ListFilter className="mr-2 h-4 w-4" /> Practice CBT Test
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onSelect={() => setBarcodeProduct(product)} disabled={!product.sku}>
                              <BarcodeIcon className="mr-2 h-4 w-4" /> Print Barcode
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Subject Visual Header */}
                      <div 
                        className="h-28 bg-muted/20 flex items-center justify-center border-b border-border/10 cursor-pointer relative"
                        onClick={() => !(product as any).isOptimistic && router.push(`/syllabus-tracker/details?id=${product.id}`)}
                      >
                        {product.imageUrl ? (
                          <div 
                            className="relative h-full w-full flex items-center justify-center p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage({ src: product.imageUrl!, alt: product.name });
                            }}
                          >
                            <CachedImage
                              alt={product.name}
                              className="max-h-full max-w-full object-contain rounded-md hover:scale-105 transition-transform"
                              src={product.imageUrl}
                            />
                            {(product as any).isOptimistic && (
                              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground relative">
                            <Package className="h-6 w-6" />
                            {(product as any).isOptimistic && (
                              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                              </div>
                            )}
                          </div>
                        )}
                        {(product as any).isOptimistic && <Badge variant="secondary" className="absolute bottom-2 right-2 text-[8px] h-4">Saving...</Badge>}
                      </div>

                      {/* Subject Information */}
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.type === 'composite' && (
                            <Badge variant="outline" className="text-[9px] h-4 bg-primary/5 text-primary border-primary/20 gap-0.5 px-1 py-0">
                              <Layers className="h-2.5 w-2.5" /> Bundle
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] h-4 px-1.5 py-0 rounded-full",
                              progress === 100 && "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
                              progress > 0 && progress < 100 && "bg-blue-500/10 text-blue-500 border-blue-500/30",
                              progress === 0 && "bg-slate-500/10 text-slate-500 border-slate-500/30"
                            )}
                          >
                            {progress === 100 ? "Completed" : progress > 0 ? "In Progress" : "Not Started"}
                          </Badge>
                        </div>
                        
                        <CardTitle className="text-sm font-bold text-foreground line-clamp-1 mt-1">
                          <Link href={(product as any).isOptimistic ? '#' : `/syllabus-tracker/details?id=${product.id}`} className={cn("hover:underline", (product as any).isOptimistic && "pointer-events-none")}>
                            {product.name}
                          </Link>
                        </CardTitle>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{product.sku || 'NO-SKU'}</p>
                      </CardHeader>

                      {/* Subject Progress */}
                      <CardContent className="px-4 py-2 space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                            <span>Syllabus Progress</span>
                            <span className="font-mono text-primary">{progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/10">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                progress === 100 ? "bg-emerald-500" : "bg-primary"
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-border/5 text-[10px]">
                          <div>
                            <span className="text-muted-foreground font-bold uppercase block">Instructor</span>
                            <span className="font-semibold text-foreground truncate block mt-0.5">{product.tutorName || "Unassigned"}</span>
                          </div>
                          {canManageStock ? (
                            <div>
                              <span className="text-muted-foreground font-bold uppercase block">Enrollment Fee</span>
                              <span className="font-semibold text-foreground block mt-0.5">{currencySymbol}{product.price.toLocaleString()}</span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-muted-foreground font-bold uppercase block">Category</span>
                              <span className="font-semibold text-foreground truncate block mt-0.5">{product.category || "General"}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>

                      {/* Card Action Footer */}
                      <CardFooter className="px-4 py-3 border-t border-border/10 flex justify-between bg-muted/5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => router.push(`/syllabus-tracker/details?id=${product.id}`)}
                          className="h-7 text-[10px] px-2.5"
                        >
                          Open Workspace
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setProgressDialogProduct(product)}
                          className="h-7 text-[10px] px-2.5 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          Update Progress
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 min-h-[400px]">
                <PackageOpen className="h-24 w-24 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold">{searchTerm ? 'No subject found' : 'Empty Syllabus'}</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                  {searchTerm ? `Try searching for something else or clear the search.` : 'Start registering subjects to your academic syllabus.'}
                </p>
                <div className="flex gap-2">
                  {canManageStock && (
                    <Button asChild>
                      <Link href="/syllabus-tracker/add">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
                      </Link>
                    </Button>
                  )}
                  {canManageStock && (
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" /> Import CSV
                    </Button>
                  )}
                </div>
              </div>
            )
          )}
        </CardContent>
        {filteredProducts && filteredProducts.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t py-4">
            <div className="text-sm text-muted-foreground">
              Total <strong>{filteredProducts.length}</strong> subjects found
            </div>
          </CardFooter>
        )}
      </Card>
      
      {academy && (
        <ImportDialog
          isOpen={isImportOpen}
          onOpenChange={setIsImportOpen}
          academyId={academy.id}
          subjects={subjects}
          onSuccess={handleImportSuccess}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will queue the deletion of {selectedProductIds.length} subjects. This is permanent once synced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {quickEditProduct && currentUserProfile && (
        <QuickEditDialog
          product={quickEditProduct}
          isOpen={!!quickEditProduct}
          onOpenChange={(open) => !open && setQuickEditProduct(null)}
          userProfile={currentUserProfile}
        />
      )}

      {isBulkEditDialogOpen && (
        <BulkEditDialog
          productIds={selectedProductIds}
          isOpen={isBulkEditDialogOpen}
          onOpenChange={setIsBulkEditDialogOpen}
          onSuccess={handleBulkEditSuccess}
        />
      )}

      {barcodeProduct && (
        <BarcodeDialog
          product={barcodeProduct}
          isOpen={!!barcodeProduct}
          onOpenChange={(open) => !open && setBarcodeProduct(null)}
        />
      )}

      {isScannerOpen && (
        <BarcodeScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScan={(sku) => {
            setSearchTerm(sku);
            setIsScannerOpen(false);
          }}
        />
      )}
      <ImageDialog 
          isOpen={!!previewImage} 
          onClose={() => setPreviewImage(null)} 
          src={previewImage?.src || null} 
          alt={previewImage?.alt || ''} 
      />

      {progressDialogProduct && (
        <UpdateProgressDialog
          product={progressDialogProduct}
          isOpen={!!progressDialogProduct}
          onOpenChange={(open) => !open && setProgressDialogProduct(null)}
          currentProgress={progressMap[progressDialogProduct.id] ?? 0}
          onSave={(progress) => handleSaveProgress(progressDialogProduct.id, progress)}
        />
      )}
    </div>

  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

