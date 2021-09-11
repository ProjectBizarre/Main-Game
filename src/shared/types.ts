export interface Move {
	id: number;
	name: string;
	stamina: number;
	run: (ctx: Context, done: Callback) => void;
}

export interface Stand {
	moveSet: { [index: number]: Move };
	standlessmoveSet: { [index: number]: Move };
}

export interface Context {
	root: BasePart;
	Humanoid: Humanoid;
	Character: Model;
	Stand: Model;
	data: PlayerData;
	tempData: TempData;
}

export interface PlayerData {
	Stand: {
		id: string;
		isActive: boolean;
		debounce: boolean;
		cooldown: { [index: number]: boolean };
	};
	Data: {
		level: number,
		xp: number,
	}
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
}