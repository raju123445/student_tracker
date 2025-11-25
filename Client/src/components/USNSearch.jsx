import { useState } from 'react';
import { fetchStudentByUSN } from '../api/api';

export default function USNSearch({ onSearch }) {
  const [usn, setUsn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!usn) return;

    setLoading(true);
    setError(null);
    try {
      if (onSearch) {
        await onSearch(usn);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow flex gap-2 items-center">
      <input
        value={usn}
        onChange={(e) => setUsn(e.target.value.toUpperCase())}
        placeholder="Enter USN e.g. 4VZ22CS013"
        className="border rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700"
      />
      <button
        type="submit"
        disabled={!usn || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Track'}
      </button>
      {error && <div className="text-sm text-red-500">{error}</div>}
    </form>
  );
}
