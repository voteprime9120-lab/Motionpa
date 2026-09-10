import React, { useState } from 'react';
import { ARTIST_DOSSIER } from '../data/initialData';
import { Mail, Send, Award, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { ToastNotification } from '../types';

interface AboutViewProps {
  onShowToast: (toast: ToastNotification) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onShowToast }) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('museum');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onShowToast({
      id: `inquiry-${Date.now()}`,
      title: 'Curatorial Dispatch Sent',
      subtitle: `Your transmission has been encrypted and routed to J. Vance's vault desk.`
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Dossier Header */}
      <div className="w-full px-6 md:px-12 py-8 bg-[#0e0e0e] border-b border-[#201f1f] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
              CURATORIAL DOSSIER // ARCHIVAL COLOPHON
            </span>
            <span className="w-1 h-1 rounded-full bg-[#a88a86]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86]">
              J. VANCE
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#e5e2e1] font-normal tracking-tight">
            About the Archive &amp; Contact
          </h1>
          <p className="font-mono text-[13px] text-[#a88a86] max-w-2xl leading-relaxed">
            Principles of sacred curation, museum provenance, and low-lux monochrome
            reproduction. Direct communication dispatch for institutions, private
            collectors, and gallery acquisitions.
          </p>
        </div>
      </div>

      <div className="w-full px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Artist Biography & Manifestos (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Biography Card */}
          <div className="p-6 md:p-8 bg-[#0e0e0e] border border-[#201f1f] flex flex-col gap-4">
            <div className="flex items-center gap-4 pb-4 border-b border-[#201f1f]">
              <div className="w-14 h-14 bg-[#1c1b1b] border border-[#991b1b] flex items-center justify-center font-serif text-xl text-[#ffdad6]">
                JV
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#e5e2e1] font-medium">
                  {ARTIST_DOSSIER.name}
                </h2>
                <span className="font-mono text-[11px] text-[#ffb4ac] uppercase tracking-wider">
                  {ARTIST_DOSSIER.epithet} • {ARTIST_DOSSIER.location}
                </span>
              </div>
            </div>

            <p className="font-mono text-[13px] text-[#a88a86] leading-relaxed">
              {ARTIST_DOSSIER.biography}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#131313] border border-[#201f1f] flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#ffb4ac]">
                  PRACTICE
                </span>
                <span className="font-mono text-[11px] text-[#e5e2e1]">
                  Digital Stippling &amp; Copperplate Gravure
                </span>
              </div>
              <div className="p-3 bg-[#131313] border border-[#201f1f] flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#ffb4ac]">
                  LIGHTING PHILOSOPHY
                </span>
                <span className="font-mono text-[11px] text-[#e5e2e1]">
                  2700K Warm Halogen Low-LUX Preservation
                </span>
              </div>
            </div>
          </div>

          {/* Exhibition History & Curatorial Standard */}
          <div className="p-6 md:p-8 bg-[#0e0e0e] border border-[#201f1f] flex flex-col gap-4">
            <h3 className="font-serif text-xl text-[#e5e2e1] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#ffb4ac]" />
              <span>Selected Exhibitions &amp; Folios</span>
            </h3>
            <div className="flex flex-col divide-y divide-[#201f1f]">
              {ARTIST_DOSSIER.exhibitions.map((ex, i) => (
                <div key={i} className="py-3 flex items-baseline justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-serif text-[17px] text-[#e5e2e1]">
                      {ex.title}
                    </span>
                    <span className="font-mono text-[11px] text-[#a88a86]">
                      {ex.venue}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#ffb4ac] font-bold">
                    {ex.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Colophon */}
          <div className="p-6 md:p-8 bg-[#0e0e0e] border border-[#201f1f] flex flex-col gap-3">
            <h3 className="font-serif text-xl text-[#e5e2e1] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#ffb4ac]" />
              <span>Vault Technical Specifications</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px] text-[#a88a86] pt-1">
              <div>
                <span className="text-[#e5e2e1] block uppercase text-[10px]">
                  Resolution Standard:
                </span>
                {ARTIST_DOSSIER.curatorialStandard.resolution}
              </div>
              <div>
                <span className="text-[#e5e2e1] block uppercase text-[10px]">
                  Color Space &amp; Bit Depth:
                </span>
                {ARTIST_DOSSIER.curatorialStandard.bitDepth}
              </div>
              <div>
                <span className="text-[#e5e2e1] block uppercase text-[10px]">
                  Tonal Calibration:
                </span>
                {ARTIST_DOSSIER.curatorialStandard.inkDensity}
              </div>
              <div>
                <span className="text-[#e5e2e1] block uppercase text-[10px]">
                  Digital Preservation:
                </span>
                {ARTIST_DOSSIER.curatorialStandard.preservation}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Acquisitions Dispatch (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 md:p-8 bg-[#0e0e0e] border border-[#201f1f] flex flex-col gap-4">
            <div className="flex flex-col gap-1 pb-3 border-b border-[#201f1f]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
                DIRECT TRANSMISSION
              </span>
              <h3 className="font-serif text-2xl text-[#e5e2e1] font-medium">
                Curatorial Inquiry
              </h3>
              <p className="font-mono text-[11px] text-[#a88a86]">
                For museum loans, gallery consignment, archival fine-art prints, or
                private commission folios.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-[#1c1b1b] border border-[#991b1b] text-center flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-[#ffb4ac]" />
                <span className="font-serif text-xl text-[#e5e2e1]">
                  Transmission Sealed
                </span>
                <p className="font-mono text-xs text-[#a88a86]">
                  Your message has been encrypted into the nocturnal dispatch log.
                  Response will be generated via secure courier.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setInquiryMessage('');
                  }}
                  className="mt-2 px-4 py-1.5 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#ffb4ac] font-mono text-xs uppercase"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider">
                    Full Name // Institution
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Eleanor Vance / Basel Kunsthalle"
                    className="w-full px-4 py-2 bg-[#131313] border border-[#201f1f] text-[#e5e2e1] font-mono text-[12px] focus:outline-none focus:border-[#991b1b]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider">
                    Official Email / Cipher Return
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="curator@sanctum.art"
                    className="w-full px-4 py-2 bg-[#131313] border border-[#201f1f] text-[#e5e2e1] font-mono text-[12px] focus:outline-none focus:border-[#991b1b]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider">
                    Nature of Inquiry
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-4 py-2 bg-[#131313] border border-[#201f1f] text-[#e5e2e1] font-mono text-[12px] focus:outline-none focus:border-[#991b1b] cursor-pointer"
                  >
                    <option value="museum">Museum Exhibition Loan / Staging</option>
                    <option value="print">Acquisition of 16-Bit Master Fine Art Print</option>
                    <option value="commission">Private Nocturne Folio Commission</option>
                    <option value="scholarly">Academic Research &amp; Codex Access</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider">
                    Curatorial Details &amp; Specific Plate Number
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Specify plate numbers (e.g. PL. NO. 048 // I), exhibition venue, or acquisition scope..."
                    className="w-full p-4 bg-[#131313] border border-[#201f1f] text-[#e5e2e1] font-mono text-[12px] focus:outline-none focus:border-[#991b1b] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#991b1b] hover:bg-[#cc003c] text-[#ffdad6] font-mono text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Curatorial Dispatch</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
