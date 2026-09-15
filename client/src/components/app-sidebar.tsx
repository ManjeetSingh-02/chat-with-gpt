import { ThemeSelector } from '@/components/theme-selector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import {
  useConversations,
  useCreateConversation,
  useDeleteConversation,
  useUpdateConversation,
} from '@/hooks/use-conversation';
import { authClient } from '@/lib/auth-client';
import type { Conversation } from '@/types/conversations';
import { useNavigate } from '@tanstack/react-router';
import { cn } from 'cn';
import {
  Archive,
  Bot,
  ChevronDown,
  Ellipsis,
  LogOut,
  MessageSquare,
  MessagesSquare,
  Pencil,
  PinIcon,
  PinOff,
  Plus,
  Settings,
  Trash,
  User,
} from 'lucide-react';
import { useState } from 'react';

type AppSidebarProps = {
  user: {
    image: string | undefined | null;
    name: string;
    email: string;
  };
};

export function AppSidebar({ user }: AppSidebarProps) {
  const { data, isLoading, isError, error } = useConversations(false);
  const useCreateConversationMutation = useCreateConversation();
  const navigate = useNavigate();

  function createConversation() {
    return useCreateConversationMutation.mutate(undefined, {
      onSuccess: ({ data }) =>
        navigate({
          to: '/conversations/$id',
          params: { id: data.data.id },
        }),
      onError: error =>
        toast.add({
          title: error.message,
          type: 'error',
          timeout: 3000,
        }),
    });
  }

  async function logoutUser() {
    try {
      await authClient.signOut();
      toast.add({
        title: 'Logged out successfully',
        type: 'success',
        timeout: 3000,
      });
    } catch {
      toast.add({
        title: 'Failed to log out',
        type: 'error',
        timeout: 3000,
      });
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader>
        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="bg-primary text-primary-foreground group-data-[collapsible=icon]:hidden">
                <AvatarFallback className="bg-transparent text-inherit">
                  <Bot />
                </AvatarFallback>
              </Avatar>

              <div className="group-data-[collapsible=icon]:hidden">
                <p className="truncate text-base font-medium">Chat with GPT</p>
                <p className="text-muted-foreground truncate text-xs">Your thinking partner</p>
              </div>
            </div>

            <SidebarTrigger />
          </div>

          <SidebarButton
            title="View Conversations"
            onClick={() => navigate({ to: '/conversations' })}
          >
            <MessagesSquare />
            <span className="group-data-[collapsible=icon]:hidden">View Conversations</span>
          </SidebarButton>

          <SidebarButton
            title="New Conversation"
            onClick={createConversation}
          >
            <Plus />
            <span className="group-data-[collapsible=icon]:hidden">New Conversation</span>
          </SidebarButton>
        </div>
      </SidebarHeader>

      <SidebarContent className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
        {isLoading ? (
          <div className="flex h-full items-center justify-center group-data-[collapsible=icon]:hidden">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center group-data-[collapsible=icon]:hidden">
            <span className="text-destructive text-center">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </span>
          </div>
        ) : data.pinned.length === 0 && data.recents.length === 0 ? (
          <Empty className="group-data-[collapsible=icon]:hidden">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessagesSquare />
              </EmptyMedia>
              <EmptyTitle>No conversations</EmptyTitle>
              <EmptyDescription>Start a new conversation to see it here</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {data.pinned.length > 0 && (
              <NavigationGroup
                label="Pinned"
                conversations={data.pinned}
              />
            )}
            <NavigationGroup
              label="Recents"
              conversations={data.recents}
            />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="bg-primary text-primary-foreground group-data-[collapsible=icon]:hidden">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="bg-transparent text-inherit">
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="truncate text-base font-medium">{user.name}</p>
                <p className="text-muted-foreground truncate text-xs">Free</p>
              </div>
            </div>

            <ThemeSelector />
          </div>

          <SidebarButton
            title="Settings"
            onClick={() => navigate({ to: '/settings' })}
          >
            <Settings />
            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
          </SidebarButton>

          <SidebarButton
            title="Logout"
            className="hover:text-destructive"
            onClick={logoutUser}
          >
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </SidebarButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavigationGroup({
  conversations,
  label,
}: {
  conversations: Conversation[];
  label: string;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel
        render={<button type="button" />}
        className="hover:text-accent-foreground w-full justify-start gap-1 pr-2"
        onClick={() => setIsCollapsed(collapsed => !collapsed)}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            'hidden transition-transform group-hover:block',
            isCollapsed && '-rotate-90'
          )}
        />
      </SidebarGroupLabel>

      <SidebarGroupContent className={cn('overflow-hidden', isCollapsed && 'hidden')}>
        <SidebarMenu>
          {conversations.map(c => {
            return (
              <SidebarMenuItem key={c.id}>
                <div className="hover:bg-accent flex w-full items-center rounded-md">
                  <SidebarButton
                    title={c.title}
                    onClick={() => navigate({ to: '/conversations/$id', params: { id: c.id } })}
                  >
                    {c.isPinned ? <PinIcon /> : <MessageSquare />}
                    <span className="truncate">{c.title}</span>
                  </SidebarButton>
                  <ActionsMenu
                    id={c.id}
                    isPinned={c.isPinned}
                    title={c.title}
                  />
                </div>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function SidebarButton({
  title,
  className,
  onClick,
  children,
}: {
  title: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <SidebarMenuButton
      title={title}
      onClick={onClick}
      className={cn('text-primary hover:bg-accent', className)}
    >
      {children}
    </SidebarMenuButton>
  );
}

function ActionsMenu({ id, isPinned, title }: { id: string; isPinned: boolean; title: string }) {
  const [conversationTitle, setConversationTitle] = useState(title);
  const updateConversationMutation = useUpdateConversation(id);
  const deleteConversationMutation = useDeleteConversation(id, false);

  function pinOrUnpinConversation() {
    return updateConversationMutation.mutate(
      { isPinned: !isPinned },
      {
        onSuccess: () =>
          toast.add({
            title: `Conversation ${isPinned ? 'unpinned' : 'pinned'}`,
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

  function archiveConversation() {
    return updateConversationMutation.mutate(
      { isArchived: true },
      {
        onSuccess: () =>
          toast.add({
            title: 'Conversation archived',
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

  function deleteConversation() {
    return deleteConversationMutation.mutate(undefined, {
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
    });
  }

  function renameConversation() {
    return updateConversationMutation.mutate(
      { title: conversationTitle },
      {
        onSuccess: () =>
          toast.add({
            title: 'Conversation renamed',
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

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground shrink-0 hover:flex"
            >
              <Ellipsis />
            </Button>
          }
        />

        <DropdownMenuContent>
          <DialogTrigger
            render={
              <DropdownMenuItem className="cursor-pointer">
                <Pencil />
                <span>Rename</span>
              </DropdownMenuItem>
            }
          />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={pinOrUnpinConversation}
          >
            {isPinned ? <PinOff className="rotate-45" /> : <PinIcon className="rotate-45" />}
            <span>{isPinned ? 'Unpin' : 'Pin'}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={archiveConversation}
          >
            <Archive />
            <span>Archive</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={deleteConversation}
          >
            <Trash />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
          <DialogDescription>Enter a new name for this conversation</DialogDescription>
        </DialogHeader>

        <Field>
          <Input
            id="title"
            name="title"
            value={conversationTitle}
            onChange={e => setConversationTitle(e.target.value)}
          />
        </Field>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose
            render={
              <Button
                disabled={conversationTitle.trim().length === 0 || conversationTitle === title}
                onClick={renameConversation}
              >
                <span>Rename</span>
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
