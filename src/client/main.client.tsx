import { Events } from "./network/events";
import { Players, UserInputService, ReplicatedStorage } from "@rbxts/services";
import { PlayerData, Context, TempData, Stand, Move } from "shared/types";
import { Client } from "shared/stand";
const player = Players.LocalPlayer;
Client.TempData = {
	combo: [],
	debounce: false,
	player,
	stamina: 100,
	lastattack: 0,
	isblocking: false,
	blocktime: 0,	
	lastdamage: 0
}
Events.connect("setData", (data, data2) => {
	Client.LocalData = data
	Client.TempData = data2
	
})
Client.init()
import Flipper from "@rbxts/flipper"
import Healthbar from "./gui/healthbar"
import Roact from '@rbxts/roact';
import Staminabar from "./gui/staminabar";
import Leveling from "./gui/leveling";
import { getMaxXp } from "shared/utils";





player.GetMouse();




Events.connect("NumericDisplay", (root, num, numtype) => {
	let testdamage = root.FindFirstChild("Damage") as BillboardGui
	let damager = ReplicatedStorage.FindFirstChild("Damage")?.Clone() as BillboardGui
	let text = damager.FindFirstChild("TextLabel") as TextLabel
	text.Text = tostring(num)
	damager.Parent = root
	if (math.random(0,1) === 1) {
		damager.ExtentsOffset = new Vector3(2, 1, 0)
	} else {
		damager.ExtentsOffset = new Vector3(5, 1, 0)
	}
	damager.StudsOffsetWorldSpace = new Vector3(math.random() * 2.5,math.random() * 1,math.random() * 2.5)
	if (testdamage !== undefined) {
		let newtext = testdamage.FindFirstChild("TextLabel") as TextLabel
		let newnum = tonumber(newtext.Text) as number
		text.Text = tostring(newnum + num)
		testdamage.Destroy()
	}
	for (let i = 1; i > 0; i -= 0.1) {
		text.TextTransparency = i
		text.TextStrokeTransparency = i
		wait(0.003)
	}

	wait (1)

	for (let i = 1; i > 0; i -= 0.1) {
		text.TextTransparency = 1 - i
		text.TextStrokeTransparency = 1 - i
		wait(0.04)
	}
	damager.Destroy()
})

player.GetMouse().Button1Down.Connect(() => {
	if (!Client.TempData.debounce) Client.StandMove(1)
});


UserInputService.InputEnded.Connect((input, isTyping) => {
	if (isTyping) return;

	switch (input.KeyCode) {
		case Enum.KeyCode.F:
			if (!Client.TempData.debounce) Events.isBlocking(false)
			break
	}
});

UserInputService.InputBegan.Connect((input, isTyping) => {
	if (isTyping) return;
	switch (input.KeyCode) {
		case Enum.KeyCode.Q:
			Client.SummonStand()
			break;
		case Enum.KeyCode.E:
			if (!Client.TempData.debounce) Client.StandMove(2)
			break
		case Enum.KeyCode.R:
			if (!Client.TempData.debounce) Client.StandMove(3)
			break
		case Enum.KeyCode.F:
			if (!Client.TempData.debounce) Events.isBlocking(true)
			break
		case Enum.KeyCode.LeftControl:

			let humanoid = player.Character?.FindFirstChild("Humanoid") as Humanoid
			if (humanoid !== undefined) {
				if (humanoid.WalkSpeed === 25) {
					humanoid.WalkSpeed = 16
				} else if (humanoid.WalkSpeed >= 16){
					humanoid.WalkSpeed = 25
				}
			}
			
	}
});

let motor = new Flipper.SingleMotor(Client.TempData.stamina)
motor.onStep((number) => {
	Client.TempData.stamina = number
})



function tree() {
	return (
		<screengui >
			<Healthbar player={player}/>
			<Staminabar stamina={Client.TempData.stamina} />
			<Leveling maxxp={Client.LocalData.Data.level} xp={Client.LocalData.Data.xp}/>
		</screengui>
	)
}

let GUI: Roact.Tree | undefined = undefined;
player.CharacterAdded.Connect((char) => {
	GUI = Roact.mount(tree(), Players.LocalPlayer.FindFirstChildOfClass("PlayerGui"), "test");
})

Events.connect("setStamina",(stamina) => {

	motor.setGoal(new Flipper.Linear(stamina, { velocity: Client.TempData.stamina * 2}))
})

Events.connect("setXP",(level, xp) => {
	Client.LocalData.Data.xp = xp
	Client.LocalData.Data.level = level
})
while (true) {
	wait(0.005)
	if (GUI !== undefined) {
		Roact.update(GUI, tree())
	}
	
}