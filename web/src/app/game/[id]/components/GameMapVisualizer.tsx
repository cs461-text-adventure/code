import React, { useEffect, useState } from 'react';
import { GameComponent } from './types';

interface Room {
  id: string;
  name: string;
  description: string;
  connections: {
    [direction: string]: string;
  };
  inventory: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  position?: {
    x: number;
    y: number;
  };
}

interface GameMapVisualizerProps {
  gameData: {
    rooms: Room[];
  };
  selectedComponent: GameComponent | null;
  onSelectComponent: (component: GameComponent) => void;
  mapComponents: GameComponent[];
}

const GameMapVisualizer: React.FC<GameMapVisualizerProps> = ({ 
  gameData, 
  selectedComponent, 
  onSelectComponent,
  mapComponents
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  
  useEffect(() => {
    if (gameData && gameData.rooms) {
      // Clone the rooms to avoid modifying the original data
      const roomsWithPositions = JSON.parse(JSON.stringify(gameData.rooms)) as Room[];
      
      // Set initial position for the first room
      if (roomsWithPositions.length > 0) {
        roomsWithPositions[0].position = { x: 300, y: 200 };
      }
      
      // Calculate positions for all rooms based on connections
      const positionedRooms = calculateRoomPositions(roomsWithPositions);
      setRooms(positionedRooms);
    }
  }, [gameData]);
  
  // Calculate positions for all rooms based on their connections
  const calculateRoomPositions = (rooms: Room[]): Room[] => {
    const roomMap = new Map<string, Room>();
    
    // Create a map of rooms by ID for easy lookup
    rooms.forEach(room => {
      roomMap.set(room.id, room);
    });
    
    // Process rooms with positions and assign positions to connected rooms
    let hasChanges = true;
    const spacing = 200; // Space between rooms
    
    while (hasChanges) {
      hasChanges = false;
      
      rooms.forEach(room => {
        if (room.position) {
          // For each connection, set position if not already set
          Object.entries(room.connections).forEach(([direction, connectedRoomId]) => {
            const connectedRoom = roomMap.get(connectedRoomId);
            
            if (connectedRoom && !connectedRoom.position) {
              // Normalize direction to handle variations
              const dir = direction.toLowerCase();
              
              // Set position based on direction
              if (dir === 'north' || dir.includes('north')) {
                connectedRoom.position = { 
                  x: room.position!.x, 
                  y: room.position!.y - spacing 
                };
                hasChanges = true;
              } else if (dir === 'south' || dir.includes('south')) {
                connectedRoom.position = { 
                  x: room.position!.x, 
                  y: room.position!.y + spacing 
                };
                hasChanges = true;
              } else if (dir === 'east' || dir.includes('east')) {
                connectedRoom.position = { 
                  x: room.position!.x + spacing, 
                  y: room.position!.y 
                };
                hasChanges = true;
              } else if (dir === 'west' || dir.includes('west')) {
                connectedRoom.position = { 
                  x: room.position!.x - spacing, 
                  y: room.position!.y 
                };
                hasChanges = true;
              } else {
                // For non-cardinal directions, position diagonally
                // This ensures all connections are visible
                connectedRoom.position = { 
                  x: room.position!.x + spacing, 
                  y: room.position!.y + spacing 
                };
                hasChanges = true;
              }
            }
          });
        }
      });
    }
    
    return rooms;
  };
  
  // Find the map boundaries to center the view
  const getBoundaries = () => {
    if (rooms.length === 0) return { minX: 0, maxX: 600, minY: 0, maxY: 400 };
    
    const positions = rooms
      .filter(room => room.position)
      .map(room => room.position!);
    
    // Add more padding to ensure all elements are visible
    // Increase right padding significantly to allow more space for unconnected rooms
    const minX = Math.min(...positions.map(pos => pos.x)) - 150;
    const maxX = Math.max(...positions.map(pos => pos.x)) + 300; // Increased from 150 to 300
    const minY = Math.min(...positions.map(pos => pos.y)) - 150;
    const maxY = Math.max(...positions.map(pos => pos.y)) + 150;
    
    return { minX, maxX, minY, maxY };
  };
  
  const { minX, maxX, minY, maxY } = getBoundaries();
  const mapWidth = maxX - minX;
  const mapHeight = maxY - minY;
  
  // Get room color based on index (first room is start room)
  const getRoomColor = (index: number, isSelected: boolean) => {
    if (index === 0) {
      // Start room - green
      return {
        bg: isSelected ? '#0D9488' : '#10B981', // bright green
        text: '#FFFFFF', // white text
        border: isSelected ? '#0F766E' : '#047857' // darker green border
      };
    }
    
    // Other room colors with good contrast
    const colors = [
      { bg: '#3B82F6', text: '#FFFFFF', border: '#1D4ED8' }, // blue
      { bg: '#8B5CF6', text: '#FFFFFF', border: '#6D28D9' }, // purple
      { bg: '#EC4899', text: '#FFFFFF', border: '#BE185D' }, // pink
      { bg: '#F59E0B', text: '#000000', border: '#B45309' }, // yellow
      { bg: '#EF4444', text: '#FFFFFF', border: '#B91C1C' }, // red
      { bg: '#6366F1', text: '#FFFFFF', border: '#4338CA' }, // indigo
      { bg: '#14B8A6', text: '#FFFFFF', border: '#0F766E' }, // teal
    ];
    
    const color = colors[(index - 1) % colors.length];
    
    if (isSelected) {
      // Darken the color for selected rooms
      return {
        bg: color.border, // Use the border color as background for selected state
        text: color.text,
        border: color.border
      };
    }
    
    return color;
  };
  
  // Find the reverse connection direction from target room back to source room
  const findReverseConnection = (sourceRoom: Room, targetRoomId: string): string | null => {
    const targetRoom = rooms.find(r => r.id === targetRoomId);
    if (!targetRoom) return null;
    
    // Look through all connections in the target room
    for (const [direction, connectedId] of Object.entries(targetRoom.connections)) {
      if (connectedId === sourceRoom.id) {
        return direction;
      }
    }
    
    return null;
  };
  
  // Find the corresponding GameComponent for a room
  const findComponentForRoom = (roomId: string): GameComponent | null => {
    return mapComponents.find(component => component.id === roomId) || null;
  };
  
  // Handle room selection
  const handleRoomClick = (room: Room, index: number) => {
    const component = findComponentForRoom(room.id);
    if (component) {
      onSelectComponent(component);
    } else {
      // If no matching component exists, create one from the room data
      const newComponent: GameComponent = {
        id: room.id,
        type: index === 0 ? 'start-room' : 'room',
        name: room.name || `Room ${index + 1}`,
        position: room.position,
        properties: {
          id: room.id,
          description: room.description,
          inventory: room.inventory || [],
          connections: room.connections || {}
        }
      };
      onSelectComponent(newComponent);
    }
  };
  
  return (
    <div className="border border-gray-300 rounded-lg bg-gray-100 p-4 overflow-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Game Map</h3>
      
      <div 
        className="relative bg-white border border-gray-200 rounded-lg"
        style={{ 
          width: '100%', 
          height: '500px',
          overflow: 'auto'
        }}
      >
        <div 
          className="absolute"
          style={{ 
            width: mapWidth, 
            height: mapHeight,
            transform: `translate(${-minX}px, ${-minY}px)`
          }}
        >
          {/* Draw connections between rooms */}
          {rooms.map((room, roomIndex) => {
            if (!room.position) return null;
            
            return Object.entries(room.connections).map(([direction, connectedRoomId]) => {
              const connectedRoom = rooms.find(r => r.id === connectedRoomId);
              if (!connectedRoom || !connectedRoom.position) return null;
              
              // Only draw connections where this room's ID is lexicographically smaller
              // This prevents drawing the same connection twice
              if (room.id > connectedRoomId) return null;
              
              // Calculate line coordinates
              const startX = room.position!.x;
              const startY = room.position!.y;
              const endX = connectedRoom.position.x;
              const endY = connectedRoom.position.y;
              
              // Determine if this is a horizontal connection (east-west)
              const dir = direction.toLowerCase();
              const isHorizontal = dir === 'east' || dir === 'west' || 
                               dir.includes('east') || dir.includes('west');
              
              // Make labels smaller
              const labelWidth = 30;
              const labelHeight = 14;
              
              // Calculate perpendicular offset to position labels above the line
              const dx = endX - startX;
              const dy = endY - startY;
              const length = Math.sqrt(dx * dx + dy * dy);
              const normalizedDx = dx / length;
              const normalizedDy = dy / length;
              
              // Perpendicular vector (always points "up" relative to the line)
              const perpX = -normalizedDy;
              const perpY = normalizedDx;
              
              // Apply a smaller offset perpendicular to the line to keep labels closer to connections
              // Increase offset for horizontal connections
              const labelOffset = isHorizontal ? 25 : 15;
              
              // For horizontal connections, position labels at specific points along the connection
              // but closer to the connection line
              const firstLabelX = startX + dx * 0.4 + perpX * labelOffset;
              const firstLabelY = startY + dy * 0.4 + perpY * labelOffset;
              
              // Position for second label (60% along the line, offset perpendicular to line)
              const secondLabelX = startX + dx * 0.6 + perpX * labelOffset;
              const secondLabelY = startY + dy * 0.6 + perpY * labelOffset;
              
              // Find the reverse connection if it exists
              const reverseDirection = findReverseConnection(room, connectedRoomId);
              
              return (
                <svg
                  key={`${room.id}-${direction}-${connectedRoomId}`}
                  className="absolute top-0 left-0"
                  style={{ 
                    width: mapWidth, 
                    height: mapHeight,
                    pointerEvents: 'none'
                  }}
                >
                  {/* Connection line */}
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#4B5563"
                    strokeWidth="3"
                    strokeOpacity="0.7"
                  />
                  
                  {/* Direction label from source room */}
                  <g transform={`translate(${firstLabelX}, ${firstLabelY})`}>
                    <rect
                      x={-labelWidth/2}
                      y={-labelHeight/2}
                      width={labelWidth}
                      height={labelHeight}
                      fill="white"
                      stroke="#4B5563"
                      strokeWidth="1"
                      rx="3"
                    />
                    <text
                      x="0"
                      y="1"
                      fill="#000000"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {direction}
                    </text>
                  </g>
                  
                  {/* Direction label from target room (if reverse connection exists) */}
                  {reverseDirection && (
                    <g transform={`translate(${secondLabelX}, ${secondLabelY})`}>
                      <rect
                        x={-labelWidth/2}
                        y={-labelHeight/2}
                        width={labelWidth}
                        height={labelHeight}
                        fill="white"
                        stroke="#4B5563"
                        strokeWidth="1"
                        rx="3"
                      />
                      <text
                        x="0"
                        y="1"
                        fill="#000000"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {reverseDirection}
                      </text>
                    </g>
                  )}
                </svg>
              );
            });
          })}
          
          {/* Draw room nodes */}
          {rooms.map((room, index) => {
            if (!room.position) return null;
            
            const isSelected = selectedComponent?.id === room.id;
            const { bg, text, border } = getRoomColor(index, isSelected);
            const isStartRoom = index === 0;
            
            return (
              <div
                key={room.id}
                className={`absolute rounded-lg shadow-md flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all duration-200 ${isSelected ? 'ring-4 ring-blue-400' : ''}`}
                style={{
                  left: room.position.x - 60,
                  top: room.position.y - 40,
                  width: '120px',
                  height: '80px',
                  backgroundColor: bg,
                  color: text,
                  border: `2px solid ${border}`,
                  zIndex: 10,
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                }}
                onClick={() => handleRoomClick(room, index)}
              >
                {isStartRoom && (
                  <div className="text-xs font-bold mb-1 bg-white text-green-800 px-2 py-0.5 rounded-full">
                    START
                  </div>
                )}
                <div className="font-bold text-sm truncate max-w-full">
                  {room.name || `Room ${index + 1}`}
                </div>
                <div className="text-xs truncate max-w-full">
                  {room.id.substring(0, 8)}...
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameMapVisualizer;