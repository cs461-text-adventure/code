'use client';

/**
 * Game Creation Page
 * 
 * This page provides a form interface for creating new games. It includes:
 * - Game name input field
 * - Structured form for common game settings
 * - Template selection for quick starts
 * - JSON preview with validation
 * - Error handling for invalid JSON and API responses
 * - Session expiration handling
 * - Loading states during form submission
 * 
 * Note: This page is protected by authentication middleware.
 * Users with expired sessions will be prompted to log in again.
 */

import { FormEvent, useState, ReactElement } from 'react';

// Template options for quick start
const templates = [
  {
    name: 'Empty Game',
    data: {
      difficulty: 'medium',
      settings: {
        maxPlayers: 1,
        timeLimit: 3600,
        checkpoints: true
      },
      scenes: {}
    }
  },
  {
    name: 'Basic Adventure',
    data: {
      difficulty: 'easy',
      settings: {
        maxPlayers: 1,
        timeLimit: 3600,
        checkpoints: true
      },
      scenes: {
        start: {
          description: "You stand at the entrance of a mysterious cave. A cool breeze flows from within.",
          choices: [
            {
              text: "Enter the cave",
              nextScene: "cave"
            },
            {
              text: "Look around outside",
              nextScene: "outside"
            }
          ]
        },
        cave: {
          description: "The cave is dark but you can see a faint light deeper inside.",
          choices: [
            {
              text: "Go deeper",
              nextScene: "deepCave"
            },
            {
              text: "Return outside",
              nextScene: "start"
            }
          ]
        },
        outside: {
          description: "You find some old equipment near the cave entrance.",
          choices: [
            {
              text: "Enter the cave",
              nextScene: "cave"
            }
          ]
        }
      }
    }
  }
];

export default function NewGame() {
  // Form state management
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [maxPlayers, setMaxPlayers] = useState(1);
  const [timeLimit, setTimeLimit] = useState(3600);
  const [checkpoints, setCheckpoints] = useState(true);
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update JSON preview when form values change
  const updateJsonPreview = () => {
    const data = {
      difficulty,
      settings: {
        maxPlayers,
        timeLimit,
        checkpoints
      },
      scenes: templates[selectedTemplate].data.scenes
    };
    setJsonData(JSON.stringify(data, null, 2));
  };

  // Event handlers for form inputs
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError('');
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setSelectedTemplate(index);
    const template = templates[index];
    setDifficulty(template.data.difficulty);
    setMaxPlayers(template.data.settings.maxPlayers);
    setTimeLimit(template.data.settings.timeLimit);
    setCheckpoints(template.data.settings.checkpoints);
    updateJsonPreview();
    setError('');
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
    updateJsonPreview();
  };

  const handleMaxPlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setMaxPlayers(value);
      updateJsonPreview();
    }
  };

  const handleMaxPlayersClick = () => {
    setMaxPlayers(1);
  };

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeLimit(parseInt(e.target.value));
    updateJsonPreview();
  };

  const handleCheckpointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckpoints(e.target.checked);
    updateJsonPreview();
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
    setError('');
  };

  /**
   * Form submission handler
   * Validates and submits the game data
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate max players
      if (maxPlayers < 1 || maxPlayers > 10) {
        throw new Error('Max players must be between 1 and 10');
      }

      // Use either the form-generated JSON or manually edited JSON
      const dataToSubmit = showAdvanced ? jsonData : JSON.stringify({
        difficulty,
        settings: {
          maxPlayers,
          timeLimit,
          checkpoints
        },
        scenes: templates[selectedTemplate].data.scenes
      });

      // Validate JSON
      const parsedData = JSON.parse(dataToSubmit);

      // Send POST request to create game
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          data: parsedData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again to continue.');
        }
        throw new Error(errorData.error || 'Failed to create game');
      }

      // Clear form and show success message
      await response.json();
      setName('');
      setSelectedTemplate(0);
      setDifficulty('medium');
      setMaxPlayers(1);
      setTimeLimit(3600);
      setCheckpoints(true);
      setJsonData('');
      setError('Game created successfully!');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON data format');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create game. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Game</h1>
          <p className="mt-2 text-gray-600">Design your text adventure game</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Basic Settings Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Settings</h2>
            
            <div className="space-y-4">
              {/* Game Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Game Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={handleNameChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                  placeholder="Enter game name"
                />
              </div>

              {/* Template Selection */}
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                  Template
                </label>
                <select
                  id="template"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                >
                  {templates.map((template, index) => (
                    <option key={index} value={index}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Game Settings */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700">
                    Max Players (1-10)
                  </label>
                  <input
                    type="number"
                    id="maxPlayers"
                    min="1"
                    max="10"
                    value={maxPlayers}
                    onChange={handleMaxPlayersChange}
                    onClick={handleMaxPlayersClick}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
                    Time Limit (seconds)
                  </label>
                  <input
                    type="number"
                    id="timeLimit"
                    min="0"
                    step="300"
                    value={timeLimit}
                    onChange={handleTimeLimitChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="checkpoints"
                  checked={checkpoints}
                  onChange={handleCheckpointsChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="checkpoints" className="ml-2 block text-sm text-gray-900">
                  Enable Checkpoints
                </label>
              </div>
            </div>
          </div>

          {/* Advanced Settings Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                {showAdvanced ? 'Hide' : 'Show'}
              </button>
            </div>

            {showAdvanced && (
              <div>
                <label htmlFor="jsonData" className="block text-sm font-medium text-gray-700">
                  Game Data (JSON)
                </label>
                <textarea
                  id="jsonData"
                  value={jsonData}
                  onChange={handleJsonChange}
                  rows={10}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-sm text-gray-900"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Edit the JSON directly for advanced configuration
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Game'}
            </button>
          </div>
          
          {/* Error/Success Message */}
          {error && (
            <div className={`mt-4 p-3 rounded ${
              error.includes('successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
