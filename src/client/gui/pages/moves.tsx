import Roact, {Portal} from '@rbxts/roact';
import Hooks from "@rbxts/roact-hooks";
import Flipper from "@rbxts/flipper"
import MoveBox from "../components/move"
import Move from '../components/move';
import { Client } from 'shared/stand';
import { StandsList } from 'shared/stands';



interface Props {
	player: Player
}

const Menu: Hooks.FC<Props> = (props, { useState, useEffect }) => {
	
	let Stand = StandsList[Client.LocalData.Stand.id]
	let index = 0

	return (
		<scrollingframe
		Transparency={1}
		Size={new UDim2(1,0,1,0)}
		Position={new UDim2(0,0,0,0)}
		CanvasSize={new UDim2(0,0,2.5,0)}
		BorderSizePixel={0}
		>
			<textlabel
				AnchorPoint={new Vector2(0.5,0.5)}
				TextXAlignment={Enum.TextXAlignment.Right}
				TextYAlignment={Enum.TextYAlignment.Top}
				Text={`<b>Stand Moves</b>`}
				TextColor3={Color3.fromRGB(227,227,227)}
				TextSize={25}
				Font={Enum.Font.Gotham}
				TextWrapped={true}
				RichText={true}
				Size={new UDim2(0.25,0,0.15,0)}
				Position={new UDim2(0.05, 0, 0.1,0)}
				BackgroundTransparency={1}
			></textlabel>
			{new Array<Roact.Element>(7, (<frame />)).map((val, i) => {
				let move = Stand.moveSet[i]
				if (Stand.standless) {
					move = Stand.meleeMoveSet[i]
				}			
				if (move !== undefined) {
					print(index)
					index += 1
					return <Move Index={index - 1} Name={move.name} InputKey={move.key} Description={move.description} Stamina={move.stamina}/>
				}
				return <> </>

			})}


		</scrollingframe>
	
	);
}



export = new Hooks(Roact) (Menu)

