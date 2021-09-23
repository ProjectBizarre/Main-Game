import Roact, {Portal} from '@rbxts/roact';
import Hooks from "@rbxts/roact-hooks";
import Flipper from "@rbxts/flipper"
import Inventory from "./pages/inventory"
import Moves from "./pages/moves"



interface Props {
	player: Player
}

const Menu: Hooks.FC<Props> = (props, { useState, useEffect, useMemo, useValue }) => {
	let [Transparency, setTrans] = useState(0)
	let [menu, setMenu] = useState(0)

	
	let motor = new Flipper.SingleMotor(0)
	motor.onStep(setTrans)


	useEffect(() => {
		motor.setGoal(new Flipper.Linear(0.76, {velocity: 1}))
	}, [])

	const getButtonColor = (id: number) => {
		if (menu === id) {
			return Color3.fromRGB(255,255,255)
		} else {
			return Color3.fromRGB(133,133,133)
		}
	}

	const getTextSize = (id: number) => {
		if (menu === id) {
			return 19
		} else {
			return 16
		}
	}

	const clickMenu = (id: number) => {
		if (menu === id) {
			return
		} else {
			setMenu(id)
		}
	}

	const menus = () => {
		if (menu === 0) {
			return <Inventory />
		} else if (menu === 3) {
			return <Moves />
		}
		return <> </>
	}
	

	return (
			<frame
			BackgroundColor3={Color3.fromRGB(20,20,20)}
			Size={new UDim2(1,0,1,36)}
			Position={new UDim2(0,0,0,-36)}
			Transparency={1 - Transparency}
			>
	
				{/* Top Bar */}
				<frame
				BackgroundColor3={Color3.fromRGB(0,0,0)}
				ZIndex={1}
				Transparency={0.8}
				BorderSizePixel={1}
				BorderColor3={Color3.fromRGB(140,140,140)}
				Size={new UDim2(1,0,0.15,0)}
				>
					<textbutton
						BackgroundTransparency={1}
						AnchorPoint={new Vector2(0.5,0.5)}
						Position={new UDim2(0.42, 0, 0.5, 0)}
						Size={new UDim2(0.05, 0, 0.1 ,0)}
						Text="Quests"
						TextColor3={getButtonColor(4)}
						TextSize={getTextSize(4)}
						Font={Enum.Font.GothamSemibold}
						Event={{ MouseButton1Down: (rbx) => { clickMenu(4) }}}
					></textbutton>
					<textbutton
						BackgroundTransparency={1}
						AnchorPoint={new Vector2(0.5,0.5)}
						Position={new UDim2(0.34, 0, 0.5, 0)}
						Size={new UDim2(0.05, 0, 0.1 ,0)}
						Text="Profile"
						TextColor3={getButtonColor(2)}
						TextSize={getTextSize(2)}
						Font={Enum.Font.GothamSemibold}
						Event={{ MouseButton1Down: (rbx) => { clickMenu(2) }}}
					></textbutton>				
					<textbutton
						BackgroundTransparency={1}
						AnchorPoint={new Vector2(0.5,0.5)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.05, 0, 0.1 ,0)}
						Text="Inventory"
						TextColor3={getButtonColor(0)}
						TextSize={getTextSize(0)}
						Font={Enum.Font.GothamSemibold}
						Event={{ MouseButton1Down: (rbx) => { clickMenu(0) }}}
					></textbutton>
					<textbutton
						AnchorPoint={new Vector2(0.5,0.5)}
						BackgroundTransparency={1}
						Position={new UDim2(0.58, 0, 0.5, 0)}
						Size={new UDim2(0.05, 0, 0.15 ,0)}
						Text="Settings"
						TextColor3={getButtonColor(1)}
						TextSize={getTextSize(1)}
						Font={Enum.Font.GothamSemibold}
						Event={{ MouseButton1Down: (rbx) => { clickMenu(1) }}}
					></textbutton>
					<textbutton
						AnchorPoint={new Vector2(0.5,0.5)}
						BackgroundTransparency={1}
						Position={new UDim2(0.66, 0, 0.5, 0)}
						Size={new UDim2(0.05, 0, 0.15 ,0)}
						Text="Moves"
						TextColor3={getButtonColor(3)}
						TextSize={getTextSize(3)}
						Font={Enum.Font.GothamSemibold}
						Event={{ MouseButton1Down: (rbx) => { clickMenu(3) }}}
					></textbutton>
				</frame>
				
				{/* Bottom Bar */}
				<frame
				Position={new UDim2(0,0,0.9,0)}
				BackgroundColor3={Color3.fromRGB(0,0,0)}
				ZIndex={1}
				Transparency={0.8} 
				BorderSizePixel={1}
				BorderColor3={Color3.fromRGB(140,140,140)}
				Size={new UDim2(1,0,0.1,0)}>
				</frame>
	
				{/* Middle Bar */}
				<frame
				Transparency={1}
				Position={new UDim2(0,0,0.15,0)}
				Size={new UDim2(1,0,0.75,0)}
				>
					{menus()}

					
				</frame>
	
			</frame>
	);
}



export = new Hooks(Roact) (Menu)

