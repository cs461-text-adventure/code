export interface GameComponent {
  id: string;
  type: "room" | "start-room" | "end-room" | "npc" | "puzzle" | "room-link" | "win-condition";
  name: string;
  position?: {
    x: number;
    y: number;
  };
  properties: {
    id: string;
    description?: string;
    inventory?: Array<{
      id: string;
      name: string;
      description: string;
    }>;
    connections?: {
      [direction: string]: string;
    };
    conditions?: Array<{
      description: string;
      type: string;
      value: any;
    }>;
    win_condition?: {
      required_items: string[];
      required_room: string;
    };
  };
}