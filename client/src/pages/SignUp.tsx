import { postSignUp, type SignUpPayload } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router";

export default function SignUp() {
  const mutation = useMutation({
    mutationFn: postSignUp,
  });

  async function signUp(formData: FormData) {
    const payload: SignUpPayload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    mutation.mutate(payload);
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

      <Button
        variant="ghost"
        className="absolute left-4 top-4 rounded-xl text-slate-600 transition-colors hover:bg-white/80 hover:text-slate-950 md:left-8 md:top-8"
      >
        <Link to="/" className="flex items-center gap-2">
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </Button>

      <Card className="relative z-10 w-full max-w-md border border-slate-200/80 bg-white/90 py-0 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
        <form action={signUp}>
          <CardHeader className="space-y-2 border-b border-slate-100 px-6 pb-6 pt-7 sm:px-8">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
                Login to your account
              </CardTitle>

              <CardDescription className="text-sm leading-6 text-slate-500">
                Enter your email below to login to your account
              </CardDescription>
            </div>

            <CardAction>
              <Button
                variant="link"
                type="button"
                className="px-0 font-semibold text-slate-900"
              >
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700"
                >
                  Username
                </Label>

                <Input
                  id="name"
                  name="name"
                  type="name"
                  placeholder="Bob"
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-4 shadow-none transition-all placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-200"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-4 shadow-none transition-all placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-200"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-4 shadow-none transition-all focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-200"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-6 pb-7 sm:px-8">
            <Button
              type="submit"
              className="h-11 w-full rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
