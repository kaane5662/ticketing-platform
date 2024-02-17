import React, { useState } from "react";

const eventsData = [
  { id: 1, title: "Event 1" },
  { id: 2, title: "Event 2" },
  { id: 3, title: "Event 3" },
  { id: 4, title: "Another Event" },
  // Add more events as needed
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    filterEvents(event.target.value);
  };

  const filterEvents = (searchTerm) => {
    const filteredResults = eventsData.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  return (
    <main className="h-screen bg-primary text-secondary p-32">
      <div className="max-w-xl mx-auto font-poppins">
        <h1 className="text-3xl font-bold mb-8">Search Events</h1>
        <div className="flex">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500 flex-1 text-black"
          />
          <button
            type="button"
            onClick={() => filterEvents(searchTerm)}
            className="px-6 py-2 bg-complementary text-primary rounded-r hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div className="mt-4">
          {searchResults.length > 0 ? (
            searchResults.map(event => (
              <div key={event.id} className="border-b border-gray-300 py-2">
                <h2 className="text-lg font-bold">{event.title}</h2>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No events found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
