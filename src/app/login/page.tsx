import { redirect } from "next/navigation";
import { signIn, isAuthConfigured, isAuthenticated } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchParams = {
  error?: string | string[];
};

async function loginAction(formData: FormData) {
  "use server";

  const password = formData.get("password");
  if (typeof password !== "string" || password.trim().length === 0) {
    redirect("/login?error=missing");
  }

  try {
    const authenticated = await signIn(password);
    if (!authenticated) {
      redirect("/login?error=invalid");
    }
  } catch {
    redirect("/login?error=config");
  }

  redirect("/dashboard");
}

function getErrorMessage(errorCode?: string) {
  if (errorCode === "missing") return "Password is required.";
  if (errorCode === "invalid") return "Invalid password.";
  if (errorCode === "config") return "Auth is not configured. Set APP_PASSWORD and APP_SESSION_SECRET.";
  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const errorCode = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined;
  const errorMessage = getErrorMessage(errorCode);
  const authConfigured = isAuthConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Private Access</CardTitle>
          <CardDescription>Enter your deployment password to open the app.</CardDescription>
        </CardHeader>
        <CardContent>
          {!authConfigured && (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              APP_PASSWORD and APP_SESSION_SECRET must be set in your environment variables.
            </p>
          )}
          {errorMessage && (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage}
            </p>
          )}
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
