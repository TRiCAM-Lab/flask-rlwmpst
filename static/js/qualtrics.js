var consentPage = {
  type: "html-keyboard-response",
  stimulus: [
    '<div id="iframe"> <iframe width="900" height="900"' +
      ' src="https://brown.co1.qualtrics.com/jfe/form/SV_6xNgXiaN1eyozkh"' +
      ' frameborder="0"' +
      " allowfullscreen > </iframe></div>",
  ],
  choices: jsPsych.ALL_KEYS, // in last page of consent qualtrics
  // can instruct which specific key to press to proceed to task
};
