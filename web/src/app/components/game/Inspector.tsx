import { useState } from 'react';

interface GameComponent {
  id: string;
  type: 'start-room' | 'room' | 'end-room' | 'npc' | 'puzzle' | 'room-link';
  name: string;
  position?: { x: number, y: number };
  properties: Record<string, any>;
}

interface InspectorProps {
  component: GameComponent | null;
  onUpdateComponent: (componentId: string, property: string, value: any) => void;
}

export default function Inspector({ component, onUpdateComponent }: InspectorProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    connections: true,
    inventory: false,
  });

  if (!component) {
    return (
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Select a component to inspect its properties
        </p>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePropertyChange = (property: string, value: any) => {
    onUpdateComponent(component.id, property, value);
  };

  const handleNestedPropertyChange = (parentProperty: string, key: string, value: any) => {
    const updatedObject = { 
      ...component.properties[parentProperty], 
      [key]: value 
    };
    onUpdateComponent(component.id, parentProperty, updatedObject);
  };

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 overflow-y-auto max-h-[500px]">
      <h3 className="text-lg font-medium mb-4">Inspector: {component.name}</h3>
      
      {/* Basic Properties Section */}
      <div className="mb-4">
        <button 
          className="flex items-center justify-between w-full text-left font-medium p-2 bg-gray-100 dark:bg-gray-700 rounded"
          onClick={() => toggleSection('basic')}
        >
          <span>Basic Properties</span>
          <span>{expandedSections.basic ? '−' : '+'}</span>
        </button>
        
        {expandedSections.basic && (
          <div className="mt-2 space-y-3 p-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={component.name}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ID
              </label>
              <input
                type="text"
                value={component.id}
                onChange={(e) => handlePropertyChange('id', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={component.properties.description || ''}
                onChange={(e) => handlePropertyChange('properties', {
                  ...component.properties,
                  description: e.target.value
                })}
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Connections Section */}
      <div className="mb-4">
        <button 
          className="flex items-center justify-between w-full text-left font-medium p-2 bg-gray-100 dark:bg-gray-700 rounded"
          onClick={() => toggleSection('connections')}
        >
          <span>Connections</span>
          <span>{expandedSections.connections ? '−' : '+'}</span>
        </button>
        
        {expandedSections.connections && (
          <div className="mt-2 space-y-3 p-2">
            {['north', 'south', 'east', 'west'].map(direction => (
              <div key={direction}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                  {direction}
                </label>
                <input
                  type="text"
                  value={component.properties.connections?.[direction] || ''}
                  onChange={(e) => handleNestedPropertyChange('connections', direction, e.target.value)}
                  placeholder="Room ID"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Inventory Section */}
      <div className="mb-4">
        <button 
          className="flex items-center justify-between w-full text-left font-medium p-2 bg-gray-100 dark:bg-gray-700 rounded"
          onClick={() => toggleSection('inventory')}
        >
          <span>Inventory</span>
          <span>{expandedSections.inventory ? '−' : '+'}</span>
        </button>
        
        {expandedSections.inventory && (
          <div className="mt-2 p-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Items in this room:
            </p>
            
            {(component.properties.inventory || []).length === 0 ? (
              <p className="text-sm italic text-gray-500">No items</p>
            ) : (
              <ul className="space-y-2">
                {(component.properties.inventory || []).map((item: any, index: number) => (
                  <li key={index} className="border p-2 rounded dark:border-gray-600">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{item.name}</span>
                      <button 
                        className="text-red-500 text-sm"
                        onClick={() => {
                          const newInventory = [...component.properties.inventory];
                          newInventory.splice(index, 1);
                          handlePropertyChange('properties', {
                            ...component.properties,
                            inventory: newInventory
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description || 'No description'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            
            <button 
              className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              onClick={() => {
                const newInventory = [...(component.properties.inventory || [])];
                newInventory.push({
                  id: `item-${Date.now()}`,
                  name: 'New Item',
                  description: 'Item description'
                });
                handlePropertyChange('properties', {
                  ...component.properties,
                  inventory: newInventory
                });
              }}
            >
              Add Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}