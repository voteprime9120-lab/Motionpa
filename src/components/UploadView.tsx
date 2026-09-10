import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FolderOpen,
  CheckCircle2,
  HardDrive,
  ChevronDown,
  X,
  Save,
  Upload,
  Trash2,
  Sparkles
} from 'lucide-react';
import { PlateMetadata, CollectionSeries, ToastNotification } from '../types';

interface UploadViewProps {
  stagedPlates: PlateMetadata[];
  setStagedPlates: React.Dispatch<React.SetStateAction<PlateMetadata[]>>;
  seriesList: CollectionSeries[];
  onPublishPlate: (plate: PlateMetadata) => void;
  onShowToast: (toast: ToastNotification) => void;
  onNavigateToGallery: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  stagedPlates,
  setStagedPlates,
  seriesList,
  onPublishPlate,
  onShowToast,
  onNavigateToGallery
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    stagedPlates[0]?.id || 'staged-1'
  );
  const [tagInput, setTagInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active plate being edited
  const activePlateIndex = stagedPlates.findIndex((p) => p.id === selectedId);
  const activePlate =
    activePlateIndex !== -1 ? stagedPlates[activePlateIndex] : stagedPlates[0];

  // Backup of initial state for discard functionality
  const [baselinePlates, setBaselinePlates] = useState<PlateMetadata[]>(stagedPlates);

  const updateActivePlate = (updates: Partial<PlateMetadata>) => {
    if (!activePlate) return;
    setStagedPlates((prev) =>
      prev.map((p) => (p.id === activePlate.id ? { ...p, ...updates } : p))
    );
  };

  // Handle Tag Input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && activePlate) {
        const formatted = `#${val}`;
        if (!activePlate.tags.includes(formatted)) {
          updateActivePlate({ tags: [...activePlate.tags, formatted] });
        }
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (!activePlate) return;
    updateActivePlate({
      tags: activePlate.tags.filter((t) => t !== tagToRemove)
    });
  };

  // Handle File Upload
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        const formattedTitle = nameWithoutExt
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        const newPlate: PlateMetadata = {
          id: `upload-${Date.now()}-${index}`,
          plateNumber: `PL. NO. 0${stagedPlates.length + index + 50} // I`,
          uuid: Math.random().toString(16).substring(2, 6).toUpperCase() + '-' + Math.random().toString(16).substring(2, 6).toUpperCase(),
          title: formattedTitle || 'Untitled Nocturne Artefact',
          filename: file.name.toUpperCase(),
          series: seriesList[0]?.name || 'Sanctum of Ash',
          epoch: '2024 (Winter Solstice)',
          medium: 'Digital Ink Stippling, Procreate, Custom Grain Brushes',
          lore: `Archival study of "${formattedTitle}". Encoded at master resolution with cold monochrome contrast and microscopic stipple dispersion.`,
          tags: ['#master-plate', '#monochrome', '#inkwork', '#vault'],
          rights: {
            fineArtPrint: true,
            editorialLore: true,
            nftToken: false
          },
          visibility: 'public',
          imageUrl: resultUrl,
          resolution: '3840 × 2160 UHD',
          colorDepth: '16-BIT RGB',
          fileSize: `${sizeInMb} MB`,
          progress: 100,
          gamma: 2.2,
          deepShadowsPercent: 88,
          midtoneInkPercent: 10,
          crimsonLightPercent: 2,
          exhibitionLighting: '2700K LOW LUX',
          isMuseumReady: true,
          ingestedAt: new Date().toISOString(),
          isStaged: true
        };

        setStagedPlates((prev) => [newPlate, ...prev]);
        setSelectedId(newPlate.id);
        onShowToast({
          id: `toast-${Date.now()}`,
          title: `Master Plate Ingested: ${newPlate.title}`,
          subtitle: `File ${newPlate.filename} buffered into curatorial queue.`
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleClearBatch = () => {
    if (confirm('Clear all staged artefacts from the ingestion buffer?')) {
      setStagedPlates([]);
      onShowToast({
        id: `toast-${Date.now()}`,
        title: 'Buffer Cleared',
        subtitle: 'All staged artefacts removed from memory.',
        type: 'info'
      });
    }
  };

  const handleRemoveStagedItem = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = stagedPlates.filter((p) => p.id !== idToRemove);
    setStagedPlates(remaining);
    if (selectedId === idToRemove && remaining.length > 0) {
      setSelectedId(remaining[0].id);
    }
  };

  const handleSaveDraft = () => {
    if (!activePlate) return;
    onShowToast({
      id: `toast-${Date.now()}`,
      title: 'Draft State Preserved',
      subtitle: `Taxonomy for "${activePlate.title}" synchronized in buffer.`
    });
  };

  const handleDiscardChanges = () => {
    setStagedPlates(baselinePlates);
    onShowToast({
      id: `toast-${Date.now()}`,
      title: 'Reverted to Original Ingestion Plate',
      subtitle: 'Unsaved modifications discarded.',
      type: 'info'
    });
  };

  const handlePublish = () => {
    if (!activePlate) return;
    onPublishPlate(activePlate);
    // Remove from staged and set next selected
    const nextStaged = stagedPlates.filter((p) => p.id !== activePlate.id);
    setStagedPlates(nextStaged);
    if (nextStaged.length > 0) {
      setSelectedId(nextStaged[0].id);
    }
    onShowToast({
      id: `toast-${Date.now()}`,
      title: `Artefact Sealed: ${activePlate.title}`,
      subtitle: `Plate ${activePlate.plateNumber} committed to permanent vault.`
    });
  };

  // Quick Demo Ingestion
  const handleInjectDemoPlate = () => {
    const demoPlate: PlateMetadata = {
      id: `demo-${Date.now()}`,
      plateNumber: `PL. NO. 0${stagedPlates.length + 51} // III`,
      uuid: 'B910-33CD',
      title: 'The Obsidian Throne of Malakor',
      filename: 'MALAKOR_THRONEROOM_16BIT.TIFF',
      series: 'Sanctum of Ash',
      epoch: '2024 (Winter Solstice)',
      medium: 'Digital Ink Stippling, Procreate, Custom Grain Brushes',
      lore: 'The empty throne forged from meteorite obsidian, towering over the petrified council of seven dukes.',
      tags: ['#throne', '#malakor', '#stipple', '#obsidian'],
      rights: { fineArtPrint: true, editorialLore: true, nftToken: false },
      visibility: 'public',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      resolution: '3840 × 2160 UHD',
      colorDepth: '16-BIT RGB',
      fileSize: '46.5 MB',
      progress: 100,
      gamma: 2.2,
      deepShadowsPercent: 87,
      midtoneInkPercent: 11,
      crimsonLightPercent: 2,
      exhibitionLighting: '2700K LOW LUX',
      isMuseumReady: true,
      ingestedAt: new Date().toISOString(),
      isStaged: true
    };
    setStagedPlates((prev) => [demoPlate, ...prev]);
    setSelectedId(demoPlate.id);
    onShowToast({
      id: `toast-${Date.now()}`,
      title: 'Demo Plate Buffered',
      subtitle: `${demoPlate.title} added to queue.`
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Archival Context Banner & Ingestion Header */}
      <div className="w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-[#0e0e0e] border-b border-[#201f1f]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
              CURATORIAL PROTOCOL // INGESTION 0.94
            </span>
            <span className="w-1 h-1 rounded-full bg-[#a88a86]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86]">
              SACRED VAULT ENCRYPTION ACTIVE
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#e5e2e1] font-normal tracking-tight">
            Ingest &amp; Curate Artefacts
          </h1>
          <p className="font-mono text-[13px] text-[#a88a86] max-w-2xl leading-relaxed">
            Upload high-fidelity monochrome plates, chromatic oil studies, and
            nocturnal visual lore. Encode plate taxonomy, exhibition status, and
            museum provenance.
          </p>
        </div>

        {/* Telemetry & Batch Status */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] uppercase text-[#a88a86]">
              Archival Buffer
            </span>
            <span className="font-serif text-[20px] text-[#e5e2e1]">
              {stagedPlates.length} Artefact{stagedPlates.length === 1 ? '' : 's'} Staged
            </span>
          </div>
          <div className="w-px h-8 bg-[#353534]" />
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] uppercase text-[#a88a86]">
              Pipeline State
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[12px] text-[#ffb4ac]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cc003c] animate-ping" />
              READY TO BIND
            </span>
          </div>
        </div>
      </div>

      {/* Primary Workspace: 12-Column Grid */}
      <div className="w-full px-6 md:px-12 py-12 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: The Crucible (Dropzone) & Upload Queue (Cols 1-5) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* The Ingestion Crucible Dropzone */}
          <div
            id="dropzone-crucible"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer transition-all duration-300 p-12 flex flex-col items-center justify-center text-center bg-[#0e0e0e] ${
              isDragOver
                ? 'bg-[#201f1f] border border-[#cc003c]'
                : 'border border-dashed border-[#991b1b]/60 hover:border-[#991b1b]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.tiff,.psd,.webp"
              multiple
              className="hidden"
              onChange={(e) => processFiles(e.target.files)}
            />

            {/* Crosshair HUD Overlays */}
            <div className="absolute top-2 left-2 font-mono text-[10px] text-[#59413e] select-none pointer-events-none">
              [ +00.00 ]
            </div>
            <div className="absolute top-2 right-2 font-mono text-[10px] text-[#59413e] select-none pointer-events-none">
              [ INGEST ]
            </div>
            <div className="absolute bottom-2 left-2 font-mono text-[10px] text-[#59413e] select-none pointer-events-none">
              [ REC: 16-BIT ]
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#59413e] select-none pointer-events-none">
              RAW / TIFF / PSD
            </div>

            {/* Central Icon & Typography */}
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#201f1f] text-[#ffb4ac] transition-transform duration-300 group-hover:scale-105 border border-[#2a2a2a]">
              <UploadCloud className="w-8 h-8" />
            </div>
            <span className="font-serif text-[22px] text-[#e5e2e1] mb-1 font-medium">
              Drop Master Plate Files Here
            </span>
            <p className="font-mono text-[12px] uppercase tracking-wider text-[#a88a86] mb-4">
              UPLOAD ARCHIVE SOURCE // DRAG TO COMMENCE
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
              <span className="px-2 py-0.5 bg-[#201f1f] text-[#c6c6ca] font-mono text-[10px] uppercase">
                PNG
              </span>
              <span className="px-2 py-0.5 bg-[#201f1f] text-[#c6c6ca] font-mono text-[10px] uppercase">
                TIFF
              </span>
              <span className="px-2 py-0.5 bg-[#201f1f] text-[#c6c6ca] font-mono text-[10px] uppercase">
                JPG (MAX 100MB)
              </span>
              <span className="px-2 py-0.5 bg-[#201f1f] text-[#c6c6ca] font-mono text-[10px] uppercase">
                PSD
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative z-10 px-4 py-2 bg-[#2a2a2a] hover:bg-[#353534] text-[#e5e2e1] font-mono text-[12px] uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Browse File Repository</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInjectDemoPlate();
                }}
                className="relative z-10 px-3 py-2 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#ffb4ac] font-mono text-[11px] uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-[#991b1b]/40"
                title="Quickly add sample plate into queue"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Demo Master</span>
              </button>
            </div>
          </div>

          {/* Active Staging Queue Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#a88a86]">
                  Staged Plates In Queue
                </span>
                <span className="px-1.5 py-0.5 bg-[#991b1b] text-[#ffdad6] font-mono text-[10px]">
                  {stagedPlates.length} SELECTED
                </span>
              </div>
              {stagedPlates.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearBatch}
                  className="font-mono text-[10px] uppercase text-[#a88a86] hover:text-[#ffb4ac] transition-colors cursor-pointer"
                >
                  Clear Batch
                </button>
              )}
            </div>

            {/* Queue List */}
            {stagedPlates.length === 0 ? (
              <div className="p-8 bg-[#0e0e0e] border border-[#201f1f] text-center text-[#a88a86] font-mono text-xs">
                No plates staged in buffer. Drag a master image above or click Browse.
              </div>
            ) : (
              stagedPlates.map((item, idx) => {
                const isSelected = item.id === selectedId;
                const formattedNum = String(idx + 1).padStart(2, '0');

                return (
                  <div
                    key={item.id}
                    id={`queue-item-${item.id}`}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer p-4 transition-all duration-200 flex flex-col gap-2 group relative border border-transparent ${
                      isSelected
                        ? 'bg-[#1c1b1b] border-l-2 border-l-[#991b1b]'
                        : 'bg-[#0e0e0e] hover:bg-[#1c1b1b]'
                    }`}
                    style={
                      isSelected
                        ? { boxShadow: 'inset 2px 0 0 0 #991b1b' }
                        : undefined
                    }
                  >
                    <div className="flex gap-4 items-start">
                      {/* Thumbnail with Index */}
                      <div className="w-20 h-28 flex-shrink-0 bg-[#0e0e0e] overflow-hidden relative border border-[#2a2a2a]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover grayscale contrast-125"
                        />
                        <div className="absolute bottom-0 right-0 px-1 bg-[#0e0e0e] text-[#ffb4ac] font-mono text-[9px]">
                          {formattedNum}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-28">
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-serif text-[18px] text-[#e5e2e1] truncate font-medium">
                              {item.title}
                            </span>
                            <span className="flex items-center text-[#ffb4ac] font-mono text-[10px] uppercase gap-1 flex-shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" /> 100%
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-[#a88a86] truncate">
                            {item.filename}
                          </span>
                        </div>

                        {/* Technical analysis pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#353534] text-[#c6c6ca]">
                            {item.resolution}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#353534] text-[#c6c6ca]">
                            {item.colorDepth}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#353534] text-[#c6c6ca]">
                            {item.fileSize}
                          </span>
                        </div>

                        {/* Progress Gauge */}
                        <div className="w-full bg-[#353534] h-1 overflow-hidden">
                          <div className="bg-[#991b1b] h-full w-full" />
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveStagedItem(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-[#a88a86] hover:text-[#ffb4ac] p-1 transition-opacity cursor-pointer"
                        title="Remove from staged queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Archival Storage Telemetry Bar */}
            <div className="p-4 bg-[#0e0e0e] border border-[#201f1f] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HardDrive className="w-4 h-4 text-[#a88a86]" />
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase text-[#a88a86]">
                    Archival Ingestion Capacity
                  </span>
                  <span className="font-mono text-[11px] text-[#e5e2e1]">
                    61.2 MB / 5.0 GB Vault Allocation
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase text-[#ffb4ac] font-bold">
                SYNC VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* CENTER & RIGHT COLUMN: Archival Metadata Form & Live Gallery Preview (Cols 6-12) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {activePlate ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Metadata Form Fields (Lg: 7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="pb-1 flex items-center justify-between border-b border-[#201f1f]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
                    CURATORIAL TAXONOMY // PLATE{' '}
                    {String(activePlateIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] text-[#a88a86]">
                    UUID: {activePlate.uuid}
                  </span>
                </div>

                {/* Title Input */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="input-title"
                    className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider"
                  >
                    Artefact Designation / Title
                  </label>
                  <input
                    id="input-title"
                    type="text"
                    value={activePlate.title}
                    onChange={(e) => updateActivePlate({ title: e.target.value })}
                    placeholder="e.g. Sovereign of Ash & Ruin"
                    className="w-full px-4 py-2 bg-[#0e0e0e] border border-[#201f1f] text-[#e5e2e1] font-mono text-[13px] focus:outline-none focus:border-[#991b1b] focus:bg-[#1c1b1b] transition-colors"
                  />
                </div>

                {/* Series & Creation Date (Row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="select-series"
                      className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider"
                    >
                      Series / Collection
                    </label>
                    <div className="relative">
                      <select
                        id="select-series"
                        value={activePlate.series}
                        onChange={(e) =>
                          updateActivePlate({ series: e.target.value })
                        }
                        className="w-full appearance-none px-4 py-2 bg-[#0e0e0e] border border-[#201f1f] text-[#e5e2e1] font-mono text-[13px] focus:outline-none focus:border-[#991b1b] focus:bg-[#1c1b1b] pr-10 cursor-pointer"
                      >
                        {seriesList.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#a88a86] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="input-date"
                      className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider"
                    >
                      Chronicle Year / Epoch
                    </label>
                    <input
                      id="input-date"
                      type="text"
                      value={activePlate.epoch}
                      onChange={(e) =>
                        updateActivePlate({ epoch: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[#0e0e0e] border border-[#201f1f] text-[#e5e2e1] font-mono text-[13px] focus:outline-none focus:border-[#991b1b] focus:bg-[#1c1b1b] transition-colors"
                    />
                  </div>
                </div>

                {/* Medium & Instruments */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="input-medium"
                    className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider"
                  >
                    Medium &amp; Instruments
                  </label>
                  <input
                    id="input-medium"
                    type="text"
                    value={activePlate.medium}
                    onChange={(e) =>
                      updateActivePlate({ medium: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#0e0e0e] border border-[#201f1f] text-[#e5e2e1] font-mono text-[13px] focus:outline-none focus:border-[#991b1b] focus:bg-[#1c1b1b] transition-colors"
                  />
                </div>

                {/* Artist Statement / Description */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="input-description"
                    className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider"
                  >
                    Artist Statement // Provenance Lore
                  </label>
                  <textarea
                    id="input-description"
                    rows={4}
                    value={activePlate.lore}
                    onChange={(e) => updateActivePlate({ lore: e.target.value })}
                    className="w-full p-4 bg-[#0e0e0e] border border-[#201f1f] text-[#e5e2e1] font-mono text-[13px] focus:outline-none focus:border-[#991b1b] focus:bg-[#1c1b1b] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Tag Manager */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase text-[#a88a86] tracking-wider">
                    Archival Taxa (Tags)
                  </label>
                  <div
                    id="tag-container"
                    className="p-2 bg-[#0e0e0e] border border-[#201f1f] flex flex-wrap gap-1.5 items-center min-h-[42px]"
                  >
                    {activePlate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#201f1f] text-[#e5e2e1] font-mono text-[10px]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-[#a88a86] hover:text-[#ffb4ab] transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      id="input-tag"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="+ add tag..."
                      className="bg-transparent border-none text-[#e5e2e1] font-mono text-[10px] px-1 py-0.5 focus:outline-none min-w-[80px]"
                    />
                  </div>
                </div>

                {/* Licensing & Rights Protocols */}
                <div className="flex flex-col gap-2 pt-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#a88a86]">
                    Archival Rights &amp; Reproduction
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 p-2 bg-[#0e0e0e] border border-[#201f1f] cursor-pointer hover:bg-[#201f1f] transition-colors">
                      <input
                        type="checkbox"
                        checked={activePlate.rights.fineArtPrint}
                        onChange={(e) =>
                          updateActivePlate({
                            rights: {
                              ...activePlate.rights,
                              fineArtPrint: e.target.checked
                            }
                          })
                        }
                        className="accent-[#991b1b] w-3.5 h-3.5"
                      />
                      <span className="font-mono text-[10px] text-[#e5e2e1] uppercase">
                        Fine Art Print
                      </span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-[#0e0e0e] border border-[#201f1f] cursor-pointer hover:bg-[#201f1f] transition-colors">
                      <input
                        type="checkbox"
                        checked={activePlate.rights.editorialLore}
                        onChange={(e) =>
                          updateActivePlate({
                            rights: {
                              ...activePlate.rights,
                              editorialLore: e.target.checked
                            }
                          })
                        }
                        className="accent-[#991b1b] w-3.5 h-3.5"
                      />
                      <span className="font-mono text-[10px] text-[#e5e2e1] uppercase">
                        Editorial Lore
                      </span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-[#0e0e0e] border border-[#201f1f] cursor-pointer hover:bg-[#201f1f] transition-colors">
                      <input
                        type="checkbox"
                        checked={activePlate.rights.nftToken}
                        onChange={(e) =>
                          updateActivePlate({
                            rights: {
                              ...activePlate.rights,
                              nftToken: e.target.checked
                            }
                          })
                        }
                        className="accent-[#991b1b] w-3.5 h-3.5"
                      />
                      <span className="font-mono text-[10px] text-[#a88a86] uppercase">
                        NFT Token
                      </span>
                    </label>
                  </div>
                </div>

                {/* Visibility Curation Setting */}
                <div className="flex flex-col gap-1 pt-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#a88a86]">
                    Access Horizon &amp; Visibility
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <label
                      className={`flex items-center gap-2 p-2 cursor-pointer border transition-colors ${
                        activePlate.visibility === 'public'
                          ? 'bg-[#1c1b1b] border-[#991b1b]'
                          : 'bg-[#0e0e0e] border-[#201f1f] hover:bg-[#201f1f]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={activePlate.visibility === 'public'}
                        onChange={() => updateActivePlate({ visibility: 'public' })}
                        className="accent-[#991b1b]"
                      />
                      <span className="font-mono text-[10px] text-[#e5e2e1] uppercase">
                        Public Vault
                      </span>
                    </label>
                    <label
                      className={`flex items-center gap-2 p-2 cursor-pointer border transition-colors ${
                        activePlate.visibility === 'curators'
                          ? 'bg-[#1c1b1b] border-[#991b1b]'
                          : 'bg-[#0e0e0e] border-[#201f1f] hover:bg-[#201f1f]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="curators"
                        checked={activePlate.visibility === 'curators'}
                        onChange={() => updateActivePlate({ visibility: 'curators' })}
                        className="accent-[#991b1b]"
                      />
                      <span className="font-mono text-[10px] text-[#e5e2e1] uppercase">
                        Curators Only
                      </span>
                    </label>
                    <label
                      className={`flex items-center gap-2 p-2 cursor-pointer border transition-colors ${
                        activePlate.visibility === 'cipher'
                          ? 'bg-[#1c1b1b] border-[#991b1b]'
                          : 'bg-[#0e0e0e] border-[#201f1f] hover:bg-[#201f1f]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="cipher"
                        checked={activePlate.visibility === 'cipher'}
                        onChange={() => updateActivePlate({ visibility: 'cipher' })}
                        className="accent-[#991b1b]"
                      />
                      <span className="font-mono text-[10px] text-[#e5e2e1] uppercase">
                        Cipher Key
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Exhibition Preview Card (Lg: 5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-1 border-b border-[#201f1f]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac] flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#cc003c]" />
                    Live Gallery Rendition
                  </span>
                  <span className="font-mono text-[10px] text-[#a88a86]">
                    PORTFOLIO VIEWPORT
                  </span>
                </div>

                {/* Simulated Gallery Wall Frame */}
                <div className="p-4 bg-[#0e0e0e] border border-[#201f1f] flex flex-col gap-4 transition-all duration-300 relative group">
                  {/* Plate Media Frame */}
                  <div className="w-full aspect-[3/4] bg-[#131313] overflow-hidden relative flex items-center justify-center border border-[#2a2a2a]">
                    <img
                      src={activePlate.imageUrl}
                      alt={activePlate.title}
                      className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-[1.02]"
                    />

                    {/* Subtle red corner crosshairs */}
                    <div className="absolute top-2 left-2 w-2 h-2 text-[#ffb4ac] pointer-events-none">
                      <svg
                        fill="none"
                        height="8"
                        viewBox="0 0 8 8"
                        width="8"
                      >
                        <path
                          d="M0 0H8M0 0V8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div className="absolute top-2 right-2 w-2 h-2 text-[#ffb4ac] pointer-events-none">
                      <svg
                        fill="none"
                        height="8"
                        viewBox="0 0 8 8"
                        width="8"
                      >
                        <path
                          d="M8 0H0M8 0V8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 text-[#ffb4ac] pointer-events-none">
                      <svg
                        fill="none"
                        height="8"
                        viewBox="0 0 8 8"
                        width="8"
                      >
                        <path
                          d="M0 8H8M0 8V0"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 text-[#ffb4ac] pointer-events-none">
                      <svg
                        fill="none"
                        height="8"
                        viewBox="0 0 8 8"
                        width="8"
                      >
                        <path
                          d="M8 8H0M8 8V0"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    {/* Archival Stamp Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#0e0e0e]/90 backdrop-blur-sm text-[#e2e2e6] font-mono text-[10px] tracking-widest uppercase border border-[#353534]">
                      {activePlate.plateNumber}
                    </div>
                  </div>

                  {/* Curatorial Placard / Caption */}
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb4ac]">
                        {activePlate.series.toUpperCase()}
                      </span>
                      <span className="font-mono text-[10px] text-[#a88a86]">
                        {activePlate.epoch}
                      </span>
                    </div>
                    <h2 className="font-serif text-[26px] text-[#e5e2e1] tracking-tight font-medium leading-tight">
                      {activePlate.title || 'Untitled Artefact'}
                    </h2>
                    <p className="font-mono text-[10px] text-[#c6c6ca] uppercase tracking-wider">
                      {activePlate.medium}
                    </p>
                    <div className="w-full h-px bg-[#201f1f] my-2" />
                    <p className="font-mono text-[11px] text-[#a88a86] line-clamp-3 leading-relaxed">
                      {activePlate.lore}
                    </p>
                  </div>

                  {/* Exhibition Context Note */}
                  <div className="p-2 bg-[#201f1f] border border-[#2a2a2a] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#a88a86] uppercase">
                      Exhibition Lighting: {activePlate.exhibitionLighting}
                    </span>
                    <span className="font-mono text-[10px] text-[#ffb4ac] uppercase font-semibold">
                      MUSEUM READY
                    </span>
                  </div>
                </div>

                {/* Color Balance & Stipple Density Telemetry Chart */}
                <div className="p-4 bg-[#0e0e0e] border border-[#201f1f] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#a88a86]">
                      Luminance &amp; Stipple Analysis
                    </span>
                    <span className="font-mono text-[10px] text-[#c6c6ca]">
                      GAMMA: {activePlate.gamma}
                    </span>
                  </div>

                  {/* Inline SVG Histogram Chart matching original */}
                  <svg
                    className="w-full h-12 text-[#a88a86]"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 300 48"
                  >
                    {/* Dark tonal range curve */}
                    <path
                      d="M0 46 L20 42 L40 38 L60 22 L80 12 L100 8 L120 18 L140 30 L160 38 L180 42 L200 44 L220 45 L240 45 L260 46 L280 47 L300 48 V48 H0 Z"
                      fill="currentColor"
                      opacity="0.15"
                    />
                    {/* Highlight crimson accent spike */}
                    <path
                      d="M0 48 L20 44 L40 40 L60 25 L80 14 L100 10 L120 20 L140 32 L160 40 L180 43 L200 45 L220 46 L240 46 L260 47 L280 47 L300 48"
                      stroke="#ffb4ac"
                      strokeWidth="1.5"
                    />
                    {/* Reference guide lines */}
                    <line
                      stroke="#991b1b"
                      strokeDasharray="2 2"
                      strokeWidth="0.75"
                      x1="100"
                      x2="100"
                      y1="0"
                      y2="48"
                    />
                    <line
                      stroke="#353534"
                      strokeDasharray="2 2"
                      strokeWidth="0.75"
                      x1="200"
                      x2="200"
                      y1="0"
                      y2="48"
                    />
                  </svg>
                  <div className="flex justify-between font-mono text-[9px] uppercase text-[#a88a86]">
                    <span>Deep Shadows ({activePlate.deepShadowsPercent}%)</span>
                    <span>Midtone Ink ({activePlate.midtoneInkPercent}%)</span>
                    <span>Crimson / Light ({activePlate.crimsonLightPercent}%)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-[#0e0e0e] border border-[#201f1f] text-center">
              <span className="font-serif text-xl text-[#e5e2e1]">
                No Active Plate Selected
              </span>
              <p className="font-mono text-xs text-[#a88a86] mt-2">
                Ingest master plates using the crucible on the left.
              </p>
            </div>
          )}

          {/* Action Confirmation Drawer / Bottom Control Bar */}
          {activePlate && (
            <div
              className="w-full p-4 bg-[#0e0e0e] border border-[#201f1f] flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-30 shadow-2xl"
              style={{
                boxShadow: '0 10px 30px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(153, 27, 27, 0.3)'
              }}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="w-full sm:w-auto px-4 py-2 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#a88a86] hover:text-[#e5e2e1] font-mono text-[12px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#2a2a2a]"
                >
                  <X className="w-4 h-4" />
                  <span>Discard</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto px-4 py-2 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#e5e2e1] font-mono text-[12px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#2a2a2a]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save as Draft</span>
                </button>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <span className="hidden md:inline-block font-mono text-[10px] uppercase text-[#a88a86]">
                  STATUS: READY FOR VAULT BINDING
                </span>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="w-full sm:w-auto px-6 py-2 bg-[#991b1b] hover:bg-[#cc003c] text-[#ffdad6] font-mono text-[12px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#991b1b]/20 hover:shadow-[#cc003c]/40 cursor-pointer active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish to Archive</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
