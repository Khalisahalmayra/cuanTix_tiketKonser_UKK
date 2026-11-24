"use client";

import React from "react";
import { Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEditEvent } from "./hooks/useEditEvent";
import {
  EditEventHeader,
  StickyStepNav,
  SectionInformasi,
  SectionJadwalLokasi,
  SectionTiket,
  SectionDenah,
  SectionReview,
  ConfirmSaveModal,
  DeleteTicketModal,
  DeleteZoneModal,
} from "./components";

export default function EditEventPage() {
  const {
    loading,
    activeStep,
    setActiveStep,

    // Section 1: Info
    title,
    setTitle,
    categoryId,
    setCategoryId,
    description,
    setDescription,
    shownBanner,
    preview,
    handleFileChange,
    removePoster,

    // Section 2: Jadwal & Lokasi
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    city,
    setCity,
    venue,
    setVenue,
    venueAddress,
    setVenueAddress,
    locationInfo,
    setLocationInfo,
    citySearch,
    setCitySearch,
    isCityOpen,
    setIsCityOpen,
    cityDropdownRef,
    groupedCities,
    durationInfo,

    // Section 3: Tiket
    tickets,
    ticketPresetMenuOpen,
    setTicketPresetMenuOpen,
    addEmptyTicket,
    addPresetTicket,
    updateTicket,
    confirmDeleteTicket,
    ticketToDelete,
    setTicketToDelete,
    totalQuota,
    totalSold,
    totalRevenue,

    // Section 4: Denah
    layoutPreset,
    selectedZoneId,
    setSelectedZoneId,
    zones,
    customLayoutImage,
    applyPresetLayout,
    addZone,
    updateZone,
    confirmDeleteZone,
    zoneToDelete,
    setZoneToDelete,
    handleCustomImageChange,
    setCustomLayoutImage,
    setCustomImageFile,

    // Section 5: Review & Actions
    currentStatus,
    saving,
    saveAction,
    showConfirmModal,
    setShowConfirmModal,
    errorMessage,
    setErrorMessage,
    successToast,
    handleTriggerSave,
    handleFinalSubmit,
  } = useEditEvent();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
        <p className="text-sm font-semibold text-gray-600">
          Memuat data event untuk diedit...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-24">
      {/* ================= HEADER SECTION ================= */}
      <EditEventHeader
        title={title}
        currentStatus={currentStatus}
        saving={saving}
        onTriggerSave={handleTriggerSave}
      />

      {/* ================= TOAST / ERROR BANNER ================= */}
      {errorMessage && (
        <div className="mb-6 flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-red-400 hover:text-red-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successToast && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ================= STICKY STEP NAVIGATION BAR ================= */}
      <StickyStepNav
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      {/* ================= FORM SECTIONS ================= */}
      <div className="space-y-10">
        {/* SECTION 1: INFORMASI UTAMA EVENT */}
        <SectionInformasi
          title={title}
          setTitle={setTitle}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          description={description}
          setDescription={setDescription}
          shownBanner={shownBanner}
          preview={preview}
          handleFileChange={handleFileChange}
          removePoster={removePoster}
        />

        {/* SECTION 2: JADWAL & LOKASI */}
        <SectionJadwalLokasi
          startAt={startAt}
          setStartAt={setStartAt}
          endAt={endAt}
          setEndAt={setEndAt}
          durationInfo={durationInfo}
          city={city}
          setCity={setCity}
          venue={venue}
          setVenue={setVenue}
          venueAddress={venueAddress}
          setVenueAddress={setVenueAddress}
          locationInfo={locationInfo}
          setLocationInfo={setLocationInfo}
          citySearch={citySearch}
          setCitySearch={setCitySearch}
          isCityOpen={isCityOpen}
          setIsCityOpen={setIsCityOpen}
          cityDropdownRef={cityDropdownRef}
          groupedCities={groupedCities}
        />

        {/* SECTION 3: PENGATURAN TIKET */}
        <SectionTiket
          tickets={tickets}
          ticketPresetMenuOpen={ticketPresetMenuOpen}
          setTicketPresetMenuOpen={setTicketPresetMenuOpen}
          addEmptyTicket={addEmptyTicket}
          addPresetTicket={addPresetTicket}
          updateTicket={updateTicket}
          setTicketToDelete={setTicketToDelete}
          totalQuota={totalQuota}
          totalSold={totalSold}
          totalRevenue={totalRevenue}
        />

        {/* SECTION 4: PENGATURAN DENAH VENUE */}
        <SectionDenah
          layoutPreset={layoutPreset}
          applyPresetLayout={applyPresetLayout}
          selectedZoneId={selectedZoneId}
          setSelectedZoneId={setSelectedZoneId}
          zones={zones}
          tickets={tickets}
          customLayoutImage={customLayoutImage}
          setCustomLayoutImage={setCustomLayoutImage}
          setCustomImageFile={setCustomImageFile}
          handleCustomImageChange={handleCustomImageChange}
          addZone={addZone}
          updateZone={updateZone}
          setZoneToDelete={setZoneToDelete}
        />

        {/* SECTION 5: REVIEW & SIMPAN */}
        <SectionReview
          title={title}
          categoryId={categoryId}
          currentStatus={currentStatus}
          shownBanner={shownBanner}
          durationInfo={durationInfo}
          startAt={startAt}
          city={city}
          venue={venue}
          tickets={tickets}
          zones={zones}
          saving={saving}
          onTriggerSave={handleTriggerSave}
        />
      </div>

      {/* ================= MODALS ================= */}
      <ConfirmSaveModal
        isOpen={showConfirmModal}
        saveAction={saveAction}
        saving={saving}
        title={title}
        venue={venue}
        city={city}
        totalQuota={totalQuota}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalSubmit}
      />

      <DeleteTicketModal
        ticketToDelete={ticketToDelete}
        onClose={() => setTicketToDelete(null)}
        onConfirm={confirmDeleteTicket}
      />

      <DeleteZoneModal
        zoneToDelete={zoneToDelete}
        onClose={() => setZoneToDelete(null)}
        onConfirm={confirmDeleteZone}
      />
    </div>
  );
}
