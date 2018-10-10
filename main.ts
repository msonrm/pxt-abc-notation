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

    let currentMelody: Melody;
    let melodyArray: string[] = [];

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


    /**
     * Sets the key
     */
    //% weight=50
    //% blockId=device_set_key
    //% block
    /*     export function setKey(value: Key): number {
            init();
            if (value == null) value = Key.C;
            switch (value) {
                case Key.C: case Key.Am: return 1;
                case Key.G: case Key.Em: return 2;
                case Key.D: case Key.Bm: return 3;
                case Key.A: case Key.FSharpM: return 4;
                case Key.E: case Key.CSharpM: return 5;
                case Key.B: case Key.GSharpM: return 6;
                case Key.FSharp: case Key.DSharpM: return 7;
                case Key.CSharp: case Key.ASharpM: return 8;
                case Key.F: case Key.Dm: return 9;
                case Key.BFlat: case Key.Gm: return 10;
                case Key.EFlat: case Key.Cm: return 11;
                case Key.AFlat: case Key.Fm: return 12;
                case Key.DFlat: case Key.BFlatM: return 13;
                case Key.GFlat: case Key.EFlatM: return 14;
                case Key.CFlat: case Key.AFlatM: return 15;
                default: return 0;
            }
        }
     */

    enum MelodyEvent {
        //*      //% block="melody note played"
        MelodyNotePlayed = 1,
        //*      //% block="melody started"
        MelodyStarted = 2,
        //*      //% block="melody ended"
        MelodyEnded = 3
    }

    /**
     * Registers code to run on various melody events
     */
    //% blockId=music_on_event block="music(ABC notation) on %value"
    //% help=abc/on-event weight=59 blockGap=32
    export function onEvent(value: MelodyEvent, handler: () => void) {
        control.onEvent(MICROBIT_MELODY_ID, value, handler);
    }

    /**
     * Play notes.
     * Notes are expressed as a string of characters with ABC notation
     * @param melodyNotes the melody notes to play
     */
    //% weight=60
    //% blockId=device_play_notes block="play notes %string"
    export function playNotes(melodyNotes: string) {
        init();

        // write function here (notes to melodyArray)
        melodyArray = ['r4:2', 'a', 'g', 'g', 'b:8', 'r:2', 'f', 'f', 'f'];

        if (currentMelody != undefined) {
            if (currentMelody)
                control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyEnded);
            currentMelody = new Melody(melodyArray);
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyStarted);
        } else {
            currentMelody = new Melody(melodyArray);
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyStarted);
            while (currentMelody.hasNextNote()) {
                playNextNote(currentMelody);
            }
            control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyEnded);
            currentMelody = null;
        }
    }


    function playNextNote(melody: Melody): void {
        // cache elements
        let currNote = melody.nextNote();
        let currentPos = melody.currentPos;
        let currentDuration = melody.currentDuration;
        let currentOctave = melody.currentOctave;

        let note: number;
        let isrest: boolean = false;
        let beatPos: number;
        let parsingOctave: boolean = true;

        for (let pos = 0; pos < currNote.length; pos++) {
            let noteChar = currNote.charAt(pos);
            switch (noteChar) {
                case 'c': case 'C': note = 1; break;
                case 'd': case 'D': note = 3; break;
                case 'e': case 'E': note = 5; break;
                case 'f': case 'F': note = 6; break;
                case 'g': case 'G': note = 8; break;
                case 'a': case 'A': note = 10; break;
                case 'b': case 'B': note = 12; break;
                case 'r': case 'R': isrest = true; break;
                case '#': note++; break;
                case 'b': note--; break;
                case ':': parsingOctave = false; beatPos = pos; break;
                default: if (parsingOctave) currentOctave = parseInt(noteChar);
            }
        }
        if (!parsingOctave) {
            currentDuration = parseInt(currNote.substr(beatPos + 1, currNote.length - beatPos));
        }
        let unitNoteMs = (60000 / bpm) * (unitNote / beatNote);
        if (isrest) {
            pins.analogPitch(0, currentDuration * unitNoteMs)
        } else {
            let keyNumber = note + (12 * (currentOctave - 1));
            let frequency = keyNumber >= 0 && keyNumber < freqTable.length ? freqTable[keyNumber] : 0;
            pins.analogPitch(frequency, currentDuration * unitNoteMs)
        }
        melody.currentDuration = currentDuration;
        melody.currentOctave = currentOctave;
        melody.currentPos = currentPos + 1;
        control.raiseEvent(MICROBIT_MELODY_ID, MelodyEvent.MelodyNotePlayed);
    }

    class Melody {
        public melodyArray: string[];
        public currentDuration: number;
        public currentOctave: number;
        public currentPos: number;

        constructor(melodyArray: string[]) {
            this.melodyArray = melodyArray;
            this.currentDuration = 1; //Default duration (unitNote*1)
            this.currentOctave = 4; //Middle octave
            this.currentPos = 0;
        }

        hasNextNote() {
            return this.currentPos < this.melodyArray.length;
        }

        nextNote(): string {
            const currentNote = this.melodyArray[this.currentPos];
            return currentNote;
        }
    }
}
