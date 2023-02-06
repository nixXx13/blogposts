const { restrictedFieldsManager } = require("./RestrictedFieldManager");

function isPropertyInObject(obj, property) {
  const q = [obj];
  while (q.length !==0) {
    const currObject = q.pop();
    if (currObject.hasOwnProperty(property)) {
      return true;
    }
    if (currObject && typeof currObject !== 'string' ) {
      q.unshift(...Object.values(currObject));
    }
  }
  return false;
}

function existingPropertiesInObject(obj, properties) {
  return properties.filter((property) => isPropertyInObject(obj, property));
}


const restrictedFieldDefaultDirective = (
    defaultResolver,
    options
  ) => {
    const { endpointName } = options;
    return async (...args) => {
      const [source, _args, context, info] = args;
      const isAdmin = context.isAdmin;
      const restrictedFields = restrictedFieldsManager.getRestrictedFields(endpointName);
      if (!isAdmin && restrictedFields.size !== 0) {
        const restrictedFieldsArr = Array.from(restrictedFields);
        const usedRestrictedFields = existingPropertiesInObject(_args, restrictedFieldsArr);
        if (usedRestrictedFields.length!==0) {
          return null;
        }
        return await defaultResolver.apply(this, args);
      }
      return await defaultResolver.apply(this, args);
    };
  };



module.exports = {
    restrictedFieldDefaultDirective,
}