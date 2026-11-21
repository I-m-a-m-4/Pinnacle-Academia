
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, User, MoreHorizontal, AlertCircle, Trash2, Mail, UserCheck, UserX, ArrowUpDown, Clock, Calendar, Activity, Edit3, Save } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, query, where, deleteDoc, updateDoc, runTransaction } from 'firebase/firestore';
import type { StudentProfile, Invitation, Academy } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddUserDialog from '@/components/student-profile/add-user-dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Hook to get current user's profile, including academyId and role
function useCurrentUserProfile() {
  const { user } = useUser();
  const firestore = useFirestore();
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userProfile, isLoading } = useDoc<StudentProfile>(userDocRef);

  return { profile: userProfile, isLoading };
}

function UserRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-6 w-32" />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <Skeleton className="h-6 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 ml-auto" />
      </TableCell>
    </TableRow>
  )
}

export default function UsersPage() {
  const { profile: currentUser, isLoading: isProfileLoading } = useCurrentUserProfile();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = React.useState(false);
  const [invitationToRevoke, setInvitationToRevoke] = React.useState<Invitation | null>(null);
  const [userToUpdate, setUserToUpdate] = React.useState<{ user: StudentProfile, action: 'activate' | 'deactivate' } | null>(null);
  const [userToEdit, setUserToEdit] = React.useState<StudentProfile | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editPhone, setEditPhone] = React.useState('');
  const [editTargetScore, setEditTargetScore] = React.useState(300);
  const [editInstitution, setEditInstitution] = React.useState('');
  const [editCourse, setEditCourse] = React.useState('');
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'active' | 'joined' | 'name'>('active');

  const openEditProfile = (u: StudentProfile) => {
    setUserToEdit(u);
    setEditName(u.name || '');
    setEditPhone(u.phone || '');
    setEditTargetScore(u.targetUTMEScore && u.targetUTMEScore <= 400 ? u.targetUTMEScore : 300);
    setEditInstitution(u.targetInstitution || '');
    setEditCourse(u.targetCourse || '');
  };

  const handleSaveStudentProfile = async () => {
    if (!userToEdit || !firestore) return;
    setIsSavingProfile(true);
    try {
      await updateDoc(doc(firestore, 'users', userToEdit.id), {
        name: editName.trim() || userToEdit.name,
        phone: editPhone.trim(),
        targetUTMEScore: Math.min(400, Math.max(0, Number(editTargetScore) || 0)),
        targetInstitution: editInstitution.trim(),
        targetCourse: editCourse.trim(),
      });
      toast({ title: 'Profile Updated', description: `${editName || userToEdit.name}'s student profile has been saved.`, variant: 'success' });
      setUserToEdit(null);
    } catch (e: any) {
      toast({ title: 'Update Failed', description: e.message || 'Could not update student profile.', variant: 'destructive' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const businessDocRef = useMemoFirebase(() => {
    if (!currentUser?.academyId || !firestore) return null;
    return doc(firestore, 'businessInstances', currentUser.academyId);
  }, [currentUser?.academyId, firestore]);
  const { data: academyInstance, isLoading: isBusinessLoading } = useDoc<Academy>(businessDocRef);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !currentUser) return null;
    const isSuperAdmin = currentUser.role === 'super-admin';
    const isAdminOrOwner = currentUser.role === 'admin' || currentUser.role === 'owner';
    if (!isSuperAdmin && !isAdminOrOwner) return null;

    if (isSuperAdmin) {
      return query(collection(firestore, "users"));
    }

    if (!currentUser.academyId) return null;
    return query(collection(firestore, "users"), where("academyId", "==", currentUser.academyId));
  }, [currentUser, firestore]);
  const { data: users, isLoading: areUsersLoading } = useCollection<StudentProfile>(usersQuery);

  const sortedUsers = React.useMemo(() => {
    if (!users) return [];
    return [...users].sort((a, b) => {
      if (sortBy === 'active') {
        const dateA = a.lastSeen ? a.lastSeen.toDate() : new Date(0);
        const dateB = b.lastSeen ? b.lastSeen.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      } else if (sortBy === 'joined') {
        const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [users, sortBy]);

  const invitationsQuery = useMemoFirebase(() => {
    if (!firestore || !currentUser) return null;
    if (currentUser.role === 'super-admin') {
      return query(collection(firestore, 'invitations'));
    }
    if (!currentUser.academyId) return null;
    return query(collection(firestore, 'invitations'), where('academyId', '==', currentUser.academyId));
  }, [currentUser, firestore]);
  const { data: invitations, isLoading: areInvitationsLoading } = useCollection<Invitation>(invitationsQuery);

  const isLoading = isProfileLoading || areUsersLoading || areInvitationsLoading || isBusinessLoading;
  const canManageUsers = currentUser?.role === 'admin' || currentUser?.role === 'super-admin' || currentUser?.role === 'owner';

  const handleRevokeInvitation = async () => {
    if (!invitationToRevoke || !firestore) return;
    const invitationRef = doc(firestore, 'invitations', invitationToRevoke.id);
    try {
      await deleteDoc(invitationRef);
      toast({ title: 'Invitation Revoked', description: `The invitation for ${invitationToRevoke.email} has been revoked.`, variant: 'success' });
    } catch (e) {
      toast({ title: 'Error', description: 'Could not revoke invitation.', variant: 'destructive' });
    } finally {
      setInvitationToRevoke(null);
    }
  };

  const handleUpdateUserStatus = async () => {
    if (!userToUpdate || !firestore) return;
    const userRef = doc(firestore, 'users', userToUpdate.user.id);
    const newStatus = userToUpdate.action === 'activate' ? 'active' : 'inactive';

    try {
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User does not exist.");
        }
        transaction.update(userRef, { status: newStatus });
      });
      toast({ title: `User ${userToUpdate.action}d`, description: `${userToUpdate.user.name}'s account has been ${userToUpdate.action}d.`, variant: 'success' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Could not update user status.', variant: 'destructive' });
    } finally {
      setUserToUpdate(null);
    }
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="w-full md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User & Staff Management</CardTitle>
                <CardDescription>
                  Invite and manage roles for your academy.
                </CardDescription>
              </div>
              <Button size="lg" className="h-9 gap-1" disabled={!canManageUsers} onClick={() => setIsAddUserDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Invite User
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1 ml-2">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Sort: {sortBy === 'active' ? 'Last Active' : sortBy === 'joined' ? 'Date Joined' : 'Name'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort Users By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy('active')}>
                    <Clock className="mr-2 h-4 w-4" /> Last Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('joined')}>
                    <Calendar className="mr-2 h-4 w-4" /> Date Joined
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('name')}>
                    <User className="mr-2 h-4 w-4" /> Name
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {!canManageUsers && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Permission Denied</AlertTitle>
                <AlertDescription>
                  You do not have permission to manage users. Please contact your academy administrator.
                </AlertDescription>
              </Alert>
            )}
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Live Activity</TableHead>
                    <TableHead className="hidden lg:table-cell">Target Course</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <UserRowSkeleton />
                  <UserRowSkeleton />
                </TableBody>
              </Table>
            ) : users && users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Live Activity</TableHead>
                    <TableHead className="hidden lg:table-cell">Target Course</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className='sr-only'>Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {(() => {
                          const activity = (user as any).currentActivity;
                          const lastSeen = user.lastSeen?.toDate();
                          const isOnlineNow = lastSeen && (Date.now() - lastSeen.getTime()) < 10 * 60 * 1000;
                          return activity ? (
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isOnlineNow ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                              <span className="text-xs text-muted-foreground">{activity}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {(user as any).targetCourse || (user as any).examTarget || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {user.lastSeen ? formatDistanceToNow(user.lastSeen.toDate(), { addSuffix: true }) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'inactive' ? 'destructive' : 'outline'} className="capitalize">
                          {user.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              disabled={!canManageUsers || currentUser.id === user.id}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); openEditProfile(user); }}>
                              <Edit3 className="mr-2 h-4 w-4" /> Edit Student Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'inactive' ? (
                              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); setUserToUpdate({ user, action: 'activate' }); }}>
                                <UserCheck className="mr-2 h-4 w-4" /> Activate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); setUserToUpdate({ user, action: 'deactivate' }); }}>
                                <UserX className="mr-2 h-4 w-4" /> Deactivate User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 border-2 border-dashed rounded-lg">
                <User className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold mt-4">No Staff Found</h3>
                <p className="text-muted-foreground mt-2 mb-4">Invite your first team member to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {canManageUsers && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>These users have been invited but have not yet signed up.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">Loading invitations...</div>
              ) : invitations && invitations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map(invitation => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">{invitation.email}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{invitation.role.replace('_', ' ')}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{invitation.createdAt ? formatDistanceToNow(invitation.createdAt.toDate(), { addSuffix: true }) : 'Just now'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => setInvitationToRevoke(invitation)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <Mail className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-4">No pending invitations.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {currentUser?.academyId && (
        <AddUserDialog
          isOpen={isAddUserDialogOpen}
          onOpenChange={setIsAddUserDialogOpen}
          academyId={currentUser.academyId}
          businessName={academyInstance?.name || ''}
          inviterName={currentUser.name}
          currentUserCount={users?.length || 0}
          pendingInvitationCount={invitations?.length || 0}
        />
      )}

      <AlertDialog open={!!invitationToRevoke} onOpenChange={(open) => !open && setInvitationToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will revoke the invitation for <strong>{invitationToRevoke?.email}</strong>. They will not be able to join your academy unless you invite them again.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeInvitation} className="bg-destructive hover:bg-destructive/90">Revoke</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>Update profile details and JAMB UTME goals for {userToEdit?.email}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="080..." />
              </div>
              <div className="space-y-1.5">
                <Label>Target JAMB Score (0–400)</Label>
                <Input type="number" min={0} max={400} value={editTargetScore} onChange={(e) => setEditTargetScore(Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Target Institution</Label>
              <Input value={editInstitution} onChange={(e) => setEditInstitution(e.target.value)} placeholder="e.g. OAU, UNILAG" />
            </div>
            <div className="space-y-1.5">
              <Label>Target Course</Label>
              <Input value={editCourse} onChange={(e) => setEditCourse(e.target.value)} placeholder="e.g. Medicine & Surgery" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setUserToEdit(null)} disabled={isSavingProfile}>Cancel</Button>
              <Button onClick={handleSaveStudentProfile} disabled={isSavingProfile} className="gap-1.5">
                <Save className="h-4 w-4" /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!userToUpdate} onOpenChange={(open) => !open && setUserToUpdate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {userToUpdate?.action === 'deactivate'
                ? <>This will mark <strong>{userToUpdate?.user.name}</strong> as inactive, and they will not be able to log in. Their data will be preserved.</>
                : <>This will reactivate <strong>{userToUpdate?.user.name}</strong>'s account, allowing them to log in again.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateUserStatus} className={userToUpdate?.action === 'deactivate' ? 'bg-destructive hover:bg-destructive/90' : ''}>
              {userToUpdate?.action === 'deactivate' ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
