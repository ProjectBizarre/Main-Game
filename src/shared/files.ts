import { ReplicatedStorage } from "@rbxts/services"

export const StandList = ReplicatedStorage.WaitForChild("Stands") as Folder
export const Animations = StandList.FindFirstChild("Animations") as Folder
