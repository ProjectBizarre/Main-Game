import Roact from '@rbxts/roact';
import Hooks from "@rbxts/roact-hooks";
import Flipper from "@rbxts/flipper"
import UIBox from "../components/inventorybox"
import { UserInputService, Players } from "@rbxts/services"
import { Events } from 'client/network/events';
import { Client } from "shared/stand"
import { createDragController } from "@rbxts/snapdragon";
import { InventoryI } from 'shared/types';


interface Props {
	player: Player
}

Events.connect("setInventory", (inv: InventoryI, bool: boolean) => {
	Client.LocalData.Inventory = inv
	if (lastactive !== undefined) {
		if (setactive !== undefined && setlastDown !== undefined) {
			if (bool) {
				childref?.Destroy()
				childref = undefined
				setlastDown(-2)
			} else {
				setactive(-2)
			}
			
			
			
		}
	}
	
	
})

let lastdown: number | undefined;
let lastactive: number | undefined;
let setlastDown: Hooks.Dispatch<number | (() => number)> | undefined = undefined;
let setactive: Hooks.Dispatch<number | (() => number)> | undefined = undefined;
let ref: Roact.Ref<TextButton> | undefined = undefined
let childref: ImageLabel | undefined = undefined
let cloneref: ImageLabel | undefined = undefined
UserInputService.InputChanged.Connect((input, boolean) => {
	let player = Players.LocalPlayer
	let mouse = player.GetMouse()
	if (ref !== undefined && childref === undefined) {
		if (ref.getValue() !== undefined){
			if (ref.getValue()?.FindFirstChildOfClass("ImageLabel")) {
				
				childref = ref.getValue()?.FindFirstChildOfClass("ImageLabel")
				//@ts-expect-error
				cloneref = childref.Clone()
				//@ts-expect-error
				childref.Parent = ref.getValue()?.Parent.Parent
				//@ts-expect-error
				childref.Size = new UDim2(0.15,0, 0.15,0)
				//@ts-expect-error
				childref.Position = new UDim2(-0.02,mouse.X,-0.2,mouse.Y)
			}



		} 

		
	} else if (childref) {
			childref.Position = new UDim2(-0.02,mouse.X,-0.2,mouse.Y)	
	}
	

})

const Menu: Hooks.FC<Props> = (props, { useState, useEffect }) => {
	let [Active, setActive] = useState(-1)
	let [LastDown, setLastDown] = useState(-1)
	let refs: { [index: number]: Roact.Ref<TextButton>} = {}
	setactive = setActive
	lastactive = Active
	lastdown = LastDown
	setlastDown = setLastDown
	useEffect(() => {
		if (refs[LastDown]) {
			let value = refs[LastDown].getValue()
			if (value !== undefined) {
				ref = refs[LastDown]
			}
		}

		
	})

	const MakeUIs = () => {
		let rows = new Array<Roact.Element>(24, (<frame />)).map((val, i) => {
			refs[i] = Roact.createRef<TextButton>()
			return (
				<UIBox 
					Ref={refs[i]}
					Slot={i}
					ActiveSlot={Active}
					Events={{onClick: (slot) => {
						setActive(slot)
						
					}, onUp: (slot) => {
						
					}, onDown: (slot) => {
						if (LastDown >= 0) {
							if (LastDown === slot) {

								//@ts-expect-error
								cloneref?.FindFirstChildOfClass("TextLabel").Text = childref?.FindFirstChildOfClass("TextLabel").Text
								childref?.Destroy()
								childref = undefined
								//@ts-expect-error
								
								cloneref?.Parent = refs[slot].getValue()
								setLastDown(-1)
								setActive(slot)
							} else {
								Events.swapSlot(LastDown, slot)
								childref?.Destroy()
								childref = undefined
								ref = undefined
								setActive(slot)

							}

						} else {
							if (Client.LocalData.Inventory[tostring(slot)] !== undefined) {
								setLastDown(slot)
							}
						}

						
					}, onRightDown: (slot) => {
						if (LastDown >= 0) {
							if (LastDown === slot) {
								//@ts-expect-error
								cloneref?.FindFirstChildOfClass("TextLabel").Text = childref?.FindFirstChildOfClass("TextLabel").Text
								childref?.Destroy()
								childref = undefined
								//@ts-expect-error
								
								cloneref?.Parent = refs[slot].getValue()
								setLastDown(-1)
								setActive(slot)
							} else {
								
								let text = tonumber(childref?.FindFirstChildOfClass("TextLabel")?.Text)
								if (text !== undefined && text !== 1) {
									if (math.floor(text / 2) !== text / 2) {
										//@ts-expect-error
										childref?.FindFirstChildOfClass("TextLabel")?.Text = tostring(math.floor(text / 2) + 1)
									} else {
										//@ts-expect-error
										childref?.FindFirstChildOfClass("TextLabel")?.Text = tostring(math.floor(text / 2))
									}

									Events.halfSlot(LastDown, slot)
								}
								setActive(slot)

							}

						} else {
							setActive(slot)
						}				
					}
	
				}}
				/>)
		})
		return rows
	}


	return (
		<frame
		Transparency={1}
		Size={new UDim2(1,0,1,0)}
		Position={new UDim2(0,0,0,0)}
		>

			<frame
				AnchorPoint={new Vector2(0.5,0.5)}
				Position={new UDim2(0.32,0,0.42,0)}
				Size={new UDim2(0.5,0,0.3,0)}
				Transparency={1}
			>
				{MakeUIs()}

				<uiaspectratioconstraint AspectRatio={1.2 / 0.3}/>

				<uigridlayout 
					CellPadding={new UDim2(0.01,0,0.002,0)}
					CellSize={new UDim2(0.11,0,0.55,0)}
				
				></uigridlayout>

			</frame>
			{Client.LocalData.Inventory[tostring(Active)] !== undefined &&
				<>
					<frame
					AnchorPoint={new Vector2(0.5,0.5)}
					BackgroundTransparency={0.4}
					BorderSizePixel={2}

					
					BackgroundColor3={Color3.fromRGB(15,15,18)}
					Size={new UDim2(0.4,0,0.3,0)}
					Position={new UDim2(0.76, 0, 0.7,0)}
					
					>
						<uicorner CornerRadius={new UDim(0.1,0)}/>
						<uiaspectratioconstraint AspectRatio={2.999}/>

						<textlabel
						AnchorPoint={new Vector2(0.5,0.5)}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
						//@ts-expect-error
						Text={`<b><font size="27">` + Client.LocalData.Inventory[tostring(Active)].Item.Name + `</font></b><br />` + Client.LocalData.Inventory[tostring(Active)].Item.Description}
						TextColor3={Color3.fromRGB(227,227,227)}
						TextSize={20}
						Font={Enum.Font.Gotham}
						TextWrapped={true}
						RichText={true}
						Size={new UDim2(0.9,0,0.9,0)}
						Position={new UDim2(0.5, 0, 0.5,0)}
						BackgroundTransparency={1}
						>

						</textlabel>
					</frame>

					<imagelabel
						AnchorPoint={new Vector2(0.5,0.5)}
						Size={new UDim2(0.5,0,0.5,0)}
						BackgroundTransparency={1}
						Position={new UDim2(0.75, 0, 0.35,0)}
						//@ts-expect-error
						Image={Client.LocalData.Inventory[tostring(Active)].Item.Texture}
					
					>
						<uiaspectratioconstraint AspectRatio={1}/>
					</imagelabel>
				</>
			}


		</frame>
	);
}



export = new Hooks(Roact) (Menu)

