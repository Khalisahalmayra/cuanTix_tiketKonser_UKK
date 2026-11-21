
const express = require("express");
const supabase = require("../config/database");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// CUSTOMER: mengirim pengajuan event
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Hanya customer yang dapat mengajukan event",
      });
    }

    const {
      title,
      description,
      poster_url,
      banner_url,
      category_id,
      city,
      venue,
      venue_address,
      location_info,
      start_at,
      end_at,
      seating_layout,
      ticket_types,
    } = req.body;

    if (!title || !start_at || !Array.isArray(ticket_types) || ticket_types.length === 0) {
      return res.status(400).json({
        message: "Nama event, tanggal mulai, dan minimal satu jenis tiket wajib diisi",
      });
    }

    const invalidTicket = ticket_types.some(
      (ticket) =>
        !ticket.name ||
        !Number.isInteger(Number(ticket.price)) ||
        Number(ticket.price) < 0 ||
        !Number.isInteger(Number(ticket.quota)) ||
        Number(ticket.quota) <= 0
    );

    if (invalidTicket) {
      return res.status(400).json({
        message: "Data jenis tiket tidak valid",
      });
    }

    const { data: submission, error: submissionError } = await supabase
      .from("event_submissions")
      .insert({
        user_id: req.user.id,
        title,
        description,
        poster_url,
        banner_url,
        category_id: category_id || null,
        city,
        venue,
        venue_address,
        location_info,
        start_at,
        end_at: end_at || null,
        seating_layout: seating_layout || null,
        status: "pending_review",
      })
      .select()
      .single();

    if (submissionError) throw submissionError;

    const tickets = ticket_types.map((ticket) => ({
      submission_id: submission.id,
      name: ticket.name,
      price: Number(ticket.price),
      quota: Number(ticket.quota),
      sale_start: ticket.sale_start || null,
      sale_end: ticket.sale_end || null,
      description: ticket.description || null,
    }));

    const { error: ticketError } = await supabase
      .from("event_submission_ticket_types")
      .insert(tickets);

    if (ticketError) {
      await supabase
        .from("event_submissions")
        .delete()
        .eq("id", submission.id);

      throw ticketError;
    }

    return res.status(201).json({
      message: "Pengajuan event berhasil dikirim",
      data: submission,
    });
  } catch (error) {
    console.error("Submit event error:", error.message);
    return res.status(500).json({
      message: "Gagal mengirim pengajuan event",
    });
  }
});

// CUSTOMER: melihat pengajuan miliknya
router.get("/my", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        message: "Akses hanya untuk customer",
      });
    }

    const { data, error } = await supabase
      .from("event_submissions")
      .select("*, event_submission_ticket_types(*)")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Get my submissions error:", error.message);
    return res.status(500).json({
      message: "Gagal mengambil pengajuan event",
    });
  }
});



// ADMIN: melihat semua pengajuan
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { data: submissions, error } = await supabase
      .from("event_submissions")
      .select("*, event_submission_ticket_types(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!submissions || submissions.length === 0) {
      return res.json([]);
    }

    const userIds = [...new Set(submissions.map((item) => item.user_id))];

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email")
      .in("id", userIds);

    if (usersError) throw usersError;

    const result = submissions.map((submission) => ({
      ...submission,
      users: users.find((user) => user.id === submission.user_id) || null,
    }));

    return res.json(result);
  } catch (error) {
    console.error("Get submissions error:", error.message);
    return res.status(500).json({
      message: "Gagal mengambil daftar pengajuan",
    });
  }
});




