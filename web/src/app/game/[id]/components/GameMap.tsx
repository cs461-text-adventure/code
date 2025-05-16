// import React from 'react';
// import { GameComponent } from './types';

// interface GameMapProps {
//   mapRef: React.RefObject<HTMLDivElement | null>;
//   components: GameComponent[];
//   selectedComponent: GameComponent | null;
//   onSelectComponent: (component: GameComponent) => void;
//   onComponentsChange: (components: GameComponent[]) => void;
// }

// const GameMap: React.FC<GameMapProps> = ({
//   mapRef,
//   components,
//   selectedComponent,
//   onSelectComponent,
//   onComponentsChange
// }) => {
//   // Handle drag over event
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };

//   // Handle drop event
//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
    
//     if (!mapRef.current) return;
    
//     const componentType = e.dataTransfer.getData('componentType') as GameComponent['type'];
//     if (!componentType) return;
    
//     const rect = mapRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     const newId = `${componentType}-${Date.now()}`;
//     const newComponent: GameComponent = {
//       id: newId,
//       type: componentType,
//       name: `New ${componentType}`,
//       position: { x, y },
//       properties: {
//         id: newId,
//         description: `Description for new ${componentType}`,
//         inventory: [],
//         connections: {}
//       }
//     };
    
//     onComponentsChange([...components, newComponent]);
//   };

//   return (
//     <div 
//       ref={mapRef}
//       className="border border-gray-300 rounded-md bg-white h-96 p-4 relative overflow-auto"
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//     >
//       <h3 className="text-sm font-medium mb-3">Game Map</h3>
      
//       {/* Render map components */}
//       {components.map(component => (
//         <div
//           key={component.id}
//           className={`absolute p-2 rounded-md cursor-pointer ${
//             selectedComponent?.id === component.id 
//               ? 'ring-2 ring-blue-500' 
//               : ''
//           }`}
//           style={{
//             left: `${component.position?.x || 0}px`,
//             top: `${component.position?.y || 0}px`,
//             backgroundColor: 
//               component.type === 'start-room' ? '#BFDBFE' : 
//               component.type === 'end-room' ? '#FEE2E2' : 
//               component.type === 'room' ? '#E0E7FF' :
//               component.type === 'npc' ? '#D1FAE5' :
//               component.type === 'puzzle' ? '#EDE9FE' : '#F3F4F6'
//           }}
//           onClick={() => onSelectComponent(component)}
//         >
//           <div className="text-xs font-medium">{component.name}</div>
//         </div>
//       ))}
      
//       {/* Empty state message */}
//       {components.length === 0 && (
//         <div className="h-full flex items-center justify-center text-gray-400 text-sm">
//           Drag components here to build your game
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameMap;