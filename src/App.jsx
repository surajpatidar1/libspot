import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterSidebar from './components/FilterSidebar';
import LibraryCard from './components/LibraryCard';
import LibraryCardSkeleton from './components/LibraryCardSkeleton';
import LibraryDetailPage from './components/LibraryDetailPage';
import CompareDrawer from './components/CompareDrawer';
import BookmarksDrawer from './components/BookmarksDrawer';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import { LIBRARIES, CATEGORIES, BUNDLE_SIZE_RANGES } from './data/libraries';
import { getLibraries, getLibraryById, enrichLibrariesWithLiveTelemetry, USE_REAL_BACKEND_API } from './services/api';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown, PackageX, Sparkles, Server, Radio, ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  // Theme state: defaults to dark or persists user preference
  const [isDark, setIsDark] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('devstack_theme');
      return savedTheme ? savedTheme === 'dark' : true;
    } catch {
      return true;
    }
  });

  // Global Package Manager state (npm | pnpm | yarn | bun)
  const [packageManager, setPackageManager] = useState(() => {
    try {
      return localStorage.getItem('devstack_pm') || 'npm';
    } catch {
      return 'npm';
    }
  });

  const handlePackageManagerChange = (pm) => {
    setPackageManager(pm);
    try {
      localStorage.setItem('devstack_pm', pm);
    } catch (e) {
      console.error(e);
    }
  };

  // Deep linking: parse initial URL search parameters
  const getInitialUrlState = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        pkg: params.get('package') || '',
        q: params.get('q') || '',
        eco: params.get('eco') || 'All',
        cat: params.get('cat') || 'All',
        fw: params.get('fw') || 'All',
        page: parseInt(params.get('page') || '1', 10) || 1,
      };
    } catch {
      return { pkg: '', q: '', eco: 'All', cat: 'All', fw: 'All', page: 1 };
    }
  };

  const initialUrl = useRef(getInitialUrlState()).current;

  // Search & Filter state (initialized from URL if present)
  const [searchQuery, setSearchQuery] = useState(initialUrl.q);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialUrl.q);
  const [selectedEcosystem, setSelectedEcosystem] = useState(initialUrl.eco);
  const [selectedCategory, setSelectedCategory] = useState(initialUrl.cat);
  const [selectedFramework, setSelectedFramework] = useState(initialUrl.fw);
  const [selectedBundleSize, setSelectedBundleSize] = useState(0);
  const [tsOnly, setTsOnly] = useState(false);
  const [ssrOnly, setSsrOnly] = useState(false);
  const [sortBy, setSortBy] = useState('stars'); // 'stars' | 'downloads' | 'size' | 'name'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchLiveNpm, setSearchLiveNpm] = useState(false); // Live NPM registry search toggle

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialUrl.page);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // 300ms Debounce search input to avoid spamming network registry requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Libraries state (pure dynamic live NPM registry)
  const [filteredLibraries, setFilteredLibraries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation State (Active detail page vs Main catalog)
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  // Saved & Compared libraries (clean default: no pre-selected compare items blocking the screen)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('devstack_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comparedIds, setComparedIds] = useState([]);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Refs
  const searchInputRef = useRef(null);
  const librariesSectionRef = useRef(null);

  // Theme synchronization with html class
  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('devstack_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('devstack_theme', 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDark]);

  // Save savedIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('devstack_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  // Fetch libraries via service (curated ecosystems + live NPM)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getLibraries({
      searchQuery: debouncedSearchQuery,
      selectedEcosystem,
      selectedCategory,
      selectedFramework,
      selectedBundleSize,
      tsOnly,
      ssrOnly,
      sortBy,
      searchLiveNpm
    }).then((results) => {
      if (isMounted) {
        setFilteredLibraries(results || []);
        setIsLoading(false);

        // Asynchronously enrich top visible cards with live NPM weekly telemetry
        enrichLibrariesWithLiveTelemetry(results || []).then((enriched) => {
          if (isMounted && enriched && enriched.length > 0) {
            setFilteredLibraries(enriched);
          }
        });
      }
    }).catch((err) => {
      console.error('Failed to fetch libraries via service:', err);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchQuery, selectedEcosystem, selectedCategory, selectedFramework, selectedBundleSize, tsOnly, ssrOnly, sortBy, searchLiveNpm]);

  // 1. Deep linking: Load initial package detail if specified in URL (?package=xyz)
  useEffect(() => {
    if (initialUrl.pkg) {
      getLibraryById(initialUrl.pkg)
        .then((lib) => {
          if (lib) setSelectedLibrary(lib);
        })
        .catch((err) => console.error('Failed to load initial package from URL:', err));
    }
  }, []);

  // 2. Synchronize URL query params with state (deep linking & shareable links)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedLibrary) {
      params.set('package', selectedLibrary.id);
    } else {
      if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
      if (selectedEcosystem && selectedEcosystem !== 'All') params.set('eco', selectedEcosystem);
      if (selectedCategory && selectedCategory !== 'All') params.set('cat', selectedCategory);
      if (selectedFramework && selectedFramework !== 'All') params.set('fw', selectedFramework);
      if (currentPage > 1) params.set('page', String(currentPage));
    }
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({ package: selectedLibrary?.id || null }, '', newUrl);
  }, [selectedLibrary, debouncedSearchQuery, selectedEcosystem, selectedCategory, selectedFramework, currentPage]);

  // 3. Browser Back / Forward navigation handling (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pkg = params.get('package');
      if (pkg) {
        getLibraryById(pkg)
          .then((lib) => {
            if (lib) setSelectedLibrary(lib);
          })
          .catch((err) => console.error('Failed to restore package on popstate:', err));
      } else {
        setSelectedLibrary(null);
        setSearchQuery(params.get('q') || '');
        setSelectedEcosystem(params.get('eco') || 'All');
        setSelectedCategory(params.get('cat') || 'All');
        setSelectedFramework(params.get('fw') || 'All');
        setCurrentPage(parseInt(params.get('page') || '1', 10) || 1);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Safe navigation handlers for detail view
  const handleSelectLibrary = (lib) => {
    if (!lib) return;
    window.history.pushState({ package: lib.id }, '', `?package=${encodeURIComponent(lib.id)}`);
    setSelectedLibrary(lib);
  };

  const handleBackFromDetail = () => {
    setSelectedLibrary(null);
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (selectedEcosystem && selectedEcosystem !== 'All') params.set('eco', selectedEcosystem);
    if (selectedCategory && selectedCategory !== 'All') params.set('cat', selectedCategory);
    if (selectedFramework && selectedFramework !== 'All') params.set('fw', selectedFramework);
    if (currentPage > 1) params.set('page', String(currentPage));
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };

  // Pagination: Reset page to 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedEcosystem, selectedCategory, selectedFramework, selectedBundleSize, tsOnly, ssrOnly, sortBy, searchLiveNpm]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredLibraries.length / itemsPerPage));

  // Clamp current page if items change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const displayedLibraries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLibraries.slice(start, start + itemsPerPage);
  }, [filteredLibraries, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    librariesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [totalPages, currentPage]);

  const startItemIndex = filteredLibraries.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItemIndex = Math.min(filteredLibraries.length, currentPage * itemsPerPage);

  // Global Keyboard shortcuts ('/' focuses search, 'Escape' goes back)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        if (!selectedLibrary) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      } else if (e.key === 'Escape') {
        if (selectedLibrary) {
          handleBackFromDetail();
        }
        setIsSavedDrawerOpen(false);
        setIsCompareModalOpen(false);
        setIsFilterMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLibrary]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Smooth scroll down to library explorer section
  const handleScrollToLibraries = () => {
    librariesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle Save
  const handleToggleSave = (id) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        addToast('Removed from stack', 'info');
        return prev.filter((x) => x !== id);
      } else {
        addToast('Saved to stack!', 'success');
        return [...prev, id];
      }
    });
  };

  // Toggle Compare
  const handleToggleCompare = (id) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        addToast('Removed from comparison', 'info');
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 4) {
        addToast('You can compare up to 4 libraries at once', 'error');
        return prev;
      }
      addToast('Added to comparison matrix!', 'success');
      return [...prev, id];
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEcosystem('All');
    setSelectedCategory('All');
    setSelectedFramework('All');
    setSelectedBundleSize(0);
    setTsOnly(false);
    setSsrOnly(false);
    setCurrentPage(1);
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedEcosystem !== 'All') count++;
    if (selectedCategory !== 'All') count++;
    if (selectedFramework !== 'All') count++;
    if (selectedBundleSize !== 0) count++;
    if (tsOnly) count++;
    if (ssrOnly) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedEcosystem, selectedCategory, selectedFramework, selectedBundleSize, tsOnly, ssrOnly, searchQuery]);

  // Unified dynamic library pool (100% dynamic live packages)
  const allLibrariesPool = useMemo(() => {
    const map = new Map();
    (filteredLibraries || []).forEach((l) => {
      if (l && l.id) map.set(l.id.toLowerCase(), l);
    });
    return Array.from(map.values());
  }, [filteredLibraries]);

  // Category counts (dynamic based on live results)
  const categoryCounts = useMemo(() => {
    const counts = { All: allLibrariesPool.length };
    allLibrariesPool.forEach((lib) => {
      if (lib && lib.category) {
        counts[lib.category] = (counts[lib.category] || 0) + 1;
      }
    });
    return counts;
  }, [allLibrariesPool]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#0a1628] text-slate-800 dark:text-slate-200 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Conditionally render: Full-page Library Detail OR Main Catalog */}
      <AnimatePresence mode="wait">
        {selectedLibrary ? (
          <LibraryDetailPage
            key={selectedLibrary.id}
            library={selectedLibrary}
            onBack={handleBackFromDetail}
            isSaved={savedIds.includes(selectedLibrary.id)}
            isCompared={comparedIds.includes(selectedLibrary.id)}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectAlternative={handleSelectLibrary}
            allLibraries={allLibrariesPool}
            packageManager={packageManager}
          />
        ) : (
          <motion.div
            key="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top Navigation */}
            <Navbar
              savedCount={savedIds.length}
              compareCount={comparedIds.length}
              onOpenSaved={() => setIsSavedDrawerOpen(true)}
              onOpenCompare={() => setIsCompareModalOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchInputRef={searchInputRef}
              onResetFilters={handleResetFilters}
              isDark={isDark}
              onToggleTheme={() => setIsDark((prev) => !prev)}
              packageManager={packageManager}
              onPackageManagerChange={handlePackageManagerChange}
            />

            {/* 1. First Show Hero */}
            <HeroSection
              totalCount={allLibrariesPool.length || filteredLibraries.length || 36}
              onScrollToLibraries={handleScrollToLibraries}
            />

            {/* 2. Then Show Libraries Section Directly Below */}
            <section
              ref={librariesSectionRef}
              id="libraries-section"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8"
            >
              {/* Section Heading & Explorer Controls */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1.5">
                    {USE_REAL_BACKEND_API && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-2">
                        <Server className="w-3 h-3" /> Backend Active
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Explore & Filter Packages
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-mono">
                    Click any package to view its documentation, code guide, and live benchmarks
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 bg-white dark:bg-[#111d32] px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700 text-xs shadow-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-slate-900 dark:text-white focus:outline-none cursor-pointer text-xs font-mono font-semibold"
                    >
                      <option value="stars" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Most Stars</option>
                      <option value="downloads" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Most Downloads</option>
                      <option value="size" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Smallest Bundle</option>
                      <option value="name" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Name (A-Z)</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-white dark:bg-[#111d32] p-1 rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-xs">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'grid' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'list' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setIsFilterMobileOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111d32] border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-800 dark:text-white shadow-xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-medium">
                  Showing <strong className="text-slate-900 dark:text-white">{filteredLibraries.length}</strong> libraries
                </span>
              </div>

              {/* Layout: Sidebar + Grid */}
              <div className="flex items-start gap-8">
                {/* Desktop Filter Sidebar */}
                <FilterSidebar
                  selectedEcosystem={selectedEcosystem}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  selectedBundleSize={selectedBundleSize}
                  onSelectBundleSize={setSelectedBundleSize}
                  tsOnly={tsOnly}
                  onToggleTsOnly={() => setTsOnly((prev) => !prev)}
                  ssrOnly={ssrOnly}
                  onToggleSsrOnly={() => setSsrOnly((prev) => !prev)}
                  onResetFilters={handleResetFilters}
                  activeFilterCount={activeFilterCount}
                  categoryCounts={categoryCounts}
                  isMobileOpen={isFilterMobileOpen}
                  onCloseMobile={() => setIsFilterMobileOpen(false)}
                />

                {/* Libraries Results Grid */}
                <div className="flex-1 min-w-0">
                  {isLoading ? (
                    viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <LibraryCardSkeleton key={`skeleton-${i}`} viewMode="grid" />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <LibraryCardSkeleton key={`skeleton-${i}`} viewMode="list" />
                        ))}
                      </div>
                    )
                  ) : filteredLibraries.length === 0 ? (
                    <div className="bg-white dark:bg-[#111d32] border border-slate-200 dark:border-slate-700 p-12 rounded-2xl text-center flex flex-col items-center justify-center shadow-xs">
                      <PackageX className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3 stroke-[1.5]" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 font-mono">No packages matched</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mb-4">
                        We couldn't find any packages matching your current filter configuration.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-mono font-bold shadow-md transition-all cursor-pointer"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                      <AnimatePresence mode="popLayout">
                        {displayedLibraries.map((lib) => (
                          <LibraryCard
                            key={lib.id}
                            library={lib}
                            viewMode="grid"
                            isSaved={savedIds.includes(lib.id)}
                            isCompared={comparedIds.includes(lib.id)}
                            onToggleSave={handleToggleSave}
                            onToggleCompare={handleToggleCompare}
                            onSelectLibrary={handleSelectLibrary}
                            onCopyCommand={(cmd) => addToast(`Copied ${cmd}`, 'success')}
                            packageManager={packageManager}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <AnimatePresence mode="popLayout">
                        {displayedLibraries.map((lib) => (
                          <LibraryCard
                            key={lib.id}
                            library={lib}
                            viewMode="list"
                            isSaved={savedIds.includes(lib.id)}
                            isCompared={comparedIds.includes(lib.id)}
                            onToggleSave={handleToggleSave}
                            onToggleCompare={handleToggleCompare}
                            onSelectLibrary={handleSelectLibrary}
                            onCopyCommand={(cmd) => addToast(`Copied ${cmd}`, 'success')}
                            packageManager={packageManager}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Pagination Bar */}
                  {filteredLibraries.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Item count summary */}
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        Showing <span className="font-semibold text-slate-900 dark:text-white">{startItemIndex}–{endItemIndex}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredLibraries.length}</span> packages
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        {/* Items per page selector */}
                        <div className="flex items-center gap-1.5 mr-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                          <span>Per page:</span>
                          <select
                            value={itemsPerPage}
                            onChange={(e) => {
                              setItemsPerPage(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="bg-white dark:bg-[#111d32] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white focus:outline-none cursor-pointer text-xs font-mono"
                          >
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={36}>36</option>
                          </select>
                        </div>

                        {/* Prev button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all ${
                            currentPage <= 1
                              ? 'opacity-40 cursor-not-allowed text-slate-400'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs'
                          }`}
                          title="Previous Page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {pageNumbers.map((p, idx) =>
                            p === '...' ? (
                              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-mono text-xs">
                                ...
                              </span>
                            ) : (
                              <button
                                key={`page-${p}`}
                                onClick={() => handlePageChange(p)}
                                className={`w-8 h-8 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                                  currentPage === p
                                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/25 font-bold'
                                    : 'bg-white dark:bg-[#111d32] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400'
                                }`}
                              >
                                {p}
                              </button>
                            )
                          )}
                        </div>

                        {/* Next button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all ${
                            currentPage >= totalPages
                              ? 'opacity-40 cursor-not-allowed text-slate-400'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs'
                          }`}
                          title="Next Page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Drawer & Matrix Modal */}
      <CompareDrawer
        comparedIds={comparedIds}
        allLibraries={allLibrariesPool}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen((prev) => !prev)}
        onRemoveFromCompare={handleToggleCompare}
        onClearCompare={() => setComparedIds([])}
        onSelectLibrary={(lib) => {
          setIsCompareModalOpen(false);
          handleSelectLibrary(lib);
        }}
      />

      {/* Saved Bookmarks Drawer */}
      <AnimatePresence>
        {isSavedDrawerOpen && (
          <BookmarksDrawer
            isOpen={isSavedDrawerOpen}
            onClose={() => setIsSavedDrawerOpen(false)}
            savedIds={savedIds}
            allLibraries={allLibrariesPool}
            onRemoveFromSaved={handleToggleSave}
            onClearSaved={() => setSavedIds([])}
            onSelectLibrary={(lib) => {
              setIsSavedDrawerOpen(false);
              handleSelectLibrary(lib);
            }}
            packageManager={packageManager}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer onResetFilters={handleResetFilters} />

    </div>
  );
}
