import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { authClient } from '@/lib/auth-client';
import type { Conversation } from '@/types/conversations';
import { Link } from '@tanstack/react-router';
import { cn } from 'cn';
import { Bot, ChevronDown, Compass, LogOut, Plus, Settings, User } from 'lucide-react';
import { useState } from 'react';

interface IAppSidebar {
  conversations: {
    pinned: Conversation[];
    recents: Conversation[];
  };
  user: {
    image: string | undefined | null;
    name: string;
    email: string;
  };
}

export function AppSidebar({ conversations, user }: IAppSidebar) {
  async function signOut() {
    await authClient.signOut();
  }

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
            <Link
              to="/conversations"
              className="group-data-[collapsible=icon]:flex-1"
            >
              <SidebarButton title="New chat">
                <Plus />
                <span className="group-data-[collapsible=icon]:hidden">New chat</span>
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
        {conversations.pinned.length > 0 && (
          <NavigationGroup
            label="Pinned"
            conversations={conversations.pinned}
          />
        )}
        <NavigationGroup
          label="Recents"
          conversations={conversations.recents}
        />
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
              onClick={signOut}
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
        <ChevronDown className={cn('transition-transform', isCollapsed && '-rotate-90')} />
      </SidebarGroupLabel>

      <SidebarGroupContent className={cn('overflow-hidden', isCollapsed && 'hidden')}>
        <SidebarMenu>
          {conversations.map(c => {
            return (
              <SidebarMenuItem key={c.id}>
                <SidebarMenuButton
                  tooltip={c.title}
                  render={
                    <Link
                      params={{ id: c.id }}
                      to={'/conversations/$id'}
                    />
                  }
                >
                  {c.title}
                </SidebarMenuButton>
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
