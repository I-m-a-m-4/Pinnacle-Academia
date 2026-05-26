
'use client';

import * as React from 'react';
import { useAcademy } from '@/context/academy-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import type { MentorshipBooking } from '@/types';
import PageTitle from '@/components/shared/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Globe, MoreHorizontal, CheckCircle, Clock, Info, XCircle, DollarSign, ShoppingCart, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import RefreshButton from '@/components/shared/refresh-button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

function OrderRowSkeleton() {
    return (
        <TableRow>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16 text-center" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
             <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
        </TableRow>
    )
}

function StatCard({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: React.ElementType, description?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    pending: 'secondary',
    paid: 'default',
    shipped: 'outline',
    cancelled: 'destructive',
}

const statusLabel: { [key: string]: string } = {
    pending: 'Pending',
    paid: 'Confirmed',
    shipped: 'Completed',
    cancelled: 'Cancelled',
}

export default function MentorshipBookingsPage() {
    const { academy, isLoading: isPosLoading, currencySymbol, triggerRefresh } = useAcademy();
    const firestore = useFirestore();
    const { toast } = useToast();

    const mentorshipBookingsQuery = useMemoFirebase(
        () => academy?.id ? query(collection(firestore, 'businessInstances', academy.id, 'mentorshipBookings'), orderBy('createdAt', 'desc')) : null,
        [academy?.id, firestore]
    );

    const { data: mentorshipBookings, isLoading: isLoadingBookings } = useCollection<MentorshipBooking>(mentorshipBookingsQuery);
    const isLoading = isPosLoading || isLoadingBookings;

    const analytics = React.useMemo(() => {
        if (!mentorshipBookings) return { totalBookingValue: 0, totalOrders: 0, averageSessionValue: 0 };
        const totalBookingValue = mentorshipBookings.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = mentorshipBookings.length;
        const averageSessionValue = totalOrders > 0 ? totalBookingValue / totalOrders : 0;
        return { totalBookingValue, totalOrders, averageSessionValue };
    }, [mentorshipBookings]);
    
    const handleStatusChange = async (bookingId: string, status: MentorshipBooking['status']) => {
        if (!academy?.id) return;
        const orderRef = doc(firestore, 'businessInstances', academy.id, 'mentorshipBookings', bookingId);
        try {
            await updateDoc(orderRef, { status });
            triggerRefresh();
            toast({
                variant: 'success',
                title: 'Booking Status Updated',
                description: `Booking has been marked as ${statusLabel[status]}.`,
            });
        } catch (e) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not update booking status.',
            });
        }
    };

    return (
        <div className="space-y-6">
            <PageTitle title="Mentorship Bookings" subtitle="Manage incoming consultation sessions and mentorship bookings from students." />
            
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Total Bookings Value" value={`${currencySymbol}${analytics.totalBookingValue.toLocaleString()}`} icon={DollarSign} />
                <StatCard title="Total Sessions" value={analytics.totalOrders.toLocaleString()} icon={ShoppingCart} />
                <StatCard title="Average Booking Value" value={`${currencySymbol}${analytics.averageSessionValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={DollarSign} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div>
                            <CardTitle className="flex items-center gap-2"><Globe /> Scheduled Consultations</CardTitle>
                            <CardDescription>A log of all consultation sessions booked by students.</CardDescription>
                         </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Topics / Notes</TableHead>
                                    <TableHead className="text-right">Fees</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <OrderRowSkeleton />
                                <OrderRowSkeleton />
                                <OrderRowSkeleton />
                            </TableBody>
                        </Table>
                    ) : mentorshipBookings && mentorshipBookings.length > 0 ? (
                        <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Topics / Notes</TableHead>
                                    <TableHead className="text-right">Fees</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mentorshipBookings.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">{order.id.substring(0,8)}...</TableCell>
                                        <TableCell>{order.createdAt ? format(order.createdAt.toDate(), 'PP') : 'N/A'}</TableCell>
                                        <TableCell>
                                            {order.studentId ? (
                                                <Link href={`/students/${order.studentId}`} className="font-medium hover:underline">{order.customerName}</Link>
                                            ) : (
                                                <div className="font-medium">{order.customerName}</div>
                                            )}
                                            <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                                            <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                                            <div className="text-xs text-muted-foreground mt-1 truncate max-w-xs">{order.customerAddress}</div>
                                             {order.shippingDetails && (
                                                <div className="text-xs text-muted-foreground mt-1 font-semibold flex items-center gap-1">
                                                   <Truck className="h-3 w-3"/>
                                                   {order.shippingDetails.name} (+{currencySymbol}{order.shippingDetails.price})
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[order.status]} className="capitalize">{statusLabel[order.status] || order.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Badge variant="outline" className="cursor-default flex items-center gap-1.5">
                                                        <Info className="h-3 w-3"/>
                                                        {order.items.length} item(s)
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <ul>
                                                        {order.items.map(item => (
                                                            <li key={item.subjectId} className="text-sm">{item.quantity} x {item.name}</li>
                                                        ))}
                                                    </ul>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">{currencySymbol}{order.total.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'paid')}><CheckCircle className="mr-2 h-4 w-4 text-green-500"/> Mark as Confirmed</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'shipped')}><CheckCircle className="mr-2 h-4 w-4 text-blue-500"/> Mark as Completed</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'pending')}><Clock className="mr-2 h-4 w-4 text-amber-500"/> Mark as Pending</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'cancelled')} className="text-destructive"><XCircle className="mr-2 h-4 w-4"/> Cancel Booking</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </TooltipProvider>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                            <Globe className="h-12 w-12 text-muted-foreground/50" />
                            <h3 className="text-xl font-semibold mt-4">No Mentorship Bookings Yet</h3>
                            <p className="text-muted-foreground mt-2">Mentorship sessions booked by students will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
