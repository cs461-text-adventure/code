"use client";

/**
 * Game Edit Page
 *  * This page provides a form interface for editing existing games. It includes:
 * - Game name input field pre-filled with existing data
 * - JSON data input field with validation pre-filled with existing data
 * - Error handling for invalid JSON and API responses
 * - Session expiration handling
 * - Loading states during form submission and initial data fetch
 *
 * Note: This page is protected by authentication middleware.
 * Users with expired sessions will be prompted to log in again.
 * This page provides an interface for editing existing games with both JSON and visual editors.
 * It integrates modular components for a better user experience and code organization.
 */

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
// Remove this import and use the one from the Inspector component
import { GameComponent } from "./components/types";
import Inspector from "@/components/game/Inspector";

// import GameMap from "./components/GameMap";

// import ComponentPalette from "./components/ComponentPalette";
import JsonEditor from "./components/JsonEditor";
import GameMapVisualizer from "./components/GameMapVisualizer";


export default function EditGame() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  const mapRef = useRef<HTMLDivElement>(null);

  // Form state management
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVisualEditor, setIsVisualEditor] = useState(false);
  
  // Visual editor state
  const [mapComponents, setMapComponents] = useState<GameComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<GameComponent | null>(null);

  // Fetch existing game data when component mounts
  useEffect(() => {
    async function fetchGameData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session has expired. Please log in again to continue.",
            );
          } else if (response.status === 404) {
            throw new Error("Game not found");
          } else {
            throw new Error("Failed to fetch game data");
          }
        }

        const gameData = await response.json();
        setName(gameData.name);
        setData(JSON.stringify(gameData.data, null, 2));
        
        // Initialize map components from game data if available
        try {
          const parsedData = gameData.data;
          if (parsedData.rooms && Array.isArray(parsedData.rooms)) {
            const components: GameComponent[] = parsedData.rooms.map((room: any, index: number) => ({
              id: room.id || `room-${index}`,
              type: index === 0 ? 'start-room' : 'room',
              name: `Room ${index + 1}`,
              position: { x: 100 + (index * 150), y: 100 },
              properties: { ...room }
            }));
            setMapComponents(components);
          }
        } catch (err) {
          console.error("Failed to parse rooms for visual editor:", err);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch game data");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchGameData();
  }, [gameId]);

  // Event handlers for form inputs
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError("");
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
    setError("");
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      // Attempt to parse JSON data before sending to API
      const parsedData = JSON.parse(data);

      // Send PATCH request to update game
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            data: parsedData,
          }),
        },
      );

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please log in again to continue.",
          );
        } else if (response.status === 404) {
          throw new Error("Game not found");
        }
        throw new Error(errorData.error || "Failed to update game");
      }

      // On success, show success message and redirect to dashboard
      setError("Game updated successfully!");

      // Redirect to dashboard after a short delay to show success message
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      // Handle different types of errors
      if (err instanceof SyntaxError) {
        setError("Invalid JSON data format");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update game. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle between simple and visual editor
  const toggleEditor = () => {
    if (!isVisualEditor) {
      // Switching to visual editor - parse JSON and update components
      try {
        const parsedData = JSON.parse(data);
        // Format the JSON before displaying it
        const formattedData = JSON.stringify(parsedData, null, 2);
        setData(formattedData);
        
        // Update visual components from JSON data
        if (parsedData.rooms && Array.isArray(parsedData.rooms)) {
          const components: GameComponent[] = parsedData.rooms.map((room: any, index: number) => ({
            id: room.id || `room-${index}`,
            type: index === 0 ? 'start-room' : 'room',
            name: room.description?.substring(0, 20) || `Room ${index + 1}`,
            position: { x: 100 + (index * 150), y: 100 },
            properties: { ...room }
          }));
          setMapComponents(components);
        }
      } catch (err) {
        setError("Invalid JSON format. Please correct before switching to visual editor.");
        return; // Don't switch if JSON is invalid
      }
    } else {
      // Switching to JSON editor - update JSON from components
      try {
        // Convert visual components back to JSON
        const roomsData = mapComponents.map(component => component.properties);
        const currentData = JSON.parse(data);
        const updatedData = { ...currentData, rooms: roomsData };
        setData(JSON.stringify(updatedData, null, 2));
      } catch (err) {
        console.error("Failed to update JSON from visual components:", err);
      }
    }
    
    setIsVisualEditor(!isVisualEditor);
  };

  // Update component property
  const updateComponentProperty = (componentId: string, property: string, value: any) => {
    setMapComponents(mapComponents.map(component => {
      if (component.id === componentId) {
        if (property === 'name') {
          return { ...component, name: value };
        } else if (property === 'id') {
          return { ...component, id: value };
        } else if (property === 'properties') {
          return { ...component, properties: value };
        } else {
          return { ...component, properties: { ...component.properties, [property]: value } };
        }
      }
      return component;
    }));
  };

  // Handle adding a new component
  const handleAddComponent = (componentType: GameComponent['type']) => {
    const newId = `${componentType}-${Date.now()}`;
    const newComponent: GameComponent = {
      id: newId,
      type: componentType,
      name: `New ${componentType}`,
      position: { x: 150, y: 150 },
      properties: {
        id: newId,
        description: `Description for new ${componentType}`,
        inventory: [],
        connections: {}
      }
    };
    
    setMapComponents([...mapComponents, newComponent]);
    setSelectedComponent(newComponent);
  };

  // Handle drag and drop for the map
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!mapRef.current) return;
    
    const componentType = e.dataTransfer.getData('componentType') as GameComponent['type'];
    if (!componentType) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newId = `${componentType}-${Date.now()}`;
    const newComponent: GameComponent = {
      id: newId,
      type: componentType,
      name: `New ${componentType}`,
      position: { x, y },
      properties: {
        id: newId,
        description: `Description for new ${componentType}`,
        inventory: [],
        connections: {}
      }
    };
    
    setMapComponents([...mapComponents, newComponent]);
    setSelectedComponent(newComponent);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading game data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with game name and save button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Game: {name}</h1>
          <div className="flex space-x-4">
            <button
              onClick={toggleEditor}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isVisualEditor ? "Switch to JSON Editor" : "Switch to Visual Editor"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSaving
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isSaving ? "Saving..." : "Save Game"}
            </button>
          </div>
        </div>

        {/* Error/Success message display */}
        {error && (
          <div
            className={`mb-6 p-3 rounded ${
              error.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {/* Game name input */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2">
            Game Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xl font-bold text-gray-800"
          />
        </div>

        {isVisualEditor ? (
  // Visual Editor with JSON Editor
  <div className="grid grid-cols-1 gap-6">
    {/* Visual Editor Components */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Map Editor - Now takes up 3 columns instead of 2 */}
      <div className="lg:col-span-3">
        <GameMapVisualizer 
          gameData={{ 
            rooms: JSON.parse(data).rooms || [] 
          }}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          mapComponents={mapComponents}
        />
      </div>
      
      {/* Inspector - Now takes up 2 columns instead of 1 */}
      <div className="lg:col-span-2">
        <Inspector 
          component={selectedComponent as any}
          onUpdateComponent={updateComponentProperty}
        />
      </div>
    </div>
    
    {/* JSON Editor below the visual components */}
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">JSON Data</h3>
      <JsonEditor 
        data={data}
        handleDataChange={handleDataChange}
        formatJSON={() => {
          try {
            const parsedData = JSON.parse(data);
            setData(JSON.stringify(parsedData, null, 2));
          } catch (err) {
            setError("Invalid JSON format");
          }
        }}
      />
    </div>
  </div>
) : (
  // JSON Editor Only
  <JsonEditor 
    data={data}
    handleDataChange={handleDataChange}
    formatJSON={() => {
      try {
        const parsedData = JSON.parse(data);
        setData(JSON.stringify(parsedData, null, 2));
      } catch (err) {
        setError("Invalid JSON format");
      }
    }}
  />
)}

      </div>
    </div>
  );
}
