// src/components/Home.jsx

// --- CHANGE THESE ---
// UI components are in the './ui/' subdirectory
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

// Files outside 'components' need to go up one level ('../')
import supabase from "../supabaseConfig"; // ../ goes components -> src
import { cn } from "../lib/utils";     // ../ goes components -> src

// CSS file is in the same folder (assuming Home.css is in src/components/)
import './Home.css';
// --- END CHANGES ---

// These imports are fine
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus } from "lucide-react";

// Assuming logo is in public/ as per index.html favicon
// No import needed for public assets

function Home() {
  // ... (rest of your component code remains the same)
  const [searchQuery, setSearchQuery] = useState("")
  const [links, setLinks] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [newLink, setNewLink] = useState("")
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [expandedRows, setExpandedRows] = useState({})
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [tableSearchQuery, setTableSearchQuery] = useState("")
  const [searchResultCount, setSearchResultCount] = useState("3")
  const [showExistingLinkDialog, setShowExistingLinkDialog] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchLinks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableSearchQuery]);

  const fetchLinks = async () => {
    try {
      let query = supabase
        .from('links')
        .select('id, url, summary, created_at')
        .order('created_at', { ascending: false });

      if (tableSearchQuery) {
        query = query.or(`url.ilike.%${tableSearchQuery}%,summary.ilike.%${tableSearchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching links:", error);
        return;
      }
      setLinks(data || []);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

    const handleSubmit = async () => {
    if (!newLink.trim()) {
      alert("Please enter a valid link.");
      return;
    }
     try {
        new URL(newLink);
      } catch (_) {
        alert("Please enter a valid URL (e.g., https://example.com)");
        return;
      }


    setIsAddingLink(true);
    try {
      const { data: existingLinks, error } = await supabase
        .from('links')
        .select('url')
        .eq('url', newLink)
        .limit(1);

      if (error) {
        console.error("Error checking existing link:", error);
        alert("Error checking existing link. Please try again.");
        setIsAddingLink(false);
        return;
      }

      if (existingLinks && existingLinks.length > 0) {
        setShowExistingLinkDialog(true);
        setTableSearchQuery(newLink);
        setNewLink("");
        setIsAddingLink(false);
        return;
      }

      const response = await axios.post('http://localhost:8000/summarize', {
        url: newLink
      }, {
        timeout: 30000
      });

      const { data: insertData, error: insertError } = await supabase
        .from('links')
        .insert([{ url: newLink, summary: response.data.summary }]);

      if (insertError) {
        console.error("Error inserting link:", insertError);
        alert("Error inserting link. Please try again.");
      } else {
        console.log("Link added:", insertData);
        setNewLink("");
        await fetchLinks();
      }

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else if (error.code === 'ECONNABORTED') {
        alert("The request timed out (30 seconds). The server might be busy or the URL is slow to respond. Please try again.");
      } else if (error.response) {
        console.error("Server Error:", error.response.data, error.response.status);
        alert(`Server error: ${error.response.status}. Check the console for more details.`);
      } else if (error.request) {
        console.error("Network Error:", error.request);
        alert("Network error. Could not reach the backend server (http://localhost:8000). Is it running?");
      } else {
        console.error("Error:", error.message);
        alert("An unexpected error occurred while processing the link. Please try again.");
      }
    } finally {
      setIsAddingLink(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

    const handleSearch = async () => {
    if (!searchQuery.trim()) {
        alert("Please enter a valid search query.");
        return;
      }

      setIsSearching(true);
      setSearchResults([]);
      try {
        const response = await axios.post('http://localhost:8000/search', {
          query: searchQuery,
          k: parseInt(searchResultCount)
        }, {
          timeout: 30000
        });

        const { matches } = response.data;

        if (!matches || !Array.isArray(matches) || matches.length === 0) {
          console.log("No matches found from backend search.");
          setSearchResults([]);
          return;
        }

        const { data, error } = await supabase
          .from('links')
          .select('id, url, summary, created_at')
          .in('id', matches);

        if (error) {
          console.error("Error fetching search results from Supabase:", error);
          alert("Error fetching search result details. Please try again.");
        } else if (data) {
           const validLinks = data.filter(link => link != null);
           const linkMap = new Map(validLinks.map(link => [link.id, link]));
           const sortedResults = matches
               .map(id => linkMap.get(id))
              .filter(link => link != null);
           console.log("Search results fetched and sorted:", sortedResults);
           setSearchResults(sortedResults);
        } else {
          console.log("No data returned from Supabase for matched IDs.");
          setSearchResults([]);
        }

      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Search request canceled:", error.message);
        } else if (error.code === 'ECONNABORTED') {
          alert("The search request timed out (30 seconds). Please try again.");
        } else if (error.response) {
          console.error("Server Error during search:", error.response.data, error.response.status);
          alert(`Server error during search: ${error.response.status}. Check the console.`);
        } else if (error.request) {
          console.error("Network Error during search:", error.request);
          alert("Network error during search. Could not reach the backend server (http://localhost:8000).");
        } else {
          console.error("Error during search:", error.message);
          alert("An unexpected error occurred during search. Please try again.");
        }
      } finally {
        setIsSearching(false);
      }
  };


  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSummary = (summary, id) => {
    if (!summary) return '';
    if (expandedRows[id]) {
      return summary;
    }
    const maxLength = isMobile ? 50 : 100;
    return summary.length > maxLength ? summary.slice(0, maxLength) + '...' : summary;
  };


  return (
    <>
      <div className="home-container">
        <img src="/compendium.png" alt="Company Logo" className="company-logo" />

        <Dialog open={showExistingLinkDialog} onOpenChange={setShowExistingLinkDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Already Exists</DialogTitle>
                <DialogDescription>
                  This link is already in the database. You can find it in the table below.
                </DialogDescription>
              </DialogHeader>
              <Button
                onClick={() => setShowExistingLinkDialog(false)}
                className="mt-4 w-full"
              >
                Close
              </Button>
            </DialogContent>
          </Dialog>


        <div className="compendium">
          <h2 className="compendium-title">Our Product</h2>
          <div className="input-group">
            <Input
              type="url"
              placeholder="Enter your link here (e.g., https://example.com)"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
              aria-label="Enter link to add"
            />
            <div className="button-group">
              <Button
                onClick={handleSubmit}
                disabled={isAddingLink || !newLink.trim()}
                className="add-link-button"
                aria-live="polite"
              >
                {isAddingLink ? 'Processing...' : <><Plus className="icon mr-1" size={16} />Add Link</>}
              </Button>
              <Button
                onClick={() => setIsSearchOpen(true)}
                className="look-deeper-button"
                aria-label="Open search dialog"
              >
                <Search className="icon mr-1" size={16} />Look Deeper
              </Button>
            </div>
          </div>
        </div>

         <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
             <DialogContent className="search-modal-content">
               <DialogHeader>
                 <DialogTitle className="search-modal-title">Query through Compendium's Knowledge Base</DialogTitle>
               </DialogHeader>
               <div className="search-input-group">
                 <Input
                   type="text"
                   placeholder="Describe what you're looking for..."
                   className="input"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyPress={handleSearchKeyPress}
                   aria-label="Enter search query"
                 />
                 <Select value={searchResultCount} onValueChange={setSearchResultCount}>
                   <SelectTrigger className="select-trigger w-[120px]">
                     <SelectValue placeholder="Results" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="3">3 results</SelectItem>
                     <SelectItem value="5">5 results</SelectItem>
                     <SelectItem value="10">10 results</SelectItem>
                   </SelectContent>
                 </Select>
                 <Button
                   onClick={handleSearch}
                   disabled={isSearching || !searchQuery.trim()}
                   className="search-button"
                   aria-live="polite"
                 >
                   {isSearching ? 'Searching...' : <><Search className="icon mr-1" size={16} />Search</>}
                 </Button>
               </div>

               <div className="table-container">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>URL</TableHead>
                       <TableHead>Summary</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {isSearching ? (
                        <TableRow>
                           <TableCell colSpan={2} className="no-results text-center">Searching...</TableCell>
                        </TableRow>
                     ) : searchResults.length > 0 ? (
                       searchResults.map((link) => (
                         <TableRow key={`search-${link.id}`} onClick={() => toggleRowExpansion(link.id)} className="table-row">
                           <TableCell className="table-cell url-cell">
                             <a href={link.url} target="_blank" rel="noopener noreferrer" className="link">
                               {link.url}
                             </a>
                           </TableCell>
                           <TableCell className="table-cell summary-cell">{renderSummary(link.summary, link.id)}</TableCell>
                         </TableRow>
                       ))
                     ) : (
                       <TableRow>
                         <TableCell colSpan={2} className="no-results text-center">No results found</TableCell>
                       </TableRow>
                     )}
                   </TableBody>
                 </Table>
               </div>
               <Button
                 onClick={() => setIsSearchOpen(false)}
                 className="close-button mt-4"
               >
                 Close
               </Button>
             </DialogContent>
           </Dialog>


        <div className="search-bar">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search all links..."
            value={tableSearchQuery}
            onChange={(e) => setTableSearchQuery(e.target.value)}
            className="input"
            aria-label="Search existing links in table"
          />
        </div>

        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.length > 0 ? (
                 links.map((link) => (
                  <TableRow key={link.id} onClick={() => toggleRowExpansion(link.id)} className="table-row">
                    <TableCell className="table-cell url-cell">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="link">
                        {link.url}
                      </a>
                    </TableCell>
                    <TableCell className="table-cell summary-cell">{renderSummary(link.summary, link.id)}</TableCell>
                  </TableRow>
                 ))
              ) : (
                <TableRow>
                   <TableCell colSpan={2} className="no-results text-center">
                       {tableSearchQuery ? 'No links found matching your search.' : 'No links available yet. Add one above!'}
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

export default Home;