enum NoteFraction {
    //% block="1"
    Whole = 1,
    //% block="1/2"
    Half = 2,
    //% block="1/4"
    Quarter = 4,
    //% block="1/8"
    Eighth = 8,
    //% block="1/16"
    Sixteenth = 16,
    //% block="1/32"
    Thirtysecond = 32
}

enum KeyNameMajor {
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
}

enum KeyNameMinor {
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
    //% block="note played"
    NotePlayed = 1,
    //% block="melody started"
    MelodyStarted = 2,
    //% block="melody ended"
    MelodyEnded = 3
}


//% weight=70 icon="\uf001" color=#ffa500 block="ABC notation"
namespace abcNotation {
    let unitNote: number = 1 / 8;
    let beatNote: number = 1 / 4;
    let bpm: number = 120;
    let unitNoteMs = 62.5;
    let key: number[] = [];
    let freqTable: number[] = [];
    const MICROBIT_MELODY_ID = 2000;

    function init() {
        if (unitNote <= 0) unitNote = 1 / 8;
        if (beatNote <= 0) beatNote = 1 / 4;
        if (bpm <= 0) bpm = 120;
        if (unitNoteMs <= 0) unitNoteMs = (60000 / bpm) * (unitNote / beatNote);
        if (freqTable.length == 0) freqTable = [65, 69, 73, 78, 82, 87, 92, 98, 104, 110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951, 0]
    }

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
    //% blockId=set_unit_note block="set unit note(L:) %value"
    export function setUnitNote(value: NoteFraction): void {
        init();
        unitNote = 1 / value;
    }

    /**
     * Sets the tempo.
     */
    //% blockId=set_tempo block="set tempo(Q:) %beatNote = %bpm"
    export function setTempo(beatNote: NoteFraction, bpm: number): void {
        unitNoteMs = (60000 / bpm) * (unitNote / beatNote);
    }

