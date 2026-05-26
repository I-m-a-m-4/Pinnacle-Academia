'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAcademy } from "@/context/academy-context";
import { PlusCircle, Search, ShoppingCart, Trash2, Package, PackageOpen, Columns, Loader2, ChevronsUp, ListFilter, Archive, History, Clock, BookOpen } from "lucide-react";
import { CachedImage } from "@/components/shared/cached-image";
import Link from "next/link";
import *as React from "react";
import type { Subject } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BarcodeScanner } from "@/components/syllabus-tracker/barcode-scanner";
import { QrCode } from "lucide-react";
import { ImageDialog } from "@/components/shared/image-dialog";
import SavedSessionsDrawer from "@/components/cbt-simulator/saved-sessions-drawer";
import { collection, query, where, onSnapshot } from "firebase/firestore";


const DEFAULT_MAPPINGS = [
    {
        university: 'University of Ibadan (UI)',
        course: 'Medicine and Surgery',
        subjects: ['Use of English', 'Biology', 'Chemistry', 'Physics']
    },
    {
        university: 'University of Ibadan (UI)',
        course: 'Computer Science',
        subjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry']
    },
    {
        university: 'University of Lagos (UNILAG)',
        course: 'Computer Science',
        subjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry']
    },
    {
        university: 'University of Lagos (UNILAG)',
        course: 'Medicine and Surgery',
        subjects: ['Use of English', 'Biology', 'Chemistry', 'Physics']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Computer Science',
        subjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Medicine and Surgery',
        subjects: ['Use of English', 'Biology', 'Chemistry', 'Physics']
    }
];

const DEFAULT_SUBJECTS = [
    { id: 'sub-eng', name: 'Use of English', price: 50, category: 'General', stock: 100, imageUrl: '' },
    { id: 'sub-math', name: 'Mathematics', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-phys', name: 'Physics', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-chem', name: 'Chemistry', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-bio', name: 'Biology', price: 50, category: 'Science', stock: 100, imageUrl: '' }
];

function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Skeleton className="w-full h-32" />
            </CardContent>
            <CardHeader className="p-2 h-20">
                <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardFooter className="p-2 flex justify-between items-center">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-7 w-7 rounded-full" />
            </CardFooter>
        </Card>
    );
}

