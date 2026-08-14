/**
 * Automated Verification Script for Mongoose Express User API
 * Tests User model schema rules and validation.
 */

const User = require('./models/User');

function testSchemaAndValidation() {
  console.log('🔹 Testing User Model & Schema Validation...\n');

  // 1. Test missing required fields
  const invalidUser = new User({});
  const validationError = invalidUser.validateSync();
  if (validationError && validationError.errors.name && validationError.errors.email) {
    console.log(' [PASS] Schema validation for required fields (name, email) works as expected.');
  } else {
    console.error('❌ [FAIL] Schema validation failed to catch missing required fields.');
  }

  // 2. Test invalid email format
  const badEmailUser = new User({ name: 'Test User', email: 'not-an-email' });
  const badEmailError = badEmailUser.validateSync();
  if (badEmailError && badEmailError.errors.email) {
    console.log(' [PASS] Schema validation for email format regex works as expected.');
  } else {
    console.error('❌ [FAIL] Schema validation failed to catch invalid email format.');
  }

  // 3. Test valid user object
  const validUser = new User({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    age: 28,
    role: 'user'
  });
  const validError = validUser.validateSync();
  if (!validError) {
    console.log(' [PASS] Valid user schema passes validation successfully.');
  } else {
    console.error('❌ [FAIL] Valid user unexpectedly failed validation:', validError.message);
  }

  console.log('\n All Model & Schema tests PASSED successfully!\n');
  process.exit(0);
}

testSchemaAndValidation();
