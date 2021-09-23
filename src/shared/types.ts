export interface Move {
	id: number;
	key: string;
	name: string;
	description: string;
	stamina: number;
	run: (ctx: Context, done: Callback) => void;
}

interface animations {
	idle?: string,
	walk?: string,
	run?: string
}

export interface Stand {
	moveSet: { [index: number]: Move };
	meleeMoveSet: { [index: number]: Move };
	standless?: boolean;
	animations: animations
}

export interface Context {
	root: BasePart;
	Humanoid: Humanoid;
	Character: Model;
	Stand: Model;
	data: PlayerData;
	tempData: TempData;
}

export interface ItemI {
	Name: string
	ID: number
	Texture: string
	Model: string
	Description: string
	use?: (player: Player) => Boolean
}

export interface ItemSlotI {
	Item: ItemI
	Amount: number
}

export function ItemSlot(Item: ItemI, amount: number): ItemSlotI {
	return {
		Item: Item,
		Amount: amount
	}
}
export class Item implements ItemI {

	public Name: string;
	public ID: number;
	public Texture: string;
	public Model: string;
	public Description: string;

	constructor(name: string, id: number, texture: string, Model: string, Description: string) {
		this.Name = name
		this.ID = id
		this.Texture = "rbxassetid://" + texture
		this.Model = Model
		this.Description = Description
	}

	
}

export class UsableItem implements ItemI {

	public Name: string;
	public ID: number;
	public Texture: string;
	public Model: string;
	public Description: string;
	public use: (player: Player) => Boolean;

	constructor(name: string, id: number, texture: string, Model: string, Description: string, use: (player: Player) => Boolean) {
		this.Name = name
		this.ID = id
		this.Texture = "rbxassetid://" + texture
		this.Model = Model
		this.Description = Description
		this.use = use
	}

	
}

export interface InventoryI { [index: string ]: ItemSlotI | undefined}

export class Inventory implements InventoryI{
	[index: string]: ItemSlotI | undefined;
	constructor() {
		for(let i = 0; i < 23; i++) {
			this[tostring(i)] = undefined
		}
	}
}

export interface PlayerData {
	Stand: {
		id: string;

	};
	Data: {
		level: number,
		xp: number,
	}
	Inventory: InventoryI
	player: Player;

}

export interface TempData {
	combo: Array<string>
	debounce: Boolean
	player: Player;
	stamina: number;
	lastattack: number;
	lastdamage: number;
	isblocking: boolean;
	blocktime: number;
	standIsActive: boolean;
	standDebounce: boolean;
	cooldown: { [index: number]: boolean };
	meleecooldown: { [index: number]: boolean };
	camera: boolean;
}