export interface GameComponent {
  id: string;
  type: 'room' | 'start-room' | 'end-room' | 'npc' | 'puzzle' | 'room-link' | 'win-condition';
  name: string;
  position?: { x: number, y: number };
  properties: Record<string, any>;
}