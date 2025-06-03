import React, { useState } from 'react';
import { GameComponent } from './types';

interface WinConditionsInspectorProps {
  winCondition: GameComponent | null;
  onUpdateComponent: (componentId: string, property: string, value: any) => void;
  onCreateWinCondition: () => void;
}

const WinConditionsInspector: React.FC<WinConditionsInspectorProps> = ({
  winCondition,
  onUpdateComponent,
  onCreateWinCondition
}) => {
  const [newItemId, setNewItemId] = useState('');
  const [newRoomId, setNewRoomId] = useState('');

  // Handle adding a new required item
  const handleAddRequiredItem = () => {
    if (!winCondition || !newItemId.trim()) return;
    
    // Get current conditions
    const conditions = [...(winCondition.properties.conditions || [])];
    
    // Find the required_items condition if it exists
    const itemConditionIndex = conditions.findIndex(c => c.type === 'required_items');
    
    if (itemConditionIndex >= 0) {
      // Update existing condition
      const updatedConditions = [...conditions];
      const currentItems = Array.isArray(updatedConditions[itemConditionIndex].value) 
        ? updatedConditions[itemConditionIndex].value 
        : [];
      
      updatedConditions[itemConditionIndex] = {
        ...updatedConditions[itemConditionIndex],
        value: [...currentItems, newItemId]
      };
      
      onUpdateComponent(
        winCondition.id, 
        'properties', 
        { ...winCondition.properties, conditions: updatedConditions }
      );
    } else {
      // Create new condition
      const newCondition = {
        description: 'Required Items',
        type: 'required_items',
        value: [newItemId]
      };
      
      onUpdateComponent(
        winCondition.id, 
        'properties', 
        { ...winCondition.properties, conditions: [...conditions, newCondition] }
      );
    }
    
    setNewItemId('');
  };

  // Handle setting required room
  const handleSetRequiredRoom = () => {
    if (!winCondition || !newRoomId.trim()) return;
    
    // Get current conditions
    const conditions = [...(winCondition.properties.conditions || [])];
    
    // Find the required_room condition if it exists
    const roomConditionIndex = conditions.findIndex(c => c.type === 'required_room');
    
    if (roomConditionIndex >= 0) {
      // Update existing condition
      const updatedConditions = [...conditions];
      updatedConditions[roomConditionIndex] = {
        ...updatedConditions[roomConditionIndex],
        value: newRoomId
      };
      
      onUpdateComponent(
        winCondition.id, 
        'properties', 
        { ...winCondition.properties, conditions: updatedConditions }
      );
    } else {
      // Create new condition
      const newCondition = {
        description: 'Required Room',
        type: 'required_room',
        value: newRoomId
      };
      
      onUpdateComponent(
        winCondition.id, 
        'properties', 
        { ...winCondition.properties, conditions: [...conditions, newCondition] }
      );
    }
    
    setNewRoomId('');
  };

  // Handle removing a required item
  const handleRemoveRequiredItem = (itemId: string) => {
    if (!winCondition) return;
    
    // Get current conditions
    const conditions = [...(winCondition.properties.conditions || [])];
    
    // Find the required_items condition
    const itemConditionIndex = conditions.findIndex(c => c.type === 'required_items');
    if (itemConditionIndex < 0) return;
    
    // Get current items and filter out the one to remove
    const currentItems = Array.isArray(conditions[itemConditionIndex].value) 
      ? conditions[itemConditionIndex].value 
      : [];
    
    const updatedItems = currentItems.filter((id: string) => id !== itemId);
    
    // Update the condition
    const updatedConditions = [...conditions];
    updatedConditions[itemConditionIndex] = {
      ...updatedConditions[itemConditionIndex],
      value: updatedItems
    };
    
    onUpdateComponent(
      winCondition.id, 
      'properties', 
      { ...winCondition.properties, conditions: updatedConditions }
    );
  };

  if (!winCondition) {
    return (
      <div className="w-full border border-gray-300 rounded-md bg-white p-4">
        <h3 className="text-sm font-medium mb-3">Win Conditions</h3>
        <div className="text-gray-400 text-sm mb-4">
          No win conditions set for this game
        </div>
        
        <button
          onClick={onCreateWinCondition}
          className="w-full px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Create Win Conditions
        </button>
      </div>
    );
  }

  // Extract win conditions from the component
  const conditions = winCondition.properties.conditions || [];
  const requiredItemsCondition = conditions.find((c: { type: string }) => c.type === 'required_items');
  const requiredRoomCondition = conditions.find((c: { type: string }) => c.type === 'required_room');
  
  const requiredItems = requiredItemsCondition ? requiredItemsCondition.value || [] : [];
  const requiredRoom = requiredRoomCondition ? requiredRoomCondition.value : '';

  return (
    <div className="border border-gray-300 rounded-lg bg-gray-100 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Win Conditions</h3>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        {/* Required Items Section */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-2">Required Items</h4>
          
          {requiredItems.length > 0 ? (
            <ul className="mb-3 space-y-1">
              {requiredItems.map((itemId: string) => (
                <li key={itemId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600">{itemId}</span>
                  <button 
                    onClick={() => handleRemoveRequiredItem(itemId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mb-3">No required items set</p>
          )}
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newItemId}
              onChange={(e) => setNewItemId(e.target.value)}
              placeholder="Item ID"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleAddRequiredItem}
              className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Item
            </button>
          </div>
        </div>
        
        {/* Required Room Section */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-2">Required Room</h4>
          
          {requiredRoom ? (
            <div className="mb-3 bg-gray-50 p-2 rounded">
              <span className="text-sm text-gray-600">{requiredRoom}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">No required room set</p>
          )}
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newRoomId}
              onChange={(e) => setNewRoomId(e.target.value)}
              placeholder="Room ID"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleSetRequiredRoom}
              className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Set Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinConditionsInspector;