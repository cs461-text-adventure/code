import { useState, useRef, useEffect } from 'react';

interface GameComponent {
  id: string;
  type: 'start-room' | 'room' | 'end-room' | 'npc' | 'puzzle' | 'room-link';
  name: string;
  position?: { x: number, y: number };
  properties: Record<string, any>;
}

interface MapEditorProps {
  components: GameComponent[];
  onComponentsChange: (components: GameComponent[]) => void;
  onSelectComponent: (component: GameComponent | null) => void;
  selectedComponent: GameComponent | null;
}

export default function MapEditor({ 
  components, 
  onComponentsChange, 
  onSelectComponent,
  selectedComponent 
}: MapEditorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle component dragging
  const handleDragStart = (e: React.MouseEvent, component: GameComponent) => {
    if (!component.position) return;
    
    setIsDragging(true);
    setDraggedComponent(component.id);
    
    // Calculate offset from mouse position to component position
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Prevent default drag behavior
    e.preventDefault();
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !draggedComponent || !mapRef.current) return;
    
    const mapRect = mapRef.current.getBoundingClientRect();
    const newX = e.clientX - mapRect.left - dragOffset.x;
    const newY = e.clientY - mapRect.top - dragOffset.y;
    
    // Update component position
    const updatedComponents = components.map(comp => {
      if (comp.id === draggedComponent) {
        return {
          ...comp,
          position: { x: Math.max(0, newX), y: Math.max(0, newY) }
        };
      }
      return comp;
    });
    
    onComponentsChange(updatedComponents);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedComponent(null);
  };

  // Set up event listeners for drag operations
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, draggedComponent]);

  return (
    <div className="border rounded-lg bg-gray-100 dark:bg-gray-800 h-[500px] relative overflow-hidden" ref={mapRef}>
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] gap-4 p-4 pointer-events-none">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-sm opacity-30"></div>
        ))}
      </div>
      
      {/* Map components */}
      {components.map(component => (
        <div
          key={component.id}
          className={`absolute p-2 rounded-lg shadow-md cursor-move ${
            component.id === selectedComponent?.id 
              ? 'ring-2 ring-blue-500' 
              : ''
          } ${
            component.type === 'start-room' 
              ? 'bg-green-100 dark:bg-green-800' 
              : component.type === 'end-room'
                ? 'bg-red-100 dark:bg-red-800'
                : 'bg-white dark:bg-gray-700'
          }`}
          style={{
            left: component.position?.x || 0,
            top: component.position?.y || 0,
            width: '120px',
            zIndex: component.id === selectedComponent?.id ? 10 : 1
          }}
          onClick={() => onSelectComponent(component)}
          onMouseDown={(e) => handleDragStart(e, component)}
        >
          <div className="text-sm font-medium truncate">{component.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300">{component.type}</div>
        </div>
      ))}
    </div>
  );
}