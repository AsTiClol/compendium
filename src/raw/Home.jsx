import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { HoverBorderGradient } from "../components/ui/hover-border-gradient"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import supabase from "../supabaseConfig"
import { useState, useEffect } from "react"
import axios from "axios"
import { cn } from "../lib/utils"
import { Search, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog"
import './Home.css'

function Home() {
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

      if (!matches || !matches.length) {
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
        const uniqueLinks = data.filter(link => link != null);
        const seenIds = new Set();
        const uniqueFilteredLinks = uniqueLinks.filter(el => {
          const duplicate = seenIds.has(el.id);
          seenIds.add(el.id);
          return !duplicate;
        });

        const sortedResults = matches
          .map(id => uniqueFilteredLinks.find(link => link.id === id))
          .filter(link => link != null);

        setSearchResults(sortedResults);
      } else {
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
        <img src={logo} alt="Company Logo" className="company-logo" />
        <Dialog open={showExistingLinkDialog} onOpenChange={setShowExistingLinkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Already Exists</DialogTitle>
              <DialogDescription>
                This link is already in the database. You can find it by searching or scrolling below.
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => setShowExistingLinkDialog(false)}
              className="purple-gradient-button w-full mt-4"
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>

        <div className="compendium">
          <h2 className="compendium-title">Our Product</h2>
          <div className="input-group">
            <Input
              type="text"
              placeholder="Enter your link here..."
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
            />
            <div className="button-group">
              <Button
                onClick={handleSubmit}
                disabled={isAddingLink || !newLink.trim()}
                className="purple-gradient-button"
              >
                {isAddingLink ? 'Processing...' : <><Plus className="icon mr-1" size={16} />Add Link</>}
              </Button>
              <Button
                onClick={() => setIsSearchOpen(true)}
                className="purple-gradient-button"
              >
                <Search className="icon mr-1" size={16} />Look Deeper
              </Button>
            </div>
          </div>
        </div>

        {isSearchOpen && (
          <div className="search-modal">
            <div className="search-modal-content">
              <h2 className="search-modal-title">Query through Compendium's Knowledge Base</h2>
              <div className="search-input-group">
                <Input
                  type="text"
                  placeholder="Describe what you're looking for..."
                  className="input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
                <Select value={searchResultCount} onValueChange={setSearchResultCount}>
                  <SelectTrigger className="select-trigger">
                    <SelectValue placeholder="Result count" />
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
                  className="purple-gradient-button"
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
                        <TableCell colSpan={2} className="no-results text-center">No results found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button
                onClick={() => setIsSearchOpen(false)}
                className="purple-gradient-button mt-4"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        <div className="search-bar">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search links..."
            value={tableSearchQuery}
            onChange={(e) => setTableSearchQuery(e.target.value)}
            className="input"
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
                       {tableSearchQuery ? 'No links found matching your search.' : 'No links available.'}
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

export default Home