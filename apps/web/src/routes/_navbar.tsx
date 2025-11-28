import {
  createFileRoute,
  Link,
  Outlet,
  useRouter
} from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { Button } from 'src/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList
} from 'src/components/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from 'src/components/ui/sheet';
import { Label } from 'src/components/ui/label';
import { authClient, invalidateAuthCache } from 'src/lib/auth/client';
import { toast } from 'sonner';
import { useState } from 'react';
import { useLogger } from 'src/lib/logger';

const { logger } = useLogger();

export const Route = createFileRoute('/_navbar')({
  component: RootComponent
});

function RootComponent() {
  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <hr />
      <div className="no-scrollbar h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

function Navbar() {
  const router = useRouter();
  const { queryClient, user } = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const title = 'Starter';
  const logoAlt = 'donut';
  const logoSrc = '/donut.svg';
  const items = [
    { label: 'Recipes', href: '/recipe', light: false }
    // TODO: Implement a sandbox playground.
    // { label: 'Sandbox', href: '/sandbox', light: true }
  ];

  const handleLogout = async () => {
    setOpen(false);
    const res = await authClient.signOut();
    logger.info('User signed out', res);
    if (res.data) {
      await invalidateAuthCache(router, queryClient);
      navigate({ to: '/' });
    } else {
      toast.error(res.error?.message ?? 'Sign out failed');
    }
  };

  return (
    <section className="p-2">
      <div className="container mx-auto">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoSrc} className="w-8" alt={logoAlt} />
              <span className="text-xl font-extrabold">{title}</span>
            </Link>
            <div className="text-muted-foreground flex items-center font-medium">
              <NavigationMenu>
                <NavigationMenuList>
                  {items.map(({ label, href }) => (
                    <Link
                      key={label}
                      to={href}
                      className="group bg-background hover:bg-muted hover:text-accent-foreground active:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 transition-colors"
                      activeProps={{
                        className: 'text-accent-foreground font-bold'
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Label className="text-md">Hello, {user.firstName}!</Label>
                <Button className="cursor-pointer" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            )}
          </div>
        </nav>
        {/** Mobile. */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoSrc} className="w-8" alt={logoAlt} />
              <span className="text-lg font-semibold">{title}</span>
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <SheetClose asChild>
                      <Link to="/" className="flex items-center gap-2">
                        <img src={logoSrc} className="w-8" alt={logoAlt} />
                        <span className="text-lg font-semibold">{title}</span>
                      </Link>
                    </SheetClose>
                  </SheetTitle>
                  {items
                    .filter((item) => !item.light)
                    .map(({ label, href }) => (
                      <SheetClose asChild key={label}>
                        <Link
                          to={href}
                          className="hover:bg-muted hover:text-accent-foreground inline-flex h-10 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
                        >
                          {label}
                        </Link>
                      </SheetClose>
                    ))}
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <div className="border-t py-4">
                    <div className="justify-start">
                      {items
                        .filter((item) => item.light)
                        .map(({ label, href }) => (
                          <Link
                            key={label}
                            to={href}
                            className="text-muted-foreground hover:bg-muted hover:text-accent-foreground inline-flex h-10 w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
                          >
                            {label}
                          </Link>
                        ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {!user ? (
                      <>
                        <Button asChild variant="outline">
                          <Link to="/login">Log in</Link>
                        </Button>
                        <Button asChild>
                          <Link to="/signup">Sign up</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleLogout}>Log out</Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
