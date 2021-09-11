import { GlobalEvents } from "./networking";
import { StandsList } from "./stands/index";
import { ReplicatedStorage, Players, TweenService } from "@rbxts/services"
import { StandList, Animations } from "./files";
import { StandAnimation,PlayerAnimation, StopAnimation } from "./utils";
import { PlayerData, Context, TempData, Stand, Move } from "./types";
import Data from "./data"
import data from "./data";



function generateContext(data: PlayerData): Context | undefined {
	const Character = data.player.Character;
	const tempData = Data.Server.TempData[data.player.UserId]
	if (Character === undefined) return;
	const Humanoid = Character.FindFirstChild("Humanoid") as Humanoid;
	if (Humanoid === undefined) return;
	const root = Humanoid.RootPart as BasePart;
	const Stand = Character.FindFirstChild("PlayerStand") as Model;
	if (Stand === undefined) return;
	const ctx: Context = {
		Character,
		Humanoid,
		root,
		Stand,
		data,
		tempData,


	};
	return ctx
}


export class Server {




	public static init() {
		Players.PlayerAdded.Connect((player) => {
			Data.Server.Data[player.UserId] = {
				Stand: {
					id: "star_platinum",
					isActive: false,
					debounce: false,
					cooldown: {}
				},
				Data: {
					level: 1,
					xp: 0	
				},
				player
			}


			Data.Server.TempData[player.UserId] = {
				combo: [],
				debounce: false,
				player,
				stamina: 100,
				lastattack: 0,
				isblocking: false,
				blocktime: 0,
				lastdamage: 0,
			}
			GlobalEvents.server.setData(player, Data.Server.Data[player.UserId], Data.Server.TempData[player.UserId])
			player.CharacterAdded.Connect((char) => {
				wait(0.2)
				let human = char.FindFirstChild("Humanoid") as Humanoid
				human.MaxHealth = 300
				human.Health = 300
				let animate = char.WaitForChild("Animate")
				//@ts-ignore
				//animate.FindFirstChild("run").FindFirstChild("RunAnim").AnimationId = "rbxassetid://7413929646"
				//@ts-ignore
				//animate.FindFirstChild("walk").FindFirstChild("WalkAnim").AnimationId = "rbxassetid://7413929646"
			})

		})


		Players.PlayerRemoving.Connect((player) => {
			delete Data.Server.Data[player.UserId]
		})

		GlobalEvents.server.connect("isBlocking", (player: Player, block: boolean) => {
			
			if (block === true && tick() >= (Data.Server.TempData[player.UserId].blocktime + 3)) {
				Data.Server.TempData[player.UserId].isblocking = true
				PlayerAnimation(player.Character as Model, "Player_Block")
				Data.Server.TempData[player.UserId].blocktime = tick()
				
			} else {
				Data.Server.TempData[player.UserId].isblocking = false
				StopAnimation(player.Character as Model, "Player_Block")
				
			}
			
		})
	}


	public static SummonStand(player: Player, isActive: Boolean) {
		let Character = player.Character
		let Humanoid = Character?.FindFirstChild("Humanoid") as Humanoid
		let root = Humanoid.RootPart as Part
		Data.Server.Data[player.UserId].Stand.isActive = isActive as boolean
		if (isActive) {
			
			
			let Stand = StandList.FindFirstChild(Data.Server.Data[player.UserId].Stand.id)?.Clone() as Model
			Stand.Name = "PlayerStand"
			let AnimControl = Stand.FindFirstChild("AnimControl") as AnimationController
			if (Stand !== undefined && Stand.PrimaryPart !== undefined) {
	
				Stand.Parent = Character
				Stand.PrimaryPart.CFrame = root.CFrame
	
				let weld = new Instance("ManualWeld")
				weld.Name = "StandWeld"
				weld.Part0 = Stand.PrimaryPart
				weld.Part1 = root
				weld.C0 = weld.Part0.CFrame.ToObjectSpace(weld.Part1.CFrame)
				weld.Parent = weld.Part0
	
	
				
				let idle = AnimControl.LoadAnimation(Animations?.FindFirstChild("Idle") as Animation)
				idle.Play()
	
				let goal = {
					"C0": weld.Part0.CFrame.ToObjectSpace(weld.Part1.CFrame),
					"C1": weld.Part0.CFrame.ToObjectSpace(weld.Part1.CFrame.mul(new CFrame(-3,1,2)))
				}
				let info = new TweenInfo(.5)
				
				let tween = TweenService.Create(weld, info, goal)
				tween.Play()
				for (let i = 1; i > 0; i -= 0.1) {
					Stand.GetDescendants().forEach((part: Instance) => {
						if (part.Name === "HumanoidRootPart") return
						if (part.IsA("BasePart")) {
							let part2 = part as Part
							part2.Transparency = i
						}
	
					})
					wait(0.02)
				}
	
	
			}
		} else {
	
			let Stand = Character?.FindFirstChild("PlayerStand") as Model
	
			if (Stand !== undefined && Stand.PrimaryPart !== undefined) {
				let goal = {
					"C0": Stand.PrimaryPart.CFrame.ToObjectSpace(root.CFrame),
					"C1": Stand.PrimaryPart.CFrame.ToObjectSpace(root.CFrame.mul(new CFrame(0,0,0)))
				}
				let info = new TweenInfo(.5)
				let tween = TweenService.Create(Stand.PrimaryPart.FindFirstChild("StandWeld") as ManualWeld, info, goal)
				tween.Play()
				tween.Completed.Connect(() => {
					Stand.Destroy()
				})
				for (let i = 0; i < 1; i += 0.1) {
					Stand.GetDescendants().forEach((part: Instance) => {
	
						if (part.Name === "HumanoidRootPart") return
						if (part.IsA("BasePart")) {
							let part2 = part as Part
							part2.Transparency = i
						}
					})
					wait(0.02)
				}
	
			}
	
	
		}		
	}

