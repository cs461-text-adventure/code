// import React from 'react';
// import { GameComponent } from './types';

// interface ComponentPaletteProps {
//   handleDragStart?: (componentType: string) => (e: React.DragEvent) => void;
//   onAddComponent?: (componentType: GameComponent['type']) => void;
// }

// const ComponentPalette: React.FC<ComponentPaletteProps> = ({ 
//   handleDragStart, 
//   onAddComponent 
// }) => {
//   // If both props are provided, prioritize onAddComponent for click events
//   const handleComponentClick = (componentType: GameComponent['type']) => {
//     if (onAddComponent) {
//       onAddComponent(componentType);
//     }
//   };

//   return (
//     <div className="border border-gray-300 rounded-md bg-white p-4">
//       <h3 className="text-sm font-medium mb-3">Game Components</h3>
//       <div className="space-y-2">
//         <div 
//           className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm cursor-move"
//           draggable={!!handleDragStart}
//           onDragStart={handleDragStart ? handleDragStart('start-room') : undefined}
//           onClick={() => onAddComponent && onAddComponent('start-room')}
//         >
//           Start Room
//         </div>
//         <div 
//           className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm cursor-move"
//           draggable={!!handleDragStart}
//           onDragStart={handleDragStart ? handleDragStart('room') : undefined}
//           onClick={() => onAddComponent && onAddComponent('room')}
//         >
//           Room
//         </div>
//         <div 
//           className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm cursor-move"
//           draggable={!!handleDragStart}
//           onDragStart={handleDragStart ? handleDragStart('end-room') : undefined}
//           onClick={() => onAddComponent && onAddComponent('end-room')}
//         >
//           End Room
//         </div>
//         <div 
//           className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm cursor-move"
//           draggable={!!handleDragStart}
//           onDragStart={handleDragStart ? handleDragStart('npc') : undefined}
//           onClick={() => onAddComponent && onAddComponent('npc')}
//         >
//           NPC
//         </div>
//         <div 
//           className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm cursor-move"
//           draggable={!!handleDragStart}
//           onDragStart={handleDragStart ? handleDragStart('puzzle') : undefined}
//           onClick={() => onAddComponent && onAddComponent('puzzle')}
//         >
//           Puzzle
//         </div>
//         <div 
//           className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm cursor-move"
//           draggable={!!handleDragStart}
//           onDragStart={handleDragStart ? handleDragStart('room-link') : undefined}
//           onClick={() => onAddComponent && onAddComponent('room-link')}
//         >
//           Room Link
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComponentPalette;