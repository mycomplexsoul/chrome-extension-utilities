class TextToSpeech {
  synth = window.speechSynthesis;
  voices = this.synth.getVoices();
  utt: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth.onvoiceschanged = () => {
      this.voices = this.synth.getVoices();
      console.log(`Voices are ready, loaded ${this.voices.length} voices`);
    };
  }

  getVoice(lang = "es-US") {
    if (!this.voices.length) {
      this.voices = this.synth.getVoices();
    }
    return this.voices.find((v) => v.lang === lang) || null;
  }

  textToSpeechVoice(
    text: string,
    lang = "es-US",
    rate = 1,
    volume = 0.4
  ) {
    this.utt = new SpeechSynthesisUtterance(text);
    this.utt.voice = this.getVoice(lang);
    this.utt.rate = rate;
    this.utt.volume = volume;

    this.synth.cancel();
    console.log(`Speaking: ${text}`);
    this.synth.speak(this.utt);

    return new Promise((resolve, reject) => {
      let resolveCalled = false;
      if (this.utt) {
        this.utt.onend = () => {
          console.log("Speech ended");
          resolveCalled = true;
          return resolve(true);
        };
      }

      setTimeout(() => {
        if (!resolveCalled) {
          console.log("Speech timed out");
          this.synth.cancel();
          return reject(false);
        }
      }, 15000);
    });
  }
}

const textToSpeech = new TextToSpeech();
// await textToSpeech.textToSpeechVoice('hello I am ready again');

export {
  textToSpeech,
}