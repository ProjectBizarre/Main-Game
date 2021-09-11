import { ReplicatedStorage, Players} from "@rbxts/services"
import { Animations } from "./files";
import { PlayerData, Context, TempData, Stand, Move } from "./types";
import Data from "./data"
import { GlobalEvents } from "./networking";


export function DamageHitbox(player1: Player,damage: number, char: Model,root: BasePart, onhit?: (hit: Humanoid, root: BasePart) => void): BasePart {
	let Hitbox = ReplicatedStorage.FindFirstChild("Hitbox")?.Clone() as BasePart
	Hitbox.CFrame = root.CFrame.mul(new CFrame(0,0,-2))
	Hitbox.Parent = root

	let weld = new Instance("ManualWeld")
	weld.Part0 = Hitbox
	weld.Part1 = root
	weld.C0 = weld.Part0.CFrame.ToObjectSpace(weld.Part1.CFrame)
	weld.Parent = weld.Part0

	Hitbox.Touched.Connect((hit) => {
		if (hit.IsA("BasePart") && !hit.IsDescendantOf(char)) {
			let hitHum = hit.Parent?.FindFirstChild("Humanoid") as Humanoid
			let hitHumRP = hit.Parent?.FindFirstChild("HumanoidRootPart") as BasePart
			if (hitHum && hitHumRP) {
				let player = Players.GetPlayerFromCharacter(hit.Parent as Model)
				if (player) {
					if (Data.Server.TempData[player.UserId].isblocking === true) {
						let data = Data.Server.TempData[player.UserId]
						data.combo.push("BL")
						if (data.combo.size() >= 4) {
							data.combo = []
							data.isblocking = false
							data.stamina = 0
							data.blocktime = tick()
							StopAnimation(hit.Parent as Model, "Player_Block")
						}
						data.lastdamage = tick()
						Data.Server.TempData[player.UserId] = data

						if (onhit !== undefined) {
							onhit(hitHum, hitHumRP)
						}
						let playerdata = Data.Server.Data[player1.UserId]
						if (playerdata.Data.xp + 1 >= getMaxXp(playerdata.Data.level)) {
							playerdata.Data.xp = 0
							playerdata.Data.level += 0.1
						} else {
							playerdata.Data.xp += 0.1
						}
						GlobalEvents.server.setXP(player1, playerdata.Data.level,playerdata.Data.xp)
						hitHum.TakeDamage(damage)
						Hitbox.Destroy()
						

					} else {

					}
				} else {
						if (onhit !== undefined) {
							onhit(hitHum, hitHumRP)
						}
						let playerdata = Data.Server.Data[player1.UserId]
						if (playerdata.Data.xp + 1 >= getMaxXp(playerdata.Data.level)) {
							playerdata.Data.xp = 0
							playerdata.Data.level += 0.1
						} else {
							playerdata.Data.xp += 0.1
						}
						GlobalEvents.server.setXP(player1, playerdata.Data.level,playerdata.Data.xp)
						hitHum.TakeDamage(damage)
						Hitbox.Destroy()
					}
				

				}
				
			}
	})

	return Hitbox


}

export function StopAnimation(model: Model, Anim: string) {
	
	let length = 0
	let animation = Animations?.FindFirstChild(Anim) as Animation
	let AnimControl;
	let animator : AnimationTrack;
	let humanoid = model.FindFirstChild("Humanoid") as Humanoid
	AnimControl = humanoid.FindFirstChild("Animator") as Animator
	animator = AnimControl.LoadAnimation(animation)
	AnimControl.GetPlayingAnimationTracks().forEach((test) => {
		if (Anim === test.Name) {
			test.Stop(0.2)
		}
		
	})
}
function anim(animator: AnimationTrack, Anim: string): [ animator: AnimationTrack, length: number] {
	let length = 0

	let animation = Animations?.FindFirstChild(Anim) as Animation
	let keyframes = game.GetService("KeyframeSequenceProvider").GetKeyframeSequenceAsync(animation.AnimationId).GetKeyframes()

	keyframes.forEach((frame) => {
		let time = frame.Time
		if (time > length ) {
			length = time
		}
	})

	animator.Play(0.2, 3)	
	return [animator, length]
}

export function PlayerAnimation(model: Model, Anim: string): [ animator: AnimationTrack, length: number] {
	let humanoid = model.FindFirstChild("Humanoid") as Humanoid
	let AnimControl = humanoid.FindFirstChild("Animator") as Animator
	let animator = AnimControl.LoadAnimation(Animations?.FindFirstChild(Anim) as Animation)
	

	return anim(animator, Anim)
}

export function StandAnimation(model: Model, Anim: string): [ animator: AnimationTrack, length: number] {
	let AnimControl = model.FindFirstChild("AnimControl") as AnimationController
	let animator = AnimControl.LoadAnimation(Animations?.FindFirstChild(Anim) as Animation)

	
	return anim(animator, Anim)
}

export function getMaxXp(x: number): number {
	return (x + 30) * (x / 5)
}


export function nullMove(id: number): Move {
	return {
		id,
		name: "null",
		stamina: 0,
		run: (ctx, done) => {done()},
		
	}
}