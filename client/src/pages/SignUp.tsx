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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { byteLength } from "@/utils/convert";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

export const formSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required.")
        .refine(
            (value) => byteLength(value) <= 500,
            "Name must not be more than 500 bytes long.",
        ),

    email: z
        .string()
        .min(1, "Email is required.")
        .email("Must be a valid email address."),

    password: z
        .string()
        .refine(
            (value) => byteLength(value) >= 8,
            "Password must be at least 8 bytes long.",
        )
        .refine(
            (value) => byteLength(value) <= 72,
            "Password must not be more than 72 bytes long.",
        ),
});

export default function SignUp() {
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: postSignUp,
        onSuccess: () => {
            navigate("/signin");
            toast.success("Account created successfully");
        },
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }: { value: SignUpPayload }) => {
            try {
                await mutation.mutateAsync(value);
                form.reset();
            } catch (error) {
                // mutation.isError display error message in JSX
            }
        },
    });

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 px-4">
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
                <form
                    id="signup-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <CardHeader className="space-y-2 border-b border-slate-100 px-6 pb-6 pt-7 sm:px-8">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
                                Create your account
                            </CardTitle>

                            <CardDescription className="text-sm leading-6 text-slate-500">
                                Enter your information below to create your
                                account
                            </CardDescription>
                        </div>

                        <CardAction>
                            <Link
                                to="/signin"
                                className="text-sm font-semibold text-slate-900 hover:underline"
                            >
                                Login
                            </Link>
                        </CardAction>
                    </CardHeader>

                    <CardContent className="px-6 py-7 sm:px-8">
                        <div className="flex flex-col gap-5">
                            {mutation.isError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {mutation.error.message}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <form.Field
                                    name="name"
                                    children={(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    Username
                                                </FieldLabel>

                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder="Bob"
                                                />

                                                {isInvalid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                />
                            </div>

                            <div className="grid gap-2">
                                <form.Field
                                    name="email"
                                    children={(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    Email
                                                </FieldLabel>

                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder="bob@example.com"
                                                    type="email"
                                                />

                                                {isInvalid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                />
                            </div>

                            <div className="grid gap-2">
                                <form.Field
                                    name="password"
                                    children={(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    Password
                                                </FieldLabel>

                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder="************"
                                                    type="password"
                                                />

                                                {isInvalid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="px-6 pb-7 sm:px-8">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="h-11 w-full rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                        >
                            {mutation.isPending
                                ? "Creating account..."
                                : "Create account"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
