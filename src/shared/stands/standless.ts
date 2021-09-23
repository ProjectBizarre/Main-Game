import { PlayerData, Context, TempData, Stand, Move } from "../types";

import { DamageHitbox, PlayerAnimation, StandAnimation,  nullMove} from "shared/utils";
import { GlobalEvents } from "shared/networking";
import { Animations } from "shared/files";


const punch: Move = {
	id: 1,
	name: "Punch",
	key: "M1",
	description: "An Average Punch that deals 7 damage per punch.",
	stamina: 15,
	run: (ctx, done) => {
		let animation: AnimationTrack;
		let length: number;
		if (ctx.tempData.combo[ctx.tempData.combo.size() - 1] === undefined || ctx.tempData.combo[ctx.tempData.combo.size() - 1] !== "SP1") {
			[animation, length] = PlayerAnimation(ctx.Character, "Standless_Punch")
			ctx.tempData.combo.push("SP1")
		} else if (ctx.tempData.combo[ctx.tempData.combo.size() - 1] !== "SP2") {
			[animation, length] = PlayerAnimation(ctx.Character, "Standless_Punch2")
			ctx.tempData.combo.push("SP2")			
		} else {
			[animation, length] = PlayerAnimation(ctx.Character, "Standless_Punch")
			ctx.tempData.combo.push("SP1")			
		}
		
		
		let hitbox = DamageHitbox(ctx.data.player, 7, ctx.Character ,ctx.root,)
		animation.Stopped.Connect(() => {
			hitbox.Destroy()
			done()
		})

		if (ctx.tempData.combo.size() >= 4) {
			ctx.tempData.combo = []
		}
		

	}
}

const stand: Stand = {
	moveSet: {
		1: nullMove(1),
		2: nullMove(2),
		3: nullMove(3),
	},
	meleeMoveSet: {
		1: punch
	},
	standless: true,
	animations: {
		idle: "7471910386"
	}
	
}

export default stand