import { PlayerData, Context, TempData, Stand, Move } from "./types";

class Server {
	public static Data: { [index: number]: PlayerData} = {}
	public static TempData: { [index: number]: TempData} = {}
}

export = {
	Server
}