	public static StandMove(player: Player, MoveID: number) {
		let ctx = generateContext(Data.Server.Data[player.UserId]) as Context
		
		if (ctx?.data.Stand.isActive) {
			if (ctx === undefined) {
				GlobalEvents.server.StandMoveReady(player, MoveID, false, []) 
				return
			} else if (ctx !== undefined) {
				if (ctx?.tempData.stamina >= StandsList[ctx.data.Stand.id].moveSet[MoveID].stamina && tick() >= ctx.tempData.lastdamage + 0.1 ) {
					ctx.tempData.stamina -= StandsList[ctx.data.Stand.id].moveSet[MoveID].stamina
					ctx.tempData.lastattack = tick()
					GlobalEvents.server.setStamina(player, ctx.tempData.stamina)
					StandsList[ctx.data.Stand.id].moveSet[MoveID].run(ctx, (debounce?: Boolean) => {
						ctx.tempData.debounce = debounce as boolean
						GlobalEvents.server.StandMoveReady(player, MoveID, debounce ?? false, ctx?.tempData.combo as string[])
						if (debounce === true) {
							wait(1.1)
							GlobalEvents.server.StandMoveReady(player, MoveID, false, ctx?.tempData.combo as string[])
						}
					})
				} else {
					GlobalEvents.server.StandMoveReady(player, MoveID, false, ctx?.tempData.combo as string[])
				}
			}


		} else {
			StandsList[ctx.data.Stand.id].moveSet[MoveID].run(ctx, (debounce?: Boolean) => {
				ctx.tempData.debounce = debounce as boolean
				GlobalEvents.server.StandMoveReady(player, MoveID, debounce ?? false, ctx?.tempData.combo as string[])
				if (debounce === true) {
					wait(1.1)
					GlobalEvents.server.StandMoveReady(player, MoveID, false, ctx?.tempData.combo as string[])
				}
			})			
		}
		

	}

}

export class Client {

	public static LocalData: PlayerData;
	public static TempData: TempData

	public static init() {
		GlobalEvents.client.connect("StandMoveReady", (MoveID, attackdebounce, combo) => {
			this.LocalData.Stand.cooldown[MoveID] = false
			this.TempData.debounce = attackdebounce
			this.TempData.combo = combo
			
		})


	}

	public static StandMove(MoveID: number) {
		const Stand = StandsList[this.LocalData.Stand.id];
		const Move = Stand.moveSet[MoveID];
		if (Client.LocalData.Stand.cooldown[MoveID] !== true) {
			Client.LocalData.Stand.cooldown[MoveID] = true;
			GlobalEvents.client.StandMove(MoveID);
		}
	}
	public static SummonStand() {
		if (Client.LocalData.Stand.debounce === false && Client.LocalData.Stand.isActive === false) {
			Client.LocalData.Stand.isActive = true;
			Client.LocalData.Stand.debounce = true;

			GlobalEvents.client.SummonStand(Client.LocalData.Stand.isActive);

			wait(2);
			Client.LocalData.Stand.debounce = false;
		} else if (Client.LocalData.Stand.debounce === false && Client.LocalData.Stand.isActive === true) {
			Client.LocalData.Stand.isActive = false;
			Client.LocalData.Stand.debounce = true;

			GlobalEvents.client.SummonStand(Client.LocalData.Stand.isActive);

			wait(2);
			Client.LocalData.Stand.debounce = false;
		}
	}
}
