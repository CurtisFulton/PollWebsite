window.onload = () => {
	// If it somehow got to server side validation, we check for errors
	if ($('.collection-item').length)
		$('#error-modal').modal('open');

	// Validate the poll when the form is submitted
	$('.poll-container').submit(validatePoll);

	$('.poll-option input').last().on('input', addNewOption);
}

function addNewOption(e) {
	let lastPoll = $('.poll-option input').last();
	lastPoll.off('input');

	let newOptionHTML = `
		<div class="input-field poll-option">
			<input placeholder="Enter a poll option" type="text" name="option">
		</div>
	`
	lastPoll.parent().after(newOptionHTML);
	let newOption = $('.poll-option input').last();
	newOption.on('input', addNewOption);
}

function validatePoll(e) {
	let pollQuestion = $('#poll-question').val().trim();
	let pollOptions = $('input[name=option]').filter((index, option) => option.value.trim().length > 0);
	let errors = [];

	if (pollQuestion.trim().length == 0) {
		errors.push("You must supply a title for the poll");
	}

	if (pollOptions.length < 2) {
		errors.push("Enter at least 2 options for the poll");
	}

	if (errors.length > 0) {
		showErrors(errors);
		e.preventDefault();
	}
}

function showErrors(errors) {
	var modalList = $('#error-list');
	modalList.empty();

	errors.forEach((err) => {
		var errorHTML = '<li class="collection-item">' + err + '</li>';
		modalList.append(errorHTML);
	});

	$('#error-modal').modal('open');
}