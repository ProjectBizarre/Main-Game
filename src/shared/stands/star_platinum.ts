import { PlayerData, Context, TempData, Stand, Move } from "../types";

import { DamageHitbox, PlayerAnimation, StandAnimation,  nullMove} from "shared/utils";
import { GlobalEvents } from "shared/networking";


const punch: Move = {
	id: 1,
	name: "Punch",
	stamina: 15,
	run: (ctx, done) => {
		
		let animation: AnimationTrack;
		let length: number;
		let dmg: number;
		if (ctx.tempData.combo.size() === 0) {
			[animation, length] = StandAnimation(ctx.Stand, "Punch")
			dmg = 15
		} else if (ctx.tempData.combo.size() < 4){
			if (math.random(0,1) === 1) {
				[animation, length] = StandAnimation(ctx.Stand, "Punch2")
			} else {
				[animation, length] = StandAnimation(ctx.Stand, "Punch3")
			}
			
			dmg = 10
		} else {
			[animation, length] = StandAnimation(ctx.Stand, "Smash")
			dmg = 35
		}

		ctx.Humanoid.WalkSpeed = 6
		
		let Hitbox = DamageHitbox(ctx.data.player, dmg, ctx.Character ,ctx.Stand.FindFirstChild("LowerTorso") as BasePart, (hit, root) => {
			GlobalEvents.server.NumericDisplay(ctx.tempData.player, root, dmg, "-0")
			
		})

		wait(0.3)
		ctx.Humanoid.WalkSpeed = 16
		if (ctx.tempData.combo.size() >= 4) {
			ctx.tempData.combo = []
			Hitbox.Destroy()
			done(true)
			return
		}
		ctx.tempData.combo.push("P")

		Hitbox.Destroy()
		done(false)
		return


	}
} 


const Heavy: Move = {
	id: 3,
	name: "Heavy Punch",
	stamina: 45,
	run: (ctx, done) => {
		
		let animation: AnimationTrack;
		let length: number;
		let dmg: number;
		[animation, length] = StandAnimation(ctx.Stand, "HeavyPunch")
		dmg = 35


		ctx.Humanoid.WalkSpeed = 2
		
		let Hitbox = DamageHitbox(ctx.data.player,dmg, ctx.Character ,ctx.Stand.FindFirstChild("LowerTorso") as BasePart, (hit, root) => {
			GlobalEvents.server.NumericDisplay(ctx.data.player, root, dmg, "-0")
			
		})

		wait((length / 3) + (length / 2))
		ctx.Humanoid.WalkSpeed = 16
		
		ctx.tempData.combo = []

		Hitbox.Destroy()
		done(true)
		return


	}
} 


const barage: Move = {
	id: 2,
	name: "Barage",
	stamina: 102,
	run: (ctx, done) => {
		
		let animation: AnimationTrack;
		let length: number;
		
		[animation, length] = StandAnimation(ctx.Stand, "Barage")
		ctx.Humanoid.WalkSpeed = 6
		animation.Stopped.Connect(() => {
			ctx.Humanoid.WalkSpeed = 16
		})	


		let hitboxes = []
		for (let i = 1; i < 10; i++) {
			let Hitbox = DamageHitbox(ctx.data.player, 10.5, ctx.Character ,ctx.Stand.FindFirstChild("LowerTorso") as BasePart, (hit, root) => {
				GlobalEvents.server.NumericDisplay(ctx.data.player, root, 10.5, "-0")
				
			})
			hitboxes.push(Hitbox)
			wait(0.26)
		}
		
		ctx.tempData.combo = []

		hitboxes.forEach((hitbox) => {
			hitbox.Destroy()
		})
		done(true)
		return


	}
} 

const stand: Stand = {
	moveSet: {
		1: punch,
		2: barage,
		3: Heavy
	},
	standlessmoveSet: {
		1: nullMove(1),
		2: nullMove(2),
		3: nullMove(3),
	}
}

export default stand