import Roact, { Event } from '@rbxts/roact';
import Hooks from "@rbxts/roact-hooks";
import Flipper from "@rbxts/flipper"
import { Data } from "../../MenuData"
import { Client } from "shared/stand"
import Items from "shared/items"

interface Props {
	Slot: number
	ActiveSlot: number
	Events: {
		onClick: (slot: number) => void
		onUp: (slot: number) => void
		onDown: (slot: number) => void
		onRightDown: (slot: number) => void
	}
	Ref: any
}

const Menu = Roact.forwardRef((props: Props, ref) => {
	
	let Color = Color3.fromRGB(15,15,18)

	if (props.ActiveSlot === props.Slot) {	
		Color = Color3.fromRGB(0,0,0)
	}
	let slot = tostring(props.Slot) as string

	return (
			<textbutton
			Ref={ref as Roact.Ref<TextButton>}
			Text=""
			AnchorPoint={new Vector2(0.5,0.5)}
			BackgroundTransparency={0.4}
			BorderSizePixel={0}
			BackgroundColor3={Color}
			Size={new UDim2(0.001,0,0.001,0)}
			Position={new UDim2(props.Slot / 24,0,0.5,0)}
			Event={{MouseButton1Click: () => {
				props.Events.onClick(props.Slot)
			}, MouseButton1Up: () => {
				props.Events.onUp(props.Slot)
			}, MouseButton1Down: () => {
				props.Events.onDown(props.Slot)
			}, MouseButton2Down: () => {
				props.Events.onRightDown(props.Slot)
			}
		
		}}
			>
				<uicorner CornerRadius={new UDim(0.1,0)}/>
				<uiaspectratioconstraint AspectRatio={1}></uiaspectratioconstraint>
				{Client.LocalData.Inventory[slot] !== undefined &&
					<>
						<imagelabel
							Size={new UDim2(1,0,1,0)}
							BackgroundTransparency={1}
							//@ts-expect-error
							Image={Client.LocalData.Inventory[slot].Item.Texture}
						
						>
							<uiaspectratioconstraint AspectRatio={1}></uiaspectratioconstraint>
							<textlabel
								BackgroundTransparency={1}
								Size={new UDim2(0.05,0,0.05,0)}
								Position={new UDim2(0.85,0,0.84,0)}
								TextColor3={Color3.fromRGB(166,166,166)}
								TextSize={10}
								//@ts-expect-error
								Text={tostring(Client.LocalData.Inventory[slot].Amount)}
							>

							</textlabel>
						</imagelabel>

					</>
				}

			</textbutton>


	);
})



export = Menu

