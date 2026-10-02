import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-border-subtle flex items-center justify-center mx-auto text-text-tertiary">
        <Compass className="w-8 h-8 stroke-[1.5]" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Page Not Found
        </h1>
        <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
          The page or product you were looking for doesn&apos;t exist or has been relocated.
        </p>
      </div>
      <div>
        <Link href="/">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Homepage</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
