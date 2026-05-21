import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Compass,
  MessageCircle,
  Sparkles,
  ChevronRight,
} from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUsage, type UsageKind } from "@/lib/usage";

type SubItem = { title: string; hash: string };

const items: Array<{
  title: string;
  url: string;
  icon: typeof Mail;
  kind?: UsageKind;
  subs?: SubItem[];
}> = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail, kind: "email" },
  {
    title: "Meeting Notes",
    url: "/meetings",
    icon: FileText,
    kind: "meetings",
    subs: [
      { title: "Key points", hash: "key-points" },
      { title: "Actions", hash: "actions" },
      { title: "Deadlines", hash: "deadlines" },
    ],
  },
  {
    title: "Task Planner",
    url: "/tasks",
    icon: ListChecks,
    kind: "tasks",
    subs: [
      { title: "Prioritization", hash: "prioritization" },
      { title: "Scheduling", hash: "scheduling" },
    ],
  },
  {
    title: "Research Assist",
    url: "/research",
    icon: Compass,
    kind: "research",
    subs: [
      { title: "Insights", hash: "insights" },
      { title: "Summaries", hash: "summaries" },
    ],
  },
  { title: "AI Chatbot", url: "/chat", icon: MessageCircle, kind: "chat" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const currentHash = useRouterState({ select: (r) => r.location.hash });
  const usage = useUsage();
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold">Aurora</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                AI Workspace
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const runs = item.kind ? usage[item.kind].runs : 0;
                const active = isActive(item.url);
                const hasSubs = !!item.subs?.length;

                const labelRow = (
                  <>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.kind && runs > 0 && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            {runs > 99 ? "99+" : runs}
                          </span>
                        )}
                      </>
                    )}
                  </>
                );

                if (!hasSubs || collapsed) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.kind ? `${item.title} · ${runs} runs` : item.title}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          {labelRow}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <Collapsible key={item.title} defaultOpen={active} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={active}
                          className="w-full"
                          tooltip={item.title}
                        >
                          {labelRow}
                          <ChevronRight className="ml-1 h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={active && !currentHash}>
                              <Link to={item.url}>Overview</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {item.subs!.map((s) => {
                            const subActive = active && currentHash === s.hash;
                            return (
                              <SidebarMenuSubItem key={s.hash}>
                                <SidebarMenuSubButton asChild isActive={subActive}>
                                  <Link to={item.url} hash={s.hash}>
                                    {s.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        {!collapsed ? (
          <div className="rounded-lg bg-accent/60 p-3 text-xs text-accent-foreground">
            <p className="font-medium">Powered by Lovable AI</p>
            <p className="mt-1 text-muted-foreground">All features ready to use.</p>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
