import React from 'react';

interface JsonEditorProps {
  data: string;
  handleDataChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  formatJSON: () => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ data, handleDataChange, formatJSON }) => {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={formatJSON}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Format JSON
        </button>
      </div>
      <textarea
        id="data"
        required
        value={data}
        onChange={handleDataChange}
        rows={12}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-gray-900"
        placeholder='{"key": "value"}'
      />
    </div>
  );
};

export default JsonEditor;