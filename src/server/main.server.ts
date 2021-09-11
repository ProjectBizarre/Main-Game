import { Events } from "./network/events"
import { Server } from "shared/stand";
import Data from "shared/data";
import { ReplicatedStorage, TweenService, Players } from "@rbxts/services"
import { StopAnimation } from "shared/utils";
Server.init()
let StandList = ReplicatedStorage.WaitForChild("Stands")
let Animations = StandList.FindFirstChild("Animations")


Events.connect("StandMove", (player, MoveID) => {
	Server.StandMove(player, MoveID)
})


Events.connect("SummonStand", (player, isActive) => {
	Server.SummonStand(player, isActive)


})

while (true) {
	wait(0.01)
	Players.GetPlayers().forEach((player: Player) => {
		let playerdata = Data.Server.TempData[player.UserId]
		
		if (tick() - playerdata.lastattack >= 3 && playerdata.isblocking !== true) {
			if (playerdata.stamina + 23 >= 100) {
				if (playerdata.stamina + 1 >= 200 && playerdata.stamina !== 200) {
					playerdata.stamina = 200
					Events.setStamina(player, 200)					
				}
				playerdata.stamina += 0.1
				Events.setStamina(player, playerdata.stamina + 0.1)
			} else {
				playerdata.stamina = playerdata.stamina + 23
				Events.setStamina(player, playerdata.stamina + 23)
			}

		} else if (playerdata.isblocking === true) {
			if (playerdata.stamina - 1 <= 0) {
				playerdata.isblocking = false
				playerdata.blocktime = tick()
				StopAnimation(player.Character as Model, "Player_Block")
				
			}
			playerdata.stamina = playerdata.stamina - 0.6
			Events.setStamina(player, playerdata.stamina - 0.6)			
		}
 
	})
}