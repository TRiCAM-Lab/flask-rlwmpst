/*  jspsych-xab.js
 *	Josh de Leeuw
 *
 *  This plugin runs a single XAB trial, where X is an image presented in isolation, and A and B are choices, with A or B being equal to X.
 *	The subject's goal is to identify whether A or B is identical to X.
 *
 * documentation: https://github.com/jodeleeuw/jsPsych/wiki/jspsych-xab
 *
 */

(function($) {
    jsPsych.pst = (function() {

        var plugin = {};

        plugin.create = function(params) {

            params = jsPsych.pluginAPI.enforceArray(params, ['data']);

            // the number of trials is determined by how many entries the params.stimuli array has
            var trials = new Array(params.trials.length);

            for (var i = 0; i < trials.length; i++) {
                trials[i] = {};
                trials[i].num_trial = i;
                trials[i].type = "pst";
                trials[i].trial_type = params.trial_type;
                trials[i].left_img = params.trials[i].imgs[0];
                trials[i].right_img = params.trials[i].imgs[1];
                trials[i].left_stim = params.trials[i].stims[0];
                trials[i].right_stim = params.trials[i].stims[1];
                trials[i].display_feedback = params.display_feedback;
                trials[i].correct = params.trials[i].correct;
                trials[i].reward = params.trials[i].reward;
                trials[i].reward_path = params.feedback[0];
                trials[i].noreward_path = params.feedback[1];
                trials[i].block = params.block || 99;
                trials[i].left_key = params.left_key || 49; // defaults to '1'
                trials[i].right_key = params.right_key || 48; // defaults to '0'
                // timing parameters
                trials[i].timing_x = params.timing_x || 500; // defaults to 1000msec.
                trials[i].timing_stim_duration = params.timing_stim_duration || 4000; // defaults to 1000msec.
                trials[i].timing_feedback_duration = 1000; // (typeof params.timing_post_trial === 'undefined') ? 10000 : params.timing_post_trial; // defaults to 1000msec.
                // optional parameters
                trials[i].is_html = (typeof params.is_html === 'undefined') ? false : params.is_html;
                trials[i].prompt = (typeof params.prompt === 'undefined') ? "" : params.prompt;
                trials[i].reset_counter = params.reset_counter || false;
            }
            return trials;
        };

        var pst_trial_complete = false;
        var reward = false;
        var points = 0;
        var setTimeoutHandlers = [];

        plugin.trial = function(display_element, trial) {
      	    // kill any remaining setTimeout handlers
            for (var i = 0; i < setTimeoutHandlers.length; i++) {
		clearTimeout(setTimeoutHandlers[i]);
	    }
            jsPsych.pluginAPI.cancelAllKeyboardResponses()

            // if any trial variables are functions
            // this evaluates the function and replaces
            // it with the output of the function
            trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

            if (trial.num_trial == 0 & trial.reset_counter) {
                points = 0;
            }

            display_element.html(''); // remove all

            // reset this variable to false
            pst_trial_complete = false;

            setTimeout(function() {
                showBlankScreen();
            }, trial.timing_x);

	    function showBlankScreen() {
		// remove the x stimulus
		$('.jspsych-pst-stimulus').remove();
		setTimeout(function() {
		    showStimulus();
		}, trial.timing_xab_gap);
	    }

            function showStimulus() {
                var images = [trial.left_img, trial.right_img];

                // show the options
                display_element.append($('<img>', {
                    src: images[0],
                    "class": 'jspsych-pst-stimulus left',
                }));
                display_element.append($('<img>', {
                    src: images[1],
                    "class": 'jspsych-pst-stimulus right',
                }));

                if (trial.prompt !== "") {
                    display_element.append(trial.prompt);
                }

                // create the function that triggers when a key is pressed.
                var after_response = function(info) {

                    if ((info.key == trial.left_key) && (trial.reward == 0) || (info.key == trial.right_key) && (trial.reward == 1)) {
                        reward = true;
                        points += 1;
                    }
                    else {
                        reward = false;
                        points += 0;
                    }

                    if ((info.key == trial.left_key) && (trial.correct == 0) || (info.key == trial.right_key) && (trial.correct == 1)) {
                        correct = true;
                    }
                    else {
                        correct = false;
                    }

                    // create object to store data from trial
                    var trial_data = {
                        "trial": trial.trial_type,
                        "trial_type": 'pst',
                        "rt": info.rt,
                        "reward": reward,
                        "correct": correct,
                        "left_img": trial.left_img,
                        "right_img": trial.right_img,
                        "left_stim": trial.left_stim,
                        "right_stim": trial.right_stim,
                        "correct_stim": trial.correct,
                        "key_press": info.key,
                        "display_feedback": trial.display_feedback,
                        "block": trial.block,
                        "points": points
                    };
                    jsPsych.data.write($.extend({}, trial_data, trial.data));

                    for (var i = 0; i < setTimeoutHandlers.length; i++) {
		        clearTimeout(setTimeoutHandlers[i]);
	            }
                    displayFeedback(false);
                };

                jsPsych.pluginAPI.getKeyboardResponse(after_response, [trial.left_key, trial.right_key], 'date', false);

                setTimeoutHandlers.push(setTimeout(function() {
                    timeOut(true);
                }, trial.timing_stim_duration));
            }

            function timeOut() {
                    // create object to store data from trial
                    var trial_data = {
                        "trial": trial.trial_type,
                        "trial_type": 'pst',
                        "rt": 99,
                        "reward": 99,
                        "correct": 99,
                        "left_img": trial.left_img,
                        "right_img": trial.right_img,
                        "left_stim": trial.left_stim,
                        "right_stim": trial.right_stim,
                        "correct_stim": trial.correct,
                        "key_press": 99,
                        "display_feedback": trial.display_feedback,
                        "block": trial.block
                    };
                    jsPsych.data.write($.extend({}, trial_data, trial.data));
                    displayFeedback(true);
            }

            function displayFeedback(timeout) {
                if (pst_trial_complete) {
                    return;
                }
                pst_trial_complete = true;

                display_element.html(''); // remove all

                if (timeout) {
                    display_element.append($('<div>', {
                        "class": 'jspsych-pst-feedback reward',
                        text: "Timeout! Respond faster."
                    }));
                }
		setTimeout(function() {
		    jsPsych.finishTrial();
		}, trial.timing_feedback_duration);
            }
        };
        return plugin;
    })();
})(jQuery);
