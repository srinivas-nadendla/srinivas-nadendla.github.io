import { useState, useEffect } from "react";

let speech;


const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [textObj, setTextObj] = useState({ isFinal: false, interim_transcript: '', });

  const listen = () => {
    setIsListening(!isListening);
    if (isListening) {
      speech.stop();
    } else {
      speech.start();
    }
  };

  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      // eslint-disable-next-line
      speech = new window.webkitSpeechRecognition;
      speech.continuous = true;
      speech.interimResults = true;
      speech.lang = "en-US";
      speech.maxAlternatives = 1;
      speech.onresult = (event) => {
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i]?.length > 0) {
            for (let k = 0; k < event.results[i]?.length; k++) {
              interim_transcript += event.results[i][k].transcript;
            }
          }
        }
        const isFinal = event.results[event.results.length - 1]?.isFinal && event.results[event.results.length - 1]?.[0]?.confidence > 0;
        setTextObj({
          isFinal: isFinal,
          interim_transcript: interim_transcript
        })
        if (isFinal) {
          setTimeout(() => {
            setIsListening(false);
            speech.stop();
          }, 5000)
        }
      };

    } else {
      speech = null;
    }
  }, []);

  return {
    isListening,
    textObj,
    listen,
    voiceSupported: speech !== null
  };
};

export { useVoice };
