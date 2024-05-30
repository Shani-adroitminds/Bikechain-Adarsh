import stateCountry from '../common/state-country';
import nod from '../common/nod';
import utils from '@bigcommerce/stencil-utils';
import { Validators, announceInputErrorMessage } from '../common/utils/form-utils';
import collapsibleFactory from '../common/collapsible';
import swal from '../global/sweet-alert';

export default class ShippingEstimator {
    constructor($element, shippingErrorMessages) {
        this.$element = $element;

        this.$state = $('[data-field-type="State"]', this.$element);
        this.isEstimatorFormOpened = false;
        this.shippingErrorMessages = shippingErrorMessages;
        this.initFormValidation();
        this.bindStateCountryChange();
        this.bindEstimatorEvents();
    }

    initFormValidation() {
        const shippingEstimatorAlert = $('.shipping-quotes');

        this.shippingEstimator = 'form[data-shipping-estimator]';
        this.shippingValidator = nod({
            submit: `${this.shippingEstimator} .shipping-estimate-submit`,
            tap: announceInputErrorMessage,
        });

        $('.shipping-estimate-submit', this.$element).on('click', event => {
            if (shippingEstimatorAlert.attr('role')) {
                shippingEstimatorAlert.removeAttr('role');
            }

            shippingEstimatorAlert.attr('role', 'alert');
            if ($(`${this.shippingEstimator} select[name="shipping-country"]`).val()) {
                this.shippingValidator.performCheck();
            }

            if (this.shippingValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });

        this.bindValidation();
        this.bindStateValidation();
    }

    bindValidation() {
        this.shippingValidator.add([
            {
                selector: `${this.shippingEstimator} select[name="shipping-country"]`,
                validate: (cb, val) => {
                    const countryId = Number(val);
                    const result = countryId !== 0 && !Number.isNaN(countryId);

                    cb(result);
                },
                errorMessage: this.shippingErrorMessages.country,
            },
        ]);
    }

    bindStateValidation() {
        this.shippingValidator.add([
            {
                selector: $(`${this.shippingEstimator} select[name="shipping-state"]`),
                validate: (cb) => {
                    let result;

                    const $ele = $(`${this.shippingEstimator} select[name="shipping-state"]`);

                    if ($ele.length) {
                        const eleVal = $ele.val();

                        result = eleVal && eleVal.length && eleVal !== 'State/province';
                    }

                    cb(result);
                },
                errorMessage: this.shippingErrorMessages.province,
            },
        ]);
    }

    bindStateCountryChange() {
        let $last;

        // Requests the states for a country with AJAX
        stateCountry(this.$state, this.context, { useIdForStates: true }, (err, field) => {
            if (err) {
                swal.fire({
                    text: err,
                    icon: 'error',
                });

                throw new Error(err);
            }

            const $field = $(field);

            if (this.shippingValidator.getStatus(this.$state) !== 'undefined') {
                this.shippingValidator.remove(this.$state);
            }

            if ($last) {
                this.shippingValidator.remove($last);
            }

            if ($field.is('select')) {
                $last = field;
                this.bindStateValidation();
            } else {
                $field.attr('placeholder', 'State/province');
                Validators.cleanUpStateValidation(field);
            }

            $(this.shippingEstimator).find('.form-field--success').removeClass('form-field--success');
        });
    }

    toggleEstimatorFormState(toggleButton, buttonSelector, $toggleContainer) {
        const changeAttributesOnToggle = (selectorToActivate) => {
            $(toggleButton).attr('aria-labelledby', selectorToActivate);
            $(buttonSelector).text($(`#${selectorToActivate}`).text());
        };

        if (!this.isEstimatorFormOpened) {
            changeAttributesOnToggle('estimator-close');
            $toggleContainer.removeClass('u-hidden');
        } else {
            changeAttributesOnToggle('estimator-add');
            $toggleContainer.addClass('u-hidden');
        }
        this.isEstimatorFormOpened = !this.isEstimatorFormOpened;
    }

    bindEstimatorEvents() {
        const $estimatorContainer = $('.shipping-estimator');
        const $estimatorForm = $('.estimator-form');
        collapsibleFactory();
        $estimatorForm.on('submit', event => {
            const params = {
                country_id: $('[name="shipping-country"]', $estimatorForm).val(),
                state_id: $('[name="shipping-state"]', $estimatorForm).val(),
                city: $('[name="shipping-city"]', $estimatorForm).val(),
                zip_code: $('[name="shipping-zip"]', $estimatorForm).val(),
            };

            event.preventDefault();

            utils.api.cart.getShippingQuotes(params, 'cart/shipping-quotes', (err, response) => {
                $('.shipping-quotes').html(response.content);

                $('.select-shipping-quote').on('click', clickEvent => {
                    const quoteId = $('.shipping-quote:checked').val();

                    clickEvent.preventDefault();

                    utils.api.cart.submitShippingQuote(quoteId, () => {
                        window.location.reload();
                    });
                });
            });
        });

        $('.shipping-estimate-show').on('click', event => {
            event.preventDefault();
            this.toggleEstimatorFormState(event.currentTarget, '.shipping-estimate-show__btn-name', $estimatorContainer);
        });
    }
}