    /**
     * Sets the major key.
     */
    //% blockId=set_major_key block="set major key (K:) %setKey"
    export function setMajorKey(setKey: KeyNameMajor): void {
        switch (setKey) {
            case KeyNameMajor.C: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            case KeyNameMajor.G: key = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
            case KeyNameMajor.D: key = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
            case KeyNameMajor.A: key = [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0];
            case KeyNameMajor.E: key = [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0];
            case KeyNameMajor.B: key = [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0];
            case KeyNameMajor.FSharp: key = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0];
            case KeyNameMajor.CSharp: key = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
            case KeyNameMajor.F: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1];
            case KeyNameMajor.BFlat: key = [0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, -1];
            case KeyNameMajor.EFlat: key = [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, -1];
            case KeyNameMajor.AFlat: key = [0, 0, -1, 0, -1, 0, 0, 0, 0, -1, 0, -1];
            case KeyNameMajor.DFlat: key = [0, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1];
            case KeyNameMajor.GFlat: key = [-1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1];
            case KeyNameMajor.CFlat: key = [-1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1];
            default: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    }

    /**
     * Sets the minor key.
     */
    //% blockId=set_minor_key block="set minor key (K:) %setKey"
    export function setMinorKey(setKey: KeyNameMinor): void {
        switch (setKey) {
            case KeyNameMinor.Am: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            case KeyNameMinor.Em: key = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
            case KeyNameMinor.Bm: key = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
            case KeyNameMinor.FSharpM: key = [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0];
            case KeyNameMinor.CSharpM: key = [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0];
            case KeyNameMinor.GSharpM: key = [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0];
            case KeyNameMinor.DSharpM: key = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0];
            case KeyNameMinor.ASharpM: key = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
            case KeyNameMinor.Dm: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1];
            case KeyNameMinor.Gm: key = [0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, -1];
            case KeyNameMinor.Cm: key = [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, -1];
            case KeyNameMinor.Fm: key = [0, 0, -1, 0, -1, 0, 0, 0, 0, -1, 0, -1];
            case KeyNameMinor.BFlatM: key = [0, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1];
            case KeyNameMinor.EFlatM: key = [-1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1];
            case KeyNameMinor.AFlatM: key = [-1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1];
            default: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    }


    /**
     * Play score.
     * Score are expressed as a string of characters with ABC notation.
     */
    //% weight=60
    //% blockId=play_score block="play score %string"
    export function playScore(score: string) {
        init();
        let scoreArray: string[][] = null;
        let measureOrder: number[] = null;
        let currMeasure: string[] = [];

        if (scoreArray != null) {
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyEnded);
            scoreArray = scoreToScoreArray(score);
            measureOrder = scoreToMeasureOrder(score)
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyStarted);
        } else {
            scoreArray = scoreToScoreArray(score);
            measureOrder = scoreToMeasureOrder(score)
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyStarted);
            for (let melodyIndex = 0; melodyIndex < measureOrder.length; melodyIndex++) {
                playMeasure(scoreArray[measureOrder[melodyIndex]]);
            }
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyEnded);
            scoreArray = null;
        }
    }

    function scoreToScoreArray(score: string): string[][] {
        // return dummy
        return [["C2", "D2", "E1", "F4", "G2", "A2", "B1", "z2"], ["B1", "A2"]];
    }

    function scoreToMeasureOrder(score: string): number[] {
        // return dummy
        return [0, 1];
    }

    function playMeasure(currMeasure: string[]): void {
        let currKey: number[]; //key at the measure
        let currNote: string; //current note strings
        let currNotePos: number; //current note position at the measure  
        let currAccidental: number; //current accidental
        let currNoteNumber: number;
        let isrest: boolean = false;
        let beatPos: number;
        let noteNumber: number;
        let duration: number;
        let frequency: number;

        //set current key from key(6 octaves) & rest
        for (let i = 0; i < 6; i++) {
            key.forEach(function (value: number, index: number) {
                currKey.push(value);
            })
        }
        currKey.push(0);

        for (currNotePos = 0; currNotePos < currMeasure.length; currNotePos++) {
            currNote = currMeasure[currNotePos];
            currAccidental = null;
            isrest = false;
            duration = unitNoteMs / unitNote;
            for (let pos = 0; pos < currNote.length; pos++) {
                let noteChar = currNote.charAt(pos);
                beatPos = 0;
                switch (noteChar) {
                    case "^": currAccidental = 1; break;
                    case "_": currAccidental = -1; break;
                    case "=": currAccidental = 0; break;
                    case "C": currNoteNumber = 24; break;
                    case "D": currNoteNumber = 26; break;
                    case "E": currNoteNumber = 28; break;
                    case "F": currNoteNumber = 29; break;
                    case "G": currNoteNumber = 31; break;
                    case "A": currNoteNumber = 33; break;
                    case "B": currNoteNumber = 35; break;
                    case "c": currNoteNumber = 36; break;
                    case "d": currNoteNumber = 38; break;
                    case "e": currNoteNumber = 40; break;
                    case "f": currNoteNumber = 41; break;
                    case "g": currNoteNumber = 43; break;
                    case "a": currNoteNumber = 45; break;
                    case "b": currNoteNumber = 47; break;
                    case "z": currNoteNumber = 72; isrest = true; break;
                    case "Z": currNoteNumber = 72; isrest = true; duration = unitNoteMs / unitNote; break;
                    case "'": currNoteNumber += 12; break;
                    case ",": currNoteNumber -= 12; break;
                    default: if (beatPos == 0) beatPos = pos;
                }
            }
            if (currAccidental != null) currKey[currNoteNumber] = currAccidental;
            noteNumber = currNoteNumber + currKey[currNoteNumber];
            let beatString = currNote.substr(beatPos, currNote.length);
            //            if (beatString.indexOf("/")) {
            //write function for decode beatString to duration.    
            //               duration = 100;
            //            }
            duration = 100;
            // play sound of note
            frequency = freqTable[noteNumber];
            //            pins.analogPitch(frequency, duration);
            basic.showNumber(noteNumber);
            //           basic.showNumber(duration);
            // reset note

            if (!isrest) control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.NotePlayed);
        }
    }
}
