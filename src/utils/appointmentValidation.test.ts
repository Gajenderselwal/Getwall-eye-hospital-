import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isDateSunday,
  validateAppointmentDate,
  validateIndianPhone,
  validateAppointmentForm,
  SUNDAY_ERROR_MESSAGE,
} from './appointmentValidation.ts';

test('Sunday detection works accurately', () => {
  // 2026-10-18 is a Sunday
  assert.equal(isDateSunday('2026-10-18'), true);
  // 2026-10-19 is a Monday
  assert.equal(isDateSunday('2026-10-19'), false);
  // 2026-10-25 is a Sunday
  assert.equal(isDateSunday('2026-10-25'), true);
  // 2026-10-24 is a Saturday
  assert.equal(isDateSunday('2026-10-24'), false);
});

test('Appointment date validation strictly rejects Sunday with required error message', () => {
  const refDate = new Date('2026-10-15T10:00:00Z');
  const result = validateAppointmentDate('2026-10-18', refDate);
  assert.equal(result.isValid, false);
  assert.equal(result.error, SUNDAY_ERROR_MESSAGE);
});

test('Appointment date validation rejects past dates', () => {
  const refDate = new Date('2026-10-15T10:00:00Z');
  const result = validateAppointmentDate('2026-10-14', refDate);
  assert.equal(result.isValid, false);
  assert.equal(result.error, 'Appointment date cannot be in the past.');
});

test('Appointment date validation accepts valid future non-Sunday dates', () => {
  const refDate = new Date('2026-10-15T10:00:00Z');
  const result = validateAppointmentDate('2026-10-20', refDate); // Tuesday
  assert.equal(result.isValid, true);
  assert.equal(result.error, undefined);
});

test('Indian phone number validation tests', () => {
  // Valid 10-digit mobile
  const valid1 = validateIndianPhone('9829012345');
  assert.equal(valid1.isValid, true);
  assert.equal(valid1.cleanPhone, '+91 98290 12345');

  // Valid with +91 prefix and spaces
  const valid2 = validateIndianPhone('+91 94144 32100');
  assert.equal(valid2.isValid, true);

  // Invalid: starts with 4 or 5
  const invalid1 = validateIndianPhone('4123456789');
  assert.equal(invalid1.isValid, false);

  // Invalid: too short
  const invalid2 = validateIndianPhone('98290123');
  assert.equal(invalid2.isValid, false);

  // Invalid: non-numeric garbage
  const invalid3 = validateIndianPhone('abcdefghij');
  assert.equal(invalid3.isValid, false);
});

test('Appointment form complete validation', () => {
  const refDate = new Date('2026-10-15T10:00:00Z');

  // Fails when consent missing or Sunday date
  const failRes = validateAppointmentForm({
    patientName: 'Ramesh Sharma',
    phoneNumber: '9829012345',
    requestedDate: '2026-10-18', // Sunday
    consentGiven: false,
  }, refDate);
  assert.equal(failRes.isValid, false);
  assert.equal(failRes.errors.requestedDate, SUNDAY_ERROR_MESSAGE);
  assert.ok(failRes.errors.consentGiven);

  // Passes when all fields valid
  const passRes = validateAppointmentForm({
    patientName: 'Ramesh Sharma',
    phoneNumber: '9829012345',
    requestedDate: '2026-10-20', // Tuesday
    visitReason: 'Routine vision checkup and reading blurriness',
    consentGiven: true,
  }, refDate);
  assert.equal(passRes.isValid, true);
  assert.equal(Object.keys(passRes.errors).length, 0);
});
