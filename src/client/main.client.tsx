import { Events } from "./network/events";
import { Players, UserInputService, ReplicatedStorage } from "@rbxts/services";
import { PlayerData, Context, TempData, Stand, Move } from "shared/types";
import { Client } from "shared/stand";
import { PlayerAnimation } from "shared/utils"
const player = Players.LocalPlayer;
Client.TempData = {
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
	meleecooldown: [],
	cooldown: [],
	camera: true,
}
Events.connect("setData", (data, data2) => {
	Client.LocalData = data
	Client.TempData = data2
	
})

game.GetService("StarterGui").SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false)
game.GetService("StarterGui").SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false)

Client.init()
import Flipper from "@rbxts/flipper"
import Healthbar from "./gui/healthbar"
import Roact from '@rbxts/roact';
import Staminabar from "./gui/staminabar";
import Leveling from "./gui/leveling";
import Levelup from "./gui/levelup";
import Menu from "./gui/menu";
import { getMaxXp } from "shared/utils";




let lastjump: number = 0;
let defjumpheight: number = 4
let Cam = game.GetService("Workspace").CurrentCamera
let menuopen = false;


player.GetMouse();


player.CharacterAdded.Connect((char) => {
	let humanoid = char.WaitForChild("Humanoid") as Humanoid
	humanoid.JumpHeight = defjumpheight

	humanoid.Jumping.Connect((active) => {
		if (active !== true) return
		if (tick() >= lastjump + 0.6) {
			humanoid.JumpHeight = defjumpheight
			lastjump = tick()
				
		} else {
			humanoid.JumpHeight = 0
			wait(0.6)
			humanoid.JumpHeight = defjumpheight

		}
	})
})


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
	
	if (input.UserInputType === Enum.UserInputType.MouseButton1) {
		if (!menuopen) if (!Client.TempData.debounce) Client.StandMove(1)
	}
	let humanoid = player.Character?.FindFirstChild("Humanoid") as Humanoid
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

			if (humanoid !== undefined) {
				Events.RequestRun()
			}
			break
		case Enum.KeyCode.Tab:
			openmenu()
			break
		case Enum.KeyCode.M:
			openmenu()
			break
	}
});

function openmenu() {
	if (menuopen) {
		menuopen = false
		if (menu) Roact.unmount(menu)
		Blur?.Destroy()
		Client.TempData.camera = true
		let humanoid = player.Character?.FindFirstChild("Humanoid") as Humanoid
		humanoid.WalkSpeed = lastspeed
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter
	} else {
		menuopen = true
		Blur = new Instance("BlurEffect")
		Blur.Parent = game.GetService("Lighting")
		Client.TempData.camera = false
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default
		let humanoid = player.Character?.FindFirstChild("Humanoid") as Humanoid
		lastspeed = humanoid.WalkSpeed
		humanoid.WalkSpeed = 0
		menu = Roact.mount((
			<screengui>
				<Menu/>
			</screengui>
		), Players.LocalPlayer.FindFirstChildOfClass("PlayerGui"), "Menu")
	}
}

let motor = new Flipper.SingleMotor(Client.TempData.stamina)
let menu: Roact.Tree | undefined;
let Blur: BlurEffect | undefined;
let lastspeed: number = 0;

motor.onStep((number) => {
	Client.TempData.stamina = number
})



function tree() {
	if (!menuopen) {
		return (
			<screengui >
				<frame
				Position={new UDim2(0.02, 0, 0.76 ,0)}
				Size={new UDim2(0.30, 0, 0.20 ,0)}
				Transparency={1}
				>
					<Healthbar player={player}/>
					<Staminabar stamina={Client.TempData.stamina} />
					<Leveling maxxp={Client.LocalData.Data.level} xp={Client.LocalData.Data.xp}/>
					<uiaspectratioconstraint AspectRatio={0.6 / 0.2}></uiaspectratioconstraint>
				</frame>
			</screengui>
		)
	}
	return (<> </>)
}

let GUI: Roact.Tree | undefined = undefined;
player.CharacterAdded.Connect((char) => {
	GUI = Roact.mount(tree(), Players.LocalPlayer.FindFirstChildOfClass("PlayerGui"), "test");
})

Events.connect("setStamina",(stamina) => {

	motor.setGoal(new Flipper.Linear(stamina, { velocity: Client.TempData.stamina * 2}))
})

Events.connect("LevelUp", () => {
	let LevelupGUI: Roact.Tree = Roact.mount((
		<screengui>
			<Levelup/>
		</screengui>
	), Players.LocalPlayer.FindFirstChildOfClass("PlayerGui"), "Levelup");
	wait(1)
	Roact.unmount(LevelupGUI)
	
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