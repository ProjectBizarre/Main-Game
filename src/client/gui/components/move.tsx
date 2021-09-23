import Roact, {Portal} from '@rbxts/roact';
import Hooks from "@rbxts/roact-hooks";
import Flipper from "@rbxts/flipper"
import MoveBox from "../components/move"



interface Props {
	Name: string
	InputKey: string
	Description: string
	Stamina: number
	Index: number

}

const Menu: Hooks.FC<Props> = (props, { useState, useEffect }) => {
	
	

	return (
		<frame
		BackgroundColor3={Color3.fromRGB(10,10,10)}
		BorderSizePixel={0}
		Transparency={0.9}
		Size={new UDim2(0.45,0,0.15,0)}
		Position={new UDim2(0.05,0,0.068 + (props.Index * 0.175),0)}
		>
			<textlabel
				AnchorPoint={new Vector2(0.5,0.5)}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
				Text={`<br/><b>${props.Name}</b> - ${props.InputKey}<br/><br/>${props.Description}<br/><br />Stamina: <b>${tostring(props.Stamina)}</b>`}
				TextColor3={Color3.fromRGB(227,227,227)}
				TextSize={20}
				Font={Enum.Font.Gotham}
				TextWrapped={true}
				RichText={true}
				Size={new UDim2(0.9,0,0.9,0)}
				Position={new UDim2(0.5, 0, 0.5,0)}
				BackgroundTransparency={1}
			></textlabel>

			<uicorner CornerRadius={new UDim(0.1,0)}/>

		</frame>
	
	);
}



export = new Hooks(Roact) (Menu)