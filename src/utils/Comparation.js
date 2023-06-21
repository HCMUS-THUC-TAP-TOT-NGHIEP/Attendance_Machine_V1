function compareString(a, b, field) {
  try {
    const fieldA = a[field].toUpperCase(); // ignore upper and lowercase
    const fieldB = b[field].toUpperCase(); // ignore upper and lowercase
    if (fieldA < fieldB) {
      return -1;
    }
    if (fieldA > fieldB) {
      return 1;
    }
    return 0; // field must be equal
  } catch (error) {
    console.error(error);
  }
}

function compareDatetime(a, b, field) {
  try {
    if (a[field] == b[field]) {
      return 0;
    }
    if (a[field] == b[field]) {
      return 1;
    }
    return -1;
  } catch (error) {
    console.error(error);
  }
}
export { compareString, compareDatetime };
