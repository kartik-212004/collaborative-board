"use client";

import Image from "next/image";
import React from "react";

import { Check, ShieldCheck, BarChart3, Grip, Cloud, Building2, LifeBuoy, User } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Features() {
  return (
    <section className="bg-white py-24 text-slate-900">
      <div className="container mx-auto px-6">
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded bg-slate-100 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              <span className="text-sm font-medium text-slate-600">Collaborative Whiteboard</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Visual management <br />
              for your team to create.
            </h2>

            <div className="mb-8 space-y-4">
              {[
                "Real-time collaborative drawing with synchronized cursors",
                "Persistent storage of drawn shapes saved to your account",
                "Built-in live chat for teammates to communicate while drawing",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-slate-900" />
                  <p className="text-lg text-slate-600">{item}</p>
                </div>
              ))}
            </div>

            <Button className="h-12 bg-blue-600 px-8 text-base font-medium text-white hover:bg-blue-700">
              Start Now
            </Button>
          </div>
          <Image
            src="/demo.jpeg"
            className="rounded-md object-cover"
            alt="Features"
            width={700}
            height={700}
          />
        </div>

        <div className="grid gap-8 border-t border-slate-200 pt-16 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Grip,
              title: "Real-time Drawing",
              desc: "Draw together live — strokes and cursors sync instantly across users.",
            },
            {
              icon: Cloud,
              title: "Persistent Storage",
              desc: "Shapes and drawings are stored to the database so your work is preserved.",
            },
            {
              icon: User,
              title: "Live Chat",
              desc: "Built-in chat keeps team conversations next to the board for fast coordination.",
            },
            {
              icon: BarChart3,
              title: "Multiple Tools",
              desc: "Pencil, shapes (circle, square), eraser, selection and more for precise editing.",
            },
          ].map((feature, i) => (
            <div key={i} className="border-l-2 border-slate-100 pl-6 transition-colors hover:border-blue-500">
              <div className="mb-4 flex items-center gap-2">
                <feature.icon className="h-5 w-5 text-slate-900" />
                <h3 className="font-bold text-slate-900">{feature.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
