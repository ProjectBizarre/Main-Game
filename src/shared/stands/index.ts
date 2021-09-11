import { PlayerData, Context, TempData, Stand, Move } from "../types";

export const StandsList: { [index: string]: Stand} = {}

script.GetChildren().forEach((tempscript: Instance) => {
	if (tempscript.IsA("ModuleScript")) {
		let module = tempscript as ModuleScript
		let req = require(module)
		if (req !== undefined) {
			// @ts-ignore
			if (req.default !== undefined) {
				// @ts-ignore
				StandsList[module.Name] = req.default
			}
		}
	}
})