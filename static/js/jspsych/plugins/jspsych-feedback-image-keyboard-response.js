/**
 * jspsych-image-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["feedback-image-keyboard-response"] = (function() {

  var plugin = {};

    jsPsych.pluginAPI.registerPreload('feedback-image-keyboard-response', 'large_reward_path', 'image');
    jsPsych.pluginAPI.registerPreload('feedback-image-keyboard-response', 'small_reward_path', 'image');
    jsPsych.pluginAPI.registerPreload('feedback-image-keyboard-response', 'noreward_path', 'image');

  plugin.info = {
    name: 'feedback-image-keyboard-response',
    description: '',
    parameters: {
      large_reward_path: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      small_reward_path: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      noreward_path: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      scale: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Scale',
        default: '100%',
        description: 'Whether to scale the image.'
      },
      reward_if_correct: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Reward if correct choice',
        default: 1,
        description: ''
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.NO_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      correct_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Correct',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    var last_resp = jsPsych.data.get().last(1).select('key_press').values[0];
    var last_rt = jsPsych.data.get().last(1).select('rt').values[0];
    if (last_resp == trial.correct_key){
        correct = true;
        timeout = false;
        reward = trial.reward_if_correct;
    }
    else if (last_resp == null) {
        // timeout
        reward = -1;
        correct = false;
        timeout = true;
    }
    else {
        correct = false;
        timeout = false;
        reward = 0;
    }

    if (reward == 1) {
        stimulus = trial.small_reward_path;
    }
    else if (reward == 2) {
        stimulus = trial.large_reward_path;
    }
    else if (reward == 0) {
        stimulus = trial.noreward_path;
    }
   else if (reward == -1){
       stimulus = '';
       trial.prompt = "<font color=\"red\" size=\"12\">Timeout! Respond faster.</font>";
    }

    var new_html = '<img width="'+trial.scale+'" src="'+stimulus+'" id="jspsych-image-keyboard-response-stimulus"></img>';

    // add prompt
    if (trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
          "key_press": response.key,
          "reward": reward,
          "timeout": timeout,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
