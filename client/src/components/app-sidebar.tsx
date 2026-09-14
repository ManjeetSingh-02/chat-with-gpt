import { auth } from '@/api/auth';
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
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
import {
  useConversations,
  useCreateConversation,
  useDeleteConversation,
  useUpdateConversation,
} from '@/hooks/use-conversation';
import { toast } from '@/components/ui/toast';
import type { Conversation } from '@/types/conversations';
import { Link, useNavigate } from '@tanstack/react-router';
import { cn } from 'cn';
import {
  Archive,
  Bot,
  ChevronDown,
  Compass,
  Ellipsis,
  LogOut,
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
  const { data, isLoading, isError, error } = useConversations();
  const useCreateConversationMutation = useCreateConversation();
  const navigate = useNavigate();

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="mt-1 shrink-0 p-3">
        <div className="hidden justify-center group-data-[collapsible=icon]:flex">
          <SidebarTrigger />
        </div>

        <div>
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
            <Avatar className="bg-primary text-primary-foreground">
              <AvatarFallback className="bg-transparent text-inherit">
                <Bot />
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium">Chat with GPT</p>
              <p className="text-muted-foreground truncate text-xs">Your thinking partner</p>
            </div>

            <SidebarTrigger />
          </div>

          <Separator className="mt-3 mb-2 group-data-[collapsible=icon]:hidden" />

          <div className="flex w-full gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
            <SidebarButton
              title="New chat"
              onClick={() =>
                useCreateConversationMutation.mutate(undefined, {
                  onError: error =>
                    toast.add({
                      title: error.message,
                      type: 'error',
                      timeout: 3000,
                    }),
                  onSuccess: ({ data }) =>
                    navigate({
                      to: '/conversations/$id',
                      params: { id: data.data.id },
                    }),
                })
              }
            >
              <Plus />
              <span className="group-data-[collapsible=icon]:hidden">New chat</span>
            </SidebarButton>

            <Separator
              orientation="vertical"
              className="group-data-[collapsible=icon]:hidden"
            />
            <Separator
              orientation="horizontal"
              className="hidden group-data-[collapsible=icon]:block"
            />
            <Link
              to="/conversations"
              className="group-data-[collapsible=icon]:flex-1"
            >
              <SidebarButton title="Explore">
                <Compass />
                <span className="group-data-[collapsible=icon]:hidden">Explore</span>
              </SidebarButton>
            </Link>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-destructive text-center">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </span>
          </div>
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

      <SidebarFooter className="mb-1 shrink-0 p-3">
        <div>
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
            <Avatar className="bg-primary text-primary-foreground">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="bg-transparent text-inherit">
                <User />
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium">{user.name}</p>
              <p className="text-muted-foreground truncate text-xs">{user.email}</p>
            </div>
          </div>

          <Separator className="mt-3 mb-2 group-data-[collapsible=icon]:hidden" />

          <div className="flex w-full gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
            <Link
              to="/settings"
              className="group-data-[collapsible=icon]:flex-1"
            >
              <SidebarButton title="Settings">
                <Settings />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </SidebarButton>
            </Link>

            <Separator
              orientation="vertical"
              className="group-data-[collapsible=icon]:hidden"
            />
            <Separator
              orientation="horizontal"
              className="hidden group-data-[collapsible=icon]:block"
            />

            <SidebarButton
              title="Log out"
              className="hover:text-destructive"
              onClick={async () =>
                await auth
                  .logout()
                  .then(() =>
                    toast.add({
                      title: 'Logged out successfully',
                      type: 'success',
                      timeout: 3000,
                    })
                  )
                  .catch(error =>
                    toast.add({
                      title: error.message,
                      type: 'error',
                      timeout: 3000,
                    })
                  )
              }
            >
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarButton>
          </div>
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
                  <SidebarMenuButton
                    tooltip={c.title}
                    render={
                      <Link
                        params={{ id: c.id }}
                        to={'/conversations/$id'}
                      />
                    }
                  >
                    <span className="truncate">{c.title}</span>
                  </SidebarMenuButton>
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
    <Button
      variant="ghost"
      className={cn(
        'text-muted-foreground hover:text-primary min-w-0 transition-colors group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:px-1 hover:bg-transparent',
        className
      )}
      title={title}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ActionsMenu({ id, isPinned, title }: { id: string; isPinned: boolean; title: string }) {
  const [conversationTitle, setConversationTitle] = useState(title);
  const updateConversationMutation = useUpdateConversation(id);
  const deleteConversationMutation = useDeleteConversation();

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
            onClick={() =>
              updateConversationMutation.mutate(
                { isPinned: !isPinned },
                {
                  onError: error =>
                    toast.add({
                      title: error.message,
                      type: 'error',
                      timeout: 3000,
                    }),
                  onSuccess: () =>
                    toast.add({
                      title: `Conversation ${isPinned ? 'unpinned' : 'pinned'}`,
                      type: 'success',
                      timeout: 3000,
                    }),
                }
              )
            }
          >
            {isPinned ? <PinOff /> : <PinIcon />}
            <span>{isPinned ? 'Unpin' : 'Pin'}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              updateConversationMutation.mutate(
                { isArchived: true },
                {
                  onError: error =>
                    toast.add({
                      title: error.message,
                      type: 'error',
                      timeout: 3000,
                    }),
                  onSuccess: () =>
                    toast.add({
                      title: 'Conversation archived',
                      type: 'success',
                      timeout: 3000,
                    }),
                }
              )
            }
          >
            <Archive />
            <span>Archive</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() =>
              deleteConversationMutation.mutate(id, {
                onError: error =>
                  toast.add({
                    title: error.message,
                    type: 'error',
                    timeout: 3000,
                  }),
                onSuccess: () =>
                  toast.add({
                    title: 'Conversation deleted',
                    type: 'success',
                    timeout: 3000,
                  }),
              })
            }
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
                onClick={() =>
                  updateConversationMutation.mutate(
                    { title: conversationTitle },
                    {
                      onError: error =>
                        toast.add({
                          title: error.message,
                          type: 'error',
                          timeout: 3000,
                        }),
                      onSuccess: () =>
                        toast.add({
                          title: 'Conversation renamed',
                          type: 'success',
                          timeout: 3000,
                        }),
                    }
                  )
                }
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
