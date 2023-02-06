class RestrictedFieldsManager {
  restrictedFields;
  constructor() {
    this.restrictedFields = new Map();
  }

  addRestrictedField(endpointName, restrictedField) {
    if (!this.restrictedFields.has(endpointName)) {
      const endpointRestrictedFields = new Set();
      this.restrictedFields.set(endpointName, endpointRestrictedFields);
    }
    const endpointRestrictedFields = this.restrictedFields.get(endpointName);

    endpointRestrictedFields.add(restrictedField)
  }

  getRestrictedFields(endpointName) {
    const endpointRestrictedFields = this.restrictedFields.get(endpointName) || new Set();
    return endpointRestrictedFields;
  }
}

const restrictedFieldsManager = new RestrictedFieldsManager();

module.exports = {
    restrictedFieldsManager,
}