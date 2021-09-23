import { GlobalEvents } from "./networking";
import { StandsList } from "./stands/index";
import { ReplicatedStorage, Players, TweenService } from "@rbxts/services"
import { StandList, Animations } from "./files";
import { StandAnimation,PlayerAnimation, StopAnimation } from "./utils";
import { PlayerData, Context, TempData, Stand, Move, Item, ItemSlot, Inventory, ItemSlotI, ItemI } from "./types";
import Data from "./data"
import data from "./data";
import Items from "./items"



function generateContext(data: PlayerData): Context | undefined {
	const Character = data.player.Character;
	const tempData = Data.Server.TempData[data.player.UserId]
	if (Character === undefined) return;
	const Humanoid = Character.FindFirstChild("Humanoid") as Humanoid;
	if (Humanoid === undefined) return;
	const root = Humanoid.RootPart as BasePart;
	let Stand = Character.FindFirstChild("PlayerStand") as Model;
	if (Stand === undefined) Stand = new Instance("Model");
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
				},
				Data: {
					level: 1,
					xp: 0	
				},
				player,
				Inventory: new Inventory()
			}
			Data.Server.Data[player.UserId].Inventory["1"] = ItemSlot(Items[1], 20)

			Data.Server.TempData[player.UserId] = {
				combo: [],
				debounce: false,
				player,
				stamina: 100,
				lastattack: 0,
				isblocking: false,
				blocktime: 0,
				lastdamage: 0,
				standIsActive: false,
				standDebounce: false,
				cooldown: {},
				meleecooldown: {},
				camera: true,
			}
			GlobalEvents.server.setData(player, Data.Server.Data[player.UserId], Data.Server.TempData[player.UserId])
			player.CharacterAdded.Connect((char) => {
				wait(0.2)
				let human = char.FindFirstChild("Humanoid") as Humanoid
				human.MaxHealth = 300
				human.Health = 300
				human.WalkSpeed = 13
				//@ts-expect-error
				human.FindFirstChild("BodyHeightScale").Value = 0.95
				//@ts-expect-error
				human.FindFirstChild("BodyProportionScale").Value = 0.35
				//@ts-expect-error
				human.FindFirstChild("BodyTypeScale").Value = 0.1
				//@ts-expect-error
				human.FindFirstChild("HeadScale").Value = 3
				//@ts-expect-error
				human.FindFirstChild("BodyWidthScale").Value = 0.95
				//@ts-expect-error
				human.FindFirstChild("BodyDepthScale").Value = 0.95
				let animate = char.WaitForChild("Animate")
				let stand = StandsList[Data.Server.Data[player.UserId].Stand.id]
				//@ts-ignore
				animate.FindFirstChild("run").FindFirstChild("RunAnim").AnimationId = "rbxassetid://7485388305"			
				//@ts-ignore
				animate.FindFirstChild("walk").FindFirstChild("WalkAnim").AnimationId = "rbxassetid://7485388305"
				if (stand.animations.idle !== undefined) {
					//@ts-ignore
					animate.FindFirstChild("idle").FindFirstChild("Animation1").AnimationId = "rbxassetid://" + stand.animations.idle
					//@ts-ignore
					animate.FindFirstChild("idle").FindFirstChild("Animation2").AnimationId = "rbxassetid://" + stand.animations.idle
				}

			})

			game.GetService("RunService").Heartbeat.Connect(() => {
				Players.GetPlayers().forEach((player: Player) => {
					let root = player.Character?.FindFirstChild("HumanoidRootPart") as BasePart
				})
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

		GlobalEvents.server.connect("swapSlot", (player: Player, num1: number, num2: number) => {
			if (num1 === num2) {
				GlobalEvents.server.setInventory(player, Data.Server.Data[player.UserId].Inventory, true)

			} else {
				if (Data.Server.Data[player.UserId].Inventory[tostring(num2)] === undefined) {
					Data.Server.Data[player.UserId].Inventory[tostring(num2)] = Data.Server.Data[player.UserId].Inventory[tostring(num1)]
					delete Data.Server.Data[player.UserId].Inventory[tostring(num1)]
					GlobalEvents.server.setInventory(player, Data.Server.Data[player.UserId].Inventory, true)
				} else {
					//@ts-expect-error
					Data.Server.Data[player.UserId].Inventory[tostring(num2)]?.Amount += Data.Server.Data[player.UserId].Inventory[tostring(num1)]?.Amount
					delete Data.Server.Data[player.UserId].Inventory[tostring(num1)]
					GlobalEvents.server.setInventory(player, Data.Server.Data[player.UserId].Inventory, true)					
				}
			}

		})

		GlobalEvents.server.connect("halfSlot", (player: Player, num1: number, num2: number) => {
			if (num1 === num2) {
				GlobalEvents.server.setInventory(player, Data.Server.Data[player.UserId].Inventory, false)

			} else if (Data.Server.Data[player.UserId].Inventory[tostring(num2)] === undefined){
				let item = Data.Server.Data[player.UserId].Inventory[tostring(num1)] 
				if (item) {
					if ((item.Amount / 2) === math.floor(item.Amount / 2) && item.Amount > 1) {
						let iclone2: ItemSlotI = { Item: { Description: item.Item.Description, ID: item.Item.ID, Model: item.Item.Model, Name: item.Item.Name, Texture: item.Item.Texture, use: item.Item.use, }, Amount: item.Amount / 2} 
						let iclone: ItemSlotI = { Item: { Description: item.Item.Description, ID: item.Item.ID, Model: item.Item.Model, Name: item.Item.Name, Texture: item.Item.Texture, use: item.Item.use, }, Amount: item.Amount / 2} 
						Data.Server.Data[player.UserId].Inventory[tostring(num2)] = iclone
						Data.Server.Data[player.UserId].Inventory[tostring(num1)] = iclone2
						GlobalEvents.server.setInventory(player, Data.Server.Data[player.UserId].Inventory, false)
					} else if (item.Amount > 1){
						let iclone2: ItemSlotI = { Item: { Description: item.Item.Description, ID: item.Item.ID, Model: item.Item.Model, Name: item.Item.Name, Texture: item.Item.Texture, use: item.Item.use, }, Amount: math.floor(item.Amount / 2) + 1} 
						let iclone: ItemSlotI = { Item: { Description: item.Item.Description, ID: item.Item.ID, Model: item.Item.Model, Name: item.Item.Name, Texture: item.Item.Texture, use: item.Item.use, }, Amount: math.floor(item.Amount / 2)} 
						Data.Server.Data[player.UserId].Inventory[tostring(num2)] = iclone
						Data.Server.Data[player.UserId].Inventory[tostring(num1)] = iclone2
						GlobalEvents.server.setInventory(player, Data.Server.Data[player.UserId].Inventory, false)
					}

				}

			}

		})

		GlobalEvents.server.connect("RequestRun", (player: Player) => {
			let Character = player.Character as Model
			let Humanoid = Character?.FindFirstChild("Humanoid") as Humanoid
			let animate = Character.WaitForChild("Animate") as Animator
			//7500387095
			if (Humanoid.WalkSpeed >= 20) {
				
				//@ts-ignore
				animate.FindFirstChild("run").FindFirstChild("RunAnim").AnimationId = "rbxassetid://7485388305"			
				//@ts-ignore
				animate.FindFirstChild("walk").FindFirstChild("WalkAnim").AnimationId = "rbxassetid://7485388305"
				Humanoid.WalkSpeed = 13

			} else {
				
				//@ts-ignore
				animate.FindFirstChild("run").FindFirstChild("RunAnim").AnimationId = "rbxassetid://7500387095"			
				//@ts-ignore
				animate.FindFirstChild("walk").FindFirstChild("WalkAnim").AnimationId = "rbxassetid://7500387095"
				Humanoid.WalkSpeed = 20
			}
			
			
		})
	}


	public static SummonStand(player: Player, isActive: Boolean) {
		
		let Character = player.Character
		let Humanoid = Character?.FindFirstChild("Humanoid") as Humanoid
		let root = Humanoid.RootPart as Part
		Data.Server.TempData[player.UserId].standIsActive = isActive as boolean
		if (!StandsList[Data.Server.Data[player.UserId].Stand.id].standless) {
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
	}

	public static StandMove(player: Player, MoveID: number) {
		let ctx = generateContext(Data.Server.Data[player.UserId]) as Context
		if (!ctx) {
			GlobalEvents.server.StandMoveReady(player, MoveID, false, []) 
			return
		} else if (ctx) {
			if (ctx?.tempData.standIsActive) {

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


			} else {

				if (ctx?.tempData.stamina >= StandsList[ctx.data.Stand.id].meleeMoveSet[MoveID].stamina && tick() >= ctx.tempData.lastdamage + 0.1 ) {
					ctx.tempData.stamina -= StandsList[ctx.data.Stand.id].meleeMoveSet[MoveID].stamina
					ctx.tempData.lastattack = tick()
					GlobalEvents.server.setStamina(player, ctx.tempData.stamina)
					StandsList[ctx.data.Stand.id].meleeMoveSet[MoveID].run(ctx, (debounce?: Boolean) => {
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
			
			
		}

	}


}

export class Client {

	public static LocalData: PlayerData;
	public static TempData: TempData

	public static init() {
		GlobalEvents.client.connect("StandMoveReady", (MoveID, attackdebounce, combo) => {
			this.TempData.cooldown[MoveID] = false
			this.TempData.meleecooldown[MoveID] = false
			this.TempData.debounce = attackdebounce
			this.TempData.combo = combo
			
		})


	}

	public static StandMove(MoveID: number) {
		const Stand = StandsList[this.LocalData.Stand.id];
		const Move = Stand.moveSet[MoveID];
		if (Client.TempData.standIsActive === true) {
			if (Client.TempData.cooldown[MoveID] !== true) {
				Client.TempData.cooldown[MoveID] = true;
				GlobalEvents.client.StandMove(MoveID);
			}
		} else {
			if (Client.TempData.meleecooldown[MoveID] !== true) {
				Client.TempData.meleecooldown[MoveID] = true;
				GlobalEvents.client.StandMove(MoveID);
			}
		}
	}
	public static SummonStand() {
		if (StandsList[Client.LocalData.Stand.id].standless === true ) return
		if (Client.TempData.standDebounce === false && Client.TempData.standIsActive === false) {
			Client.TempData.standIsActive = true;
			Client.TempData.standDebounce = true;

			GlobalEvents.client.SummonStand(Client.TempData.standIsActive);

			wait(2);
			Client.TempData.standDebounce = false;
		} else if (Client.TempData.standDebounce === false && Client.TempData.standIsActive === true) {
			Client.TempData.standIsActive = false;
			Client.TempData.standDebounce = true;

			GlobalEvents.client.SummonStand(Client.TempData.standIsActive);

			wait(2);
			Client.TempData.standDebounce = false;
		}
	}
}
