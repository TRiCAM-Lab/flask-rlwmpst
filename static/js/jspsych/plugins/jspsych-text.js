/* jspsych-text.js
 * Josh de Leeuw
 *
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
 * documentation: docs.jspsych.org
 *
 *
 */

jsPsych.plugins.text = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    trial.cont_key = trial.cont_key || [];

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
    trial.timeout = trial.timeout || -1;

      var setTimeoutHandlers = [];


    // set the HTML of the display target to replaced_text.
    display_element.html(trial.text);

    var after_response = function(info) {

      display_element.html(''); // clear the display

      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      var trialdata = {
        "rt": info.rt,
        "key_press": info.key
      }

      jsPsych.finishTrial(trialdata);

    };

    var mouse_listener = function(e) {

      var rt = (new Date()).getTime() - start_time;

      display_element.unbind('click', mouse_listener);

      after_response({
        key: 'mouse',
        rt: rt
      });

    };

    // check if key is 'mouse'
    if (trial.cont_key == 'mouse') {
      display_element.click(mouse_listener);
      var start_time = (new Date()).getTime();
    } else {
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.cont_key,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    if (trial.timeout > 0){
      var t_finish = setTimeout(function() {
          after_response({'rt': -1, 'key': 'timeout'});
      }, trial.timeout);
          setTimeoutHandlers.push(t_finish);
    }

  };

  return plugin;
})();
