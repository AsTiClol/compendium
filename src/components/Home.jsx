// src/components/Home.jsx

// Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Plus, ArrowLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import supabase from "../supabaseConfig";
import './Home.css';

function Home() {
  console.log("Rendering Home component..."); // Log start

  const navigate = useNavigate();

  // --- State Hooks ---
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [searchResultCount, setSearchResultCount] = useState("5");
  const [showExistingLinkDialog, setShowExistingLinkDialog] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  // --- Effects & Functions ---
  useEffect(() => { /* Handle Resize */ setIsMobile(window.innerWidth < 640); const hr = () => setIsMobile(window.innerWidth<640); window.addEventListener('resize',hr); return () => window.removeEventListener('resize',hr); }, []);
  const debounce = (func, delay) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => func.apply(this,a), delay);}; };
  const debouncedFetchLinks = React.useCallback(debounce(async (st) => { console.log("Fetching links with filter:", st); setIsLoadingLinks(true); try { let q = supabase.from('links').select('id,url,summary,created_at').order('created_at',{ascending:false}); if(st) q=q.or(`url.ilike.%${st}%,summary.ilike.%${st}%`); const{data,error}=await q; if(error)throw error; console.log("Fetched links data:", data); setLinks(data||[]); } catch(e){console.error("Fetch Links Error:",e);setLinks([]);alert(`Fetch Links Error: ${e.message||"?"}`)} finally {setIsLoadingLinks(false)}}, 300),[]);
  useEffect(() => { debouncedFetchLinks(tableSearchQuery); }, [tableSearchQuery, debouncedFetchLinks]);
  useEffect(() => { console.log("Initial links fetch..."); debouncedFetchLinks(''); }, [debouncedFetchLinks]);

  // DEBUGGING: Log state changes for isSearchOpen
  useEffect(() => {
    console.log("isSearchOpen state changed to:", isSearchOpen);
  }, [isSearchOpen]);

  // DEBUGGING: Log state changes for isSearching
  useEffect(() => {
    console.log("isSearching state changed to:", isSearching);
  }, [isSearching]);

  const handleSubmit = async () => { /* Submit Logic */
    const trimmedLink = newLink.trim();
    if (!trimmedLink) { alert("Please enter a link."); return; }
    try { new URL(trimmedLink); } catch (_) { alert("Invalid URL format."); return; }
    setIsAddingLink(true); console.log("Submitting link:", trimmedLink);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    if (!backendUrl) { console.error("VITE_BACKEND_URL undefined!"); alert("Backend URL missing."); setIsAddingLink(false); return; }
    try {
        const { data: existing, error: checkErr } = await supabase.from('links').select('url').eq('url', trimmedLink).limit(1);
        if (checkErr) throw new Error(`Supabase check: ${checkErr.message}`);
        if (existing?.length) { setShowExistingLinkDialog(true); setNewLink(""); throw new Error("Link exists"); }
        const response = await axios.post(`${backendUrl}/summarize`, { url: trimmedLink }, { timeout: 45000 });
        const summary = response.data.summary || "Summary could not be generated.";
        const { data: insertData, error: insertErr } = await supabase.from('links').insert([{ url: trimmedLink, summary: summary }]).select();
        if (insertErr) throw new Error(`Supabase insert: ${insertErr.message}`);
        const addedLink = insertData?.[0] || { id: `temp-${Date.now()}`, url: trimmedLink, summary: summary, created_at: new Date().toISOString() };
        setLinks(prev => [addedLink, ...prev]); setNewLink(""); console.log("Added:", addedLink);
    } catch (error) {
        console.error("handleSubmit Error:", error); if (error.message === "Link exists") return;
        if (axios.isCancel(error)) console.log("Cancelled");
        else if (error.code === 'ECONNABORTED') alert("Request timed out (45s).");
        else if (error.response) alert(`Backend error (${error.response.status}): ${error.response.data?.detail || 'Check console.'}`);
        else if (error.request) alert("Network error reaching backend.");
        else if (error.message?.includes("duplicate key") || error.message?.includes("violates unique constraint")) { alert("Link already exists."); setShowExistingLinkDialog(true); }
        else alert(`Failed add: ${error.message || "Unknown error."}`);
    } finally { setIsAddingLink(false); }
  };
  const handleKeyPress = (e) => { if (e.key === 'Enter' && !isAddingLink) handleSubmit(); }; // Trigger submit on Enter

  const handleSearch = async () => { /* Search Logic */
    console.log("handleSearch function started!"); // <-- DEBUG LOG
    const trimmedQuery = searchQuery.trim(); if (!trimmedQuery) { alert("Enter search query."); return; }
    setIsSearching(true); setSearchResults([]); console.log("Semantic search requested for:", trimmedQuery);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    if (!backendUrl) { console.error("VITE_BACKEND_URL undefined!"); alert("Backend URL missing."); setIsSearching(false); return; }
    try {
        console.log(`Sending search request to ${backendUrl}/search with query: "${trimmedQuery}" and k: ${searchResultCount}`);
        const response = await axios.post(`${backendUrl}/search`, { query: trimmedQuery, k: parseInt(searchResultCount) }, { timeout: 30000 });
        console.log("Backend search response:", response.data);
        const { matches } = response.data;
        if (!matches?.length) {
            console.log("No matches found from backend.");
            setSearchResults([]);
            return;
        }
        console.log("Received matches (IDs):", matches);
        const { data, error } = await supabase.from('links').select('id, url, summary, created_at').in('id', matches);
        if (error) throw new Error(`Supabase search fetch: ${error.message}`);
        if (data) {
            console.log("Fetched details from Supabase:", data);
            const map = new Map(data.map(l => [l.id, l]));
            const sorted = matches.map(id => map.get(id)).filter(Boolean);
            console.log("Sorted results:", sorted);
            setSearchResults(sorted);
        } else {
            console.log("No data returned from Supabase for matched IDs.");
            setSearchResults([]);
        }
    } catch (error) {
        console.error("handleSearch Error:", error);
        setSearchResults([]);
        if (axios.isCancel(error)) console.log("Search request was cancelled");
        else if (error.code === 'ECONNABORTED') alert("Search timed out (30s). Please try again or refine your query.");
        else if (error.response) {
            console.error(`Backend error details: Status=${error.response.status}, Data=`, error.response.data);
            alert(`Backend search error (${error.response.status}): ${error.response.data?.detail || 'An error occurred on the server. Check console.'}`);
        }
        else if (error.request) alert("Network error: Could not reach the search server. Please check your connection.");
        else alert(`Search failed: ${error.message || "An unknown error occurred during the search."}`);
    } finally {
        setIsSearching(false);
    }
  };
  const handleSearchKeyPress = (e) => { if (e.key === 'Enter' && !isSearching) handleSearch(); };
  const toggleRowExpansion = (id) => { setExpandedRows(prev => ({ ...prev, [id]: !prev[id] })); };
  const renderSummary = (summary, id) => { if (!summary) return <span className="italic text-gray-500">No summary</span>; if (expandedRows[id]) return summary.split('\n').map((p, i)=><p key={i} className="mb-2 last:mb-0">{p||'\u00A0'}</p>); const maxL=isMobile?70:130; return summary.length>maxL?summary.slice(0,maxL)+'…':summary; };
  const handleTableSearchChange = (e) => { setTableSearchQuery(e.target.value); };
  const handleGoToLanding = () => { navigate('/landing'); };

  // --- JSX Rendering ---
  return (
    <div className="home-page-wrapper">
      <div className="fixed-grid-background" aria-hidden="true"><div className="grid-lines"></div></div>

      <div className="home-container">
        <header className="home-header">
            <a href="/landing" onClick={(e) => { e.preventDefault(); handleGoToLanding(); }} className="company-logo-link" title="Go to Landing Page">
                 <img src="/compendium-transparent.png" alt="Compendium Logo" className="company-logo" />
            </a>
            <Button onClick={handleGoToLanding} className="button button-secondary" title="Go back">
                <ArrowLeft className="icon" /> Back
            </Button>
        </header>

        {/* Dialogs */}
        <Dialog open={showExistingLinkDialog} onOpenChange={setShowExistingLinkDialog}>
            {/* Existing Link Dialog Content */}
            <DialogContent>
               <DialogHeader><DialogTitle>Link Already Exists</DialogTitle></DialogHeader>
               <DialogDescription>This link is already in the database.</DialogDescription>
               <DialogFooter><Button onClick={() => setShowExistingLinkDialog(false)} className="button button-secondary">Close</Button></DialogFooter>
             </DialogContent>
        </Dialog>
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            {/* Advanced Search Dialog Content */}
            <DialogContent className="search-modal-content">
              <DialogHeader>
                <DialogTitle className="search-modal-title">Advanced Search</DialogTitle>
                {/* Optional: Add DialogDescription for accessibility if needed */}
                {/* <DialogDescription id="search-desc">
                  Enter keywords to search for relevant links in the knowledge base.
                </DialogDescription> */}
              </DialogHeader>
              <div className="dialog-main-content">
                  <div className="search-input-group">
                    <Input
                        type="text"
                        placeholder="Describe what you're looking for..."
                        className="input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        aria-label="Enter search query"
                        // Optional: Link to description for accessibility
                        // aria-describedby="search-desc"
                    />
                    <Select value={searchResultCount} onValueChange={setSearchResultCount}>
                      <SelectTrigger className="w-[130px] flex-shrink-0 button button-secondary">
                        <SelectValue placeholder="Results" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 results</SelectItem>
                        <SelectItem value="5">5 results</SelectItem>
                        <SelectItem value="10">10 results</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* *** DEBUGGING LOG FOR DISABLED STATE *** */}
                    {console.log("Inner Button Disabled Check:", {
                        isSearching,
                        trimmedQueryExists: !!searchQuery.trim(), // Check if query exists after trimming
                        isDisabled: isSearching || !searchQuery.trim() // The actual condition
                    })}

                    <Button
                        onClick={() => {
                            console.log("Inner Search Button Clicked!"); // Keep this log
                            handleSearch();
                        }}
                        disabled={isSearching || !searchQuery.trim()} // Keep the condition
                        className="button button-primary"
                        aria-live="polite"
                    >
                        {isSearching ? 'Searching...' : <><Search className="icon" />Search</>}
                    </Button>
                  </div>
                  <div className="table-container">
                     <Table>
                       <TableHeader><TableRow><TableHead>URL</TableHead><TableHead>Summary</TableHead></TableRow></TableHeader>
                       <TableBody>
                         {isSearching ? ( <TableRow><TableCell colSpan={2} className="no-results">Searching...</TableCell></TableRow> ) :
                         searchResults.length > 0 ? ( searchResults.map((link) => ( <TableRow key={`search-${link.id}`} onClick={() => toggleRowExpansion(link.id)} className="table-row"><TableCell className="url-cell"><a href={link.url} target="_blank" rel="noopener noreferrer" className="link" onClick={(e) => e.stopPropagation()}>{link.url}</a></TableCell><TableCell className="summary-cell">{renderSummary(link.summary, link.id)}</TableCell></TableRow> ))) :
                         ( <TableRow><TableCell colSpan={2} className="no-results">No relevant links found for your search.</TableCell></TableRow> )}
                       </TableBody>
                     </Table>
                  </div>
              </div>
              <DialogFooter><Button onClick={() => setIsSearchOpen(false)} className="button button-secondary">Close</Button></DialogFooter>
            </DialogContent>
        </Dialog>

        {/* --- Main Grid Content --- */}
        <main className="home-grid-container">

          {/* Title Area */}
           <div className="main-title-area">
              <h1 className="main-title">
                 Our <span className="highlight">Product</span>
              </h1>
           </div>

          {/* Add Link Section */}
          <section className="compendium-section" aria-label="Add New Link">
            {/* --- Input Group with Buttons --- */}
            <div className="input-group">
              <Input
                type="url"
                placeholder="Paste link here to add & summarize..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input"
                aria-label="Paste link to add"
                disabled={isAddingLink}
                />
              {/* --- Buttons Group --- */}
              <div className="button-group">
                <Button
                    onClick={handleSubmit}
                    disabled={isAddingLink || !newLink.trim()}
                    className="button button-primary"
                    aria-live="polite"
                    title="Add and Summarize this link"
                >
                  {isAddingLink ? 'Adding...' : <><Plus className="icon" /> Add</>}
                </Button>
                <Button
                    onClick={() => {
                        console.log("Outer Search Button Clicked!"); // Keep this log
                        setIsSearchOpen(true);
                    }}
                    className="button button-secondary"
                    title="Advanced Semantic Search"
                    aria-label="Open Advanced Search"
                 >
                     <Search className="icon" /> Search
                 </Button>
              </div>
               {/* --- END Buttons Group --- */}
            </div>
          </section>

          {/* Table Section (Filter + Table) */}
          <section className="table-section" aria-labelledby="links-table-title">
             <h2 id="links-table-title" className="sr-only">Stored Links</h2>
            <div className="search-bar">
              <label htmlFor="table-filter" className="sr-only">Filter links by URL or summary</label>
              {/* Icon is visual */}
              <div className="search-icon-wrapper" aria-hidden="true">
                  <Search className="search-icon" />
              </div>
              <Input id="table-filter" type="text" placeholder="Filter links by URL or summary..." value={tableSearchQuery} onChange={handleTableSearchChange} className="input" aria-label="Filter existing links in table by URL or summary" />
            </div>

            <div className="table-container">
               <Table aria-labelledby="links-table-title">
                 <TableHeader><TableRow><TableHead>URL</TableHead><TableHead>Summary</TableHead></TableRow></TableHeader>
                 <TableBody>
                    {isLoadingLinks ? (
                        <TableRow><TableCell colSpan={2} className="no-results">Loading links...</TableCell></TableRow>
                    ) : links.length > 0 ? (
                     links.map((link) => (
                         <TableRow key={link.id} onClick={() => toggleRowExpansion(link.id)} className="table-row" title="Click to expand/collapse summary">
                         <TableCell className="url-cell"><a href={link.url} target="_blank" rel="noopener noreferrer" className="link" onClick={(e) => e.stopPropagation()} title={`Open ${link.url}`}>{link.url}</a></TableCell>
                         <TableCell className="summary-cell">{renderSummary(link.summary, link.id)}</TableCell>
                         </TableRow>
                     ))
                     ) : (
                     <TableRow><TableCell colSpan={2} className="no-results">
                         {tableSearchQuery
                           ? 'No links found matching filter.'
                           : 'No links added yet. Paste one above to start.'
                         }
                     </TableCell></TableRow>
                     )}
                 </TableBody>
               </Table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Home;