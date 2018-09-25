//% weight=70 icon="\uf001" color=#ffa500 block="ABC notation"
namespace abcNotation {

    //% blockId=play_notes block="play notes %v"
    export function playNotes(text: string): void {
        pins.analogPitch(262, 100)
    }


    }

}