// ADMIN: menyetujui pengajuan dan membuat event resmi
router.patch("/:id/approve", verifyToken, requireAdmin, async (req, res) => {
  let createdEventId = null;

  try {
    // Ambil data pengajuan beserta jenis tiket
    const { data: submission, error: fetchError } = await supabase
      .from("event_submissions")
      .select("*, event_submission_ticket_types(*)")
      .eq("id", req.params.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!submission) {
      return res.status(404).json({
        message: "Pengajuan event tidak ditemukan",
      });
    }

    if (!["pending_review", "needs_revision"].includes(submission.status)) {
      return res.status(409).json({
        message: "Pengajuan ini sudah diproses",
      });
    }

    const submittedTickets = submission.event_submission_ticket_types || [];

    if (submittedTickets.length === 0) {
      return res.status(400).json({
        message: "Pengajuan tidak memiliki jenis tiket",
      });
    }

    // Cari organizer milik customer
    let organizerId = submission.organizer_id;

    if (!organizerId) {
      const { data: existingOrganizer, error: organizerError } =
        await supabase
          .from("organizers")
          .select("id")
          .eq("user_id", submission.user_id)
          .maybeSingle();

      if (organizerError) throw organizerError;

      organizerId = existingOrganizer?.id;
    }

    // Jika belum punya organizer, buat berdasarkan nama customer
    if (!organizerId) {
      const { data: customer, error: customerError } = await supabase
        .from("users")
        .select("name")
        .eq("id", submission.user_id)
        .single();

      if (customerError) throw customerError;

      const { data: newOrganizer, error: newOrganizerError } =
        await supabase
          .from("organizers")
          .insert({
            user_id: submission.user_id,
            name: customer.name || "Event Organizer",
          })
          .select("id")
          .single();

      if (newOrganizerError) throw newOrganizerError;

      organizerId = newOrganizer.id;
    }

    // Buat slug event
    const slugBase = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;

    const finalImage =
      submission.banner_url ||
      submission.poster_url ||
      "/image/snada-event.png";

    // Masukkan event ke tabel events
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        organizer_id: organizerId,
        category_id: submission.category_id || null,
        title: submission.title,
        slug,
        description: submission.description || null,
        banner_url: finalImage,
        poster_url: submission.poster_url || finalImage,
        city: submission.city,
        venue: submission.venue || null,
        venue_address: submission.venue_address || null,
        location_info: submission.location_info || null,
        seating_layout: submission.seating_layout || null,
        start_at: submission.start_at,
        end_at: submission.end_at || null,
        status: "published",
      })
      .select("id, slug")
      .single();

    if (eventError) throw eventError;

    createdEventId = event.id;

    // Masukkan semua jenis tiket ke tabel ticket_types
    const ticketRows = submittedTickets.map((ticket) => ({
      event_id: event.id,
      name: ticket.name,
      price: Number(ticket.price),
      quota: Number(ticket.quota),
      description: ticket.description || null,
      is_active: true,
      sale_start: ticket.sale_start || null,
      sale_end: ticket.sale_end || null,
    }));

    const { error: ticketError } = await supabase
      .from("ticket_types")
      .insert(ticketRows);

    if (ticketError) throw ticketError;

    // Ubah status pengajuan setelah event dan tiket berhasil dibuat
    const { data: updatedSubmission, error: updateError } = await supabase
      .from("event_submissions")
      .update({
        status: "approved",
        organizer_id: organizerId,
        admin_notes: req.body.admin_notes || null,
        reviewed_by: req.user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", submission.id)
      .in("status", ["pending_review", "needs_revision"])
      .select()
      .maybeSingle();

    if (updateError) throw updateError;

    if (!updatedSubmission) {
      throw new Error("Pengajuan sudah diproses oleh admin lain");
    }

    return res.json({
      message: "Pengajuan berhasil disetujui dan event telah dibuat",
      data: {
        submission: updatedSubmission,
        event,
      },
    });
  } catch (error) {
    console.error("Approve submission error:", error.message);

    // Bersihkan event dan tiket jika proses gagal
    if (createdEventId) {
      await supabase
        .from("ticket_types")
        .delete()
        .eq("event_id", createdEventId);

      await supabase
        .from("events")
        .delete()
        .eq("id", createdEventId);
    }

    return res.status(500).json({
      message: "Gagal menyetujui pengajuan event",
    });
  }
});


// ADMIN: meminta revisi atau menolak pengajuan
router.patch("/:id/review", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status, admin_notes } = req.body;

    if (!["needs_revision", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status review tidak valid",
      });
    }

    const { data: submission, error: updateError } = await supabase
      .from("event_submissions")
      .update({
        status,
        admin_notes: admin_notes || null,
        reviewed_by: req.user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .in("status", ["pending_review", "needs_revision"])
      .select()
      .maybeSingle();

    if (updateError) throw updateError;

    if (!submission) {
      return res.status(404).json({
        message: "Pengajuan tidak ditemukan atau sudah diproses",
      });
    }

    return res.json({
      message: "Status pengajuan berhasil diperbarui",
      data: submission,
    });
  } catch (error) {
    console.error("Review submission error:", error.message);
    return res.status(500).json({
      message: "Gagal memperbarui pengajuan",
    });
  }
});

module.exports = router;
