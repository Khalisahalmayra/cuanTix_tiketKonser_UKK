"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Send, AlertCircle, X } from "lucide-react";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import { BRAND_GRADIENT } from "./constants";
import { useBuatEvent } from "./hooks/useBuatEvent";
import {
  StepIndicator,
  Step1EventInfo,
  Step2ScheduleLocation,
  Step3TicketTypes,
  Step4Review,
  SubmissionSuccessView,
  AuthModal,
} from "./components";

export default function BuatEventPage() {
  const router = useRouter();

  const {
    currentStep,
    handleNextStep,
    handlePrevStep,
    handleStepClick,

    showAuthModal,
    setShowAuthModal,

    // Step 1
    title,
    setTitle,
    categoryId,
    setCategoryId,
    categories,
    selectedCategoryObj,
    description,
    setDescription,
    posterUrl,
    setPosterUrl,
    bannerUrl,
    setBannerUrl,
    posterPreview,
    setPosterPreview,
    bannerPreview,
    setBannerPreview,
    posterInputRef,
    bannerInputRef,
    handlePosterFileChange,
    handleBannerFileChange,

    // Step 2
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    city,
    setCity,
    venue,
    setVenue,
    venueAddress,
    setVenueAddress,
    locationInfo,
    setLocationInfo,
    seatingPreset,
    setSeatingPreset,
    customSeatingNotes,
    setCustomSeatingNotes,

    // Step 3
    ticketTypes,
    handleAddTicket,
    handleRemoveTicket,
    handleTicketChange,
    applyTicketPreset,
    summaryMetrics,

    // Submission & Errors
    errors,
    isSubmitting,
    submitError,
    setSubmitError,
    submissionSuccess,
    handleSubmitProposal,
    handleResetForm,
  } = useBuatEvent();

  return (
    <div
      className="min-h-screen bg-[#FDFBFD]"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      {/* 1. NAVBAR */}
      <HomeNavbar />

      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER ATAS DENGAN TOMBOL KEMBALI */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali ke halaman sebelumnya"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:border-[#5B1AA8] hover:bg-[#F3EBFF] hover:text-[#5B1AA8] sm:text-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Ajukan Event Kamu
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-gray-600 sm:text-base">
                Wujudkan event impianmu bersama CuanTix. Lengkapi informasi event untuk memulai proses pengajuan.
              </p>
            </div>

            {/* BADGE INFORMASI PROSES KURASI */}
            <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-purple-100 bg-[#FAF5FF] p-3 text-xs text-[#5B1AA8] sm:mt-0 sm:max-w-xs">
              <GradientIcon type="shieldCheck" size={24} />
              <span>
                Setiap pengajuan akan diverifikasi oleh tim kurasi CuanTix sebelum dipublikasikan.
              </span>
            </div>
          </div>
        </div>

        {/* JIKA SUKSES MENGAJUKAN: TAMPILKAN KONFIRMASI FEEDBACK SUKSES */}
        {submissionSuccess ? (
          <SubmissionSuccessView
            submissionSuccess={submissionSuccess}
            onReset={handleResetForm}
            onBackHome={() => router.push("/home")}
          />
        ) : (
          <div>
            {/* 2. PROGRESS INDICATOR (STEPPER MULTI-STEP) */}
            <StepIndicator
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />

            {/* ERROR ALERT TOP */}
            {submitError && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Gagal Mengirim Pengajuan</p>
                  <p className="mt-0.5 text-xs text-red-600">{submitError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* FORM CONTAINER */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-10">
              {currentStep === 1 && (
                <Step1EventInfo
                  title={title}
                  setTitle={setTitle}
                  categoryId={categoryId}
                  setCategoryId={setCategoryId}
                  categories={categories}
                  description={description}
                  setDescription={setDescription}
                  posterUrl={posterUrl}
                  setPosterUrl={setPosterUrl}
                  bannerUrl={bannerUrl}
                  setBannerUrl={setBannerUrl}
                  posterPreview={posterPreview}
                  setPosterPreview={setPosterPreview}
                  bannerPreview={bannerPreview}
                  setBannerPreview={setBannerPreview}
                  posterInputRef={posterInputRef}
                  bannerInputRef={bannerInputRef}
                  handlePosterFileChange={handlePosterFileChange}
                  handleBannerFileChange={handleBannerFileChange}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <Step2ScheduleLocation
                  startDate={startDate}
                  setStartDate={setStartDate}
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  city={city}
                  setCity={setCity}
                  venue={venue}
                  setVenue={setVenue}
                  venueAddress={venueAddress}
                  setVenueAddress={setVenueAddress}
                  locationInfo={locationInfo}
                  setLocationInfo={setLocationInfo}
                  seatingPreset={seatingPreset}
                  setSeatingPreset={setSeatingPreset}
                  customSeatingNotes={customSeatingNotes}
                  setCustomSeatingNotes={setCustomSeatingNotes}
                  errors={errors}
                />
              )}

              {currentStep === 3 && (
                <Step3TicketTypes
                  ticketTypes={ticketTypes}
                  handleAddTicket={handleAddTicket}
                  handleRemoveTicket={handleRemoveTicket}
                  handleTicketChange={handleTicketChange}
                  applyTicketPreset={applyTicketPreset}
                  summaryMetrics={summaryMetrics}
                  errors={errors}
                />
              )}

              {currentStep === 4 && (
                <Step4Review
                  title={title}
                  selectedCategoryObj={selectedCategoryObj}
                  description={description}
                  posterPreview={posterPreview}
                  posterUrl={posterUrl}
                  bannerPreview={bannerPreview}
                  bannerUrl={bannerUrl}
                  startDate={startDate}
                  startTime={startTime}
                  endDate={endDate}
                  endTime={endTime}
                  venue={venue}
                  city={city}
                  venueAddress={venueAddress}
                  ticketTypes={ticketTypes}
                  summaryMetrics={summaryMetrics}
                />
              )}

              {/* NAVIGASI STEP (TOMBOL KEMBALI & LANJUT / KIRIM) */}
              <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 sm:text-sm cursor-pointer"
                  >
                    Kembali
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 rounded-full px-7 py-3 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95 active:scale-95 sm:text-sm cursor-pointer"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    Lanjutkan
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitProposal}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-full px-8 py-3 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95 active:scale-95 disabled:opacity-60 sm:text-sm cursor-pointer"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Mengirim Pengajuan...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Kirim Pengajuan Event
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL PERINGATAN LOGIN DIPERLUKAN */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          router.push("/auth/login");
        }}
      />
    </div>
  );
}
