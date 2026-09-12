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
import { Link } from '@tanstack/react-router';
import { cn } from 'cn';
import { Bot, ChevronDown, Compass, LogOut, Plus, Settings, User } from 'lucide-react';
import { useState } from 'react';

interface IAppSidebar {
  groups: {
    label: string;
    conversations: {
      id: string;
      title: string;
    }[];
  }[];

  user: {
    image: string | undefined | null;
    name: string;
    email: string;
  };
}

export function AppSidebar({ user, groups }: IAppSidebar) {
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

          <div className="flex w-full gap-2 group-data-[collapsible=icon]:flex-col">
            <Link to="/conversations">
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
            <Link to="/conversations">
              <SidebarButton title="Explore">
                <Compass />
                <span className="group-data-[collapsible=icon]:hidden">Explore</span>
              </SidebarButton>
            </Link>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {groups.map(g => (
          <NavigationGroup
            key={g.label}
            label={g.label}
            conversations={g.conversations}
          />
        ))}
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

          <div className="flex w-full gap-2 group-data-[collapsible=icon]:flex-col">
            <Link to="/settings">
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

function NavigationGroup({ conversations, label }: IAppSidebar['groups'][0]) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel
        render={<button type="button" />}
        className="w-full justify-start gap-1 pr-2"
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

type SidebarButtonProps = {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
};

function SidebarButton({ title, onClick, children }: SidebarButtonProps) {
  return (
    <Button
      variant="ghost"
      className="text-muted-foreground hover:text-primary min-w-0 flex-1 transition-colors group-data-[collapsible=icon]:px-1 hover:bg-transparent"
      title={title}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
