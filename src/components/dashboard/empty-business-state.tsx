"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MessageSquare, Star, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface EmptyBusinessStateProps {
  userName: string;
}

export function EmptyBusinessState({ userName }: EmptyBusinessStateProps) {
  const benefits = [
    {
      title: "Receive Enquiries",
      description: "Get direct messages and leads from potential customers in your area.",
      icon: MessageSquare,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Collect Reviews",
      description: "Build trust with authentic customer reviews and ratings.",
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Appear in Search",
      description: "Boost your local visibility and rank higher in search results.",
      icon: Search,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Get Verified",
      description: "Earn a verified badge to show customers you are a legitimate business.",
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 w-full max-w-5xl mx-auto">
      <div className="text-center mb-10 space-y-4 max-w-2xl mx-auto">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
          <Building2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome back, {userName.split(" ")[0]}
        </h1>
        <p className="text-xl text-muted-foreground">
          You haven&apos;t registered a business yet. Join thousands of businesses growing their online presence with us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
        {benefits.map((benefit, i) => (
          <Card key={i} className="border-none shadow-md bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${benefit.bg} ${benefit.color}`}>
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button size="lg" className="h-14 px-8 text-lg font-medium rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
          <Link href="/dashboard/onboarding">
            Register Your Business
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium rounded-full" asChild>
          <Link href="/pricing">
            Learn More
          </Link>
        </Button>
      </div>
    </div>
  );
}
