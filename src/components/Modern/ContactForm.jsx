import React, { useRef, useState } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import AnimatedEye from '../Shared/AnimatedEye';

/**
 * The contact form's fields. State and validation live in useContactForm; this file is layout only.
 *
 * Every field has the same shape: a label row (with the eye that watches what you type), the
 * control, and a note underneath. Notes (hints, errors, the "looks good" replies) open and close
 * smoothly, so the form never jumps as you fill it in.
 */

const SALUTATIONS = ['Mr', 'Ms', 'Mrs'];

// What a field should say right now: an error, a success reply, a standing hint, or nothing
const noteFor = (form, name, hint) => {
    const { errors, touched, formData, displayedMessages } = form;
    if (errors[name] && touched[name]) return { text: displayedMessages[name] || errors[name], tone: 'error' };
    if (touched[name] && formData[name] && displayedMessages[name]) return { text: displayedMessages[name], tone: 'ok' };
    if (hint) return { text: hint, tone: 'hint' };
    return null;
};

const FieldNote = ({ id, note }) => {
    // Keep showing the last note while it closes, so it slides shut with its text still in it
    const [kept, setKept] = useState(note);
    if (note && (note.text !== kept?.text || note.tone !== kept?.tone)) setKept(note);
    const shown = note ?? kept;

    return (
        <div id={id} className={`field-note tone-${shown?.tone ?? 'hint'} ${note ? 'is-shown' : ''}`} aria-live="polite">
            <span>
                {shown?.tone === 'error' && <FaExclamationTriangle aria-hidden="true" />}
                {shown?.tone === 'ok' && <FaCheckCircle aria-hidden="true" />}
                {shown?.text}
            </span>
        </div>
    );
};

const Field = ({ form, name, label, optional, hint, wide, inputRef, children }) => {
    const { formData, errors, touched } = form;
    const invalid = Boolean(errors[name] && touched[name]);
    const valid = !invalid && Boolean(touched[name] && formData[name]);

    return (
        <div className={`field ${wide ? 'field-wide' : ''} ${invalid ? 'is-invalid' : ''} ${valid ? 'is-valid' : ''}`}>
            <div className="field-head">
                <label htmlFor={name}>
                    {label}
                    {optional && <span className="field-optional">optional</span>}
                </label>
                {inputRef && <AnimatedEye isOpen={Boolean(formData[name])} inputRef={inputRef} size="1.35rem" />}
            </div>
            {children({ invalid, describedBy: `${name}-note` })}
            <FieldNote id={`${name}-note`} note={noteFor(form, name, hint)} />
        </div>
    );
};

const ContactForm = ({ form }) => {
    const {
        formData,
        errors,
        touched,
        isSubmitting,
        messagePlaceholder,
        handleChange,
        handleBlur,
        handleFocus,
        handleSubmit,
        getCharacterCount,
    } = form;

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const mobileRef = useRef(null);
    const companyRef = useRef(null);
    const messageRef = useRef(null);

    const characterInfo = getCharacterCount();
    const salutationIndex = SALUTATIONS.indexOf(formData.salutation);
    const salutationInvalid = Boolean(errors.salutation && touched.salutation);

    // Shared props for the text inputs
    const textProps = (name, describedBy, invalid) => ({
        id: name,
        name,
        value: formData[name],
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: () => handleFocus(name),
        className: 'field-control',
        'aria-invalid': invalid || undefined,
        'aria-describedby': describedBy,
    });

    return (
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <fieldset className={`field ${salutationInvalid ? 'is-invalid' : ''}`} aria-describedby="salutation-note">
                <legend className="field-head">Salutation</legend>
                <div className="segmented" style={{ '--index': Math.max(salutationIndex, 0) }} data-picked={salutationIndex >= 0 || undefined}>
                    <span className="segmented-thumb" aria-hidden="true" />
                    {SALUTATIONS.map((value) => (
                        <label key={value} className="segment">
                            <input
                                type="radio"
                                name="salutation"
                                value={value}
                                checked={formData.salutation === value}
                                onChange={handleChange}
                                onFocus={() => handleFocus('salutation')}
                                // Validate what is actually picked, not the radio that happened to have focus
                                onBlur={() => handleBlur({ target: { name: 'salutation', value: formData.salutation } })}
                            />
                            <span>{value}</span>
                        </label>
                    ))}
                </div>
                <FieldNote id="salutation-note" note={noteFor(form, 'salutation')} />
            </fieldset>

            <Field form={form} name="firstName" label="First name" inputRef={firstNameRef}>
                {({ invalid, describedBy }) => (
                    <input ref={firstNameRef} type="text" autoComplete="given-name" maxLength={30} {...textProps('firstName', describedBy, invalid)} />
                )}
            </Field>

            <Field form={form} name="lastName" label="Last name" inputRef={lastNameRef}>
                {({ invalid, describedBy }) => (
                    <input ref={lastNameRef} type="text" autoComplete="family-name" maxLength={30} {...textProps('lastName', describedBy, invalid)} />
                )}
            </Field>

            <Field form={form} name="email" label="Email" inputRef={emailRef}>
                {({ invalid, describedBy }) => (
                    <input ref={emailRef} type="text" inputMode="email" autoComplete="email" maxLength={80} {...textProps('email', describedBy, invalid)} />
                )}
            </Field>

            <Field form={form} name="mobile" label="Mobile" hint="Indian numbers only." inputRef={mobileRef}>
                {({ invalid, describedBy }) => (
                    <div className="field-control field-affix">
                        <span className="field-prefix" aria-hidden="true">+91</span>
                        <input
                            ref={mobileRef}
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            placeholder="10-digit number"
                            maxLength={10}
                            {...textProps('mobile', describedBy, invalid)}
                            className=""
                        />
                    </div>
                )}
            </Field>

            <Field form={form} name="company" label="Company" optional inputRef={companyRef}>
                {({ describedBy }) => (
                    <input
                        ref={companyRef}
                        type="text"
                        autoComplete="organization"
                        maxLength={80}
                        {...textProps('company', describedBy, false)}
                        // Optional, so it's never validated: leaving it only clears the focus state
                        onBlur={() => handleFocus('')}
                    />
                )}
            </Field>

            <Field form={form} name="message" label="Message" wide inputRef={messageRef}>
                {({ invalid, describedBy }) => (
                    <>
                        <textarea
                            ref={messageRef}
                            placeholder={messagePlaceholder}
                            maxLength={100}
                            rows={4}
                            {...textProps('message', describedBy, invalid)}
                            aria-describedby={`${describedBy} message-count`}
                        />
                        <span id="message-count" className={`field-count tone-${characterInfo.tone}`}>{characterInfo.text}</span>
                    </>
                )}
            </Field>

            <div className="form-submit field-wide">
                <button type="submit" className={`btn btn-primary form-send ${isSubmitting ? 'is-sending' : ''}`} disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
                    <FaPaperPlane className="form-send-icon" aria-hidden="true" />
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
