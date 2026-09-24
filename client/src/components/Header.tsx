import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between  font-bold py-2 border-b-accent-foreground mx-2">
      <div className="flex items-center gap-2 text-xl">
        <img src="/logo.png" alt="Image icon app" className="h-10 w-10" />
        <p>
          Go<span className="text-primary">Board</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline">Login</Button>

        <Button className="font-semibold">Try for free</Button>
      </div>
    </header>
  );
}
