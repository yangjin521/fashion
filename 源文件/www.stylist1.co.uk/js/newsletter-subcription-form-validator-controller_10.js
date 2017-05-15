var NewsletterSubscriptionFormValidatorController = (function ($) {
    return {

        init: function () {
            $('.newsletter #subscriberEmail').click(this._emailInputHandler.bind(this));
            $('.newsletter .errorEmailBlock').click(this._errorEmailBlockHide.bind(this));
            $('.newsletter .datingBox').change(this._removeErrorClasseFromCheckboxes.bind(this));
            $('form.newsletter-form').on('submit', this._submitNewsletterSubscriptionForm.bind(this));
        },

        _emailInputHandler: function () {
            var $submitBtn = $('.newsletter .submit-btn');
            if ($submitBtn.text() != translations.signUpMessage) {
                $submitBtn.text(translations.signUpMessage || '');
            }
        },

        _errorEmailBlockHide: function () {
            $('.errorEmailBlock').addClass('hidden');
        },

        _removeErrorClasseFromCheckboxes: function () {
            var checkedBoxes = $('.datingBox:checked').length;
            if (checkedBoxes == 0) {
                $('.datingBox').addClass('errorCheckbox');
            } else {
                $('.datingBox').removeClass('errorCheckbox');
            }
        },

        _submitNewsletterSubscriptionForm: function () {
            var hasErrors, subscriberEmail, regex, checkedBoxes;

            hasErrors = false;
            subscriberEmail = $('#subscriberEmail').val();

            //  check if email is too long
            if (subscriberEmail.length > 50) {
                $('#errorEmailLengthBlock').removeClass('hidden');
                hasErrors = true;
            }

            regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!regex.test(subscriberEmail)) {
                $('#errorEmailValidBlock').removeClass('hidden');
                hasErrors = true;
            }

            var newsletterSubscriptionLang = $('#newsletterSubscriptionLang').val();

            //  check if any checkbox is selected
            checkedBoxes = $('.datingBox:checked').length;
            if (checkedBoxes == 0) {
                hasErrors = true;
            }

            if (!hasErrors && translations) {
                //  send form data by ajax

                var datingvalues = $("input[name=dating]:checked").map(function () {
                    return this.value;
                }).get().join(",");

                $.ajax({
                    url: '/wp-admin/admin-ajax.php',
                    type: 'POST',
                    data: {
                        action: 'send_newsletter_form_data',
                        Email: subscriberEmail,
                        newsletterSubscriptionLang: newsletterSubscriptionLang,
                        dating: datingvalues,
                    },
                    success: function (data) {
                        $('.newsletter .submit-btn').text(translations.doneMessage || '');
                        $('.newsletter #subscriberEmail').val('');
                    },
                    error: function () {
                        console.log('something is wrong');
                    },
                });
                return false;
            }
            return !hasErrors;
        }
    };
})(jQuery);

ControllersManager.registerController('newsletter-subscription-form-validator-controller', NewsletterSubscriptionFormValidatorController);