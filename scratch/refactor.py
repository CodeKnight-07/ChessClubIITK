import re

with open("react-app/src/pages/Gallery.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 2. Replace the 3D book wrapper with <PhotoBook />
replacement_book = """              {/* 3D Page Turning Book Wrapper Extracted */}
              <div className="w-full flex items-center justify-center overflow-visible">
                <PhotoBook photos={clubMemoriesPhotos} title="Current Tenure" subtitle="Photo Album" />
              </div>
"""
content = re.sub(r'(?s)              \{\/\* 3D Page Turning Book Wrapper \*\/\}.*?<\/AnimatePresence>\s+', replacement_book + "\n", content)

# 3. Add the "View Album" button to the Tenure Selection Dropdown
tenure_dropdown = """              {/* Tenure Selection Dropdown */}
              <div className="flex flex-col items-center justify-center mt-12 mb-4 gap-4">
                <div className="relative group">
                  <select 
                    className="appearance-none bg-surface-container-low border border-outline-variant/30 text-on-surface py-3 px-6 pr-12 rounded-xl shadow-md hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer text-sm font-semibold tracking-wide font-label uppercase"
                    value={activeTenure}
                    onChange={(e) => setActiveTenure(e.target.value)}
                  >
                    <option value="2025-26">2025-26 Tenure</option>
                    <option value="2024-25">2024-25 Tenure</option>
                    <option value="2023-24">2023-24 Tenure</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsTenureModalOpen(true)}
                  className="bg-primary text-on-primary font-bold px-6 py-2 rounded-lg shadow-md hover:scale-[1.03] active:scale-95 transition-all outline-none"
                >
                  View Album for {activeTenure}
                </button>
              </div>"""
content = re.sub(r'(?s)              \{\/\* Tenure Selection Dropdown \*\/\}.*?<\/section>', tenure_dropdown + "\n            </section>", content)

# 4. Replace the FIDE Full-Screen Lightbox with PhotoBook modal
fide_modal = """        {/* Full-Screen Image Lightbox Modal */}
  <AnimatePresence>
    {isOpenLightbox && carouselImages.length > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 outline-none"
      >
        <div className="flex justify-end w-full max-w-7xl mx-auto h-12 mb-4">
          <button
            onClick={() => setIsOpenLightbox(false)}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-colors text-on-surface hover:text-on-primary flex items-center justify-center outline-none shadow-lg"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="w-full flex-1 overflow-auto flex items-center justify-center mt-8">
          <PhotoBook 
            photos={carouselImages.map(img => img.image_url?.startsWith('http') ? img.image_url : `${API_BASE_URL}${img.image_url}`)} 
            title="FIDE Rated Tournament" 
            subtitle="Captures" 
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Tenure Modal */}
  <AnimatePresence>
    {isTenureModalOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 outline-none"
      >
        <div className="flex justify-end w-full max-w-7xl mx-auto h-12 mb-4">
          <button
            onClick={() => setIsTenureModalOpen(false)}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-colors text-on-surface hover:text-on-primary flex items-center justify-center outline-none shadow-lg"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="w-full flex-1 overflow-auto flex items-center justify-center mt-8">
          <PhotoBook photos={clubMemoriesPhotos} title={`${activeTenure} Tenure`} subtitle="Past Memories" />
        </div>
      </motion.div>
    )}
  </AnimatePresence>"""
content = re.sub(r'(?s)        \{\/\* Full-Screen Image Lightbox Modal \*\/\}.*?<\/AnimatePresence>', fide_modal, content)

with open("react-app/src/pages/Gallery.jsx", "w", encoding="utf-8") as f:
    f.write(content)
