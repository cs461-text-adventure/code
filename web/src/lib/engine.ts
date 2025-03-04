export interface Item {
  id: string;
  name: string;
  description: string;
}

export class Room {
  public id: string;
  public description: string;
  public connections: { [key: string]: Room } = {};
  public inventory: Item[];

  constructor(id: string, description: string, inventory: Item[]) {
    this.id = id;
    this.description = description;
    this.inventory = inventory;
  }

  printDescription(): string {
    return this.description;
  }

  getConnection(direction: string): Room | undefined {
    return this.connections[direction];
  }

  removeItem(item: Item): Item | undefined {
    const index = this.inventory.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      return this.inventory.splice(index, 1)[0];
    }
    return undefined;
  }
}

export class Player {
  private _health: number;
  private _inventory: Item[];
  private _currentRoom: Room;

  constructor(health: number, currentRoom: Room, inventory: Item[] = []) {
    this._health = health;
    this._inventory = inventory;
    this._currentRoom = currentRoom;
  }

  public get health(): number {
    return this._health;
  }

  public set health(value: number) {
    this._health = value;
  }

  public get inventory(): Item[] {
    return this._inventory;
  }

  public set inventory(value: Item[]) {
    this._inventory = value;
  }

  public addItem(item: Item): void {
    this._inventory.push(item);
  }

  public removeItem(itemName: string): void {
    const index = this._inventory.findIndex((item) => item.name === itemName);
    if (index !== -1) {
      this._inventory.splice(index, 1);
    }
  }

  public get currentRoom(): Room {
    return this._currentRoom;
  }

  public move(direction: string): void {
    const newRoom = this._currentRoom.getConnection(direction);
    if (newRoom) {
      this._currentRoom = newRoom;
    }
  }
}

export class Game {
  private _rooms: Map<string, Room>;
  private _player: Player;
  private stack: string[] = [];

  constructor(rooms: Room[], player: Player) {
    this._rooms = new Map();
    rooms.forEach((room) => {
      this._rooms.set(room.description, room);
    });
    this._player = player;
  }

  nextStep(input: string | null): string[] {
    const responses: string[] = [];
    // let end_condition = false; TODO: Move elsewhere
    if (this._player.health > 0) {
      if (input !== null) {
        responses.push(...this.processCommand(input));
      }
    }

    return responses;
  }

  processCommand(input: string): string[] {
    const sanitizedInput = sanitizeInput(input);

    const responses: string[] = [];

    // Check if we're waiting for specific input
    if (this.stack.length > 0) {
      const action = this.stack.pop();

      switch (action) {
        case "ITEM":
          return this.processItemInput(sanitizedInput);
        case "ATTACK":
          return this.processAttackInput(sanitizedInput);
        case "EXAMINE":
          return this.processExamineInput(sanitizedInput);
        default:
          responses.push(`Unexpected input: "${input}".`);
      }
      return responses;
    }

    const command = commands.includes(sanitizedInput as Command)
      ? (sanitizedInput as Command)
      : null;

    if (!command) {
      return [`I don't know the word "${input}".`];
    }

    switch (command) {
      case "help":
        responses.push(
          "Available commands: north, south, east, west, grab, attack, examine",
        );
        break;
      case "north":
      case "south":
      case "east":
      case "west":
        this._player.move(command);
        responses.push(this._player.currentRoom.description);
        break;
      case "grab":
        responses.push("What do you want to pick up?");
        this.stack.push("ITEM");
        break;
      case "attack":
        responses.push("What do you want to attack?");
        this.stack.push("ATTACK");
        break;
      case "examine":
        responses.push("What do you want to examine?");
        this.stack.push("EXAMINE");
        break;
      default:
        responses.push(`I don't know the word "${command}".`);
    }

    return responses;
  }

  processItemInput(input: string): string[] {
    const itemName = sanitizeInput(input);
    const item = this._player.currentRoom.inventory.find(
      (item) => item.name.toLowerCase() === itemName,
    );
    if (item) {
      this._player.addItem(item);
      this._player.currentRoom.removeItem(item);
      return ["Taken"];
    } else {
      return [`You can't see any "${itemName}" here.`];
    }
  }

  // TODO:
  processAttackInput(input: string): string[] {
    const command = sanitizeInput(input);
    return [command];
  }
  // TODO:
  processExamineInput(input: string): string[] {
    const command = sanitizeInput(input);
    return [command];
  }
}
const commands = [
  "help",
  "north",
  "south",
  "east",
  "west",
  "grab",
  "attack",
  "examine",
] as const;

type Command = (typeof commands)[number];

function sanitizeInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "");
}

