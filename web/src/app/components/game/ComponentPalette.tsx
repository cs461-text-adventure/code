import { useState } from 'react';

interface GameComponent {
  id: string;
  type: 'start-room' | 'room' | 'end-room' | 'npc' | 'puzzle' | 'room-link';
  name: string;
  position?: { x: number, y: number };
  properties: Record<string, any>;
}

interface ComponentPaletteProps {
  onAddComponent: (componentType: GameComponent['type']) => void;
}

export default function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const [expanded, setExpanded] = useState(true);
  
  const componentTypes: Array<{
    type: GameComponent['type'];
    name: string;
    description: string;
    color: string;
  }> = [
    {
      type: 'room',
      name: 'Room',
      description: 'A standard room that players can explore',
      color: 'bg-blue-100 dark:bg-blue-800',
    },
    {
      type: 'start-room',
      name: 'Start Room',
      description: 'The initial room where players begin',
      color: 'bg-green-100 dark:bg-green-800',
    },
    {
      type: 'end-room',
      name: 'End Room',
      description: 'A room that can end the game',
      color: 'bg-red-100 dark:bg-red-800',
    },
    {
      type: 'npc',
      name: 'NPC',
      description: 'A non-player character for interaction',
      color: 'bg-purple-100 dark:bg-purple-800',
    },
    {
      type: 'puzzle',
      name: 'Puzzle',
      description: 'A challenge for players to solve',
      color: 'bg-yellow-100 dark:bg-yellow-800',
    },
    {
      type: 'room-link',
      name: 'Room Link',
      description: 'A connection between rooms',
      color: 'bg-gray-100 dark:bg-gray-600',
    },
  ];

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
      <div 
        className="p-3 bg-gray-100 dark:bg-gray-700 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium">Component Palette</h3>
        <span>{expanded ? '−' : '+'}</span>
      </div>
      
      {expanded && (
        <div className="p-3 grid grid-cols-2 gap-2">
          {componentTypes.map(component => (
            <div
              key={component.type}
              className={`${component.color} p-2 rounded cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => onAddComponent(component.type)}
            >
              <div className="font-medium text-sm">{component.name}</div>
              <div className="text-xs truncate">{component.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}