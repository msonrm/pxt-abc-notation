enum Key {
    //% block="C"
    C = 1,
    //% block="G"
    G = 2,
    //% block="D"
    D = 3,
    //% block="A"
    A = 4,
    //% block="E"
    E = 5,
    //% block="B"
    B = 6,
    //% block="F#"
    FSharp = 7,
    //% block="C#"
    CSharp = 8,
    //% block="F"
    F = 9,
    //% block="Bb"
    BFlat = 10,
    //% block="Eb"
    EFlat = 11,
    //% block="Ab"
    AFlat = 12,
    //% block="Db"
    DFlat = 13,
    //% block="Gb"
    GFlat = 14,
    //% block="Cb"
    CFlat = 15,
    //% block="Am"
    Am = 16,
    //% block="Em"
    Em = 17,
    //% block="Bm"
    Bm = 18,
    //% block="F#m"
    FSharpM = 19,
    //% block="C#m"
    CSharpM = 20,
    //% block="G#m"
    GSharpM = 21,
    //% block="D#m"
    DSharpM = 22,
    //% block="A#m"
    ASharpM = 23,
    //% block="Dm"
    Dm = 24,
    //% block="Gm"
    Gm = 25,
    //% block="Cm"
    Cm = 26,
    //% block="Fm"
    Fm = 27,
    //% block="Bbm"
    BFlatM = 28,
    //% block="Ebm"
    EFlatM = 29,
    //% block="Abm"
    AFlatM = 30
}

enum MelodyEvent {
    //*      //% block="melody note played"
    MelodyNotePlayed = 1,
    //*      //% block="melody started"
    MelodyStarted = 2,
    //*      //% block="melody ended"
    MelodyEnded = 3
}


//% weight=70 icon="\uf001" color=#ffa500 block="ABC notation"
namespace abcNotation {
    let unitNote: number = 1 / 8;
    let beatNote: number = 1 / 4;
    let bpm: number = 120;
    let key: number[] = [];
    let freqTable: number[] = [];
    const MICROBIT_MELODY_ID = 2000;

    function init() {
        if (bpm <= 0) bpm = 120;
        if (freqTable.length == 0) freqTable = [28, 29, 31, 33, 35, 37, 39, 41, 44, 46, 49, 52, 55, 58, 62, 65, 69, 73, 78, 82, 87, 92, 98, 104, 110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951, 4186]
    }

    let scoreArray: string[][] = null;
    let measureOrder: number[] = null;
    let currMeasure: string[] = [];

    /**
     * Registers code to run on various melody events
    */
    //% blockId=music_on_event block="melody on %value"
    //% weight=59
    export function onEvent(value: MelodyEvent, handler: () => void) {
        control.onEvent(MICROBIT_MELODY_ID, value, handler);
    }

    /**
     * Sets the unit note length.
     */
    //% blockId=set_unit_note_length block="set unit note length(L:) %value"
    export function setUnitNote() {
        
    }

    /**
     * Sets the tempo.
     */
    //% blockId=set_tempo block="set tempo(Q:) %beatNote = %bpm"
    export function setTempo() {

    }


    /**
     * Sets the key.
     */
    //% blockId=set_key block="set key(K:) %key"
    export function setKey() {

    }


    /**
     * Play score.
     * Score are expressed as a string of characters with ABC notation.
     */
    //% weight=60
    //% blockId=play_score block="play score %string"
    export function playScore(score: string) {
        init();

        if (scoreArray != null) {
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyEnded);
            // write function here (score to scoreArray,measureOrder)
            scoreArray = [['r4:2', 'a', 'g', 'g', 'b:8', 'r:2', 'f', 'f', 'f'], ['r4:2', 'a', 'g', 'g', 'b:8', 'r:2', 'f', 'f', 'f']];
            measureOrder = [0, 1]
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyStarted);
        } else {
            // write function here (score to scoreArray,measureOrder)
            scoreArray = [['r4:2', 'a', 'g', 'g', 'b:8', 'r:2', 'f', 'f', 'f'], ['r4:2', 'a', 'g', 'g', 'b:8', 'r:2', 'f', 'f', 'f']];
            measureOrder = [0, 1]
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyStarted);
            for (let melodyIndex = 0; melodyIndex < measureOrder.length; melodyIndex++){
                playMeasure(scoreArray[measureOrder[melodyIndex]]);
            }
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyEnded);
            scoreArray = null;
        }
    }

    function playMeasure(currMeasure:string[]): void {

        control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyNotePlayed);
    }
}