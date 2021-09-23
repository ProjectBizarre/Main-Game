import { Item, ItemI, UsableItem } from "./types" 

const Items: { [index: number]: ItemI} = {}

Items[1] = new Item("Stand Disc", 1, "7527677525", "Stand_Disc", "A Man-Made item used for Capturing Stand Abilities")

export default Items