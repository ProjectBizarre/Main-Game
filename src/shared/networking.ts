import { Networking } from "@flamework/networking";
import { PlayerData, Context, TempData, Stand, Move } from "./types";


interface ServerEvents {

	SummonStand(isActive: boolean): void;
	StandMove(StandMove: number): void;
	isBlocking(block: boolean): void;
}


interface ClientEvents {

	NumericDisplay(root: BasePart, num: number, numericType: string): void;
	StandMoveReady(StandMove: number, attackdebounce: Boolean, combo: Array<string>): void;
	setStamina(Stamina: number): void;
	setData(playerdata: PlayerData, tempdata: TempData): void;
	setXP(level: number, xp: number): void;
}


export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();