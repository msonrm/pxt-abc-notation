//% weight=70 icon="\uf001" color=#ffa500 block="ABC notation"
namespace abcNotation {
    let beatsPerMinute: number = 120;
    let freqTable: number[] = [];
    let _playTone: (frequency: number, duration: number) => void;
    const MICROBIT_MELODY_ID = 2000;

    function init() {
        if (beatsPerMinute <= 0) beatsPerMinute = 120;
        if (freqTable.length == 0) freqTable = [31, 33, 35, 37, 39, 41, 44, 46, 49, 52, 55, 58, 62, 65, 69, 73, 78, 82, 87, 92, 98, 104, 110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951, 4186]
    }

    let currentMelody: Melody;
    let currentBackgroundMelody: Melody;
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
        AFlatM = 15,
    }

    /**
     * Sets the key
     */
    //% weight=50
    //% blockId=device_set_key block="set key (K:) to |%keyName"
    export function setKey(keyName: Key): void {
        init()
        if (keyName == null) keyName = Key.C;
        switch (keyName) {
            case Key.C: case Key.Am:
            case Key.G: case Key.Em:
            case Key.D: case Key.Bm:
            case Key.A: case Key.FSharpM:
            case Key.E: case Key.CSharpM:
            case Key.B: case Key.GSharpM:
            case Key.FSharp: case Key.DSharpM:
            case Key.CSharp: case Key.ASharpM:
            case Key.F: case Key.Dm:
            case Key.BFlat: case Key.Gm:
            case Key.EFlat: case Key.Cm:
            case Key.AFlat: case Key.Fm:
            case Key.DFlat: case Key.BFlatM:
            case Key.GFlat: case Key.EFlatM:
            case Key.CFlat: case Key.AFlatM:
        }
    }

    /**
     * Play notes.
     * Notes are expressed as a string of characters with ABC notation
     * @param melodyNotes the melody notes to play
     */
    //% weight=60
    //% blockId=device_play_notes block="play notes %string"
    export function playNotes(melodyNotes: string, options: MelodyOptions = 1) {
        init();

        // write function here (notes to melodyArray)
        melodyArray = ['r4:2', 'a', 'g', 'g', 'b:8', 'r:2', 'f', 'f', 'f', 'd:8'];

        if (currentMelody != undefined) {
            if (((options & MelodyOptions.OnceInBackground) == 0)
                && ((options & MelodyOptions.ForeverInBackground) == 0)
                && currentMelody.background) {
                currentBackgroundMelody = currentMelody;
                currentMelody = null;
                control.raiseEvent(MICROBIT_MELODY_ID, MusicEvent.BackgroundMelodyPaused);
            }
            if (currentMelody)
                control.raiseEvent(MICROBIT_MELODY_ID, currentMelody.background ? MusicEvent.BackgroundMelodyEnded : MusicEvent.MelodyEnded);
            currentMelody = new Melody(melodyArray, options);
            control.raiseEvent(MICROBIT_MELODY_ID, currentMelody.background ? MusicEvent.BackgroundMelodyStarted : MusicEvent.MelodyStarted);
        } else {
            currentMelody = new Melody(melodyArray, options);
            control.raiseEvent(MICROBIT_MELODY_ID, currentMelody.background ? MusicEvent.BackgroundMelodyStarted : MusicEvent.MelodyStarted);
            // Only start the fiber once
            control.inBackground(() => {
                while (currentMelody.hasNextNote()) {
                    playNextNote(currentMelody);
                    if (!currentMelody.hasNextNote() && currentBackgroundMelody) {
                        // Swap the background melody back
                        currentMelody = currentBackgroundMelody;
                        currentBackgroundMelody = null;
                        control.raiseEvent(MICROBIT_MELODY_ID, MusicEvent.MelodyEnded);
                        control.raiseEvent(MICROBIT_MELODY_ID, MusicEvent.BackgroundMelodyResumed);
                    }
                }
                control.raiseEvent(MICROBIT_MELODY_ID, currentMelody.background ? MusicEvent.BackgroundMelodyEnded : MusicEvent.MelodyEnded);
                currentMelody = null;
            })
        }
    }


    /**
    * Sets a custom playTone function for playing notes
    */
    //% advanced=true
    export function setPlayTone(f: (frequency: number, duration: number) => void) {
        _playTone = f;
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
        let beat = (60000 / beatsPerMinute) / 4;
        if (isrest) {
            music.rest(currentDuration * beat)
        } else {
            let keyNumber = note + (12 * (currentOctave - 1));
            let frequency = keyNumber >= 0 && keyNumber < freqTable.length ? freqTable[keyNumber] : 0;
            music.playTone(frequency, currentDuration * beat);
        }
        melody.currentDuration = currentDuration;
        melody.currentOctave = currentOctave;
        const repeating = melody.repeating && currentPos == melody.melodyArray.length - 1;
        melody.currentPos = repeating ? 0 : currentPos + 1;

        control.raiseEvent(MICROBIT_MELODY_ID, melody.background ? MusicEvent.BackgroundMelodyNotePlayed : MusicEvent.MelodyNotePlayed);
        if (repeating)
            control.raiseEvent(MICROBIT_MELODY_ID, melody.background ? MusicEvent.BackgroundMelodyRepeated : MusicEvent.MelodyRepeated);
    }

    class Melody {
        public melodyArray: string[];
        public currentDuration: number;
        public currentOctave: number;
        public currentPos: number;
        public repeating: boolean;
        public background: boolean;

        constructor(melodyArray: string[], options: MelodyOptions) {
            this.melodyArray = melodyArray;
            this.repeating = ((options & MelodyOptions.Forever) != 0);
            this.repeating = this.repeating ? true : ((options & MelodyOptions.ForeverInBackground) != 0)
            this.background = ((options & MelodyOptions.OnceInBackground) != 0);
            this.background = this.background ? true : ((options & MelodyOptions.ForeverInBackground) != 0);
            this.currentDuration = 4; //Default duration (Crotchet)
            this.currentOctave = 4; //Middle octave
            this.currentPos = 0;
        }

        hasNextNote() {
            return this.repeating || this.currentPos < this.melodyArray.length;
        }

        nextNote(): string {
            const currentNote = this.melodyArray[this.currentPos];
            return currentNote;
        }
    }
}
