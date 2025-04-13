// src/components/Home.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Plus, ArrowLeft, Loader2 } from "lucide-react"; // Added Loader2
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import supabase from "../supabaseConfig";
import './Home.css'; // Main component styles

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

function Home() {
  const navigate = useNavigate();

  // --- State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Start hidden
  const [newLink, setNewLink] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Search inside dialog loading
  const [expandedRows, setExpandedRows] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [searchResultCount, setSearchResultCount] = useState("5");
  const [showExistingLinkDialog, setShowExistingLinkDialog] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  // --- Effects ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize); handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const debouncedFetchLinks = useCallback( debounce(async (filterQuery) => {
      console.log("[FetchMainLinks] Filter:", filterQuery || "(none)");
      setIsLoadingLinks(true);
      try {
        let q = supabase.from('links').select('id, url, summary, created_at').order('created_at', { ascending: false });
        if (filterQuery) q = q.or(`url.ilike.%${filterQuery}%,summary.ilike.%${filterQuery}%`);
        const { data, error } = await q;
        if (error) throw error; setLinks(data || []);
      } catch (e) { console.error("Fetch Links Error:", e); setLinks([]); }
      finally { setIsLoadingLinks(false); }
    }, 300), [] );

  useEffect(() => { debouncedFetchLinks(tableSearchQuery); }, [tableSearchQuery, debouncedFetchLinks]);
  useEffect(() => { console.log("Initial Fetch..."); debouncedFetchLinks(''); }, [debouncedFetchLinks]);

  // --- Handlers ---
  const handleSubmit = useCallback(async () => { /* Add Link Logic */
    const trimmedLink = newLink.trim(); if (!trimmedLink) return; try { new URL(trimmedLink); } catch (_) { alert("Invalid URL"); return; }
    const backendUrl = import.meta.env.VITE_BACKEND_URL; if (!backendUrl) { alert("Config Error: Backend URL missing."); return; }
    if (links.some(link => link.url === trimmedLink)) { setShowExistingLinkDialog(true); setNewLink(""); return; }
    setIsAddingLink(true);
    try {
      const response = await axios.post(`${backendUrl}/summarize`, { url: trimmedLink }, { timeout: 60000 });
      const summary = response.data.summary;
      if (summary === "Could not extract content from the URL.") alert(summary);
      else if (summary?.includes("Summary exists")) setShowExistingLinkDialog(true);
      else await debouncedFetchLinks(tableSearchQuery); setNewLink("");
    } catch (error) {
      console.error("Add Link Error:", error);
      if (error.code === 'ECONNABORTED') alert("Add timed out."); else if (error.response) alert(`Backend error adding: ${error.response.data?.detail || error.response.status}`); else if (error.request) alert("Network error adding link."); else alert(`Failed to add link: ${error.message || "Unknown error."}`);
    } finally { setIsAddingLink(false); }
  }, [newLink, links, tableSearchQuery, debouncedFetchLinks]);

  const handleAddKeyPress = (e) => { if (e.key === 'Enter' && !isAddingLink && newLink.trim()) handleSubmit(); };

  // Search *inside* the dialog
  const handleSearch = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    console.log(`[handleSearch] Fired. Query: "${trimmedQuery}"`);
    if (!trimmedQuery || isSearching) return;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) { alert("Config Error: Backend URL missing for search."); return; }

    setSearchResults([]); setIsSearching(true);
    try {
      const kValue = parseInt(searchResultCount, 10) || 5;
      const searchPayload = { query: trimmedQuery, k: kValue };
      const response = await axios.post(`${backendUrl}/search`, searchPayload, { timeout: 30000 });
      console.log("[handleSearch] Backend response:", response?.data);

      if (!response?.data || !Array.isArray(response.data.matches)) throw new Error("Invalid backend response");
      const { matches } = response.data;
      if (matches.length === 0) { setSearchResults([]); }
      else {
        const { data: linkDetails, error: fetchErr } = await supabase.from('links').select('id, url, summary, created_at').in('id', matches);
        if (fetchErr) throw new Error(`DB fetch error: ${fetchErr.message}`);
        if (linkDetails?.length > 0) {
          const detailsMap = new Map(linkDetails.map(link => [link.id, link]));
          const sortedResults = matches.map(id => detailsMap.get(id)).filter(Boolean);
          setSearchResults(sortedResults);
        } else { setSearchResults([]); }
      }
    } catch (error) {
      console.error("Search Error:", error); setSearchResults([]);
      if (error.code === 'ECONNABORTED') alert("Search timed out."); else if (error.response) alert(`Backend search error: ${error.response.data?.detail || error.response.status}`); else if (error.request) alert("Network error during search."); else alert(`Search failed: ${error.message || "Unknown error."}`);
    } finally { setIsSearching(false); }
  }, [searchQuery, searchResultCount, isSearching, supabase]);

  const handleSearchKeyPress = (e) => { if (e.key === 'Enter' && !isSearching && searchQuery.trim()) handleSearch(); };
  const handleSearchQueryChange = (e) => setSearchQuery(e.target.value);

  // Other UI Handlers
  const toggleRowExpansion = useCallback((id) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] })), []);
  const renderSummary = useCallback((summary, id) => { if (!summary) return <span className="italic text-gray-500">No summary</span>; if (expandedRows[id]) return summary.split('\n').map((p, i) => <p key={i} className="mb-2 last:mb-0">{p || '\u00A0'}</p>); const maxLength = isMobile ? 70 : 130; return summary.length > maxLength ? `${summary.slice(0, maxLength)}…` : summary; }, [expandedRows, isMobile]);
  const handleTableSearchChange = useCallback((e) => setTableSearchQuery(e.target.value), []);
  const handleGoToLanding = useCallback(() => navigate('/landing'), [navigate]);

  // --- JSX ---
  return (
    <div className="home-page-wrapper">
      <div className="fixed-grid-background" aria-hidden="true"><div className="grid-lines"></div></div>
      <div className="home-container">
        <header className="home-header"> {/* Header */}
          <a href="/landing" onClick={(e) => { e.preventDefault(); handleGoToLanding(); }} className="company-logo-link"><img src="/compendium-transparent.png" alt="Logo" className="company-logo" /></a>
          <Button onClick={handleGoToLanding} className="button button-secondary"><ArrowLeft className="icon w-4 h-4 mr-1.5" /> Back</Button>
        </header>

        {/* --- Dialogs --- */}
        <Dialog open={showExistingLinkDialog} onOpenChange={setShowExistingLinkDialog}>
          <DialogContent> {/* Existing Link Dialog */}
            <DialogHeader><DialogTitle>Link Already Exists</DialogTitle></DialogHeader>
            <DialogDescription>This link is already in the database.</DialogDescription>
            <DialogFooter><Button onClick={() => setShowExistingLinkDialog(false)} className="button button-secondary">Close</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- Advanced Search Dialog --- */}
        {/* Uses isSearchOpen state for visibility */}
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="search-modal-content"> {/* Added class for specific styling */}
            <DialogHeader>
              <DialogTitle className="search-modal-title">Query through Knowledge Base</DialogTitle>
            </DialogHeader>
            <div className="dialog-main-content">
              <div className="search-input-group"> {/* Input Group */}
                <Input type="text" placeholder="Describe what you're looking for..." className="input flex-grow" value={searchQuery} onChange={handleSearchQueryChange} onKeyPress={handleSearchKeyPress} disabled={isSearching} />
                <Select value={searchResultCount} onValueChange={setSearchResultCount} disabled={isSearching}>
                  <SelectTrigger className="w-[130px] flex-shrink-0 button button-secondary"><SelectValue placeholder="Results" /></SelectTrigger>
                  <SelectContent><SelectItem value="3">3 results</SelectItem><SelectItem value="5">5 results</SelectItem><SelectItem value="10">10 results</SelectItem></SelectContent>
                </Select>
                <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="button button-primary"> {/* Inner Search Btn */}
                  {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="icon w-4 h-4 mr-1.5" />}
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <div className="table-container"> {/* Results Table */}
                <Table>
                  <TableHeader><TableRow><TableHead>URL</TableHead><TableHead>Summary</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {isSearching ? (
                      <TableRow className="searching-cell">
                         <TableCell colSpan={2}>
                            <div className="flex items-center justify-center gap-2 py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                <span>Searching...</span>
                            </div>
                         </TableCell>
                      </TableRow>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((link) => (
                        <TableRow key={`search-${link.id}`} onClick={() => toggleRowExpansion(link.id)} className="table-row" title="Click to expand/collapse">
                          <TableCell className="url-cell"><a href={link.url} target="_blank" rel="noopener noreferrer" className="link" onClick={(e) => e.stopPropagation()}>{link.url}</a></TableCell>
                          <TableCell className="summary-cell">{renderSummary(link.summary, link.id)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="no-results">
                        <TableCell colSpan={2}>
                            {searchQuery ? 'No relevant links found for your query.' : 'Enter query and click Search.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
                <Button onClick={() => setIsSearchOpen(false)} className="button button-secondary">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- Main Page Content --- */}
        <main className="home-grid-container">
          <div className="main-title-area"><h1 className="main-title">Compendium <span className="highlight">Knowledge Base</span></h1></div>
          <section className="compendium-section"> {/* Add Link */}
            <div className="input-group">
              <Input type="url" placeholder="Paste link here..." value={newLink} onChange={(e) => setNewLink(e.target.value)} onKeyPress={handleAddKeyPress} className="input" disabled={isAddingLink} />
              <div className="button-group">
                <Button onClick={handleSubmit} disabled={isAddingLink || !newLink.trim()} className="button button-primary">{isAddingLink ? 'Adding...' : <><Plus className="icon w-4 h-4 mr-1.5" />Add</>}</Button>
                {/* ---- OUTER SEARCH BUTTON ---- */}
                <Button onClick={() => setIsSearchOpen(true)} className="button button-secondary">
                  <Search className="icon w-4 h-4 mr-1.5" /> Search
                </Button>
              </div>
            </div>
          </section>
          <section className="table-section"> {/* Link Table */}
            <h2 id="links-table-title" className="sr-only">Stored Links</h2>
            <div className="search-bar"> {/* Filter */}
              <label htmlFor="table-filter" className="sr-only">Filter</label><div className="search-icon-wrapper"><Search className="search-icon" /></div>
              <Input id="table-filter" type="text" placeholder="Filter stored links..." value={tableSearchQuery} onChange={handleTableSearchChange} className="input" />
            </div>
            <div className="table-container"> {/* Table */}
              <Table aria-labelledby="links-table-title">
                <TableHeader><TableRow><TableHead>URL</TableHead><TableHead>Summary</TableHead></TableRow></TableHeader>
                <TableBody>{isLoadingLinks ? (<TableRow><TableCell colSpan={2} className="no-results">Loading...</TableCell></TableRow>) : links.length > 0 ? (links.map((link) => (<TableRow key={link.id} onClick={() => toggleRowExpansion(link.id)} className="table-row"><TableCell className="url-cell"><a href={link.url} target="_blank" rel="noopener noreferrer" className="link" onClick={(e) => e.stopPropagation()}>{link.url}</a></TableCell><TableCell className="summary-cell">{renderSummary(link.summary, link.id)}</TableCell></TableRow>))) : (<TableRow><TableCell colSpan={2} className="no-results">{tableSearchQuery ? 'No links match.' : 'No links added.'}</TableCell></TableRow>)}</TableBody>
              </Table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Home;