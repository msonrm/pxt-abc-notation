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
    Am = 1,
    //% block="Em"
    Em = 2,
    //% block="Bm"
    Bm = 3,
    //% block="F#m"
    FSharpM = 4,
    //% block="C#m"
    CSharpM = 5,
    //% block="G#m"
    GSharpM = 6,
    //% block="D#m"
    DSharpM = 7,
    //% block="A#m"
    ASharpM = 8,
    //% block="Dm"
    Dm = 9,
    //% block="Gm"
    Gm = 10,
    //% block="Cm"
    Cm = 11,
    //% block="Fm"
    Fm = 12,
    //% block="Bbm"
    BFlatM = 13,
    //% block="Ebm"
    EFlatM = 14,
    //% block="Abm"
    AFlatM = 15
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
    let unitNoteMs = 250;
    let key: number[] = [];
    let freqTable: number[] = [];
    const MICROBIT_MELODY_ID = 2000;

    function init() {
        if (unitNote <= 0) unitNote = 1 / 8;
        if (beatNote <= 0) beatNote = 1 / 4;
        if (bpm <= 0) bpm = 120;
        if (unitNoteMs <= 0) unitNoteMs = (60000 / bpm) * (unitNote / beatNote);
        if (key.length == 0) key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (freqTable.length == 0) freqTable = [0, 65, 69, 73, 78, 82, 87, 92, 98, 104, 110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951]
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
     * @param value The unit note length, eg: NoteFraction.Eighth
     */
    //% blockId=set_unit_note block="set unit note(L:) %value"
    export function setUnitNote(value: NoteFraction): void {
        init();
        unitNote = 1 / value;
    }

    /**
     * Sets the tempo.
     * @param beatNote The beat note, eg: NoteFraction.Quarter
     * @param bpm The tempo in beats per minute, eg: 120
     */
    //% blockId=set_tempo block="set tempo(Q:) %beatNote = %bpm"
    export function setTempo(beatNote: NoteFraction, bpm: number): void {
        init();
        unitNoteMs = (60000 / bpm) * (unitNote * beatNote);
    }

    /**
     * Sets the major key.
     */
    //% blockId=set_major_key block="set major key (K:) %setKey"
    export function setMajorKey(setKey: KeyNameMajor): void {
        switch (setKey) {
            case 1: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; break;
            case 2: key = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]; break;
            case 3: key = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]; break;
            case 4: key = [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]; break;
            case 5: key = [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0]; break;
            case 6: key = [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0]; break;
            case 7: key = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0]; break;
            case 8: key = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]; break;
            case 9: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1]; break;
            case 10: key = [0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, -1]; break;
            case 11: key = [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, -1]; break;
            case 12: key = [0, 0, -1, 0, -1, 0, 0, 0, 0, -1, 0, -1]; break;
            case 13: key = [0, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1]; break;
            case 14: key = [-1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1]; break;
            case 15: key = [-1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1]; break;
        }
    }

    /**
     * Sets the minor key.
     */
    //% blockId=set_minor_key block="set minor key (K:) %setKey"
    export function setMinorKey(setKey: KeyNameMinor): void {
        switch (setKey) {
            case 1: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; break;
            case 2: key = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]; break;
            case 3: key = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]; break;
            case 4: key = [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]; break;
            case 5: key = [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0]; break;
            case 6: key = [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0]; break;
            case 7: key = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0]; break;
            case 8: key = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]; break;
            case 9: key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1]; break;
            case 10: key = [0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, -1]; break;
            case 11: key = [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, -1]; break;
            case 12: key = [0, 0, -1, 0, -1, 0, 0, 0, 0, -1, 0, -1]; break;
            case 13: key = [0, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1]; break;
            case 14: key = [-1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1]; break;
            case 15: key = [-1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1]; break;
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
            measureOrder = scoreToMeasureOrder(score);
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyStarted);
            measureOrder.forEach(function (value) {
                playMeasure(scoreArray[value])
            })
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyEnded);
            scoreArray = null;
        }
    }

    function scoreToScoreArray(score: string): string[][] {
        // return dummy
        return [["C2", "D2", "E1", "F4", "G2", "A2", "B1", "z2"], ["C1", "D2"]];
    }

    function scoreToMeasureOrder(score: string): number[] {
        // return dummy
        return [0, 1];
    }

    function playMeasure(currMeasure: string[]): void {
        let currKey: number[] = [0]; //key at the measure
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
            key.forEach(function (value) {
                currKey.push(value);
            })
        }

        for (currNotePos = 0; currNotePos < currMeasure.length; currNotePos++) {
            currNote = currMeasure[currNotePos];
            currAccidental = null;
            isrest = false;
            duration = unitNoteMs;
            for (let pos = 0; pos < currNote.length; pos++) {
                let noteChar = currNote.charAt(pos);
                beatPos = 0;
                switch (noteChar) {
                    case "^": currAccidental = 1; break;
                    case "_": currAccidental = -1; break;
                    case "=": currAccidental = 0; break;
                    case "C": currNoteNumber = 25; break;
                    case "D": currNoteNumber = 27; break;
                    case "E": currNoteNumber = 29; break;
                    case "F": currNoteNumber = 30; break;
                    case "G": currNoteNumber = 32; break;
                    case "A": currNoteNumber = 34; break;
                    case "B": currNoteNumber = 36; break;
                    case "c": currNoteNumber = 37; break;
                    case "d": currNoteNumber = 39; break;
                    case "e": currNoteNumber = 41; break;
                    case "f": currNoteNumber = 42; break;
                    case "g": currNoteNumber = 44; break;
                    case "a": currNoteNumber = 46; break;
                    case "b": currNoteNumber = 48; break;
                    case "z": currNoteNumber = 0; isrest = true; break;
                    case "Z": currNoteNumber = 0; isrest = true; duration = unitNoteMs / unitNote; break;
                    case "'": if (!isrest) currNoteNumber += 12; break;
                    case ",": if (!isrest) currNoteNumber -= 12; break;
                    default: if (beatPos == 0) beatPos = pos;
                }
            }
            //calculate frequency
            if (currAccidental != null) currKey[currNoteNumber] = currAccidental;
            noteNumber = currNoteNumber + currKey[currNoteNumber];
            frequency = freqTable[noteNumber];
            //calculate duration
            if (beatPos == 0) {
                duration = unitNoteMs;
            } else {
                let beatString: string = currNote.substr(beatPos)
                // beatString assuming as number
                duration = unitNoteMs * parseInt(beatString);
            }
            // play sound of note
            pins.analogPitch(frequency, duration);
            // reset note
            beatPos = 0;
            if (!isrest) control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.NotePlayed);
        }
    }
}

