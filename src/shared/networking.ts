import { Networking } from "@flamework/networking";
import { PlayerData, Context, TempData, Stand, Move, InventoryI } from "./types";


interface ServerEvents {

	SummonStand(isActive: boolean): void;
	StandMove(StandMove: number): void;
	isBlocking(block: boolean): void;
	swapSlot(slot1: number, slot2: number): void;
	halfSlot(slot1: number, slot2: number): void;
	RequestRun(): void;
}


interface ClientEvents {

	NumericDisplay(root: BasePart, num: number, numericType: string): void;
	StandMoveReady(StandMove: number, attackdebounce: Boolean, combo: Array<string>): void;
	setStamina(Stamina: number): void;
	setData(playerdata: PlayerData, tempdata: TempData): void;
	setXP(level: number, xp: number): void;
	
	setInventory(inv: InventoryI, boolean: boolean): void;
	
	LevelUp(): void;
}


export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();