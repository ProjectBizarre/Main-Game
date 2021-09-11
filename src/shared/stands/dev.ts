import { PlayerData, Context, TempData, Stand, Move } from "../types";
import { Animations } from "../files";


const punch: Move = {
	id: 1,
	name: "Punch",
	stamina: 1.2,
	run: (ctx, done) => {
		let AnimControl = ctx.Stand.FindFirstChild("AnimControl") as AnimationController
		let anim = AnimControl.LoadAnimation(Animations?.FindFirstChild("Punch") as Animation)
		anim.Play()
		anim.Stopped.Connect(() => {
			done()
		})	
	}
} 

const stand: Stand = {
	moveSet: {
		1: punch
	},
	standlessmoveSet: {
		
	}
}

export default stand