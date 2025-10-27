"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FormsDashboard } from "@/components/form-builder/forms-dashboard";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { FormsAnalytics } from "@/components/chart";
import { RecentActivities } from "@/components/activityChart";

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="w-full  bg-background text-foreground">
      <Header
        onToggleMobileNav={() => setMobileNavOpen((v) => !v)}
        children={undefined}
      />
      <main
        className="flex-1 w-full p-4 md:p-6"
        role="main"
        aria-label="Main content"
      >
        {/* 🧩 Main Area placeholder */}
        <section className="mb-6 rounded-lg border border-dashed border-border p-6 text-center">
          {/* <p className="text-sm text-muted-foreground">{"🧩 Main Area"}</p> */}
          <p className="text-sm text-muted-foreground">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent>
                  <h4 className="text-sm text-gray-400">Total Forms</h4>
                  <p className="text-2xl font-semibold text-white">12</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h4 className="text-sm text-gray-400">Active</h4>
                  <p className="text-2xl font-semibold text-green-400">8</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h4 className="text-sm text-gray-400">Drafts</h4>
                  <p className="text-2xl font-semibold text-yellow-400">4</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h4 className="text-sm text-gray-400">Last Updated</h4>
                  <p className="text-lg text-gray-300">Oct 14, 2025</p>
                </CardContent>
              </Card>
            </div>
            <FormsAnalytics />
            <RecentActivities />
          </p>
        </section>

        {/* Existing dashboard content */}
        <div className="mx-auto">
          <FormsDashboard />
        </div>
      </main>
      {/* </div> */}
    </div>
  );
}
