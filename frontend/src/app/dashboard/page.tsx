"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useTabStore } from "@/lib/store";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import {
  ProfileTab,
  GoalsTab,
  RoadmapTab,
  SubjectsTab,
  GradesTab,
  MockExamTab,
  RecordTab,
  ScheduleTab,
  AcademicCalendarTab,
  AcademyTab,
  ClubsTab,
  AITab,
  AdmissionTypesTab,
} from "@/components/tabs";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { activeTab } = useTabStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "goals":
        return <GoalsTab />;
      case "roadmap":
        return <RoadmapTab />;
      case "subjects":
        return <SubjectsTab />;
      case "grades":
        return <GradesTab />;
      case "mock":
        return <MockExamTab />;
      case "record":
        return <RecordTab />;
      case "schedule":
        return <ScheduleTab />;
      case "academic-calendar":
        return <AcademicCalendarTab />;
      case "academy":
        return <AcademyTab />;
      case "clubs":
        return <ClubsTab />;
      case "ai":
        return <AITab />;
      case "admissions":
        return <AdmissionTypesTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <Header />
        <Navigation />
        {renderTab()}
      </div>
    </div>
  );
}
