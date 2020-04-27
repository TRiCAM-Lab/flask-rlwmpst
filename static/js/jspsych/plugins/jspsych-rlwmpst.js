
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
    jsPsych.rlwmpst = (function() {

        var plugin = {};

        plugin.create = function(params) {
            trials = jsPsych.pluginAPI.enforceArray(params, ['data']);
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
                // show the options
                display_element.append($('<img>', {
                    src: trial.stim_img,
                    "class": 'jspsych-pst-stimulus',
                }));

                if (trial.prompt !== "") {
                    display_element.append(trial.prompt);
                }

                // create the function that triggers when a key is pressed.
                var after_response = function(info) {

                    if (info.key == trial.correct_key){
                        correct = true;
                        points += trial.reward_magn;
                    }
                    else {
                        correct = false;
                        points += 0;
                    }

                    // create object to store data from trial
                    var trial_data = {
                        "trial": trial.trial_type,
                        "trial_type": 'rlwmpst',
                        "rt": info.rt,
                        "reward": trial.reward_magn,
                        "correct": correct,
                        "img": trial.img,
                        "stim": trial.stim,
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
                else if (trial.display_feedback) {
                    if (reward) {
                        display_element.append($('<img>', {
                            "class": 'jspsych-pst-feedback',
                            src: trial.reward_path,
                            width: "50%"
                        }));
                        display_element.append($('<div>', {
                            "class": 'jspsych-pst-feedback correct',
                            html: "<p>Points: " + int(points) + "</p>",
                        }));

                    }
                    else {
                        display_element.append($('<img>', {
                            "class": 'jspsych-pst-feedback',
                            src: trial.noreward_path,
                            width: "50%"
                        }));
                        display_element.append($('<div>', {
                            "class": 'jspsych-pst-feedback incorrect',
                            html: "<p>Points: " + points + "</p>",
                        }));

                    }
                }
		setTimeout(function() {
		    jsPsych.finishTrial();
		}, trial.timing_feedback_duration);
            }
        };
        return plugin;
    })();
})(jQuery);
