import { Button } from "@/components/ui/button";
import {
  ChartColumnIncreasing,
  Medal,
  MessageCircleMore,
  UserRoundGroup,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

const features = [
  {
    icon: Zap,
    title: "Organize your work",
    description: "Turn ideas into actionable tasks with flexible boards.",
  },
  {
    icon: UserRoundGroup,
    title: "Work together",
    description: "Invite your team, assign tasks, and stay in sync.",
  },
  {
    icon: MessageCircleMore,
    title: "Real-time collaboration",
    description: "See changes instantly with WebSocket-powered updates.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Track progress",
    description: "From small tasks to big goals, keep everyone aligned.",
  },
];

export default function Marketing() {
  return (
    <>
      <section className="flex min-h-120 flex-col items-center justify-center bg-linear-to-b from-primary to-primary-foreground px-6 py-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-card-foreground bg-card px-5 py-3 text-sm font-semibold text-primary shadow-sm">
          <Medal className="size-5" />
          <span>NO1 TASK MANAGEMENT</span>
        </div>

        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-[#19191D] sm:text-5xl md:text-6xl">
          GoBoard helps team move
          <br />
          <span className="mt-3 inline-block rounded-md bg-linear-to-r from-chart-1 to-chart-5 px-4 py-2 text-white">
            work forward.
          </span>
        </h1>

        <p className="mb-6 max-w-170 text-base leading-6 text-[#96999F] sm:text-lg">
          Collaborate, manage projects, and reach new productivity peaks.
          <br className="hidden sm:block" />
          From high rises to the home office, the way your team works is
          <br className="hidden md:block" />
          unique - accomplish it all with Taskify.
        </p>

        <Button size="lg">
          <Link to="sign-up">Get GoBoard for free</Link>
        </Button>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="space-y-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50">
                  <Icon className="size-5 text-blue-600" />
                </div>

                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>

                <p className="text-sm leading-5 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