/*
let testGame = {
  rooms: [
    {
      id: "eff48a18-a2a3-48e2-9246-d219ecca1da2",
      name: "Study",
      description:
        "A dimly lit room filled with the scent of aged paper and mahogany. Tall bookshelves line the walls, crammed with leather-bound tomes. A large oak desk sits in the center, its surface cluttered with scattered notes and an old brass lamp. A grandfather clock ticks softly in the corner, adding to the room’s contemplative stillness.",
      connections: {
        south: "eb4803f0-5d74-403e-a3f0-ddd17e4a4e6a",
        east: "63b8d45b-2b5e-4fab-8de8-8fcd7a843939",
      },
      inventory: [],
    },
    {
      id: "63b8d45b-2b5e-4fab-8de8-8fcd7a843939",
      name: "Hall",
      description:
        "A grand corridor with high ceilings and an elegant chandelier casting flickering light over polished marble floors. Ornate portraits of unknown figures watch from the walls, their eyes seeming to follow your every move. The air is thick with a lingering scent of candle wax and aged wood.",
      connections: {
        west: "eff48a18-a2a3-48e2-9246-d219ecca1da2",
        east: "30cf0195-265b-4538-a792-2b519fe225e5",
      },
      inventory: [],
    },
    {
      id: "30cf0195-265b-4538-a792-2b519fe225e5",
      name: "Lounge",
      description:
        "A lavish room designed for comfort, with plush velvet armchairs and a crackling fireplace illuminating the space with a golden glow. A grand piano stands in the corner, its keys long untouched. The scent of old cigars and brandy still lingers in the air, remnants of past conversations.",
      connections: {
        west: "63b8d45b-2b5e-4fab-8de8-8fcd7a843939",
        south: "685d4a6a-09a5-47d2-8a29-2592f03b7f3a",
      },
      inventory: [],
    },
    {
      id: "eb4803f0-5d74-403e-a3f0-ddd17e4a4e6a",
      name: "Library",
      description:
        "Rows upon rows of towering bookshelves create a maze of forgotten knowledge. The scent of parchment and dust fills the air. A rolling ladder leans against one of the cases, allowing access to books high above. Dim candle sconces provide just enough light to read by, casting long shadows along the walls.",
      connections: {
        north: "eff48a18-a2a3-48e2-9246-d219ecca1da2",
        south: "c8eec396-3477-45ba-85e4-84052342ab18",
      },
      inventory: [],
    },
    {
      id: "685d4a6a-09a5-47d2-8a29-2592f03b7f3a",
      name: "Dining Room",
      description:
        "A long mahogany dining table dominates the room, surrounded by high-backed chairs with intricate carvings. A chandelier hangs above, though its candles are barely flickering. The plates and silverware remain set, as if awaiting a feast that never arrived. A faint chill lingers in the air.",
      connections: {
        north: "30cf0195-265b-4538-a792-2b519fe225e5",
        south: "2d2d420d-a436-4a1c-af68-ef625c564cc8",
      },
      inventory: [],
    },
    {
      id: "c8eec396-3477-45ba-85e4-84052342ab18",
      name: "Billiard Room",
      description:
        "A cozy space with green felt-covered tables and a rack of well-worn cues mounted on the wall. A few half-empty glasses sit abandoned on a small side table, as if the last game ended in haste. A single, flickering lightbulb above casts eerie shadows across the room.",
      connections: {
        north: "eb4803f0-5d74-403e-a3f0-ddd17e4a4e6a",
        south: "51cba91a-5646-43db-ad69-4872090034da",
      },
      inventory: [],
    },
    {
      id: "51cba91a-5646-43db-ad69-4872090034da",
      name: "Conservatory",
      description:
        "Overgrown with ivy and filled with the scent of damp earth, this glass-walled sanctuary is both serene and unsettling. Sunlight filters through the dusty panes, illuminating exotic plants with curling leaves. A weathered bench sits in the corner, partially hidden by ferns, offering a quiet place for contemplation.",
      connections: {
        north: "c8eec396-3477-45ba-85e4-84052342ab18",
        east: "2b14cd67-b36a-4a98-9a0b-f80f4313e192",
      },
      inventory: [],
    },
    {
      id: "2b14cd67-b36a-4a98-9a0b-f80f4313e192",
      name: "Ball Room",
      description:
        "A vast and empty space, its once-glorious parquet floor now scuffed with age. The towering windows let in beams of pale light, reflecting off an enormous crystal chandelier above. A faded velvet curtain conceals a small stage, where musicians once played for elegant dances long past.",
      connections: {
        west: "51cba91a-5646-43db-ad69-4872090034da",
        east: "2d2d420d-a436-4a1c-af68-ef625c564cc8",
      },
      inventory: [],
    },
    {
      id: "2d2d420d-a436-4a1c-af68-ef625c564cc8",
      name: "Kitchen",
      description:
        "A cold, utilitarian space with long steel countertops and a massive iron stove. The scent of stale herbs and burnt wood still lingers. Copper pots hang from hooks, their surfaces dulled by time. A door to the pantry stands ajar, revealing shelves lined with jars of preserved goods, now covered in dust.",
      connections: {
        north: "685d4a6a-09a5-47d2-8a29-2592f03b7f3a",
        west: "2b14cd67-b36a-4a98-9a0b-f80f4313e192",
      },
      inventory: [],
    },
  ],
};
*/
