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
		Position={new UDim2(0, 0, -0.01 ,0)}
		Size={new UDim2(1.1, 0, 1.1 ,0)}
		Transparency={1}
		>

			<imagelabel
			BackgroundTransparency={1}
			Image="rbxassetid://7502265478"
			Size={new UDim2(1,0,1 * xpratio,0)}
			Position={new UDim2(0,0,1 - (1 * xpratio),0)}
			ZIndex={12}
			ImageRectSize={new Vector2(512, 512 * xpratio)}
			ImageRectOffset={new Vector2(0, 512 - (512 * xpratio))}
			>
				<uiaspectratioconstraint AspectRatio={512 / (512 * xpratio)}></uiaspectratioconstraint>
			</imagelabel>
			<imagelabel
			BackgroundTransparency={1}
			Image="rbxassetid://7502265368"
			Size={new UDim2(1,0,1,0)}
			ZIndex={10}
			>
							
				<uiaspectratioconstraint AspectRatio={1}></uiaspectratioconstraint>
			</imagelabel>


			
		</frame>
	);
}



export = new Hooks(Roact) (Healthbar)

