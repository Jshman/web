const keys = document.querySelectorAll('.key');

const keyMap = {
    'g': 'C', 'h': 'D', 'j': 'E', 'k': 'F', 'l': 'G', ';': 'A', "'": 'B',
    'y': 'Cs', 'u': 'Ds', 'i': 'E', 'o': 'Fs', 'p': 'Gs', '[': 'As', ']': 'Bs'
};
let octave = 0;

document.addEventListener('keydown', (event) => {
    if (event.key === '-' || event.key === '+') {
        octave = event.key === '-' ? octave - 1 : octave + 1;
    } else {
        const note = keyMap[event.key];
        if (note) {
            playNoteWithOctave(note, octave);
        }
    }
});

keys.forEach(key => {
    key.addEventListener('click', () => {
        const note = key.dataset.note;
        playNoteWithOctave(note, octave);
    });
});

function playNoteWithOctave(note, octave) {
    const audio = new Audio(`audio/${note}${octave}.mp3`);
    audio.play();
}
