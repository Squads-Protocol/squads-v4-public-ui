import SidebarLayout from "@/components/layout/dashboard";
import { Button } from "@/components/ui/primitives/button";
import Link from "next/link";

export default async function NotFound() {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center font-neue">
        <p className="text-base font-semibold text-neutral-600">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-wide text-white sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-neutral-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/" passHref>
            <Button className="font-neue bg-stone-700 text-white dark:bg-white dark:text-stone-700 disabled:text-stone-500 disabled:bg-gradient-to-br disabled:from-stone-800 disabled:to-stone-900 dark:disabled:bg-gradient-to-br dark:disabled:from-stone-300 dark:disabled:to-stone-500 dark:disabled:text-stone-700/50 dark:hover:bg-stone-100 transition duration-200">
              Back to home
            </Button>
          </Link>
          <Link
            href="https://discord.gg/squadsprotocol"
            className="text-sm font-semibold text-neutral-400"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
