import Roact from '@rbxts/roact';
import Hooks from "@rbxts/roact-hooks";

interface Props {
	player: Player
}

const Healthbar: Hooks.FC<Props> = (props) => {
	let Humanoid = props.player.Character?.FindFirstChild("Humanoid") as Humanoid
	let Size: UDim2;
	if (Humanoid !== undefined) {
		Size = new UDim2((Humanoid.Health / Humanoid.MaxHealth) / 4,0,0.02,0)
	} else {
		Size = new UDim2(1,0,0.02,0)
	}
	return (
		<frame
		Transparency={1}
		BackgroundColor3={Color3.fromRGB(0,0,0)}
		Size={new UDim2(1,0,1,36)}
		Position={new UDim2(0.115,0,0.94,-36)}
		ZIndex={1}
		>
			<textlabel
			Text=""
			BackgroundColor3={Color3.fromRGB(209,61,61)}
			BorderSizePixel={0}
			Size={Size}
			ZIndex={2}
			>
				<uicorner></uicorner>
			</textlabel>

			<textlabel
			Text=""
			BackgroundColor3={Color3.fromRGB(48,48,48)}
			ZIndex={1}
			Position={new UDim2(-0.005, 0, -0.005 ,0)}
			Size={new UDim2((1 / 4) + 0.01,0,0.03,0)}><uicorner></uicorner>
			</textlabel>
			
		</frame>
	);
}



export = new Hooks(Roact) (Healthbar)

