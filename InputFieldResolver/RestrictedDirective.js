const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
const { restrictedFieldsManager } = require("./RestrictedFieldManager");


function getMutationsWithInput(mutations, inputName) {
    return Object.values(mutations).filter((m) =>
      m.args.some((arg) => {
        const argTypeName1 = arg.type?.name || '';
        const argTypeName2 = arg.type?.ofType?.name || '';
        return argTypeName1.includes(inputName) || argTypeName2.includes(inputName);
      })
    );
  }

function restrictedDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {

    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {

      // Check whether this field has the specified directive
      const restrictedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (restrictedDirective) {

        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
            const isUserAdmin = context?.isAdmin;
            if (!isUserAdmin) {
                console.log(`${info?.parentType?.name}: ${info?.fieldName} - blocked! user lacks proper privileges.`)
                return null;
            }
            const result = await resolve(source, args, context, info);
            // if (!isUserAdmin) {
            //     console.log(`${info?.parentType?.name}: ${info?.fieldName} - blocked! user lacks proper privileges.`)
            //     return null;
            // }
            return result;
        }
        return fieldConfig;
      }
    },

    [MapperKind.INPUT_OBJECT_FIELD]: (fieldConfig, inputFieldName, inputName) => {

        const restrictedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
  
        if (restrictedDirective) {  
            const mutationsForInput = getMutationsWithInput(
                schema.getMutationType().getFields(),
                inputName
            );
            mutationsForInput.forEach((mutation) => {
                restrictedFieldsManager.addRestrictedField(mutation.name, inputFieldName);
            });
            return fieldConfig;
        }
      }
  });
}

module.exports = {
    restrictedDirectiveTransformer
}
