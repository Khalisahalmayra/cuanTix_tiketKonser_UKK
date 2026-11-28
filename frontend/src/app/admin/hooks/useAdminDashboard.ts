"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminEvent, Submission, DashboardStats, AdminUser } from "../types";

const EVENTS_API = "http://localhost:4000/api/admin/events";
const SUBMISSIONS_API = "http://localhost:4000/api/event-submissions";
const AUTH_API = "http://localhost:4000/api/auth/me";

export function useAdminDashboard() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (isSilent) {
      setRefreshing(true);
    }

    try {
      const [userRes, eventsRes, submissionsRes] = await Promise.allSettled([
        fetch(AUTH_API, { credentials: "include" }),
        fetch(EVENTS_API, { credentials: "include" }),
        fetch(SUBMISSIONS_API, { credentials: "include" }),
      ]);

      if (userRes.status === "fulfilled" && userRes.value.ok) {
        const userData = await userRes.value.json();
        setAdminUser(userData.user ?? userData);
      } else {
        setAdminUser(null);
      }

      let eventsData: AdminEvent[] = [];
      let submissionsData: Submission[] = [];
      const errorMessages: string[] = [];

      if (eventsRes.status === "fulfilled") {
        if (eventsRes.value.ok) {
          eventsData = await eventsRes.value.json();
          setEvents(eventsData);
        } else {
          errorMessages.push("Gagal memuat data event");
        }
      } else {
        errorMessages.push("Koneksi API event terputus");
      }

      if (submissionsRes.status === "fulfilled") {
        if (submissionsRes.value.ok) {
          submissionsData = await submissionsRes.value.json();
          setSubmissions(submissionsData);
        } else {
          errorMessages.push("Gagal memuat data pengajuan event");
        }
      } else {
        errorMessages.push("Koneksi API pengajuan terputus");
      }

      if (errorMessages.length > 0 && eventsData.length === 0 && submissionsData.length === 0) {
        setError(errorMessages.join(", "));
      } else {
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      if (isMounted) {
        void fetchDashboardData(false);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [fetchDashboardData]);

  // Hitung metrik statistik aktual
  const stats: DashboardStats = {
    totalEvents: events.length,
    publishedEvents: events.filter((e) => e.status === "published").length,
    draftEvents: events.filter((e) => e.status === "draft").length,
    totalSubmissions: submissions.length,
    pendingSubmissions: submissions.filter((s) => s.status === "pending_review").length,
    revisionSubmissions: submissions.filter((s) => s.status === "needs_revision").length,
    approvedSubmissions: submissions.filter((s) => s.status === "approved").length,
    rejectedSubmissions: submissions.filter((s) => s.status === "rejected").length,
  };

  // 5 Pengajuan terbaru berdasarkan created_at desc
  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // 5 Event terbaru berdasarkan jadwal start_at desc
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    .slice(0, 5);

  return {
    adminUser,
    stats,
    recentSubmissions,
    recentEvents,
    loading,
    refreshing,
    error,
    refreshData: () => fetchDashboardData(true),
  };
}
