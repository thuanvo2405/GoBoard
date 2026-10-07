import { Button } from "@/components/ui/button";
import {
    ChartColumnIncreasing,
    CheckCircle2,
    Medal,
    MessageCircleMore,
    Sparkles,
    UserRoundGroup,
    Zap,
} from "lucide-react";
import { Link } from "react-router";

const features = [
    {
        icon: Zap,
        title: "Organize your work",
        description:
            "Turn ideas into actionable tasks and organize everything with flexible boards.",
    },
    {
        icon: UserRoundGroup,
        title: "Work together",
        description:
            "Invite teammates, assign responsibilities, and keep everyone aligned.",
    },
    {
        icon: MessageCircleMore,
        title: "Real-time collaboration",
        description:
            "See updates instantly and collaborate smoothly with WebSocket-powered sync.",
    },
    {
        icon: ChartColumnIncreasing,
        title: "Track progress",
        description:
            "Stay on top of every task and understand how your projects are moving forward.",
    },
];

const benefits = [
    "Real-time updates",
    "Team collaboration",
    "Simple task management",
];

export default function Marketing() {
    return (
        <>
            <section className="relative overflow-hidden border-b bg-background">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-50 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -right-37.5 top-50 h-87.5 w-87.5 rounded-full bg-blue-500/10 blur-3xl" />
                </div>

                <div className="relative mx-auto flex min-h-155 max-w-7xl flex-col items-center justify-center px-6 py-20 text-center lg:py-28">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
                        <Sparkles className="size-4 text-primary" />
                        <span>Built for modern teams</span>
                    </div>

                    <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                        Move your team's work
                        <span className="block bg-linear-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
                            forward with GoBoard.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Organize tasks, collaborate with your team, and keep
                        every project moving forward — all in one simple
                        workspace.
                    </p>

                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                        <Button size="lg" className="h-12 rounded-xl px-7">
                            <Link to="/signup">Get started for free</Link>
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="h-12 rounded-xl px-7"
                        >
                            <Link to="/signin">Sign in</Link>
                        </Button>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit}
                                className="flex items-center gap-2"
                            >
                                <CheckCircle2 className="size-4 text-primary" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-14 w-full max-w-5xl">
                        <div className="absolute inset-x-12 -bottom-6 h-20 rounded-full bg-primary/20 blur-3xl" />

                        <div className="relative overflow-hidden rounded-2xl border bg-card p-2 shadow-2xl shadow-black/10">
                            <div className="rounded-xl border bg-muted/30 p-4 sm:p-6">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-left text-sm font-semibold">
                                            Product Development
                                        </p>

                                        <p className="text-left text-xs text-muted-foreground">
                                            Team workspace
                                        </p>
                                    </div>

                                    <div className="flex -space-x-2">
                                        <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground">
                                            A
                                        </div>

                                        <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground">
                                            B
                                        </div>

                                        <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground">
                                            C
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 text-left md:grid-cols-3">
                                    <div className="rounded-xl bg-muted/70 p-3">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-semibold">
                                                To do
                                            </span>

                                            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                                                3
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                                <p className="text-sm font-medium">
                                                    Design dashboard
                                                </p>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="h-1.5 w-16 rounded-full bg-primary/20">
                                                        <div className="h-full w-2/3 rounded-full bg-primary" />
                                                    </div>

                                                    <div className="size-6 rounded-full bg-muted" />
                                                </div>
                                            </div>

                                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                                <p className="text-sm font-medium">
                                                    Create auth flow
                                                </p>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="h-1.5 w-16 rounded-full bg-primary/20">
                                                        <div className="h-full w-1/2 rounded-full bg-primary" />
                                                    </div>

                                                    <div className="size-6 rounded-full bg-muted" />
                                                </div>
                                            </div>

                                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                                <p className="text-sm font-medium">
                                                    Setup database
                                                </p>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="h-1.5 w-16 rounded-full bg-primary/20">
                                                        <div className="h-full w-1/3 rounded-full bg-primary" />
                                                    </div>

                                                    <div className="size-6 rounded-full bg-muted" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-muted/70 p-3">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-semibold">
                                                In progress
                                            </span>

                                            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                                                2
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                                <p className="text-sm font-medium">
                                                    Real-time updates
                                                </p>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="h-1.5 w-16 rounded-full bg-primary/20">
                                                        <div className="h-full w-3/4 rounded-full bg-primary" />
                                                    </div>

                                                    <div className="size-6 rounded-full bg-muted" />
                                                </div>
                                            </div>

                                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                                <p className="text-sm font-medium">
                                                    Board API
                                                </p>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="h-1.5 w-16 rounded-full bg-primary/20">
                                                        <div className="h-full w-1/2 rounded-full bg-primary" />
                                                    </div>

                                                    <div className="size-6 rounded-full bg-muted" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-muted/70 p-3">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-semibold">
                                                Done
                                            </span>

                                            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                                                2
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                                <p className="text-sm font-medium">
                                                    Project setup
                                                </p>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="h-1.5 w-16 rounded-full bg-primary/20">
                                                        <div className="h-full w-full rounded-full bg-primary" />
                                                    </div>

                                                    <div className="size-6 rounded-full bg-muted" />
                                                </div>
                                            </div>

                                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                                <p className="text-sm font-medium">
                                                    User registration
                                                </p>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="h-1.5 w-16 rounded-full bg-primary/20">
                                                        <div className="h-full w-full rounded-full bg-primary" />
                                                    </div>

                                                    <div className="size-6 rounded-full bg-muted" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-muted/30">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <Medal className="size-4" />
                            EVERYTHING YOU NEED
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            One workspace for your whole team
                        </h2>

                        <p className="mt-4 text-muted-foreground">
                            GoBoard gives your team the tools to organize work,
                            collaborate in real time, and stay focused.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="group rounded-2xl border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Icon className="size-5" />
                                    </div>

                                    <h3 className="text-base font-semibold">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="border-t">
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to move your work forward?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm text-primary-foreground/80 sm:text-base">
                            Create your workspace and start organizing your
                            team's tasks today.
                        </p>

                        <Button
                            size="lg"
                            variant="secondary"
                            className="mt-7 rounded-xl"
                        >
                            <Link to="/signup">Start using GoBoard</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
