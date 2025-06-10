import React, { useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import { Tooltip } from "@mui/material";

const TextReader = (props: any) => {
  const parentRef = useRef<HTMLDivElement>(null); // Ref for the parent container
  const isSpeakingRef = useRef(false); // Tracks speaking state
  const selectedTextRef: any = useRef("");
  const [voices, setVoices] = useState<any>([]);
  const device = useDetectDevice();

  useEffect(() => {
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoices(window.speechSynthesis.getVoices()); // Preloads voices
        };
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      handleStop(); // Stop speaking when the component unmounts
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeak = () => {
    const text = stripHtmlUsingDOM(selectedTextRef.current || props.text);
    const chunks = splitTextIntoSentences(text);
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
        window.speechSynthesis.cancel();
      }
      speakChunks(chunks);
    }
    isSpeakingRef.current = true;
    toggleIcons(true); // Show the "Volume Off" icon
  };

  const speakChunks = (chunks: string[]) => {
    let voice: any = voices.find(
      (voice: any) => voice.name === "Google US English"
    );
    if (!voice) {
      const voicesArr = window.speechSynthesis.getVoices();
      voice = voicesArr.find(
        (voice: any) => voice.name === "Google US English"
      );
    }
    chunks.forEach((chunk, index) => {
      const utterance: any = new SpeechSynthesisUtterance(chunk);
      utterance.voice = voice;

      utterance.onend = () => {
        if (index === chunks.length - 1) {
          handleOnEnd();
        }
      };

      utterance.onerror = () => {
        handleOnError();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    toggleIcons(false); // Show the "Volume Up" icon
  };

  const handleOnEnd = () => {
    toggleIcons(false); // Show the "Volume Up" icon
  };

  const handleOnError = () => {
    toggleIcons(false); // Show the "Volume Up" icon
  };

  const toggleIcons = (isSpeaking: boolean) => {
    if (parentRef.current) {
      const volumeUpIcon = parentRef.current.querySelector("#volume-up-icon");
      const volumeOffIcon = parentRef.current.querySelector("#volume-off-icon");

      if (volumeUpIcon && volumeOffIcon) {
        if (isSpeaking) {
          volumeUpIcon.classList.add("brena-text-hidden-cls");
          volumeOffIcon.classList.remove("brena-text-hidden-cls");
        } else {
          volumeUpIcon.classList.remove("brena-text-hidden-cls");
          volumeOffIcon.classList.add("brena-text-hidden-cls");
        }
      }
    }
  };

  const stripHtmlUsingDOM = (html: any) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const splitTextIntoSentences = (text: string) => {
    const urlPattern = /\b(?:https?:\/\/|www\.)[^\s]+\b|\b\w+\.\w+\b/g;
    let urlMatches: string[] = [];
    let placeholderText = text.replace(urlPattern, (url) => {
      urlMatches.push(url);
      return `[[URL${urlMatches.length - 1}]]`;
    });
    const sentencePattern = /[^.!?]+[.!?]+(?=\s|$)|[^.!?]+(?=\s|$)/g;
    let sentences: any = placeholderText.match(sentencePattern) || [];
    sentences = sentences.map((sentence: any) =>
      sentence.replace(
        /\[\[URL(\d+)\]\]/g,
        (match: any, index: any) => urlMatches[parseInt(index)]
      )
    );
    return sentences.map((sentence: any) => sentence.trim());
  };

  return (
    <div ref={parentRef} className="brena-chat-volume-icon-container">
      <Tooltip title="Start Reading" id="brenaVolumeUpTooltip">
        <VolumeUpIcon
          id="volume-up-icon"
          color={device === "brena-mobile" ? "disabled" : "inherit"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const selection: any = window.getSelection();
            let selectedText: any = "";

            if (selection.rangeCount > 0) {
              const selectionText: any = selection.toString().trim();

              if (selectionText.length > 0) {
                selectedText = selectionText;
              }
            }

            selectedTextRef.current = selectedText;
            handleSpeak();
          }}
        />
      </Tooltip>
      <Tooltip title="Stop Reading" id="brenaVolumeOffTooltip">
        <VolumeOffIcon
          id="volume-off-icon"
          color="primary"
          className="brena-text-hidden-cls"
          onClick={() => {
            selectedTextRef.current = "";
            handleStop();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default TextReader;
