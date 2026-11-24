"use client";

import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useAddEvent } from "./hooks/useAddEvent";
import {
  AddEventHeader,
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

export default function CreateEventPage() {
  const {
    activeStep,
    setActiveStep,

    // Section 1: Info
    title,
    setTitle,
    categoryId,
    setCategoryId,
    description,
    setDescription,
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
    saving,
    saveAction,
    showConfirmModal,
    setShowConfirmModal,
    errorMessage,
    setErrorMessage,
    successToast,
    handleTriggerSave,
    handleFinalSubmit,
  } = useAddEvent();

  return (
    <div className="mx-auto max-w-6xl pb-24">
      {/* ================= HEADER SECTION ================= */}
      <AddEventHeader
        saving={saving}
        onTriggerSave={handleTriggerSave}
      />

      {/* ================= TOAST / ERROR BANNER ================= */}
      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="font-semibold">Periksa kembali data formulir:</p>
            <p className="text-xs text-red-700">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successToast && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold">{successToast}</span>
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
          preview={preview}
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