const ProductItem = React.memo(({ product, currencySymbol, handleAddToCart, addToCart, onPreview }: {
    product: Subject,
    currencySymbol: string,
    handleAddToCart: (product: Subject) => void,
    addToCart: any,
    onPreview: (src: string, alt: string) => void
}) => {
    return (
        <Card key={product.id} className="overflow-hidden flex flex-col shadow-none border-[0.5px] border-border/40 bg-card/40 rounded-xl backdrop-blur-sm">
            <CardContent 
                className="p-4 relative h-44 w-full bg-muted/20 flex items-center justify-center cursor-zoom-in"
                onClick={() => product.imageUrl && onPreview(product.imageUrl, product.name)}
            >
                {product.imageUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <CachedImage
                            src={product.imageUrl}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain hover:scale-105 transition-transform"
                        />
                    </div>

                ) : (
                    <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground/40">
                        <Package size={40} />
                    </div>
                )}
            </CardContent>
            <CardHeader className="px-4 py-1 flex-grow">
                <CardTitle className="text-sm font-medium leading-tight line-clamp-3 min-h-[3.25rem] text-foreground flex items-center gap-1.5 flex-wrap">
                    {product.name}
                    {(product.categoryType === 'service' || product.category?.toLowerCase() === 'service' || product.category?.toLowerCase() === 'services') ? (
                        <Badge variant="outline" className="text-[10px] h-4 bg-blue-500/10 text-blue-500 border-blue-500/20 px-1 py-0">Optional</Badge>
                    ) : (
                        (product.stock || 0) <= 0 && <Badge variant="destructive" className="text-[10px] h-4 px-1 py-0 bg-red-500/10 text-red-500 border-red-500/20">Unavailable</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-end mt-auto">
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground dark:text-white">{product.price.toLocaleString()} Qs</span>
                    {product.baseUnit && <span className="text-[10px] text-muted-foreground">per {product.baseUnit}</span>}
                </div>

                {product.uomConversions && product.uomConversions.length > 0 ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="outline" className="h-11 w-11 rounded-lg border-border/50 hover:bg-accent flex items-center justify-center">
                                <PlusCircle className="h-6 w-6 text-foreground dark:text-white" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Select Unit</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup onValueChange={(unit) => {
                                if (unit === 'base') {
                                    handleAddToCart(product);
                                } else {
                                    const uom = product.uomConversions?.find(u => u.unitName === unit);
                                    if (uom) {
                                        addToCart(product, uom.unitName, uom.multiplier, uom.price);
                                    }
                                }
                            }}>
                                <DropdownMenuRadioItem value="base">1 {product.baseUnit || 'Paper'} ({product.price.toLocaleString()} Qs)</DropdownMenuRadioItem>
                                {product.uomConversions.map((uom) => (
                                    <DropdownMenuRadioItem key={uom.unitName} value={uom.unitName}>
                                        1 {uom.unitName} ({uom.multiplier} {product.baseUnit || 'papers'}) - {(uom.price || product.price).toLocaleString()} Qs
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button size="icon" variant="outline" className="h-11 w-11 rounded-lg border-border/50 hover:bg-accent flex items-center justify-center" onClick={() => handleAddToCart(product)}>
                        <PlusCircle className="h-6 w-6 text-foreground dark:text-white" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
});

ProductItem.displayName = 'ProductItem';

const CartContents = () => {
    const { 
        syllabus, 
        removeFromCart, 
        updateQuantity, 
        subtotal, 
        currencySymbol, 
        clearCart,
        saveCurrentSession,
        savedSessions,
        resumeSavedSession,
        deleteSavedSession
    } = useAcademy();

    return (
        <>
            {syllabus.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                    <ShoppingCart className="h-12 w-12" />
                    <p className="mt-4 text-xs">No subjects selected. Choose your UTME subject combination from the left.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => saveCurrentSession()}
                                className="h-8 gap-1.5 px-2 text-xs font-medium border-dashed"
                            >
                                <Archive className="h-3.5 w-3.5" />
                                Save Setup
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearCart}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1.5 px-2 text-xs font-medium"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Clear Selection
                        </Button>
                    </div>
                    {syllabus.map(item => {
                        const cartItemId = item.unit ? `${item.product.id}-${item.unit}` : item.product.id;
                        return (
                            <div key={cartItemId} className="flex justify-between items-center">
                                <div className="flex-1 mr-4">
                                    <p className="font-medium text-sm line-clamp-1">
                                        {item.product.name}
                                        {item.unit && <Badge variant="secondary" className="ml-2 text-[10px] py-0 h-4">{item.unit}</Badge>}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{(item.product.price * item.quantity).toLocaleString()} Questions</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(cartItemId, parseInt(e.target.value))}
                                        className="w-16 h-8 text-center"
                                        min="1"
                                    />
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeFromCart(cartItemId)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                        <span>Total Questions</span>
                        <span>{syllabus.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toLocaleString()} Qs</span>
                    </div>
                </div>
            )}
        </>
    );
};


export default function SelectProductsPage() {
    const { 
        syllabus, 
        addToCart, 
        clearCart,
        subtotal, 
        currencySymbol, 
        subjects, 
        isLoading: isPosLoading, 
        academy,
        currentUserProfile,
        firestore,
        searchProducts,
        searchProductsByField,
        findProductBySku,
        fetchMoreProducts,
        isSyncing,
        savedSessions,
        resumeSavedSession,
        deleteSavedSession,
        saveCurrentSession
    } = useAcademy();
    const router = useRouter();
    const { toast } = useToast();
        const [searchTerm, setSearchTerm] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const [columnClass, setColumnClass] = React.useState('lg:grid-cols-4');
    const [isNavigating, setIsNavigating] = React.useState(false);
    const [isScannerOpen, setIsScannerOpen] = React.useState(false);

    const [activeUni, setActiveUni] = React.useState('');
    const [activeCourse, setActiveCourse] = React.useState('');
    const [mappings, setMappings] = React.useState<any[]>([]);
    const [isLoadingMappings, setIsLoadingMappings] = React.useState(true);

    React.useEffect(() => {
        if (currentUserProfile) {
            setActiveUni(currentUserProfile.targetInstitution || '');
            setActiveCourse(currentUserProfile.targetCourse || '');
        }
    }, [currentUserProfile]);

    React.useEffect(() => {
        if (!academy?.id || !firestore) return;

        const q = query(collection(firestore, 'postUtmeMappings'), where('academyId', '==', academy.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMappings(data);
            setIsLoadingMappings(false);
        }, (err) => {
            console.error(err);
            setIsLoadingMappings(false);
        });

        return () => unsubscribe();
    }, [academy?.id, firestore]);

    const allMappings = React.useMemo(() => {
        return mappings.length > 0 ? mappings : DEFAULT_MAPPINGS;
    }, [mappings]);

    const allAvailableSubjects = React.useMemo(() => {
        return subjects && subjects.length > 0 ? subjects : DEFAULT_SUBJECTS;
    }, [subjects]);

    const activeMapping = React.useMemo(() => {
        if (!activeUni || !activeCourse || allMappings.length === 0) return null;
        return allMappings.find(m => 
            m.university.toLowerCase() === activeUni.toLowerCase() && 
            m.course.toLowerCase() === activeCourse.toLowerCase()
        ) || null;
    }, [activeUni, activeCourse, allMappings]);

    const availableUniversities = React.useMemo(() => {
        const unis = new Set<string>();
        if (currentUserProfile?.targetInstitution) {
            unis.add(currentUserProfile.targetInstitution);
        }
        allMappings.forEach(m => unis.add(m.university));
        return Array.from(unis);
    }, [allMappings, currentUserProfile]);

    const availableCoursesForSelectedUni = React.useMemo(() => {
        const courses = new Set<string>();
        if (currentUserProfile?.targetCourse && currentUserProfile?.targetInstitution?.toLowerCase() === activeUni?.toLowerCase()) {
            courses.add(currentUserProfile.targetCourse);
        }
        allMappings.filter(m => m.university.toLowerCase() === activeUni.toLowerCase()).forEach(m => courses.add(m.course));
        return Array.from(courses);
    }, [allMappings, activeUni, currentUserProfile]);

    const handleApplyRecommended = () => {
        if (!activeMapping) return;

        // Clear existing selections
        clearCart();

        let addedCount = 0;
        activeMapping.subjects.forEach((subName: string) => {
            const matchedSubject = allAvailableSubjects.find(s => s.name.toLowerCase() === subName.toLowerCase());
            if (matchedSubject) {
                addToCart(matchedSubject);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            toast({
                variant: 'success',
                title: 'Combination Applied',
                description: `Successfully loaded recommended subjects for ${activeCourse} at ${activeUni}.`
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Subject Match Failed',
                description: 'Could not find matching subjects in the syllabus catalog. Please contact your tutor/admin.'
            });
        }
    };


    const [previewImage, setPreviewImage] = React.useState<{ src: string, alt: string } | null>(null);


    // Subscription status is now managed by the background glassmorphism overlay in layout.tsx.

    const [isFetchingMore, setIsFetchingMore] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(allAvailableSubjects ? allAvailableSubjects.length >= 50 : true);

    const isLoading = isPosLoading && (!subjects || subjects.length === 0);

    const performManualSearch = () => {
        if (!searchTerm.trim()) return;
        
        const exactMatch = allAvailableSubjects.find(p =>
            p.sku?.toLowerCase() === searchTerm.toLowerCase() ||
            p.name.toLowerCase() === searchTerm.toLowerCase()
        );

        if (exactMatch) {
            addToCart(exactMatch);
            setSearchTerm('');
            toast({
                title: "Added to Cart",
                description: exactMatch.name
            });
        }
    };


    const filteredProducts = React.useMemo(() => {
        let base = [...allAvailableSubjects];
        
        // Apply instant local substring filter
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            base = base.filter(p => 
                p.name.toLowerCase().includes(lower) || 
                p.sku?.toLowerCase().includes(lower) ||
                p.category?.toLowerCase().includes(lower)
            );
        }

        if (categoryFilter !== 'all') {
            base = base.filter(p => p.category === categoryFilter);
        }

        return base;
    }, [allAvailableSubjects, searchTerm, categoryFilter]);

    const handleLoadMore = async () => {
        setIsFetchingMore(true);
        const count = await fetchMoreProducts();
        if (count === 0) setHasMore(false);
        setIsFetchingMore(false);
    };

    const handleAddToCart = React.useCallback((product: Subject) => {
        addToCart(product);
    }, [addToCart]);

    const handleScan = (sku: string) => {
        const product = subjects?.find(p => p.sku === sku);
        
        if (product) {
            addToCart(product);
            toast({
                title: "Subject Added",
                description: `${product.name} has been added to the syllabus.`,
            });
            setIsScannerOpen(false);
        } else {
            toast({
                variant: "destructive",
                title: "Subject Not Found",
                description: `No product found with SKU: ${sku}`,
            });
        }
    };


    const handleNext = () => {
        setIsNavigating(true);
        router.push('/cbt-simulator/student-details');
    };

    return (
        <div className="grid md:grid-cols-3 md:gap-8">
            <div className="md:col-span-2">
                {/* Post-UTME Mapping Configurator */}
                <Card className="mb-6 border border-primary/20 bg-primary/5 backdrop-blur-md shadow-md rounded-2xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                            <BookOpen className="h-5 w-5" />
                            Post-UTME Exam Configurator
                        </CardTitle>
                        <CardDescription>
                            Select your target university and course to auto-configure your Post-UTME simulator subjects.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Target University</label>
                                <Select value={activeUni} onValueChange={setActiveUni}>
                                    <SelectTrigger className="bg-background/80">
                                        <SelectValue placeholder="Select University" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUniversities.map(uni => (
                                            <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Desired Course</label>
                                <Select value={activeCourse} onValueChange={setActiveCourse}>
                                    <SelectTrigger className="bg-background/80">
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCoursesForSelectedUni.map(course => (
                                            <SelectItem key={course} value={course}>{course}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {activeMapping ? (
                            <div className="p-4 rounded-xl border border-primary/10 bg-primary/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-semibold text-sm text-foreground">Recommended Combination found!</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Post-UTME subjects for <strong className="text-foreground">{activeCourse}</strong> at <strong className="text-foreground">{activeUni}</strong>:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {activeMapping.subjects.map((sub: string) => (
                                                <Badge key={sub} variant="secondary" className="bg-background border text-[11px]">{sub}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button onClick={handleApplyRecommended} size="sm" className="shadow-sm active:scale-95 transition-transform shrink-0">
                                        Auto-select Combination
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            activeUni && activeCourse && (
                                <div className="p-4 rounded-xl border border-muted bg-muted/30 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        No official mapping configured for <strong className="text-foreground">{activeCourse}</strong> at <strong className="text-foreground">{activeUni}</strong>.
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1">Please select your subjects manually using the catalog below.</p>
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col mb-4 gap-2 sticky top-0 bg-background py-2 z-10 border-b">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search subjects or exam modes..."
                                className="pl-8 ring-offset-background focus-visible:ring-primary h-11"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        performManualSearch();
                                    }
                                }}
                            />

                        </div>
                        <Button 
                            variant="secondary" 
                            size="icon"
                            className="h-11 w-11 shrink-0 border shadow-sm hover:shadow-md transition-all active:scale-95"
                            onClick={performManualSearch}
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 md:hidden shrink-0 border-primary/20 text-primary hover:bg-primary/5"
                            onClick={() => setIsScannerOpen(true)}
                        >
                            <QrCode className="h-6 w-6" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-11 gap-1.5 min-w-[44px]">
                                    <ListFilter className="h-4 w-4" />
                                    <span className="sr-only sm:not-sr-only">Filter</span>
                                    {categoryFilter !== 'all' && <Badge variant="secondary" className="rounded-full h-5 w-5 p-0 flex items-center justify-center ml-1">1</Badge>}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by Department/Field</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <DropdownMenuRadioItem value="all">All Departments</DropdownMenuRadioItem>
                                    {academy?.settings?.productCategories?.map(cat => (
                                        <DropdownMenuRadioItem key={cat} value={cat}>{cat}</DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Select onValueChange={setColumnClass} defaultValue={columnClass}>
                            <SelectTrigger className="w-[150px] h-11 hidden lg:flex">
                                <Columns className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Layout" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lg:grid-cols-3">3 Columns</SelectItem>
                                <SelectItem value="lg:grid-cols-4">4 Columns</SelectItem>
                                <SelectItem value="lg:grid-cols-5">5 Columns</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {isSyncing && (
                        <div className="flex items-center gap-2 ml-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none">Global Syllabus Syncing...</span>
                        </div>
                    )}
                </div>
                <div className="pb-24 md:pb-0">
                    {isLoading || subjects === null ? (
                        <div className="flex flex-col items-center justify-center p-12 min-h-[300px] text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50 mb-4" />
                            <p className="text-muted-foreground animate-pulse">Filtering subjects...</p>
                        </div>
                    ) : (
                        <>
                            {filteredProducts && filteredProducts.length > 0 ? (
                                <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-4", columnClass)}>
                                    {filteredProducts.map(product => (
                                        <ProductItem
                                            key={product.id}
                                            product={product}
                                            currencySymbol={currencySymbol}
                                            handleAddToCart={() => handleAddToCart(product)}
                                            addToCart={addToCart}
                                            onPreview={(src, alt) => setPreviewImage({ src, alt })}
                                        />


                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg min-h-[400px]">
                                    <Package className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                                    <h3 className="text-xl font-semibold">No subjects found</h3>
                                    <p className="text-muted-foreground mt-2 mb-6 max-w-[250px] mx-auto">
                                        {searchTerm ? `We couldn't find matches for "${searchTerm}" in your synchronized syllabus.` : "This department is currently empty."}
                                    </p>
                                    {searchTerm ? (
                                        <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); }}>
                                            Clear Search
                                        </Button>
                                    ) : (
                                        <Button size="sm" asChild>
                                            <Link href="/syllabus-tracker/add">
                                                <PlusCircle className="h-4 w-4 mr-2" /> Add Subject
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Pagination removed as per user request for full catalog search */}
                        </>
                    )}
                </div>
            </div>


            {/* Desktop Cart */}
            <div className="hidden md:block">
                <Card className="sticky top-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            <span>Selected Exam Subjects</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96 pr-3">
                            <CartContents />
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleNext} disabled={syllabus.length === 0 || isNavigating}>
                            {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Next: Student Details
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Mobile Cart Sheet */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="default" className="fixed bottom-[70px] left-4 right-4 z-20 h-16 shadow-lg rounded-xl text-lg">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                    <ChevronsUp className="h-5 w-5" />
                                    <span>Selected Subjects ({syllabus.reduce((acc, item) => acc + item.quantity, 0)})</span>
                                </div>
                                <span>{syllabus.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toLocaleString()} Qs</span>
                            </div>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[75%] flex flex-col">
                        <SheetHeader className="p-4 border-b text-left">
                            <SheetTitle>Selected Exam Subjects</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="flex-1 p-4">
                            <CartContents />
                        </ScrollArea>
                        <SheetFooter className="p-4 border-t bg-background">
                            <Button className="w-full" size="lg" onClick={handleNext} disabled={syllabus.length === 0 || isNavigating}>
                                {isNavigating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Next: Student Details
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {isScannerOpen && (
                <BarcodeScanner
                    isOpen={isScannerOpen}
                    onClose={() => setIsScannerOpen(false)}
                    onScan={handleScan}
                />
            )}
            <ImageDialog 
                isOpen={!!previewImage} 
                onClose={() => setPreviewImage(null)} 
                src={previewImage?.src || null} 
                alt={previewImage?.alt || ''} 
            />
        </div>

    )
}
