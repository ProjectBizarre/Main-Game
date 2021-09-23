import Roact from '@rbxts/roact';
import Hooks from "@rbxts/roact-hooks";

interface Props {
	player: Player
}

const Healthbar: Hooks.FC<Props> = (props) => {
	let Humanoid = props.player.Character?.FindFirstChild("Humanoid") as Humanoid
	let Size: UDim2;
	if (Humanoid !== undefined) {
		Size = new UDim2((Humanoid.Health / Humanoid.MaxHealth),0,0.076,0)
	} else {
		Size = new UDim2(1,0,0.02,0)
	}
	return (
		<frame
		Position={new UDim2(0.327, 0, 0.50 ,0)}
		Size={new UDim2(1, 0, 1 ,0)}
		Transparency={1}
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
			BackgroundColor3={Color3.fromRGB(110,64,64)}
			ZIndex={1}
			Size={new UDim2(1,0,0.076,0)}><uicorner></uicorner>
			</textlabel>
			
		</frame>
	);
}



export = new Hooks(Roact) (Healthbar)

