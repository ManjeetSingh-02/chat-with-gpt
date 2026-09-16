import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import {
  useConversations,
  useDeleteConversation,
  useDeleteConversations,
  useUpdateConversation,
} from '@/hooks/use-conversation';
import { authClient } from '@/lib/auth-client';
import { createFileRoute } from '@tanstack/react-router';
import { ArchiveRestore, Ellipsis, MessagesSquare, Trash } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/(app)/settings')({
  loader: async ({ context }) => ({ user: context.user }),

  component: function Settings() {
    const { user } = Route.useLoaderData();
    const [userName, setUserName] = useState(user.name);
    const { data, error, isError, isLoading } = useConversations({ isArchived: true });
    const updateConversationMutation = useUpdateConversation();
    const deleteConversationMutation = useDeleteConversation();
    const deleteConversationsMutation = useDeleteConversations();

    function restoreConversation(id: string) {
      return updateConversationMutation.mutate(
        { id, data: { isArchived: false } },
        {
          onSuccess: () =>
            toast.add({
              title: 'Conversation restored',
              type: 'success',
              timeout: 3000,
            }),
          onError: error =>
            toast.add({
              title: error.message,
              type: 'error',
              timeout: 3000,
            }),
        }
      );
    }

    function deleteConversation(id: string) {
      return deleteConversationMutation.mutate(
        { id, isArchived: true },
        {
          onSuccess: () =>
            toast.add({
              title: 'Conversation deleted',
              type: 'success',
              timeout: 3000,
            }),
          onError: error =>
            toast.add({
              title: error.message,
              type: 'error',
              timeout: 3000,
            }),
        }
      );
    }

    function deleteConversations() {
      return deleteConversationsMutation.mutate(undefined, {
        onSuccess: () =>
          toast.add({
            title: 'Conversations deleted',
            type: 'success',
            timeout: 3000,
          }),
        onError: error =>
          toast.add({
            title: error.message,
            type: 'error',
            timeout: 3000,
          }),
      });
    }

    async function updateUserName() {
      try {
        await authClient.updateUser({ name: userName });

        toast.add({
          title: 'Name updated',
          type: 'success',
          timeout: 3000,
        });
      } catch {
        toast.add({
          title: 'Failed to update name',
          type: 'error',
          timeout: 3000,
        });
      }
    }

    async function deleteAccount() {
      try {
        await authClient.deleteUser();

        toast.add({
          title: 'Account deleted',
          type: 'success',
          timeout: 3000,
        });
      } catch {
        toast.add({
          title: 'Failed to delete account',
          type: 'error',
          timeout: 3000,
        });
      }
    }

    return (
      <div className="flex min-h-full justify-center py-10">
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your account and conversations</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Archived conversations</p>
                  <p className="text-muted-foreground">Manage conversations you've archived</p>
                </div>

                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Manage
                      </Button>
                    }
                  />

                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Archived Conversations</DialogTitle>
                    </DialogHeader>

                    {isLoading ? (
                      <div className="mt-2 flex flex-col items-center justify-center gap-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ) : isError ? (
                      <div className="flex items-center justify-center">
                        <span className="text-destructive text-center">
                          {error instanceof Error ? error.message : 'Something went wrong'}
                        </span>
                      </div>
                    ) : data.archived.length === 0 ? (
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <MessagesSquare />
                          </EmptyMedia>
                          <EmptyTitle>No archived conversations</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    ) : (
                      <Table>
                        <TableBody>
                          {data.archived.map(c => (
                            <TableRow
                              key={c.id}
                              className="hover:bg-card flex items-center justify-between"
                            >
                              <TableCell className="wrap-break-word">{c.title}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    render={
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-foreground"
                                      >
                                        <Ellipsis />
                                      </Button>
                                    }
                                  />

                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() => restoreConversation(c.id)}
                                    >
                                      <ArchiveRestore />
                                      <span>Restore</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                      variant="destructive"
                                      className="cursor-pointer"
                                      onClick={() => deleteConversation(c.id)}
                                    >
                                      <Trash />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delete conversations</p>
                  <p className="text-muted-foreground">Permanently delete all your conversations</p>
                </div>

                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={deleteConversations}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-muted-foreground">{user.name}</p>
                </div>

                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Edit
                      </Button>
                    }
                  />

                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Update Name</DialogTitle>
                      <DialogDescription>Enter a new name for your account</DialogDescription>
                    </DialogHeader>

                    <Field>
                      <Input
                        id="name"
                        name="name"
                        maxLength={20}
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                      />
                    </Field>

                    <DialogFooter>
                      <DialogClose render={<Button variant="outline">Cancel</Button>} />

                      <DialogClose
                        render={
                          <Button
                            disabled={userName.trim().length === 0 || userName === user.name}
                            onClick={updateUserName}
                          >
                            Rename
                          </Button>
                        }
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delete account</p>
                  <p className="text-muted-foreground">
                    Permanently delete your account and all of its data
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={deleteAccount}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
});
