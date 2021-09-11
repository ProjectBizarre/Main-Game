import Roact from '@rbxts/roact';
import { PlayerData, Context, TempData, Stand, Move } from "shared/types";
import { getMaxXp } from 'shared/utils'
import Hooks from "@rbxts/roact-hooks";

interface Props {
	maxxp: number
	xp: number
}

const Healthbar: Hooks.FC<Props> = (props) => {

	let xpratio = props.xp / getMaxXp(props.maxxp)
	return (
		<frame
		Transparency={1}
		BackgroundColor3={Color3.fromRGB(0,0,0)}
		Size={new UDim2(1,0,1,36)}
		Position={new UDim2(0.02,0,0.78,-36)}
		ZIndex={1}
		>
			<imagelabel
			BackgroundTransparency={1}
			Image="rbxassetid://7437595525"
			Size={new UDim2(0.25,0,0.25 * xpratio,0)}
			Position={new UDim2(0,0,0.25 - (0.25 * xpratio),0)}
			ZIndex={12}
			ImageRectSize={new Vector2(512, 512 * xpratio)}
			ImageRectOffset={new Vector2(0, 512 - (512 * xpratio))}
			>
				<uiaspectratioconstraint AspectRatio={512 / (512 * xpratio)}></uiaspectratioconstraint>
			</imagelabel>

			<imagelabel
			BackgroundTransparency={1}
			Image="rbxassetid://7437507557"
			Size={new UDim2(0.25,0,0.25,0)}
			ZIndex={10}
			>
				<uiaspectratioconstraint AspectRatio={1}></uiaspectratioconstraint>
			</imagelabel>


			
		</frame>
	);
}



export = new Hooks(Roact) (Healthbar)

