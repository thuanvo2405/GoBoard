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
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <Button variant="ghost" className="absolute left-6 top-6">
        <Link to="/">← Back to Home</Link>
      </Button>

      <Card className="w-full max-w-sm">
        <form action={signUp}>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>

            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>

            <CardAction>
              <Button variant="link" type="button">
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-4">
            <Button type="submit" className="w-full ">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
