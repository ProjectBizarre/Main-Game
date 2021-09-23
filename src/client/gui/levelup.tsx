import Roact from '@rbxts/roact';
import { PlayerData, Context, TempData, Stand, Move } from "shared/types";
import { getMaxXp } from 'shared/utils'
import Hooks from "@rbxts/roact-hooks";
import Flipper from "@rbxts/flipper"

interface Props {
	level: number
}

const Levelup: Hooks.FC<Props> = (props, { useState, useEffect }) => {
	let [Size, setSize] = useState(0)
	let motor = new Flipper.SingleMotor(0)
	motor.onStep(setSize)


	useEffect(() => {
		motor.setGoal(new Flipper.Linear(80, {velocity: 280}))
	}, [])

	return (
		<frame
		AnchorPoint={new Vector2(0.5,0.5)}
		Size={new UDim2(0.2, 0, 0.2 ,0)}
		Position={new UDim2(0.5, 0, 0.3 ,0)}
		Transparency={1}
		>

			<textlabel
				Size={new UDim2(1, 0, 1 ,0)}
				TextSize={Size}
				Font={Enum.Font.GothamSemibold}
				BackgroundTransparency={1}
				Transparency={1 - (Size / 20)}
				Text="Level Up!"
				TextStrokeTransparency={0}
				TextStrokeColor3={Color3.fromRGB(184,245,168)}
				TextColor3={Color3.fromRGB(247,255,245)}
				
			>

			</textlabel>

			
		</frame>
	);
}



export = new Hooks(Roact) (Levelup)

