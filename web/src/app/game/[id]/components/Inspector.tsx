import React from 'react';
import { GameComponent } from './types';

interface InspectorProps {
  component: GameComponent | null;
  onUpdateComponent: (componentId: string, property: string, value: any) => void;
}

const Inspector: React.FC<InspectorProps> = ({
  component,
  onUpdateComponent
}) => {
  // Function to handle creating a new room
  const handleNewRoom = () => {
    // Create a new room component
    const newId = `room-${Date.now()}`;
    const newRoom: GameComponent = {
      id: newId,
      type: 'room',
      name: 'New Room',
      position: { x: 300, y: 300 }, // Default position
      properties: {
        id: newId,
        description: 'Description for new room',
        inventory: [],
        connections: {}
      }
    };
    
    // Update the component state with the new room
    // This will need to be handled in the parent component
    if (window.parent) {
      window.parent.postMessage({
        type: 'ADD_COMPONENT',
        component: newRoom
      }, '*');
    }
  };
  
  // Function to load win conditions
  const handleWinConditions = () => {
    // Create a win condition component based on the JSON data
    const newId = `win-condition-${Date.now()}`;
    const winCondition: GameComponent = {
      id: newId,
      type: 'win-condition',
      name: 'Win Conditions',
      properties: {
        id: newId,
        description: 'Game win conditions',
        conditions: [
          {
            description: 'Required Items',
            type: 'required_items',
            value: ["f09d3ce1-195e-414c-9230-83a2f6ec2c1a", "85cf6f65-445c-42e5-91ef-188afde265df"]
          },
          {
            description: 'Required Room',
            type: 'required_room',
            value: "51cba91a-5646-43db-ad69-4872090034da"
          }
        ]
      }
    };
    
    // Update the component state with the win condition
    if (window.parent) {
      window.parent.postMessage({
        type: 'SET_WIN_CONDITION',
        component: winCondition
      }, '*');
    }
  };

  if (!component) {
    return (
      <div className="w-full border border-gray-300 rounded-md bg-white p-4">
        <h3 className="text-sm font-medium mb-3">Inspector</h3>
        <div className="text-gray-400 text-sm mb-4">
          Select a component to edit its properties
        </div>
        
        {/* Buttons for new room and win conditions */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleNewRoom}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Room
          </button>
          <button
            onClick={handleWinConditions}
            className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Win Conditions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-gray-100 p-4 overflow-auto" style={{ height: '520px' }}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Inspector</h3>
      
      {/* Inspector content */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-auto" style={{ height: '450px' }}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500">ID</label>
            <input 
              type="text" 
              value={component.id}
              className="mt-1 block w-full text-sm rounded-md border border-gray-300 px-2 py-1"
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Name</label>
            <input 
              type="text" 
              value={component.name}
              className="mt-1 block w-full text-sm rounded-md border border-gray-300 px-2 py-1"
              onChange={(e) => {
                onUpdateComponent(component.id, "name", e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Description</label>
            <textarea 
              value={component.properties.description || ""}
              className="mt-1 block w-full text-sm rounded-md border border-gray-300 px-2 py-1"
              rows={3}
              onChange={(e) => onUpdateComponent(component.id, "description", e.target.value)}
            />
          </div>
          
          {/* Display other relevant properties based on component type */}
          {component.type === 'room' && (
            <div>
              <label className="block text-xs text-gray-500">Inventory Items</label>
              <div className="mt-1 p-2 border border-gray-200 rounded-md">
                {Array.isArray(component.properties.inventory) && 
                  component.properties.inventory.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center mb-1">
                      <span className="text-xs">{item.name || `Item ${idx+1}`}</span>
                    </div>
                  ))}
                {(!component.properties.inventory || 
                  !component.properties.inventory.length) && 
                  <span className="text-xs text-gray-400">No items</span>
                }
              </div>
            </div>
          )}
          
          {/* Win conditions section - only shown when win conditions are loaded */}
          {component.type === 'win-condition' && (
            <div>
              <label className="block text-xs text-gray-500">Win Conditions</label>
              <div className="mt-1 p-2 border border-gray-200 rounded-md">
                {Array.isArray(component.properties.conditions) && 
                  component.properties.conditions.map((condition: any, idx: number) => (
                    <div key={idx} className="flex items-center mb-1">
                      <span className="text-xs">{condition.description || `Condition ${idx+1}`}</span>
                    </div>
                  ))}
                {(!component.properties.conditions || 
                  !component.properties.conditions.length) && 
                  <span className="text-xs text-gray-400">No win conditions defined</span>
                }
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Buttons for new room and win conditions */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={handleNewRoom}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          New Room
        </button>
        <button
          onClick={handleWinConditions}
          className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Win Conditions
        </button>
      </div>
    </div>
  );
};

export default Inspector;