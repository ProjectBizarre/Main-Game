import Roact from '@rbxts/roact';
import { PlayerData, Context, TempData, Stand, Move } from "shared/types";
import Hooks from "@rbxts/roact-hooks";

interface Props {
	stamina: number
}

const Healthbar: Hooks.FC<Props> = (props) => {
	let Size: UDim2;
	if (props.stamina !== undefined) {
		Size = new UDim2((props.stamina / 200),0,0.076,0)
	} else {
		Size = new UDim2(1,0,0.02,0)
	}
	return (
		<frame
		Position={new UDim2(0.327, 0, 0.585 ,0)}
		Size={new UDim2(1, 0, 1 ,0)}
		Transparency={1}
		>
			<textlabel
			Text=""
			BackgroundColor3={Color3.fromRGB(232,153,79)}
			BorderSizePixel={0}
			Size={Size}
			ZIndex={3}
			>
				<uicorner></uicorner>
			</textlabel>


			<textlabel
			Text=""
			BackgroundColor3={Color3.fromRGB(102,79,59)}
			ZIndex={1}
			Size={new UDim2(1,0,0.076,0)}><uicorner></uicorner>
			</textlabel>
			
		</frame>
	);
}



export = new Hooks(Roact) (Healthbar)

